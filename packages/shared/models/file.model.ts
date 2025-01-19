import { Field, ID } from '@nestjs/graphql';
import { File as FileEntity } from '@sapira/database';
import { Message } from './message.model';
import { Student } from './student.model';
import { StudentDossier } from './student-dossier.model';

export class File implements FileEntity {
  @Field(() => ID)
  id: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field()
  key: string;

  @Field({ nullable: true })
  publicUrl?: string | null;

  @Field(() => Message)
  message?: Message | null;

  @Field(() => [Student])
  studentRecords?: Student[] | null;

  @Field(() => [StudentDossier])
  studentDossiers?: StudentDossier[] | null;
}
