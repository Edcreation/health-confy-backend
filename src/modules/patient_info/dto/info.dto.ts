// src/dto/create-patient-info.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsNumber } from 'class-validator';

export class CreatePatientInfoDto {
  @ApiProperty()
  @IsInt()
  age: number;

  @ApiProperty()
  @IsString()
  gender: string;

  @ApiProperty()
  @IsString()
  contacts: string;

  @ApiProperty()
  @IsNumber()
  recoveryRate: number;
}
