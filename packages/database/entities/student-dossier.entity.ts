import {
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  Column,
  Entity,
} from 'typeorm';
import { Student } from './student.entity';
import { Subject } from './subject.entity';
import { User } from './user.entity';
import { File } from './file.entity';

@Entity()
export class StudentDossier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('text')
  message: string;

  @ManyToOne(() => User, (user) => user.studentDossiers, { eager: true })
  fromUser: User;

  @ManyToOne(() => Student, (student) => student.dossier)
  student: Student;

  @ManyToMany(() => File, (fil) => fil.studentDossiers, {
    nullable: true,
    cascade: true,
    eager: true,
  })
  @JoinTable({
    name: 'student_dossier_files',
    joinColumn: {
      name: 'dossier',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'file',
      referencedColumnName: 'id',
    },
  })
  files?: File[] | null;

  @ManyToOne(() => Subject, (subject) => subject.studentDossiers, {
    nullable: true,
    eager: true,
  })
  subject?: Subject | null;
}
