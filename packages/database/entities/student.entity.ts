import {
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
  OneToMany,
  OneToOne,
  Column,
  Entity,
} from 'typeorm';
import { StudentDossier } from './student-dossier.entity';
import { StudentGrade } from './student-grade.entity';
import { Parent } from './parent.entity';
import { Class } from './class.entity';
import { User } from './user.entity';
import { File } from './file.entity';

@Entity()
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, { eager: true, cascade: true })
  @JoinColumn()
  user: User;

  @Column('timestamp', { nullable: true })
  startDate?: Date | null;

  @ManyToOne(() => Class, { eager: true })
  class: Class;

  @Column('text', { default: 'none' })
  prevEducation: string;

  @Column('text', { default: '' })
  token: string;

  @ManyToMany(() => Parent, (parent) => parent.students, { nullable: true })
  parents?: Parent[] | null;

  @Column('text', { nullable: true })
  recordMessage?: string | null;

  @ManyToMany(() => File, (fil) => fil.studentRecords, {
    eager: true,
    nullable: true,
    cascade: true,
  })
  @JoinTable({
    name: 'student_record_files',
    joinColumn: {
      name: 'student',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'file',
      referencedColumnName: 'id',
    },
  })
  recordFiles?: File[] | null;

  @OneToMany(() => StudentDossier, (dossier) => dossier.student, {
    eager: true,
    nullable: true,
    cascade: true,
  })
  dossier?: StudentDossier[] | null;

  @OneToMany(() => StudentGrade, (grade) => grade.student, { nullable: true })
  grades?: StudentGrade[] | null;
}
