import { prisma } from "../common/prisma/connect.prisma.js";
import bcrypt from "bcrypt";
import { tokenService } from "./token.service.js";
import { BadRequestException, UnauthorizedException } from "../common/helpers/exception.helpers.js";

export const authService = {
    async register(req) {
        const {email, password, fullName} = req.body;

        if (!email || !password || !fullName) {
            throw new Error("Email, password, fullName are required");
        }

        const userExists = await prisma.users.findUnique({
            where: {
                email: email
            }
        });

        if (userExists) {
            throw new BadRequestException("Người dùng đã tồn tại. Vui lòng đăng nhập")
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

        return userNew;
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
    }
};