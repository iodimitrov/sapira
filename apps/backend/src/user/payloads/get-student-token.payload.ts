import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GetStudentTokenPayload {
  constructor(private readonly stToken: string) {
    this.token = stToken;
  }

  @Field()
  token: string;
}
