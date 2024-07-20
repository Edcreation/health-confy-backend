// src/message/message.controller.ts
import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { MessageService } from './message.service';
import { Message } from './message.entity';
import { JwtAuthGuard } from '@/modules/auth/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/roles.guard';
import { ApiTags, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { Paginated, PaginateQuery } from 'nestjs-paginate';

@ApiTags('Messages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get(':roomId')
  @ApiParam({
    name: 'roomId',
    required: true
  })
  findAll(@Query() query: PaginateQuery, @Param('roomId') roomId: string): Promise<Paginated<Message>> {
    return this.messageService.findAll(query, roomId);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Message> {
    return this.messageService.findOne(id);
  }

  @Post()
  create(@Body() message: Message): Promise<Message> {
    return this.messageService.create(message);
  }
}
