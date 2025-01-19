import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AddParentInput {
  @Field()
  parentToken: string;
}
