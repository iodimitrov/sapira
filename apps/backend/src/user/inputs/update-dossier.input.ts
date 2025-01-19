import { Field, InputType } from '@nestjs/graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload-minimal';

@InputType()
export class UpdateStudentDossierInput {
  @Field()
  id: string;

  @Field({ nullable: true })
  subjectId?: string;

  @Field({ nullable: true })
  message?: string;

  @Field(() => [GraphQLUpload], { nullable: true })
  files?: Promise<FileUpload[]>;
}
