import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create.dto';
import { UpdateAppointmentDto } from './dto/update.dto';
import { PaginateQuery } from 'nestjs-paginate';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../users/dto/create-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaginationQueries } from '@/decorators/pagination.decorator';

@ApiBearerAuth()
@ApiTags('Appointments')
@Controller('appointments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Roles(UserRole.SUPERVISOR)
  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Get()
  @Roles(UserRole.NURSE, UserRole.SUPERVISOR)
  @PaginationQueries()
  findAll(@Query() query: PaginateQuery, @Request() req) {
    return this.appointmentsService.findAll(query, req.user.user);
  }

  @Roles(UserRole.NURSE, UserRole.SUPERVISOR)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Roles(UserRole.SUPERVISOR)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.update(id, updateAppointmentDto);
  }

  @Roles(UserRole.SUPERVISOR)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentsService.remove(id);
  }
}
