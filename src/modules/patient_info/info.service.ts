// src/services/patient-info.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import { CreatePatientInfoDto } from './dto/info.dto';
import { PatientInfo } from './entities/info.entity';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';

@Injectable()
export class PatientInfoService {
  constructor(
    @InjectRepository(PatientInfo)
    private patientInfoRepository: Repository<PatientInfo>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async addPatientInfo(
    userId: string,
    createPatientInfoDto: CreatePatientInfoDto,
  ): Promise<PatientInfo> {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== UserRole.PATIENT) {
      throw new BadRequestException('User is not a patient');
    }

    const patientInfo = this.patientInfoRepository.create(createPatientInfoDto);
    patientInfo.user = user;
    return this.patientInfoRepository.save(patientInfo);
  }

  async findAll(query: PaginateQuery, nurse: User): Promise<Paginated<User>> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.nurse', 'nurse')
      .where('nurse.id = :nurseId', { nurseId: nurse.id  })

    return paginate(query, queryBuilder, {
      sortableColumns: ['id', 'firstName', 'lastName', 'email'],
      searchableColumns: ['firstName', 'lastName', 'email'],
      defaultSortBy: [['id', 'ASC']],
      defaultLimit: 10,
      relations: ['patientInfo'],
    });
  }
}
