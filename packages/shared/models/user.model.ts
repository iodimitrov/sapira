import { User as UserEntity, UserRole, UserStatus } from '@sapira/database';
import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Institution } from './institution.model';
import { Message } from './message.model';
import { StudentDossier } from './student-dossier.model';
import { StudentGrade } from './student-grade.model';

registerEnumType(UserStatus, {
  name: 'UserStatus',
});

registerEnumType(UserRole, {
  name: 'UserRole',
});

@ObjectType()
export class User implements UserEntity {
  @Field(() => ID)
  id: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => String)
  firstName: string;

  @Field(() => String)
  middleName: string;

  @Field(() => String)
  lastName: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;

  @Field(() => UserRole)
  role: UserRole;

  @Field(() => String, { nullable: true })
  registerToken?: string | null;

  @Field(() => UserStatus)
  status: UserStatus;

  @Field(() => Institution)
  institution: Institution;

  @Field(() => [Message])
  sentMessages: Message[];

  @Field(() => [Message])
  receivedMessages: Message[];

  @Field(() => [StudentDossier], { nullable: true })
  studentDossiers?: StudentDossier[] | null;

  @Field(() => [StudentGrade], { nullable: true })
  studentGrades?: StudentGrade[] | null;
}
