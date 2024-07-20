// src/chat.gateway.ts
import {
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketServer,
  } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ChatRoom } from './chats/chat-room.entity';
import { ChatRoomService } from './chats/chat-room.service';
import { Message } from './messages/message.entity';
import { MessageService } from './messages/message.service';
import { UsersService } from '../users/users.service';

  const options = {
    cors: true
  }
  @WebSocketGateway(options)
  export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('ChatGateway');
  
    constructor(
      private readonly chatRoomService: ChatRoomService,
      private readonly messageService: MessageService,
      private readonly usersService: UsersService,
    ) {}
  
    afterInit(server: Server) {
      this.logger.log('Init');
    }
  
    handleDisconnect(client: Socket) {
      this.logger.log(`Client disconnected: ${client.id}`);
    }
  
    handleConnection(client: Socket, ...args: any[]) {
      this.logger.log(`Client connected: ${client.id}`);
    }
  
    @SubscribeMessage('createRoom')
    async handleCreateRoom(client: Socket, payload:  { name: string; userIds: string[] }) {
      const chatRoom = new ChatRoom();
      console.log(payload)
      chatRoom.name = payload.name;
      const users = await this.usersService.findUsersByIds(payload.userIds);
      chatRoom.users = users; 
      const newChatRoom = await this.chatRoomService.create(chatRoom);
      console.log(newChatRoom)
      this.server.emit('roomCreated', newChatRoom);
    }
  
    @SubscribeMessage('sendMessage')
    async handleMessage(client: Socket, payload: { content: string; chatRoomId: string, userId: string }) {
      const message = new Message();
      message.content = payload.content;
      message.chatRoom = { id: payload.chatRoomId } as any; 
      message.user = { id: payload.userId } as any;
      const newMessage = await this.messageService.create(message);
      const realMessage = await this.messageService.findOne(newMessage.id);
      this.server.emit('messageSent', realMessage);
    }
  }
  