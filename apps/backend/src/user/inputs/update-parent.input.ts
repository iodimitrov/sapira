import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateParentInput {
  @Field()
  id: string;
}
