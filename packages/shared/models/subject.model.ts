import { Field, ID, Int } from '@nestjs/graphql';
import { Subject as SubjectEntity } from '@sapira/database';
import { Institution } from './institution.model';
import { Teacher } from './teacher.model';
import { Schedule } from './schedule.model';
import { Class } from './class.model';
import { Message } from './message.model';
import { StudentDossier } from './student-dossier.model';
import { StudentGrade } from './student-grade.model';

export class Subject implements SubjectEntity {
  @Field(() => ID)
  id: string;

  @Field(() => Int)
  startYear: number;

  @Field(() => Int)
  endYear: number;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => Institution)
  institution: Institution;

  @Field(() => [Teacher], { nullable: true })
  teachers?: Teacher[];

  @Field(() => [Schedule])
  schedules: Schedule[];

  @Field(() => Class)
  class: Class;

  @Field(() => Message, { nullable: true })
  messages?: Message[];

  @Field(() => [StudentDossier])
  studentDossiers: StudentDossier[];

  @Field(() => [StudentGrade])
  grades: StudentGrade[];
}
