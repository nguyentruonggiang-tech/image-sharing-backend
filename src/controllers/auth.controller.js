import {authService} from "../services/auth.service.js"
import { responseSuccess } from "../common/helpers/response.helpers.js";
import { statusCodes } from "../common/helpers/status-code.helper.js";
import ms from "ms";
import { ACCESS_EXPIRES_IN, REFRESH_EXPIRES_IN } from "../common/constant/app.constant.js";

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
            const cookieOptions = {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
            };

            const result = await authService.login(req);
            const accessMaxAge = ms(ACCESS_EXPIRES_IN);
            const refreshMaxAge = ms(REFRESH_EXPIRES_IN);   
            res.cookie("accessToken", result.accessToken, {...cookieOptions, maxAge: accessMaxAge});
            res.cookie("refreshToken", result.refreshToken, {...cookieOptions, maxAge: refreshMaxAge});

            const response = responseSuccess(
                { user: result.user }, 
                "Đăng nhập thành công", 
                statusCodes.OK
            );
            res.status(response.statusCode).json(response);
        } catch (error) {
            next(error);
        }
    }
};