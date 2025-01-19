import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GenerateUserTokenPayload {
  constructor(private readonly userToken: string) {
    this.token = userToken;
  }

  @Field()
  token: string;
}
