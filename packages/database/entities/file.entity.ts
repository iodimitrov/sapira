import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StudentDossier } from './student-dossier.entity';
import { Student } from './student.entity';
import { Message } from './message.entity';

@Entity()
export class File {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('text')
  key: string;

  publicUrl?: string | null;

  @ManyToOne(() => Message, (message) => message.files, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  message?: Message | null;

  @ManyToMany(() => Student, (student) => student.recordFiles, {
    nullable: true,
  })
  studentRecords?: Student[] | null;

  @ManyToMany(() => StudentDossier, (studentDossier) => studentDossier.files, {
    nullable: true,
  })
  studentDossiers?: StudentDossier[] | null;
}
