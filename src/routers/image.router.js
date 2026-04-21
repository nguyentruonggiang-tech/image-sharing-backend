import express from "express";
import { imageController } from "../controllers/image.controller.js";
import commentRouter from "./comment.router.js";

const imageRouter = express.Router();

imageRouter.get("/", imageController.findAll);
imageRouter.get("/search", imageController.searchByName);
imageRouter.use("/:imageId/comments", commentRouter);
imageRouter.get("/:imageId", imageController.findOne);

export default imageRouter;