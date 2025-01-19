import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToMany,
  JoinTable,
  OneToOne,
  Entity,
} from 'typeorm';
import { Student } from './student.entity';
import { User } from './user.entity';

@Entity()
export class Parent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => User, { cascade: true, eager: true })
  @JoinColumn()
  user: User;

  @ManyToMany(() => Student, (student) => student.parents, {
    cascade: true,
    eager: true,
  })
  @JoinTable({
    name: 'parent_student',
    joinColumn: {
      name: 'parent',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'student',
      referencedColumnName: 'id',
    },
  })
  students: Student[];
}
