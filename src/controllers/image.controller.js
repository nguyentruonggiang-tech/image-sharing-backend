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

    async isSaved(req, res, next) {
        try {
            const result = await imageService.isSaved(req);
            const response = responseSuccess(
                result,
                "Lấy trạng thái lưu ảnh thành công"
            );
            return res.status(response.statusCode).json(response);
        } catch (error) {
            next(error);
        }
    },

    async saveImage(req, res, next) {
        try {
            const result = await imageService.saveImage(req);
            const response = responseSuccess(
                result,
                "Lưu ảnh thành công"
            );
            return res.status(response.statusCode).json(response);
        } catch (error) {
            next(error);
        }
    },
    
    async unsaveImage(req, res, next) {
        try {
            const result = await imageService.unsaveImage(req);
            const response = responseSuccess(
                result,
                "Xóa lưu ảnh thành công"
            );
            return res.status(response.statusCode).json(response);
        } catch (error) {
            next(error);
        }
    },

    async deleteImage(req, res, next) {
        try {
            const result = await imageService.deleteImage(req);
            const response = responseSuccess(result, "Xóa ảnh thành công");
            return res.status(response.statusCode).json(response);
        } catch (error) {
            next(error);
        }
    },

    async create(req, res, next) {
        try {
            const result = await imageService.create(req);
            const response = responseSuccess(result, "Tạo ảnh thành công");
            return res.status(response.statusCode).json(response);
        } catch (error) {
            next(error);
        }
    }
};