import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength, IsEnum } from 'class-validator';

export enum UserRole {
  PATIENT = 'patient',
  NURSE = 'nurse',
  SUPERVISOR = 'supervisor',
  ADMIN = 'admin',
}

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  readonly firstName: string;

  @ApiProperty()
  @IsString()
  readonly lastName: string;

  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    enum: UserRole,
    example: 'admin, nurse,supervisor or patient',
  })
  @IsEnum(UserRole)
  readonly role: UserRole;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  readonly password: string;
}
