/**
 * Pagination from query (shared by list + search-by-name routes).
 */
export const parsePaginationFromReq = (req) => {
    let { page, pageSize } = req.query;
    const pageDefault = 1;
    const pageSizeDefault = 10;

    page = Number(page) || pageDefault;
    pageSize = Number(pageSize) || pageSizeDefault;

    if (page < 1) {
        page = pageDefault;
    }
    if (pageSize < 1) {
        pageSize = pageSizeDefault;
    }

    const index = (page - 1) * pageSize;

    return { page, pageSize, index };
};

export const buildQueryPrimsa = (req) => {
    const { page, pageSize, index } = parsePaginationFromReq(req);
    let { filters } = req.query;

    try {
        filters = JSON.parse(filters || "{}");
    } catch {
        filters = {};
    }

    // JSON.parse can return array/primitive; only plain objects are valid Prisma where fragments
    if (
        filters === null ||
        typeof filters !== "object" ||
        Array.isArray(filters)
    ) {
        filters = {};
    }

    if (typeof filters.name === "string" && filters.imageName === undefined) {
        filters.imageName = filters.name;
        delete filters.name;
    }

    Object.entries(filters).forEach(([key, value]) => {
        if (typeof value === "string") {
            filters[key] = { contains: value };
        }
    });

    const where = { ...filters };

    return { page, pageSize, index, where };
};