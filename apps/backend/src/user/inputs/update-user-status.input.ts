import { Field, InputType } from '@nestjs/graphql';
import { UserStatus } from '@sapira/database';

@InputType()
export class UpdateUserStatusInput {
  @Field()
  id: string;

  @Field(() => UserStatus)
  userStatus: UserStatus;
}
