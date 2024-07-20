import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class AddUserToChatRoomDto {
    @ApiProperty()
    @IsString()
    userId: string;

    @ApiProperty()
    @IsString()
    chatRoomId: string;
  }