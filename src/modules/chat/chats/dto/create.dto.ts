import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateChatRoomDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    userId: string;
  }