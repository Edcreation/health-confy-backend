// src/message/message.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { query } from 'express';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
  ) {}

  findAll(query: PaginateQuery,roomId: string): Promise<Paginated<Message>> {
    const queryBuilder = this.messagesRepository
    .createQueryBuilder('messages')
    .leftJoinAndSelect('messages.chatRoom', 'chatRoom')
    .where('chatRoom.id = :roomId', { roomId });

    return paginate(query, queryBuilder, {
      searchableColumns: ['content'],
      defaultSortBy: [['created_at', 'DESC']],
      defaultLimit: 50,
      sortableColumns: ['content'],
      relations: ['chatRoom', 'user']
    });
  }

  findOne(id: string): Promise<Message> {
    return this.messagesRepository.findOne({ where: { id }, relations: ['chatRoom', 'user']});
  }

  create(message: Message): Promise<Message> {
    return this.messagesRepository.save(message);
  }
}
