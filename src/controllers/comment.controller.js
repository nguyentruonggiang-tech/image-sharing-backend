import { responseSuccess } from "../common/helpers/response.helpers.js";
import { statusCodes } from "../common/helpers/status-code.helper.js";
import { commentService } from "../services/comment.service.js";

export const commentController = {
    async findByImageId(req, res, next) {
        try {
            const result = await commentService.findByImageId(req);
            const response = responseSuccess(
                result,
                "Lấy danh sách bình luận theo ảnh thành công"
            );
            return res.status(response.statusCode).json(response);
        } catch (error) {
            next(error);
        }
    },

    async create(req, res, next) {
        try {
            const result = await commentService.create(req);
            const response = responseSuccess(
                result,
                "Thêm bình luận thành công",
                statusCodes.CREATED
            );
            return res.status(response.statusCode).json(response);
        } catch (error) {
            next(error);
        }
    },
};