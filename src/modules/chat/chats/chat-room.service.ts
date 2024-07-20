// src/chat-room/chat-room.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatRoom } from './chat-room.entity';
import { User } from '@/modules/users/entities/user.entity';
import { AddUserToChatRoomDto } from './dto/add-user.dato';
import { CreateChatRoomDto } from './dto/create.dto';
import { UsersService } from '@/modules/users/users.service';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';

@Injectable()
export class ChatRoomService {
  constructor(
    @InjectRepository(ChatRoom)
    private chatRoomsRepository: Repository<ChatRoom>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    private readonly usersService: UsersService,
  ) {}

  async findAll(user: User, query: PaginateQuery): Promise<Paginated<ChatRoom>> {
    const queryBuilder = this.chatRoomsRepository
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.users', 'users')
      .where('users.id = :userId', { userId: user.id });

    return paginate(query, queryBuilder,  {
      searchableColumns: ['messages.content', 'users'],
      defaultSortBy: [['created_at', 'DESC']],
      defaultLimit: 50,
      sortableColumns: ['created_at'],
      relations: ['messages', 'messages.user']
    });
  }

  findOne(id: string): Promise<ChatRoom> {
    return this.chatRoomsRepository.findOne({where: { id }, relations: ['users', 'messages']});
  }

  create(chatRoom: ChatRoom): Promise<ChatRoom> {
    return this.chatRoomsRepository.save(chatRoom);
  }

  async make(cRoom: CreateChatRoomDto): Promise<ChatRoom> {
    const chatRoom = new ChatRoom();
    chatRoom.name = cRoom.name;
    const users = await this.usersService.findUsersByIds([ cRoom.userId ]);
    chatRoom.users = users; 
    return this.chatRoomsRepository.save(chatRoom);
  }

  async addUserToChatRoom(addUserToChatRoomDto: AddUserToChatRoomDto): Promise<ChatRoom> {
    const { userId, chatRoomId } = addUserToChatRoomDto;
    
    const chatRoom = await this.chatRoomsRepository.findOne({ where: { id: chatRoomId }, relations: ['users'] });
    if (!chatRoom) {
      throw new NotFoundException('Chat room not found');
    }

    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    chatRoom.users.push(user);
    await this.chatRoomsRepository.save(chatRoom);
    return chatRoom;
  }

  async removeUserFromChatRoom(removeUserFromChatRoomDto: AddUserToChatRoomDto): Promise<ChatRoom> {
    const { userId, chatRoomId } = removeUserFromChatRoomDto;
    
    const chatRoom = await this.chatRoomsRepository.findOne({ where: { id: chatRoomId }, relations: ['users'] });
    if (!chatRoom) {
      throw new NotFoundException('Chat room not found');
    }

    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    chatRoom.users = chatRoom.users.filter(existingUser => existingUser.id !== user.id);
    await this.chatRoomsRepository.save(chatRoom);
    return chatRoom;
  }
}
