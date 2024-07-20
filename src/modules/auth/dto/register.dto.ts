import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength } from 'class-validator';

export class RegisterRequestDto {
  @ApiProperty({
    description: 'The age of a cat',
    minimum: 1,
    default: 1,
  })
  @IsString()
  readonly firstName: string;

  @IsString()
  readonly lastName: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  @MinLength(6)
  readonly password: string;
}
