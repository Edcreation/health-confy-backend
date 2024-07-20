// src/entities/patient-info.entity.ts
import { BasicEntity } from '@/common/basic_entity';
import { User } from '@/modules/users/entities/user.entity';
import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';

@Entity()
export class PatientInfo extends BasicEntity {
  @Column()
  age: number;

  @Column()
  gender: string;

  @Column()
  contacts: string;

  @Column('decimal')
  recoveryRate: number;

  @OneToOne(() => User, (user) => user.patientInfo)
  @JoinColumn()
  user: User;
}
