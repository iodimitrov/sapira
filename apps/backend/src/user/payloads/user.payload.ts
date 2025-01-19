import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserPayload {
  constructor(private readonly id: string) {
    this.userId = id;
  }

  @Field()
  userId: string;
}
