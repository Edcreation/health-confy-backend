// src/chat-room/chat-room.controller.ts
import { Controller, Get, Post, Body, Param, UseGuards, Request, Delete, Query } from '@nestjs/common';
import { ChatRoomService } from './chat-room.service';
import { ChatRoom } from './chat-room.entity';
import { JwtAuthGuard } from '@/modules/auth/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/roles.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AddUserToChatRoomDto } from './dto/add-user.dato';
import { CreateChatRoomDto } from './dto/create.dto';
import { Paginated, PaginateQuery } from 'nestjs-paginate';

@ApiTags('Chat Rooms')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('chat-rooms')
export class ChatRoomController {
  constructor(private readonly chatRoomService: ChatRoomService) {}

  @Get()
  findAll(@Request() req, @Query() query: PaginateQuery): Promise<Paginated<ChatRoom>> {
    return this.chatRoomService.findAll(req.user.user, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ChatRoom> {
    return this.chatRoomService.findOne(id);
  }

  @Post()
  create(@Body() chatRoom: CreateChatRoomDto): Promise<ChatRoom> {
    return this.chatRoomService.make(chatRoom);
  }

  @Post('add-user')
  addUserToChatRoom(@Body() addUserToChatRoomDto: AddUserToChatRoomDto) {
    return this.chatRoomService.addUserToChatRoom(addUserToChatRoomDto);
  }

  @Delete('remove-user')
  removeUserFromChatRoom(@Body() removeUserFromChatRoomDto: AddUserToChatRoomDto) {
    return this.chatRoomService.removeUserFromChatRoom(removeUserFromChatRoomDto);
  }
}
