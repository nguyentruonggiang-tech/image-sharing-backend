import jwt from "jsonwebtoken"
import { BadRequestException } from "../common/helpers/exception.helpers.js"
import {ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, ACCESS_EXPIRES_IN, REFRESH_EXPIRES_IN} from "../common/constant/app.constant.js"

export const tokenService = {
    createAccessToken(userId){
        if (!userId){
            throw new BadRequestException("Không có userId để tạo token")
        }
        const accessToken = jwt.sign(
            {userId: userId},
            ACCESS_TOKEN_SECRET,
            {expiresIn: ACCESS_EXPIRES_IN}
        )
        return accessToken;
    },

    createRefreshToken(userId){
        if (!userId){
            throw new BadRequestException("Không có userId để tạo token")
        }
        const refreshToken = jwt.sign(
            {userId: userId},
            REFRESH_TOKEN_SECRET,
            {expiresIn: REFRESH_EXPIRES_IN}
        )
        return refreshToken;
    },

    verifyAccessToken(accessToken, option){
        const decode = jwt.verify(accessToken,ACCESS_TOKEN_SECRET, option)
        return decode;
    },

    verifyRefreshToken(refreshToken, option){
        const decode = jwt.verify(refreshToken,REFRESH_TOKEN_SECRET, option)
        return decode;
    }
}