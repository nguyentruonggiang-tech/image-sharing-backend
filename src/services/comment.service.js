import { prisma } from "../common/prisma/connect.prisma.js";
import {
    BadRequestException,
    NotfoundException,
} from "../common/helpers/exception.helpers.js";
import { buildQueryPrimsa } from "../common/helpers/build-query-primsa.helper.js";

function parseImageId(req) {
    const id = Number(req.params.imageId);
    if (!Number.isInteger(id) || id < 1) {
        throw new BadRequestException("Id ảnh không hợp lệ");
    }
    return id;
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

export const commentService = {
    async findByImageId(req) {
        const imageId = parseImageId(req);
        await assertImageExists(imageId);

        const { page, pageSize, index } = buildQueryPrimsa(req);

        const skip = index;
        const take = pageSize;

        const [items, total] = await Promise.all([
            prisma.comments.findMany({
                where: { imageId },
                orderBy: { createdAt: "desc" },
                skip,
                take,
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
            }),
            prisma.comments.count({ where: { imageId } }),
        ]);

        return { items, pagination: { page, pageSize, total } };
    },

    async create(req) {
        const imageId = parseImageId(req);
        await assertImageExists(imageId);

        const { content } = req.body;
        if (typeof content !== "string" || !content.trim()) {
            throw new BadRequestException("Thiếu nội dung bình luận");
        }

        const created = await prisma.comments.create({
            data: {
                content: content.trim(),
                userId: req.user.id,
                imageId,
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

        return created;
    },
};