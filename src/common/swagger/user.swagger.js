export const user = {
    "/user/me": {
        get: {
            tags: ["User"],
            summary: "Lấy thông tin người dùng",
            responses: {
                200: {
                    description: "Lấy thông tin người dùng thành công",
                },
            },
        },
    },
    "/user/me/created-images": {
        get: {
            tags: ["User"],
            summary: "Lấy danh sách ảnh do user hiện tại tạo",
            parameters: [
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
                200: { description: "Lấy danh sách ảnh đã tạo thành công" },
            },
        },
    },
    "/user/me/saved-images": {
        get: {
            tags: ["User"],
            summary: "Lấy danh sách ảnh user hiện tại đã lưu",
            parameters: [
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
                200: { description: "Lấy danh sách ảnh đã lưu thành công" },
            },
        },
    },
};