import { Field, ID } from '@nestjs/graphql';
import { Parent as ParentEntity } from '@sapira/database';
import { User } from './user.model';
import { Student } from './student.model';

export class Parent implements ParentEntity {
  @Field(() => ID)
  id: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => User)
  user: User;

  @Field(() => [Student])
  students: Student[];
}
