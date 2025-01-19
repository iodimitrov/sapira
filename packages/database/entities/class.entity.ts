import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  Column,
  Entity,
  Unique,
} from 'typeorm';
import { Institution } from './institution.entity';
import { Schedule } from './schedule.entity';
import { Teacher } from './teacher.entity';
import { Subject } from './subject.entity';
import { Message } from './message.entity';

export enum TokenStatus {
  ACTIVE,
  INACTIVE,
}

@Entity()
@Unique(['letter', 'number'])
export class Class {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Institution, { eager: true })
  institution: Institution;

  @Column('smallint')
  startYear: number;

  @Column('smallint')
  endYear: number;

  @Column('smallint')
  totalStudentCount: number;

  @OneToOne(() => Teacher, { eager: true, nullable: true })
  @JoinColumn()
  teacher?: Teacher | null;

  @Column('text')
  letter: string;

  @Column('smallint')
  number: number;

  @Column('text', { default: '' })
  token: string;

  @Column({
    type: 'enum',
    enum: TokenStatus,
    nullable: false,
    default: TokenStatus.ACTIVE,
  })
  tokenStatus: TokenStatus;

  @OneToMany(() => Schedule, (schedule) => schedule.class)
  schedules: Schedule[];

  @OneToMany(() => Subject, (subject) => subject.class)
  subjects: Subject[];

  @ManyToMany(() => Message, (message) => message.toClasses, {
    cascade: true,
  })
  messages: Message[];
}
