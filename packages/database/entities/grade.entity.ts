import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Column,
  Entity,
} from 'typeorm';
import { Student } from './student.entity';
import { Subject } from './subject.entity';
import { User } from './user.entity';

export enum GradeType {
  YEAR = 'year',
  TURM_1 = 'turm_1',
  TURM_2 = 'turm_2',
  ONGOING = 'ongoing',
}

export enum GradeWord {
  BAD,
  AVERAGE,
  GOOD,
  VERY_GOOD,
  EXCELLENT,
}

@Entity()
export class StudentGrade {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('text')
  message: string;

  @Column({
    type: 'enum',
    enum: GradeType,
    default: GradeType.ONGOING,
  })
  type: GradeType;

  @Column('int')
  grade: number;

  @Column({
    type: 'enum',
    enum: GradeWord,
    default: GradeWord.EXCELLENT,
  })
  gradeWithWords: GradeWord;

  @ManyToOne(() => User, (user) => user.studentGrades, { eager: true })
  fromUser: User;

  @ManyToOne(() => Student, (student) => student.grades, { eager: true })
  student: Student;

  @ManyToOne(() => Subject, (subject) => subject.grades, { eager: true })
  subject: Subject;
}
