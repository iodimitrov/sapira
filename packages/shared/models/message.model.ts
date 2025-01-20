import { Field, ID, registerEnumType } from '@nestjs/graphql';
import {
  AssignmentType,
  Message as MessageEntity,
  MessageStatus,
  MessageType,
} from '@sapira/database';
import { User } from './user.model';
import { Subject } from './subject.model';
import { File } from './file.model';
import { Class } from './class.model';

registerEnumType(AssignmentType, {
  name: 'AssignmentType',
});

registerEnumType(MessageType, {
  name: 'MessageType',
});

registerEnumType(MessageStatus, {
  name: 'MessageStatus',
});

export class Message implements MessageEntity {
  @Field(() => ID)
  id: string;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => User)
  fromUser: User;

  @Field(() => [User])
  toUsers?: User[] | null;

  @Field(() => [Class])
  toClasses?: Class[] | null;

  @Field(() => AssignmentType, { nullable: true })
  assignmentType?: AssignmentType | null;

  @Field(() => String, { nullable: true })
  data?: string | null;

  @Field(() => [File], { nullable: true })
  files?: File[] | null;

  @Field(() => MessageType)
  messageType: MessageType;

  @Field(() => MessageStatus)
  status: MessageStatus;

  @Field(() => Subject, { nullable: true })
  subject?: Subject | null;

  @Field(() => Date, { nullable: true })
  assignmentDueDate?: Date | null;
}
