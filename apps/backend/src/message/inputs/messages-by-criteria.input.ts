import { Field, InputType } from '@nestjs/graphql';
import { AssignmentType, MessageStatus, MessageType } from '@sapira/database';

@InputType()
export class MessagesByCriteriaInput {
  @Field(() => MessageType, { nullable: true })
  messageType?: MessageType;

  @Field(() => MessageStatus, { nullable: true })
  messageStatus?: MessageStatus;

  @Field(() => AssignmentType, { nullable: true })
  assignmentType?: AssignmentType;
}
