import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MessagePayload {
  constructor(private readonly id: string) {
    this.messageId = id;
  }

  @Field()
  messageId: string;
}
