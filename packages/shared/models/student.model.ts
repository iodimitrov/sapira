import { Student as StudentEntity } from '@sapira/database';
import { User } from './user.model';
import { Field, ID } from '@nestjs/graphql';
import { StudentDossier } from './student-dossier.model';
import { File } from './file.model';
import { StudentGrade } from './student-grade.model';
import { Parent } from './parent.model';
import { Class } from './class.model';

export class Student implements StudentEntity {
  @Field(() => ID)
  id: string;

  @Field(() => User)
  user: User;

  @Field(() => Date, { nullable: true })
  startDate?: Date | null;

  @Field(() => Class)
  class: Class;

  @Field(() => String)
  prevEducation: string;

  @Field(() => String)
  token: string;

  @Field(() => [Parent], { nullable: true })
  parents?: Parent[] | null;

  @Field(() => String, { nullable: true })
  recordMessage?: string | null;

  @Field(() => [File], { nullable: true })
  recordFiles?: File[] | null;

  @Field(() => [StudentDossier], { nullable: true })
  dossier?: StudentDossier[] | null;

  @Field(() => [StudentGrade], { nullable: true })
  grades?: StudentGrade[] | null;
}
