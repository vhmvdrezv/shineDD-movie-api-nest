import { ArgumentsHost, Catch, HttpException, HttpStatus } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Request, Response } from "express";
import { MyLoggerService } from "./my-logger/my-logger.service";

type MyResponseObj = {
    statusCode: number,
    timestamp: string,
    path: string,
    response: string | object
}

@Catch()
export class AllExceptionFilter extends BaseExceptionFilter {

    private myLogger = new MyLoggerService()

    async catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();

        const myResponseObj: MyResponseObj = {
            statusCode: 500,
            timestamp: new Date().toISOString(),
            path: request.url,
            response: ''
        }
        
        if (exception instanceof HttpException) {
            myResponseObj.statusCode = exception.getStatus();
            myResponseObj.response = exception.getResponse();
        } else if (exception instanceof PrismaClientKnownRequestError) {
            if (exception.code = 'P2025') {
                myResponseObj.statusCode = HttpStatus.NOT_FOUND;
                myResponseObj.response = "The requested record does not exist."
            } else {
                myResponseObj.statusCode = HttpStatus.BAD_REQUEST;
                myResponseObj.response = "A database error occurred."
            }
        } else {
            myResponseObj.response = exception.message || "An unexpected error occurred.";
        }

        await this.myLogger.error({
            message: exception.message,
            stack: exception.stack,
            path: request.url,
            statusCode: myResponseObj.statusCode,
        }, 'AllExceptionFilter');

        response
            .status(myResponseObj.statusCode)
            .json(myResponseObj);

    }
}