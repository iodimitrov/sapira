import { Field, ID, registerEnumType } from '@nestjs/graphql';
import {
  GradeType,
  GradeWord,
  StudentGrade as StudentGradeEntity,
} from '@sapira/database';
import { Subject } from './subject.model';
import { Student } from './student.model';
import { User } from './user.model';

registerEnumType(GradeType, {
  name: 'GradeType',
});

registerEnumType(GradeWord, {
  name: 'GradeWord',
});

export class StudentGrade implements StudentGradeEntity {
  @Field(() => ID)
  id: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field()
  message: string;

  @Field(() => GradeType)
  type: GradeType;

  @Field()
  grade: number;

  @Field(() => GradeWord)
  gradeWithWords: GradeWord;

  @Field(() => User)
  fromUser: User;

  @Field(() => Student)
  student: Student;

  @Field(() => Subject)
  subject: Subject;
}
