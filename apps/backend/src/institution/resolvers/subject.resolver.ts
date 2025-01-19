import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser, GqlAuthGuard } from '@sapira/nest-common';
import { Subject, User } from '@sapira/shared';
import { SubjectPayload } from '../payloads/subject.payload';
import { AddSubjectInput } from '../inputs/add-subject.input';
import { UpdateSubjectInput } from '../inputs/update-subject.input';
import { SubjectService } from '../services/subject.service';

@Resolver(() => Subject)
export class SubjectResolver {
  constructor(private readonly subjectService: SubjectService) {}

  @Query(() => Subject)
  @UseGuards(GqlAuthGuard)
  getSubject(@Args('id') id: string): Promise<Subject> {
    return this.subjectService.findOne(id);
  }

  @Query(() => [Subject])
  @UseGuards(GqlAuthGuard)
  getAllSubjects(@CurrentUser() currUser: User): Promise<Subject[]> {
    return this.subjectService.findAll(currUser);
  }

  @Mutation(() => SubjectPayload)
  @UseGuards(GqlAuthGuard)
  addSubject(
    @Args('input') input: AddSubjectInput,
    @CurrentUser() currUser: User,
  ): Promise<SubjectPayload> {
    return this.subjectService.add(input, currUser);
  }

  @Mutation(() => SubjectPayload)
  @UseGuards(GqlAuthGuard)
  updateSubject(
    @Args('input') input: UpdateSubjectInput,
  ): Promise<SubjectPayload> {
    return this.subjectService.update(input);
  }
}
