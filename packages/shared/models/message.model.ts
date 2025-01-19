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

  @Field()
  updatedAt: Date;

  @Field()
  createdAt: Date;

  @Field(() => User)
  fromUser: User;

  @Field(() => [User])
  toUsers: User[];

  @Field(() => [Class])
  toClasses: Class[];

  @Field(() => AssignmentType, { nullable: true })
  assignmentType?: AssignmentType;

  @Field({ nullable: true })
  data?: string;

  @Field(() => [File], { nullable: true })
  files?: File[];

  @Field(() => MessageType)
  messageType: MessageType;

  @Field(() => MessageStatus)
  status: MessageStatus;

  @Field(() => Subject, { nullable: true })
  subject?: Subject;

  @Field({ nullable: true })
  assignmentDueDate?: Date;
}
