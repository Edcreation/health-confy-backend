import { PartialType } from '@nestjs/mapped-types';
import { CreateAppointmentDto } from './create.dto';

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {}
