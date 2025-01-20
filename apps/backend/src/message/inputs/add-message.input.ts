import { Field, InputType } from '@nestjs/graphql';
import { AssignmentType, MessageType } from '@sapira/database';
import { GraphQLUpload, FileUpload } from 'graphql-upload-minimal';

@InputType()
export class AddMessageInput {
  @Field(() => [String], { nullable: true })
  toUserIds?: string[];

  @Field(() => [String], { nullable: true })
  toClassIds?: string[];

  @Field({ nullable: true })
  data?: string;

  @Field(() => [GraphQLUpload], { nullable: true })
  files?: Promise<FileUpload>[];

  @Field(() => AssignmentType, { nullable: true })
  assignmentType?: AssignmentType;

  @Field(() => MessageType)
  messageType: MessageType;

  @Field({ nullable: true })
  subjectId?: string;

  @Field(() => Date, { nullable: true })
  assignmentDueDate?: Date;
}
