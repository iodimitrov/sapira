import { Field, ID, ObjectType } from '@nestjs/graphql';
import { File as FileEntity } from '@sapira/database';
import { Message } from './message.model';
import { Student } from './student.model';
import { StudentDossier } from './student-dossier.model';

@ObjectType()
export class File implements FileEntity {
  @Field(() => ID)
  id: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => String)
  key: string;

  @Field(() => String, { nullable: true })
  publicUrl?: string | null;

  @Field(() => Message)
  message?: Message | null;

  @Field(() => [Student])
  studentRecords?: Student[] | null;

  @Field(() => [StudentDossier])
  studentDossiers?: StudentDossier[] | null;
}
