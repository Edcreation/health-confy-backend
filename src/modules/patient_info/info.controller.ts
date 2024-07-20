// src/controllers/patient-info.controller.ts
import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Get,
  Query,
  Request
} from '@nestjs/common';
import { CreatePatientInfoDto } from './dto/info.dto';
import { PatientInfoService } from './info.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../users/dto/create-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaginateQuery } from 'nestjs-paginate';
import { PaginationQueries } from '@/decorators/pagination.decorator';

@ApiBearerAuth()
@ApiTags('Patient Info')
@Controller('info')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PatientInfoController {
  constructor(private readonly patientInfoService: PatientInfoService) {}

  @Roles(UserRole.NURSE)
  @Get()
  @PaginationQueries()
  async findAll(@Query() query: PaginateQuery,  @Request() req) {
    return this.patientInfoService.findAll(query, req.user.user);
  }

  @Roles(UserRole.NURSE)
  @Post(':userId')
  async addPatientInfo(
    @Param('userId') userId: string,
    @Body() createPatientInfoDto: CreatePatientInfoDto,
  ) {
    return this.patientInfoService.addPatientInfo(userId, createPatientInfoDto);
  }
}
