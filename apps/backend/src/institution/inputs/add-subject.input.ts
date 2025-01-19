import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class AddSubjectInput {
  @Field(() => Int)
  startYear: number;

  @Field(() => Int)
  endYear: number;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => [String], { nullable: true })
  teachersIds?: string[];

  @Field({ nullable: true })
  classId?: string;
}
