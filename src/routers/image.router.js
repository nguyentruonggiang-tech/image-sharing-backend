import express from "express";
import { imageController } from "../controllers/image.controller.js";
import commentRouter from "./comment.router.js";
import { protect } from "../common/middlewares/protect.middlewares.js";
import { uploadMemoryStorage } from "../common/multer/memory-storage.multer.js";
const imageRouter = express.Router();

imageRouter.get("/", imageController.findAll);
imageRouter.get("/search", imageController.searchByName);
imageRouter.post(
    "/",
    protect,
    uploadMemoryStorage.single("image"),
    imageController.create
);
imageRouter.use("/:imageId/comments", commentRouter);
imageRouter.get("/:imageId/saved", protect, imageController.isSaved);
imageRouter.post("/:imageId/saved", protect, imageController.saveImage);
imageRouter.delete("/:imageId/saved", protect, imageController.unsaveImage);
imageRouter.get("/:imageId", imageController.findOne);
imageRouter.delete("/:imageId", protect, imageController.deleteImage);

export default imageRouter;