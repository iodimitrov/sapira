import { Field, InputType } from '@nestjs/graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload-minimal';

@InputType()
export class UpdateStudentInput {
  @Field()
  id: string;

  @Field({ nullable: true })
  startDate?: Date;

  @Field({ nullable: true })
  classId?: string;

  @Field({ nullable: true })
  prevEducation?: string;

  @Field({ nullable: true })
  recordMessage?: string;

  @Field(() => [GraphQLUpload], { nullable: true })
  files?: Promise<FileUpload>[];
}
