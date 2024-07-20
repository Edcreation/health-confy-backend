// src/message/message.entity.ts
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BasicEntity } from '@/common/basic_entity';
import { ChatRoom } from '../chats/chat-room.entity';
import { User } from '@/modules/users/entities/user.entity';

@Entity()
export class Message extends BasicEntity {

  @Column()
  content: string;

  @ManyToOne(() => ChatRoom, chatRoom => chatRoom.messages, { onDelete: 'CASCADE' })
  chatRoom: ChatRoom;

  @ManyToOne(() => User, user => user.messages)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
