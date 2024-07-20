import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/modules/users/entities/user.entity';
import { CreateAppointmentDto } from './dto/create.dto';
import { UpdateAppointmentDto } from './dto/update.dto';
import { Appointment } from './entities/appointments.entity';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';
import { UserRole } from '../users/dto/create-user.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    const patient = await this.userRepository.findOneBy({
      id: createAppointmentDto.patientId,
    });
    const nurse = await this.userRepository.findOneBy({
      id: createAppointmentDto.nurseId,
    });
    if (!patient || !nurse) {
      throw new NotFoundException('Invalid patient or nurse ID');
    }

    const appointment = this.appointmentRepository.create({
      ...createAppointmentDto,
      patient,
      nurse,
    });

    return this.appointmentRepository.save(appointment);
  }

  async findAll(
    query: PaginateQuery,
    user: User,
  ): Promise<Paginated<Appointment>> {
    const queryBuilder = this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.patient', 'patient')
      .leftJoinAndSelect('appointment.nurse', 'nurse');
      
    if (user.role === 'nurse') {
      queryBuilder.where('nurse.id = :nurseId', { nurseId: user.id });
    }

    return paginate(query, queryBuilder, {
      searchableColumns: ['description', 'date'],
      defaultSortBy: [['id', 'ASC']],
      defaultLimit: 10,
      sortableColumns: ['date'],
    });
  }

  async findOne(id: string): Promise<Appointment> {
    return this.appointmentRepository.findOne({
      where: { id },
      relations: ['patient', 'nurse'],
    });
  }

  async update(
    id: string,
    updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<Appointment> {
    await this.appointmentRepository.update(id, updateAppointmentDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.appointmentRepository.delete(id);
  }
}
