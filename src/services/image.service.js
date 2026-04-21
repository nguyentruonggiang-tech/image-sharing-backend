import { prisma } from "../common/prisma/connect.prisma.js";
import {
    buildQueryPrimsa,
    parsePaginationFromReq,
} from "../common/helpers/build-query-primsa.helper.js";
import {
    BadRequestException,
    NotfoundException,
} from "../common/helpers/exception.helpers.js";

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
};