import { Field, InputType } from '@nestjs/graphql';
import { UserRole } from '@sapira/database';

@InputType()
export class GenerateUserTokenInput {
  @Field({ nullable: true })
  classId?: string;

  @Field(() => UserRole, { nullable: true })
  role?: UserRole;
}
