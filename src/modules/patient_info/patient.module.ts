// src/patient-info/patient-info.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { PatientInfo } from './entities/info.entity';
import { PatientInfoController } from './info.controller';
import { PatientInfoService } from './info.service';

@Module({
  imports: [TypeOrmModule.forFeature([PatientInfo, User])],
  providers: [PatientInfoService],
  controllers: [PatientInfoController],
})
export class PatientInfoModule {}
