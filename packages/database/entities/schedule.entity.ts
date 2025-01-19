import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Institution } from './institution.entity';
import { Subject } from './subject.entity';
import { Teacher } from './teacher.entity';
import { Class } from './class.entity';

export enum WeekDays {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday',
}

@Entity()
@Unique(['institution', 'day', 'subject', 'class', 'startTime', 'endTime'])
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('timestamp')
  startTime: Date;

  @Column('timestamp')
  endTime: Date;

  @Column('enum', { enum: WeekDays })
  day: WeekDays;

  @ManyToOne(() => Subject, (subject) => subject.schedules, { eager: true })
  subject: Subject;

  @ManyToOne(() => Class, (cls) => cls.schedules, { eager: true })
  class: Class;

  @ManyToMany(() => Teacher, (teacher) => teacher.schedules, {
    eager: true,
    nullable: true,
  })
  @JoinTable({
    name: 'schedule_teacher',
    joinColumn: {
      name: 'schedule',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'teacher',
      referencedColumnName: 'id',
    },
  })
  teachers: Teacher[] | null;

  @ManyToOne(() => Institution, (institution) => institution.schedules, {
    eager: true,
  })
  institution: Institution;

  @Column('text')
  room: string;
}
