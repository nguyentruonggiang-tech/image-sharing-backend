import express from "express";
import { commentController } from "../controllers/comment.controller.js";
import { protect } from "../common/middlewares/protect.middlewares.js";

const commentRouter = express.Router({ mergeParams: true });

commentRouter.get("/", commentController.findByImageId);
commentRouter.post("/", protect, commentController.create);

export default commentRouter;