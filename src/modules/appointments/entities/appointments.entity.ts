import { Entity, Column, ManyToOne } from 'typeorm';
import { User } from '@/modules/users/entities/user.entity';
import { BasicEntity } from '@/common/basic_entity';

@Entity()
export class Appointment extends BasicEntity {
  @ManyToOne(() => User, { nullable: false, cascade: true, onDelete: 'CASCADE' })
  patient: User;

  @ManyToOne(() => User, { nullable: false, cascade: true, onDelete: 'CASCADE' })
  nurse: User;

  @Column()
  date: Date;

  @Column()
  description: string;
}
