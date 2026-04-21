export const image = {
    "/images": {
        get: {
            tags: ["Image"],
            summary: "Lấy danh sách ảnh (có phân trang, có thể lọc qua filters JSON)",
            parameters: [
                {
                    name: "page",
                    in: "query",
                    required: false,
                    description: "Số trang (mặc định 1).",
                    schema: { 
                        type: "integer",
                        default: 1,
                        minimum: 1,
                    },
                },
                {
                    name: "pageSize",
                    in: "query",
                    required: false,
                    description: "Số bản ghi mỗi trang (mặc định theo server).",
                    schema: {
                        type: "integer",
                        default: 10,
                        minimum: 1,
                    },
                },
                {
                    name: "filters",
                    in: "query",
                    required: false,
                    description: "Chuỗi JSON object filter",
                    schema: {
                        type: "string",
                        properties: {
                            imageName: { type: "string" },
                            description: { type: "string" }
                        },
                    },
                },
            ],
            responses: {
                200: { 
                    description: "Lấy danh sách ảnh thành công"
                },
            },
        },
    },
    "/images/search": {
        get: {
            tags: ["Image"],
            summary: "Tìm kiếm danh sách ảnh theo tên (có phân trang)",
            parameters: [
                {
                    name: "name",
                    in: "query",
                    required: true,
                    description: "Từ khóa",
                    schema: { type: "string" },
                },
                {
                    name: "page",
                    in: "query",
                    schema: { type: "integer", default: 1, minimum: 1 },
                },
                {
                    name: "pageSize",
                    in: "query",
                    schema: { type: "integer", default: 10, minimum: 1 },
                },
            ],
            responses: {
                200: { 
                    description: "Tìm kiếm danh sách ảnh theo tên thành công" 
                },
            },
        },
    },
    "/images/{imageId}": {
        get: {
            tags: ["Image"],
            summary: "Lấy chi tiết một ảnh theo id",
            parameters: [
                {
                    name: "imageId",
                    in: "path",
                    required: true,
                    schema: {
                        type: "integer",
                        example: 1
                    },
                },
            ],
            responses: {
                200: { 
                    description: "Lấy chi tiết ảnh thành công" 
                },
            },
        },
    },
};