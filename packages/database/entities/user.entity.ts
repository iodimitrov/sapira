import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  Column,
  Entity,
} from 'typeorm';
import { StudentDossier } from './student-dossier.entity';
import { Institution } from './institution.entity';
import { StudentGrade } from './student-grade.entity';
import { Message } from './message.entity';

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BLOCKED = 'blocked',
  UNVERIFIED = 'unverified',
}

export enum UserRole {
  ADMIN = 'admin',
  PARENT = 'parent',
  STUDENT = 'student',
  TEACHER = 'teacher',
  VIEWER = 'viewer',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('text')
  firstName: string;

  @Column('text')
  middleName: string;

  @Column('text')
  lastName: string;

  @Column({
    type: 'text',
    unique: true,
  })
  email: string;

  @Column('text')
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.VIEWER,
  })
  role: UserRole;

  @Column('text', { nullable: true })
  registerToken?: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.UNVERIFIED,
  })
  status: UserStatus;

  @ManyToOne(() => Institution, (student) => student.users, {
    cascade: true,
    eager: true,
  })
  institution: Institution;

  @OneToMany(() => Message, (message) => message.fromUser, { cascade: true })
  sentMessages: Message[];

  @ManyToMany(() => Message, (message) => message.toUsers, { cascade: true })
  receivedMessages: Message[];

  @OneToMany(() => StudentDossier, (dossier) => dossier.fromUser, {
    nullable: true,
    cascade: true,
  })
  studentDossiers: StudentDossier[];

  @OneToMany(() => StudentGrade, (grade) => grade.fromUser, {
    nullable: true,
    cascade: true,
  })
  studentGrades: StudentGrade[];
}
