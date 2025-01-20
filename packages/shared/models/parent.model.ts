import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Parent as ParentEntity } from '@sapira/database';
import { User } from './user.model';
import { Student } from './student.model';

@ObjectType()
export class Parent implements ParentEntity {
  @Field(() => ID)
  id: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => User)
  user: User;

  @Field(() => [Student])
  students: Student[];
}
