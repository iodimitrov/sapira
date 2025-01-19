import { Field, InputType } from '@nestjs/graphql';
import { GradeType, GradeWord } from '@sapira/database';

@InputType()
export class UpdateGradeInput {
  @Field()
  gradeId: string;

  @Field()
  studentId: string;

  @Field()
  subjectId: string;

  @Field()
  message?: string;

  @Field()
  grade: number;

  @Field(() => GradeWord)
  gradeWithWords: GradeWord;

  @Field(() => GradeType)
  type: GradeType;
}
