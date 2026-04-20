import { stat } from "node:fs";
import { responseError } from "./response.helpers.js";
import jwt from "jsonwebtoken"
import { statusCodes } from "./status-code.helper.js";

export const appErr = (err, req, res, next) => {
    if (err instanceof jwt.JsonWebTokenError) {
        err.code = statusCodes.UNAUTHORIZED
    }
    if (err instanceof jwt.TokenExpiredError) {
        err.code = statusCodes.FORBIDDEN
    }
    const response = responseError(err?.message, err?.code, err?.stack)
   
    res.status(response.statusCode).json(response);
};