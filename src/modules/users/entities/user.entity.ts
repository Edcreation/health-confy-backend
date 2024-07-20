import { Entity, Column, OneToOne, ManyToOne, OneToMany, JoinTable, ManyToMany } from 'typeorm';
import { UserRole } from '../dto/create-user.dto';
import { PatientInfo } from '@/modules/patient_info/entities/info.entity';
import { BasicEntity } from '@/common/basic_entity';
import { ChatRoom } from '@/modules/chat/chats/chat-room.entity';
import { Message } from '@/modules/chat/messages/message.entity';

@Entity()
export class User extends BasicEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.PATIENT,
  })
  role: UserRole;

  @OneToOne(() => PatientInfo, (patientInfo) => patientInfo.user, {
    nullable: true,
    cascade: true,
    onDelete: 'CASCADE'
  })
  patientInfo: PatientInfo | null;

  @ManyToOne(() => User, (user) => user.assignedPatients, { nullable: true })
  nurse: User;

  
  @OneToMany(() => User, (user) => user.nurse, { cascade: true, })
  assignedPatients: User[];
  
  @ManyToMany(() => ChatRoom, chatRoom => chatRoom.users, { cascade: true, onDelete: 'CASCADE' })
  @JoinTable()
  chatRooms: ChatRoom[];

  @OneToMany(() => Message, message => message.user)
  messages: Message[];
}
