import { Field, InputType } from '@nestjs/graphql';
import { UploadScalar } from '@sapira/nest-common';

@InputType()
export class UpdateStudentRecordInput {
  @Field()
  id: string;

  @Field({ nullable: true })
  recordMessage?: string;

  @Field(() => [UploadScalar], { nullable: true })
  files?: UploadScalar[];
}
