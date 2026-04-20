import {authService} from "../services/auth.service.js"
import { responseSuccess } from "../common/helpers/response.helpers.js";
import { statusCodes } from "../common/helpers/status-code.helper.js";

export const authController = {
    async register(req, res, next) {
        try {
            const result = await authService.register(req);
            const response = responseSuccess(result, `Đăng ký thành công`);
            res.status(response.statusCode).json(response);
        } catch (error) {
            next(error);
        }
    },

    async login(req, res, next) {
        try {
            const result = await authService.login(req);
            res.cookie("accessToken", result.accessToken);
            res.cookie("refreshToken", result.refreshToken);
            const response = responseSuccess(true, `Đăng nhập thành công`);
            res.status(response.statusCode).json(response);
        } catch (error) {
            next(error);
        }
    }
};