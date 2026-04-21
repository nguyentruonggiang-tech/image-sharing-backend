export const user = {
    "/user/me": {
        get: {
            tags: ["User"],
            summary: "Lấy thông tin người dùng",
            responses: {
                200: {
                    description: "Lấy thông tin người dùng thành công",
                }
            },
        },
    },
};