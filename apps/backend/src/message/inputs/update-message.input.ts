import { Field, InputType } from '@nestjs/graphql';
import { MessageStatus } from '@sapira/database';
import { GraphQLUpload, FileUpload } from 'graphql-upload-minimal';

@InputType()
export class UpdateMessageInput {
  @Field()
  id: string;

  @Field({ nullable: true })
  data?: string;

  @Field(() => MessageStatus)
  status: MessageStatus;

  @Field(() => [GraphQLUpload], { nullable: true })
  files?: Promise<FileUpload>[];

  @Field({ nullable: true })
  assignmentDueDate?: Date;
}
