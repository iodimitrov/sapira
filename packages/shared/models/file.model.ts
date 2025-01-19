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
  filename: string;

  @Field()
  cloudFilename: string;

  @Field({ nullable: true })
  publicUrl?: string;

  @Field(() => Message)
  message?: Message;

  @Field(() => [Student])
  studentRecords?: Student[];

  @Field(() => [StudentDossier])
  studentDossiers?: StudentDossier[];
}
