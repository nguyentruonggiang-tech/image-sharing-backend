export const comment = {
    "/images/{imageId}/comments": {
        get: {
            tags: ["Comment"],
            summary: "Lấy danh sách bình luận theo id ảnh, có phân trang, thứ tự mới nhất",
            parameters: [
                {
                    name: "imageId",
                    in: "path",
                    required: true,
                    schema: { type: "integer", example: 1 },
                },
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
            ],
            responses: {
                200: { description: "Lấy danh sách bình luận theo id ảnh thành công" },
            },
        },
        post: {
            tags: ["Comment"],
            summary: "Thêm bình luận cho ảnh (cần đăng nhập)",
            parameters: [
                {
                    name: "imageId",
                    in: "path",
                    required: true,
                    schema: { type: "integer", example: 1 },
                },
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["content"],
                            properties: {
                                content: {
                                    type: "string",
                                    example: "Ảnh đẹp quá!",
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                201: { description: "Tạo bình luận thành công" }
            },
        },
    },
};