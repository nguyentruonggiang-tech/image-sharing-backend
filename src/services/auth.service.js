import { prisma } from "../common/prisma/connect.prisma.js";
import bcrypt from "bcrypt";
import { tokenService } from "./token.service.js";
import { BadRequestException, UnauthorizedException } from "../common/helpers/exception.helpers.js";

export const authService = {
    async register(req) {
        const {email, password, fullName} = req.body;

        if (!email || !password || !fullName) {
            throw new BadRequestException("Email, password, fullName bắt buộc");
        }

        const userExists = await prisma.users.findUnique({
            where: {
                email: email
            }
        });

        if (userExists) {
            throw new BadRequestException("Email đã tồn tại. Vui lòng đăng nhập")
        }

        const saltRounds = 10;
        const passwordHassh = bcrypt.hashSync(password, saltRounds);

        const userNew = await prisma.users.create({
            data: {
                email: email,
                password: passwordHassh,
                fullName: fullName
            }
        })

        return {
            user: {
                id: userNew.id,
                email: userNew.email,
                fullName: userNew.fullName
            }
        };
    },

    async login(req) {
        const { email, password} = req.body;

        const userExists = await prisma.users.findUnique({
            where: {
                email: email
            },
            omit: {
                password: false
            }
        });

        if (!userExists) {
            throw new UnauthorizedException("Người dùng không tồn tại. Vui lòng đăng ký")
        }

        const isPassword = bcrypt.compareSync(password, userExists.password)
        if (!isPassword){
            throw new UnauthorizedException("Tài khoản hoặc mật khẩu không đúng. Vui lòng kiểm tra lại")
        }

        const  accessToken = tokenService.createAccessToken(userExists.id);
        const  refreshToken = tokenService.createRefreshToken(userExists.id);
        return {
            accessToken: accessToken,
            refreshToken: refreshToken,
            user: {
                id: userExists.id,
                email: userExists.email,
                fullName: userExists.fullName
            }
        };
    },
    async refreshToken(req) {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            throw new UnauthorizedException("Không có refresh token để kiểm tra");
        }
    
        const decode = tokenService.verifyRefreshToken(refreshToken, {});
        const user = await prisma.users.findUnique({
            where: { id: decode.userId },
            select: {
                id: true,
                email: true,
                fullName: true,
                avatar: true,
            },
        });
    
        if (!user) {
            throw new UnauthorizedException("Người dùng không tồn tại");
        }
    
        const newAccessToken = tokenService.createAccessToken(user.id);
        const newRefreshToken = tokenService.createRefreshToken(user.id); 
    
        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            user: user
        };
    }
};