import { responseSuccess } from "../common/helpers/response.helpers.js";
export const userController = {
    async getMe(req, res, next) {
        try {
            const result = await userService.getMe(req);
            const response = responseSuccess(result, "Lấy thông tin người dùng thành công");
            return res.status(response.statusCode).json(response);
        } catch (error) {
            next(error);
        }
    },
    async getMyCreatedImages(req, res, next) {
        try {
            const result = await userService.getMyCreatedImages(req);
            const response = responseSuccess(result, "Lấy danh sách ảnh đã tạo thành công");
            return res.status(response.statusCode).json(response);
        } catch (error) {
            next(error);
        }
    },
    async getMySavedImages(req, res, next) {
        try {
            const result = await userService.getMySavedImages(req);
            const response = responseSuccess(result, "Lấy danh sách ảnh đã lưu thành công");
            return res.status(response.statusCode).json(response);
        } catch (error) {
            next(error);
        }
    },
};