import { auth } from "./auth.swagger.js";
import { user } from "./user.swagger.js";
import { image } from "./image.swagger.js";
import { comment } from "./comment.swagger.js";
export const swaggerDocument = {
    openapi: "3.0.4",
    info: {
        title: "API chia sẻ ảnh",
        description:
            "Tài liệu API cho dự án học tập chia sẻ ảnh.",
        version: "0.1.9",
    },
    servers: [
        {
            url: "https://image-sharing.up.railway.app/api",
            description: "Máy chủ chính (production)",
        },
        {
            url: "http://localhost:3069/api",
            description: "Máy chủ local (phát triển)",
        }
    ],
    paths: {
        "/health": {
            get: {
              tags: ["Health"],
              summary: "Kiểm tra trạng thái server",
              responses: {
                200: { description: "Server đang hoạt động" }
              }
            }
        },
        ...auth,
        ...user,
        ...image,
        ...comment,
    },
};
