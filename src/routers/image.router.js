import express from "express";
import { imageController } from "../controllers/image.controller.js";
import commentRouter from "./comment.router.js";
import { protect } from "../common/middlewares/protect.middlewares.js";

const imageRouter = express.Router();

imageRouter.get("/", imageController.findAll);
imageRouter.get("/search", imageController.searchByName);
imageRouter.use("/:imageId/comments", commentRouter);
imageRouter.get("/:imageId/saved", protect, imageController.isSaved);
imageRouter.post("/:imageId/saved", protect, imageController.saveImage);
imageRouter.delete("/:imageId/saved", protect, imageController.unsaveImage);
imageRouter.get("/:imageId", imageController.findOne);

export default imageRouter;