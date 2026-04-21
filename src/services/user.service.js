import { prisma } from "../common/prisma/connect.prisma.js";
import { buildQueryPrimsa } from "../common/helpers/build-query-primsa.helper.js";
import { NotfoundException } from "../common/helpers/exception.helpers.js";

export const userService = {
    async getMe(req) {
        const userId = req.user.id;

        const user = await prisma.users.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                fullName: true,
                avatar: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            throw new NotfoundException("User not found");
        }

        return user;
    },

    async getMyCreatedImages(req) {
        const userId = req.user.id;
        const { page, pageSize, index } = buildQueryPrimsa(req);

        const [items, total] = await Promise.all([
            prisma.images.findMany({
                where: { userId },
                orderBy: { createdAt: "desc" },
                skip: index,
                take: pageSize,
            }),
            prisma.images.count({ where: { userId } }),
        ]);

        return { items, pagination: { page, pageSize, total } };
    },

    async getMySavedImages(req) {
        const userId = req.user.id;
        const { page, pageSize, index } = buildQueryPrimsa(req);

        const [items, total] = await Promise.all([
            prisma.saved_images.findMany({
                where: { userId },
                orderBy: { createdAt: "desc" },
                skip: index,
                take: pageSize,
                select: {
                    createdAt: true,
                    images: {
                        select: {
                            id: true,
                            imageName: true,
                            url: true,
                            description: true,
                            createdAt: true,
                            users: {
                                select: {
                                    id: true,
                                    email: true,
                                    fullName: true,
                                    avatar: true,
                                },
                            },
                        },
                    },
                },
            }),
            prisma.saved_images.count({ where: { userId } }),
        ]);
        const mappedItems = items.map((row) => ({
            savedAt: row.createdAt,
            image: row.images,
        }));
        return {
            items: mappedItems,
            pagination: { page, pageSize, total },
        };
    },
};