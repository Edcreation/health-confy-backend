import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from '@/modules/users/dto/create-user.dto';
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly firstName?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly lastName?: string;
}
