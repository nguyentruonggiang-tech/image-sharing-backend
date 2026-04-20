import { statusCodes } from "./status-code.helper.js";

export const responseSuccess = (data, message = "OK", statusCode = statusCodes.OK) => {
    return {
        status: "success",
        statusCode: statusCode,
        message: message,
        data: data,
        doc: "swagger.com"
    }
}

export const responseError = (message = "Internal Server Error", statusCode = statusCodes.INTERNAL_SERVER_ERROR, stack = null) => {
    return {
        status: "error",
        statusCode: statusCode,
        message: message,
        stack: stack,
        doc: "swagger.com"
    }
}