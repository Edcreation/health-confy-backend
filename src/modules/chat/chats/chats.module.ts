// src/patient-info/patient-info.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoom } from './chat-room.entity';
import { ChatRoomService } from './chat-room.service';
import { ChatRoomController } from './chat-room.controller';
import { User } from '@/modules/users/entities/user.entity';
import { UsersModule } from '@/modules/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([ChatRoom, User]), UsersModule],
  providers: [ChatRoomService],
  controllers: [ChatRoomController],
  exports: [ChatRoomService],
})
export class ChatRoomModule {}
