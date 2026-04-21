import { responseSuccess } from "../common/helpers/response.helpers.js";
import { imageService } from "../services/image.service.js";

export const imageController = {
    async findAll(req, res, next) {
        try {
            const result = await imageService.findAll(req);
            const response = responseSuccess(
                result,
                "Lấy danh sách ảnh thành công"
            );
            return res.status(response.statusCode).json(response);
        } catch (error) {
            next(error);
        }
    },

    async searchByName(req, res, next) {
        try {
            const result = await imageService.searchByName(req);
            const response = responseSuccess(
                result,
                "Tìm kiếm danh sách ảnh theo tên thành công"
            );
            return res.status(response.statusCode).json(response);
        } catch (error) {
            next(error);
        }
    },

    async findOne(req, res, next) {
        try {
            const result = await imageService.findOne(req);
            const response = responseSuccess(
                result,
                "Lấy chi tiết ảnh thành công"
            );
            return res.status(response.statusCode).json(response);
        } catch (error) {
            next(error);
        }
    },
};