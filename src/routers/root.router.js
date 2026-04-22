import express from "express"
import authRouter from "./auth.router.js";
import userRouter from "./user.router.js";
import imageRouter from "./image.router.js";

const rootRouter = express.Router()

rootRouter.get("/health", (req, res) => {
    return res.status(200).json({ success: true, message: "Server đang hoạt động" });
});

rootRouter.use("/auth", authRouter);
rootRouter.use("/user", userRouter);
rootRouter.use("/images", imageRouter);

export default rootRouter