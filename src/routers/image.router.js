import express from "express";
import { imageController } from "../controllers/image.controller.js";

const imageRouter = express.Router();

imageRouter.get("/", imageController.findAll);
imageRouter.get("/search", imageController.searchByName);
imageRouter.get("/:imageId", imageController.findOne);

export default imageRouter;