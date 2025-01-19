import {
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToMany,
  OneToMany,
  ManyToOne,
  JoinTable,
  Column,
  Entity,
} from 'typeorm';
import { Subject } from './subject.entity';
import { Class } from './class.entity';
import { User } from './user.entity';
import { File } from './file.entity';

export enum MessageType {
  ASSIGNMENT = 'assignment',
  MESSAGE = 'message',
}

export enum MessageStatus {
  CREATED = 'created',
  PUBLISHED = 'published',
}

export enum AssignmentType {
  HOMEWORK = 'homework',
  CLASSWORK = 'classwork',
  EXAM = 'exam',
}

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.sentMessages, { eager: true })
  fromUser: User;

  @ManyToMany(() => User, (user) => user.receivedMessages, {
    eager: true,
    nullable: true,
  })
  @JoinTable({
    name: 'message_toUsers',
    joinColumn: {
      name: 'message',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user',
      referencedColumnName: 'id',
    },
  })
  toUsers: User[] | null;

  @ManyToMany(() => Class, (cls) => cls.messages, {
    eager: true,
    nullable: true,
  })
  @JoinTable({
    name: 'message_toClass',
    joinColumn: {
      name: 'message',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'class',
      referencedColumnName: 'id',
    },
  })
  toClasses: Class[] | null;

  @Column({
    nullable: true,
    type: 'enum',
    enum: AssignmentType,
  })
  assignmentType: AssignmentType | null;

  @Column('text', { nullable: true })
  data: string | null;

  @OneToMany(() => File, (file) => file.message, {
    nullable: true,
    eager: true,
    cascade: true,
  })
  files: File[] | null;

  @Column({
    type: 'enum',
    enum: MessageType,
  })
  messageType: MessageType;

  @Column({
    type: 'enum',
    enum: MessageStatus,
    default: MessageStatus.CREATED,
  })
  status: MessageStatus;

  @ManyToOne(() => Subject, (subject) => subject.messages, {
    eager: true,
    nullable: true,
  })
  subject: Subject | null;

  @Column('timestamp', { nullable: true })
  assignmentDueDate: Date | null;
}
