import { Field, InputType } from '@nestjs/graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload-minimal';

@InputType()
export class AddUserInput {
  @Field()
  firstName: string;

  @Field()
  middleName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field({ nullable: true })
  registerToken?: string;

  @Field(() => GraphQLUpload, { nullable: true })
  photo?: Promise<FileUpload>;
}
