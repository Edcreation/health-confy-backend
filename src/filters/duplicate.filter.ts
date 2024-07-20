// filters/duplicate-key-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Response } from 'express';

@Catch(QueryFailedError)
export class DuplicateKeyExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = 409; // Conflict

    if (exception.message.includes('duplicate key value')) {
      response.status(status).json({
        statusCode: status,
        message:
          'Duplicate key error: The value already exists in the database',
        error: 'Conflict',
      });
    } else {
      response.status(500).json({
        statusCode: 500,
        message: 'Internal server error',
      });
    }
  }
}
