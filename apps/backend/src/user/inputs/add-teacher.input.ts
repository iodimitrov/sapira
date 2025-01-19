import { Field, InputType, Int } from '@nestjs/graphql';
import { ContractType } from '@sapira/database';

@InputType()
export class AddTeacherInput {
  @Field({ nullable: true })
  education?: string;

  @Field(() => Int, { nullable: true })
  yearsExperience?: number;

  @Field(() => ContractType, { nullable: true })
  contractType?: ContractType;

  @Field()
  teacherToken: string;
}
