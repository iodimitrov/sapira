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

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

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

  @Field(() => UserRole)
  role: UserRole;

  @Field({ nullable: true })
  registerToken?: string;

  @Field(() => UserStatus)
  status: UserStatus;

  @Field(() => Institution)
  institution: Institution;

  @Field(() => [Message])
  sentMessages: Message[];

  @Field(() => [Message])
  receivedMessages: Message[];

  @Field(() => [StudentDossier], { nullable: true })
  studentDossiers: StudentDossier[];

  @Field(() => [StudentGrade], { nullable: true })
  studentGrades: StudentGrade[];
}
