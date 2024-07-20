import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/modules/users/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '@/modules/auth/auth.module';
import { UsersModule } from '@/modules/users/users.module';
import { PatientInfo } from './modules/patient_info/entities/info.entity';
import { PatientInfoModule } from './modules/patient_info/patient.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { Appointment } from './modules/appointments/entities/appointments.entity';
import { ChatRoomService } from './modules/chat/chats/chat-room.service';
import { MessageService } from './modules/chat/messages/message.service';
import { ChatRoomModule } from './modules/chat/chats/chats.module';
import { MessageModule } from './modules/chat/messages/message.module';
import { ChatRoom } from './modules/chat/chats/chat-room.entity';
import { Message } from './modules/chat/messages/message.entity';
import { ChatGateway } from './modules/chat/chat.gateway';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1234',
      database: 'patient_info',
      entities: [User, PatientInfo, Appointment, ChatRoom, Message],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule,
    UsersModule,
    PatientInfoModule,
    AppointmentsModule,
    ChatRoomModule,
    MessageModule,
  ],
  providers: [ChatGateway]
})
export class AppModule {}
