import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class AddClassInput {
  @Field(() => Int)
  startYear: number;

  @Field(() => Int)
  endYear: number;

  @Field(() => Int)
  totalStudentCount: number;

  @Field(() => Int)
  number: number;

  @Field()
  letter: string;

  @Field({ nullable: true })
  teacherId: string;
}
