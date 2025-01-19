import { IsEmail, MaxLength, MinLength } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { UploadScalar } from '@sapira/nest-common';

@InputType()
export class AddUserInput {
  @Field()
  @MaxLength(50)
  firstName: string;

  @Field()
  @MaxLength(50)
  middleName: string;

  @Field()
  @MaxLength(50)
  lastName: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @MinLength(7)
  password: string;

  @Field({ nullable: true })
  registerToken?: string;

  @Field({ nullable: true })
  photo?: UploadScalar;
}
