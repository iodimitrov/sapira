import { Field, InputType } from '@nestjs/graphql';
import { UploadScalar } from '@sapira/nest-common';
import { IsEmail, MaxLength } from 'class-validator';

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  @MaxLength(50)
  firstName?: string;

  @Field({ nullable: true })
  @MaxLength(50)
  middleName?: string;

  @Field({ nullable: true })
  @MaxLength(50)
  lastName?: string;

  @Field({ nullable: true })
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  photo?: UploadScalar;
}
