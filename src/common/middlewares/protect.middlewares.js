import { UnauthorizedException } from "../helpers/exception.helpers.js";
import { prisma } from "../prisma/connect.prisma.js";
import { tokenService } from "../../services/token.service.js";

export const protect = async (req, res, next) => {
    try {
        const {accessToken} = req.cookies;
        if (!accessToken) {
            throw new UnauthorizedException("Unauthorized");
        }

        //Kiểm tra token
        const decode = tokenService.verifyAccessToken(accessToken, {});
        //Kiểm tra người dùng có trong db hay không
        const userExits = await prisma.users.findUnique({
            where: {
                id: decode.userId
            }
        });
        if (!userExits) {
            throw new UnauthorizedException("Unauthorized");
        }
        req.user = userExits;
        next();
    } catch (error) {
        next(error);
    }
};