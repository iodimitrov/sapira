import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AddStudentInput {
  @Field({ nullable: true })
  prevEducation?: string;

  @Field()
  studentToken: string;
}
