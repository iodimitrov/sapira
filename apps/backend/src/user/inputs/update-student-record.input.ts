import { Field, InputType } from '@nestjs/graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload-minimal';

@InputType()
export class UpdateStudentRecordInput {
  @Field()
  id: string;

  @Field({ nullable: true })
  recordMessage?: string;

  @Field(() => [GraphQLUpload], { nullable: true })
  files?: Promise<FileUpload>[];
}
