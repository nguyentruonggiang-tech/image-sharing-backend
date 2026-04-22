import { auth } from "./auth.swagger.js";
import { user } from "./user.swagger.js";
import { image } from "./image.swagger.js";
import { comment } from "./comment.swagger.js";
export const swaggerDocument = {
    openapi: "3.0.4",
    info: {
        title: "Sample API",
        description:
            "Optional multiline or single-line description in [CommonMark](http://commonmark.org/help/) or HTML.",
        version: "0.1.9",
    },
    servers: [
        {
            url: "https://image-sharing.up.railway.app/api",
            description: "Optional server description, e.g. Main (production) server",
        },
        {
            url: "http://localhost:3069/api",
            description: "Optional server description, e.g. Local (production) server",
        }
    ],
    paths: {
        "/health": {
            get: {
              tags: ["Health"],
              summary: "Health check",
              responses: {
                200: { description: "Server is running" }
              }
            }
        },
        ...auth,
        ...user,
        ...image,
        ...comment,
    },
};
