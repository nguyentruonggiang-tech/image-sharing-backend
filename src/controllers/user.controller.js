import { responseSuccess } from "../common/helpers/response.helpers.js";
export const userController = {
    async getMe(req, res, next) {
        try {
            const response = responseSuccess(req.user, "Lấy thông tin người dùng thành công");
            res.status(response.statusCode).json(response);
        } catch (error) {
            next(error);
        }
    }
};