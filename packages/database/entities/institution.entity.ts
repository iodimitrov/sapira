import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Schedule } from './schedule.entity';
import { Subject } from './subject.entity';
import { User } from './user.entity';

export enum InstitutionType {
  NATURAL_MATHEMATICAL = 'natural_mathematical',
  TECHNOLOGICAL = 'technological',
  LINGUISTICAL = 'linguistical',
  MATHEMATICAL = 'mathematical',
  HUMANITARIAN = 'humanitarian',
  ART = 'art',
  SU = 'su',
  OU = 'ou',
}

export enum EducationStage {
  ELEMENTARY = 'elementary',
  PRIMARY = 'primary',
  UNITED = 'united',
  HIGH = 'high',
}

@Entity()
export class Institution {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('text', { unique: true })
  name: string;

  @Column('text', { unique: true })
  email: string;

  @Column({
    type: 'enum',
    enum: InstitutionType,
  })
  type: InstitutionType;

  @Column({
    type: 'enum',
    enum: EducationStage,
  })
  educationalStage: EducationStage;

  @Column('text', { unique: true })
  alias: string;

  @OneToMany(() => User, (user) => user.institution, { nullable: true })
  users?: User[];

  @OneToMany(() => Subject, (subject) => subject.institution, {
    nullable: true,
  })
  subjects: Subject[];

  @OneToMany(() => Schedule, (schedule) => schedule.institution, {
    nullable: true,
  })
  schedules: Schedule[];
}
