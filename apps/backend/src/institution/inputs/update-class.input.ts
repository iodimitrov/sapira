import { Field, InputType, Int } from '@nestjs/graphql';
import { TokenStatus } from '@sapira/database';

@InputType()
export class UpdateClassInput {
  @Field()
  id: string;

  @Field(() => Int, { nullable: true })
  totalStudentCount?: number;

  @Field({ nullable: true })
  teacherId?: string;

  @Field({ nullable: true })
  letter?: string;

  @Field(() => Int, { nullable: true })
  number?: number;

  @Field({ nullable: true })
  token?: string;

  @Field(() => TokenStatus, { nullable: true })
  tokenStatus?: TokenStatus;
}
