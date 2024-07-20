import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class InternalServerErrorExceptionFilter implements ExceptionFilter {
  catch(error: any, host: ArgumentsHost) {
    console.log('====================================');
    console.log(error);
    console.log('====================================');
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = 500;

    response.status(error.response ? error.response.statusCode : status).json(
      error.response ?? {
        statusCode: status,
        message: 'Internal server error',
        error: 'Internal Server Error',
      },
    );
  }
}
