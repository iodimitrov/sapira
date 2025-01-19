import { Field, InputType } from '@nestjs/graphql';
import { EducationStage, InstitutionType } from '@sapira/database';
import { IsEmail } from 'class-validator';

@InputType()
export class UpdateInstitutionInput {
  @Field()
  id: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  @IsEmail()
  email?: string;

  @Field(() => InstitutionType, { nullable: true })
  type?: InstitutionType;

  @Field(() => EducationStage, { nullable: true })
  educationalStage?: EducationStage;

  @Field({ nullable: true })
  alias?: string;
}
