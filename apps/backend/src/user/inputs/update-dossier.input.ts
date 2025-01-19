import { Field, InputType } from '@nestjs/graphql';
import { UploadScalar } from '@sapira/nest-common';

@InputType()
export class UpdateStudentDossierInput {
  @Field()
  id: string;

  @Field({ nullable: true })
  subjectId?: string;

  @Field({ nullable: true })
  message?: string;

  @Field(() => [UploadScalar], { nullable: true })
  files?: UploadScalar[];
}
