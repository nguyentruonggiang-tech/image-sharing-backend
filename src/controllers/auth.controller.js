import {authService} from "../services/auth.service.js"
import { responseSuccess } from "../common/helpers/response.helpers.js";
import { statusCodes } from "../common/helpers/status-code.helper.js";
import ms from "ms";
import { ACCESS_EXPIRES_IN, REFRESH_EXPIRES_IN, NODE_ENV } from "../common/constant/app.constant.js";

const getCookieOptions = () => ({
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
});

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
            const cookieOptions = getCookieOptions();

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
    },

    async refreshToken(req, res, next) {
        try {
            const cookieOptions = getCookieOptions();
    
            const result = await authService.refreshToken(req);
    
            const accessMaxAge = ms(ACCESS_EXPIRES_IN);
            const refreshMaxAge = ms(REFRESH_EXPIRES_IN);
    
            res.cookie("accessToken", result.accessToken, { ...cookieOptions, maxAge: accessMaxAge });
            res.cookie("refreshToken", result.refreshToken, { ...cookieOptions, maxAge: refreshMaxAge });
    
            const response = responseSuccess({ user: result.user }, "Refresh token thành công", statusCodes.OK);
            res.status(response.statusCode).json(response);
        } catch (error) {
            next(error);
        }
    },
    
    async logout(req, res, next) {
        try {
            const cookieOptions = getCookieOptions();

            res.clearCookie("accessToken", cookieOptions);
            res.clearCookie("refreshToken", cookieOptions);
    
            const response = responseSuccess(null, "Đăng xuất thành công", statusCodes.OK);
            res.status(response.statusCode).json(response);
        } catch (error) {
            next(error);
        }
    },

};