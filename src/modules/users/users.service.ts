import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, UserRole } from '@/modules/users/dto/create-user.dto';
import { UpdateUserDto } from '@/modules/users/dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/modules/users/entities/user.entity';
import { Repository } from 'typeorm';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(
    query: PaginateQuery,
    role?: UserRole,
  ): Promise<Paginated<User>> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');


    if (role) {
      queryBuilder.where('user.role = :role', { role });
    }

    return paginate(query, queryBuilder, {
      sortableColumns: ['id', 'firstName', 'lastName', 'email'],
      searchableColumns: ['firstName', 'lastName', 'email'],
      defaultSortBy: [['id', 'ASC']],
      defaultLimit: 10,
      relations: ['patientInfo', 'assignedPatients', 'chatRooms', 'nurse'],
    });
  }

  async findOne(id: string): Promise<User> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['assignedPatients'],
    });
  }

  async findUsersByIds(userIds: string[]): Promise<User[]> {
    return await this.userRepository.findByIds(userIds);
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOneBy({ email });
  }

  async create(User: CreateUserDto): Promise<User> {
    return this.userRepository.save(User);
  }

  async update(id: string, User: UpdateUserDto): Promise<User> {
    await this.userRepository.update(id, User);
    return this.userRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  async assignPatientToNurse(
    patientId: string,
    nurseId: string,
  ): Promise<void> {
    const patient = await this.userRepository.findOne({
      where: { id: patientId },
    });
    if (patient.role !== UserRole.PATIENT) {
      throw new NotFoundException('The user is not a patient.');
    }

    const nurse = await this.userRepository.findOne({ where: { id: nurseId } });
    if (nurse.role !== UserRole.NURSE) {
      throw new NotFoundException('The user is not a nurse.');
    }

    patient.nurse = nurse;
    await this.userRepository.save(patient);
  }
}
