import { Field, ID } from '@nestjs/graphql';
import { StudentDossier as StudentDossierEntity } from '@sapira/database';
import { User } from './user.model';
import { Subject } from './subject.model';
import { Student } from './student.model';
import { File } from './file.model';

export class StudentDossier implements StudentDossierEntity {
  @Field(() => ID)
  id: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field()
  message: string;

  @Field(() => User)
  fromUser: User;

  @Field(() => Student)
  student: Student;

  @Field(() => [File], { nullable: true })
  files?: File[];

  @Field(() => Subject, { nullable: true })
  subject?: Subject;
}
