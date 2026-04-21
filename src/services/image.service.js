import { prisma } from "../common/prisma/connect.prisma.js";
import {
    buildQueryPrimsa,
    parsePaginationFromReq,
} from "../common/helpers/build-query-primsa.helper.js";
import {
    BadRequestException,
    NotfoundException,
} from "../common/helpers/exception.helpers.js";

function parseImageId(req) {
    const id = Number(req.params.imageId);
    if (!Number.isInteger(id) || id < 1) {
        throw new BadRequestException("Invalid image id");
    }
    return id;
}

async function assertImageExists(imageId) {
    const image = await prisma.images.findUnique({
        where: { id: imageId },
        select: { id: true },
    });
    if (!image) {
        throw new NotfoundException("Image not found");
    }
}

async function findImagesPage(where, page, pageSize, index) {
    const [items, totalItem] = await Promise.all([
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
        items,
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
        const name = typeof req.query.name === "string" ? req.query.name.trim() : "";

        if (!name) {
            throw new BadRequestException("Query `name` is required for search");
        }

        const where = { imageName: { contains: name } };
        return findImagesPage(where, page, pageSize, index);
    },

    /** GET /api/images/:imageId */
    async findOne(req) {
        const id = Number(req.params.imageId);

        if (!Number.isInteger(id) || id < 1) {
            throw new BadRequestException("Invalid image id");
        }

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
            throw new NotfoundException("Image not found");
        }

        return image;
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
    
        if (existed) throw new BadRequestException("Image already saved");
    
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
    
        if (!existed) throw new NotfoundException("Image not saved");
    
        const deleted = await prisma.saved_images.delete({
            where: {
                userId_imageId: { userId, imageId },
            },
        });
    
        return {
            imageId,
            saved: !!deleted,
            savedAt: deleted?.createdAt ?? null,
        };
    },
};