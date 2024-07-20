import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { User } from '@/modules/users/entities/user.entity';
import { Appointment } from './entities/appointments.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, User])],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
})
export class AppointmentsModule {}
