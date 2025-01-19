import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Class } from './class.entity';
import { StudentDossier } from './student-dossier.entity';
import { StudentGrade } from './grade.entity';
import { Institution } from './institution.entity';
import { Message } from './message.entity';
import { Schedule } from './schedule.entity';
import { Teacher } from './teacher.entity';

@Entity()
export class Subject {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('smallint')
  startYear: number;

  @Column('smallint')
  endYear: number;

  @Column('text')
  name: string;

  @Column('text')
  description: string;

  @ManyToOne(() => Institution, (institution) => institution.subjects, {
    eager: true,
  })
  institution: Institution;

  @ManyToMany(() => Teacher, (teacher) => teacher.subjects, {
    eager: true,
    nullable: true,
  })
  @JoinTable({
    name: 'teacher_subject',
    joinColumn: {
      name: 'subjects',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'teachers',
      referencedColumnName: 'id',
    },
  })
  teachers?: Teacher[];

  @OneToMany(() => Schedule, (schedule) => schedule.subject)
  schedules: Schedule[];

  @ManyToOne(() => Class, (cls) => cls.subjects, { eager: true })
  class: Class;

  @ManyToOne(() => Message, (message) => message.subject, { nullable: true })
  messages?: Message[];

  @OneToMany(() => StudentDossier, (dossier) => dossier.subject)
  studentDossiers: StudentDossier[];

  @OneToMany(() => StudentGrade, (grade) => grade.subject, { nullable: true })
  grades: StudentGrade[];
}
