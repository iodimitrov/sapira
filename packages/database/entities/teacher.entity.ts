import {
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToMany,
  OneToOne,
  Column,
  Entity,
} from 'typeorm';
import { Schedule } from './schedule.entity';
import { Subject } from './subject.entity';
import { User } from './user.entity';

export enum ContractType {
  PART_TIME = 'part_time',
  FULL_TIME = 'full_time',
}

@Entity()
export class Teacher {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, { eager: true })
  @JoinColumn()
  user: User;

  @Column('text', { nullable: true })
  education?: string;

  @Column('smallint', { nullable: true })
  yearsExperience?: number;

  @Column({
    type: 'enum',
    enum: ContractType,
    nullable: true,
  })
  contractType?: ContractType;

  @Column('text', { default: '' })
  token: string;

  @ManyToMany(() => Subject, (subject) => subject.teachers, { nullable: true })
  subjects?: Subject[];

  @ManyToMany(() => Schedule, (schedule) => schedule.teachers, {
    nullable: true,
  })
  schedules?: Schedule[];
}
