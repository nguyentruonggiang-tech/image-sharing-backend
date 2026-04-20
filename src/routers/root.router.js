import express from "express"

const rootRouter = express.Router()

rootRouter.get("/health", (req, res) => {
    return res.status(200).json({ success: true, message: "Server is running" });
});

export default rootRouter