import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function PaginationQueries() {
  return applyDecorators(
    ApiQuery({
      name: 'limit',
      required: false,
      type: 'number',
    }),
    ApiQuery({
      name: 'page',
      required: false,
      type: 'number',
    }),
  );
}
