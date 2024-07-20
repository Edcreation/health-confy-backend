import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsUUID, IsString, IsNotEmpty, IsDate } from 'class-validator';

export class CreateAppointmentDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  readonly patientId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  readonly nurseId: string;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  readonly date: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly description: string;
}
