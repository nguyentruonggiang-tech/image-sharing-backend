export const auth = {
    "/auth/register": {
        post: {
            tags: ["Auth"],
            summary: "Register",
            description: "Register with email, password and fullName",
            requestBody: {
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                email: {
                                    type: "string",
                                    example: "email@example.com"
                                },
                                password: {
                                    type: "string",
                                    example: "password"
                                },
                                fullName: {
                                    type: "string",
                                    example: "Nguyễn Văn A"
                                },
                            },  
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: "Đăng ký thành công",
                },
            },
        },
    },
    "/auth/login": {
        post: {
            tags: ["Auth"],
            summary: "Login",
            description: "Login with email and password",
            requestBody: {
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                email: {
                                    type: "string",
                                    example: "email@example.com"
                                },
                                password: {
                                    type: "string",
                                    example: "password"
                                }
                            },
                        },
                    },
                },
            },  
            responses: {
                200: {
                    description: "Đăng nhập thành công",
                },
            },
        },
    },
    "/auth/refresh-token": {
        post: {
            tags: ["Auth"],
            summary: "Refresh access token bằng cookie refreshToken",
            responses: {
                200: { description: "Refresh token thành công" }
            },
        },
    },
    "/auth/logout": {
        post: {
            tags: ["Auth"],
            summary: "Đăng xuất và xóa cookie token",
            responses: {
                200: { description: "Đăng xuất thành công" }
            },
        },
    }
}