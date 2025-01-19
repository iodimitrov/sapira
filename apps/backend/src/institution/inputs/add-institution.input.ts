import { Field, InputType } from '@nestjs/graphql';
import { EducationStage, InstitutionType } from '@sapira/database';

@InputType()
export class AddInstitutionInput {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field(() => InstitutionType)
  type: InstitutionType;

  @Field(() => EducationStage)
  educationalStage: EducationStage;

  @Field()
  alias: string;
}
