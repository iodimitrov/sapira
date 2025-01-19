import { Field, InputType } from '@nestjs/graphql';
import { UploadScalar } from '@sapira/nest-common';

@InputType()
export class UpdateStudentInput {
  @Field()
  id: string;

  @Field({ nullable: true })
  startDate?: Date;

  @Field({ nullable: true })
  classId?: string;

  @Field({ nullable: true })
  prevEducation?: string;

  @Field({ nullable: true })
  recordMessage?: string;

  @Field(() => [UploadScalar], { nullable: true })
  files?: UploadScalar[];
}
