import { prisma } from "../common/prisma/connect.prisma.js";
import {
    buildQueryPrimsa,
    parsePaginationFromReq,
} from "../common/helpers/build-query-primsa.helper.js";
import {
    BadRequestException,
    NotfoundException,
    ForbiddenException,
} from "../common/helpers/exception.helpers.js";
import { v2 as cloudinary } from "cloudinary";
import { CLOUDINARY_IMAGE_FOLDER } from "../common/constant/app.constant.js";

/** Cấu hình Cloudinary tương tự ExpressJS `user.service.js` */
cloudinary.config(true);
cloudinary.config({ secure: true });

function parseImageId(req) {
    const id = Number(req.params.imageId);
    if (!Number.isInteger(id) || id < 1) {
        throw new BadRequestException("Id ảnh không hợp lệ");
    }
    return id;
}

function resolveImageDeliveryUrl(stored) {
    if (!stored) return stored;
    if (stored.startsWith("http://") || stored.startsWith("https://")) {
        return stored;
    }
    return cloudinary.url(stored, { secure: true });
}

function mapImageRow(row) {
    if (!row) return row;
    return { ...row, url: resolveImageDeliveryUrl(row.url) };
}

async function uploadImageToCloudinary(buffer, publicId) {
    return await new Promise((resolve, reject) => {
        cloudinary.uploader
            .upload_stream(
                {
                    folder: CLOUDINARY_IMAGE_FOLDER,
                    public_id: publicId,
                    overwrite: true,
                    resource_type: "image",
                },
                (error, result) => {
                    if (error) return reject(error);
                    return resolve(result);
                }
            )
            .end(buffer);
    });
}

async function assertImageExists(imageId) {
    const image = await prisma.images.findUnique({
        where: { id: imageId },
        select: { id: true },
    });
    if (!image) {
        throw new NotfoundException("Không tìm thấy ảnh");
    }
}

async function findImagesPage(where, page, pageSize, index) {
    const [rows, totalItem] = await Promise.all([
        prisma.images.findMany({
            where,
            skip: index,
            take: pageSize,
        }),
        prisma.images.count({ where }),
    ]);

    return {
        totalItem,
        totalPage: Math.ceil(totalItem / pageSize),
        page,
        pageSize,
        items: rows.map(mapImageRow),
    };
}

export const imageService = {
    /** GET /api/images  */
    async findAll(req) {
        const { page, pageSize, index, where } = buildQueryPrimsa(req);
        return findImagesPage(where, page, pageSize, index);
    },

    /** GET /api/images/search  */
    async searchByName(req) {
        const { page, pageSize, index } = parsePaginationFromReq(req);
        const name =
            typeof req.query.name === "string" ? req.query.name.trim() : "";

        if (!name) {
            throw new BadRequestException("Thiếu từ khóa `name` để tìm kiếm");
        }

        const where = { imageName: { contains: name } };
        return findImagesPage(where, page, pageSize, index);
    },

    /** GET /api/images/:imageId */
    async findOne(req) {
        const id = parseImageId(req);

        const image = await prisma.images.findUnique({
            where: { id },
            include: {
                users: {
                    select: {
                        id: true,
                        email: true,
                        fullName: true,
                        avatar: true,
                    },
                },
            },
        });

        if (!image) {
            throw new NotfoundException("Không tìm thấy ảnh");
        }

        return mapImageRow(image);
    },

    async isSaved(req) {
        const imageId = parseImageId(req);
        await assertImageExists(imageId);

        const userId = req.user.id;

        const row = await prisma.saved_images.findUnique({
            where: {
                userId_imageId: { userId, imageId },
            },
            select: { id: true, createdAt: true },
        });

        return {
            imageId,
            saved: !!row,
            savedAt: row?.createdAt ?? null,
        };
    },

    async saveImage(req) {
        const imageId = parseImageId(req);
        await assertImageExists(imageId);

        const userId = req.user.id;

        const existed = await prisma.saved_images.findUnique({
            where: {
                userId_imageId: { userId, imageId },
            },
            select: { createdAt: true },
        });

        if (existed) throw new BadRequestException("Ảnh đã được lưu trước đó");

        const created = await prisma.saved_images.create({
            data: { userId, imageId },
            select: { createdAt: true },
        });

        return {
            imageId,
            saved: !!created,
            savedAt: created?.createdAt ?? null,
        };
    },

    async unsaveImage(req) {
        const imageId = parseImageId(req);
        await assertImageExists(imageId);

        const userId = req.user.id;

        const existed = await prisma.saved_images.findUnique({
            where: {
                userId_imageId: { userId, imageId },
            },
            select: { id: true },
        });

        if (!existed) throw new NotfoundException("Ảnh chưa được lưu");

        await prisma.saved_images.delete({
            where: {
                userId_imageId: { userId, imageId },
            },
        });

        return {
            imageId,
            saved: false,
            savedAt: null,
        };
    },

    async deleteImage(req) {
        const imageId = parseImageId(req);
        const currentUserId = req.user.id;

        const image = await prisma.images.findUnique({
            where: { id: imageId },
            select: { id: true, userId: true, url: true },
        });

        if (!image) throw new NotfoundException("Không tìm thấy ảnh");
        if (image.userId !== currentUserId) {
            throw new ForbiddenException(
                "Bạn không có quyền xóa ảnh này"
            );
        }

        if (image.url) {
            await cloudinary.uploader
                .destroy(image.url, { invalidate: true })
                .catch(() => {});
        }

        const deleted = await prisma.images.delete({ where: { id: imageId } });

        return {
            imageId,
            deleted: !!deleted,
        };
    },

    async create(req) {
        if (!req.file?.buffer) {
            throw new BadRequestException("Chưa upload file ảnh (field: image)");
        }

        const imageName =
            typeof req.body.imageName === "string"
                ? req.body.imageName.trim()
                : "";
        if (!imageName) {
            throw new BadRequestException("Thiếu trường `imageName`");
        }

        let description =
            typeof req.body.description === "string"
                ? req.body.description.trim()
                : "";
        description = description || null;

        const publicId = `img_${Date.now()}_${Math.round(Math.random() * 1e9)}`;

        let uploadResult;
        try {
            uploadResult = await uploadImageToCloudinary(
                req.file.buffer,
                publicId
            );
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Upload Cloudinary thất bại";
            throw new BadRequestException(message);
        }

        const created = await prisma.images.create({
            data: {
                imageName,
                description,
                url: uploadResult.public_id,
                userId: req.user.id,
            },
            include: {
                users: {
                    select: {
                        id: true,
                        email: true,
                        fullName: true,
                        avatar: true,
                    },
                },
            },
        });

        return mapImageRow(created);
    },
};
