// src/chat-room/chat-room.entity.ts
import { User } from '@/modules/users/entities/user.entity';
import { Entity, Column, ManyToOne, OneToMany, OneToOne, ManyToMany } from 'typeorm';
import { Message } from '../messages/message.entity';
import { BasicEntity } from '@/common/basic_entity';

@Entity()
export class ChatRoom extends BasicEntity {

  @Column()
  name: string;

  @OneToMany(() => Message, message => message.chatRoom, { cascade: true, onDelete: 'CASCADE' })
  messages: Message[];
  
  @ManyToMany(() => User, user => user.chatRooms, { onDelete: 'CASCADE' })
  users: User[];
}
