import { Field, ID, ObjectType } from '@nestjs/graphql';
import { StudentDossier as StudentDossierEntity } from '@sapira/database';
import { User } from './user.model';
import { Subject } from './subject.model';
import { Student } from './student.model';
import { File } from './file.model';

@ObjectType()
export class StudentDossier implements StudentDossierEntity {
  @Field(() => ID)
  id: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => String)
  message: string;

  @Field(() => User)
  fromUser: User;

  @Field(() => Student)
  student: Student;

  @Field(() => [File], { nullable: true })
  files?: File[] | null;

  @Field(() => Subject, { nullable: true })
  subject?: Subject | null;
}
