// src/patient-info/patient-info.module.ts
import { User } from '@/modules/users/entities/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Message, User])],
  providers: [MessageService],
  controllers: [MessageController],
  exports: [MessageService],
})
export class MessageModule {}
