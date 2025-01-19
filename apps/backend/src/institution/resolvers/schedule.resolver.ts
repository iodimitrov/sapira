import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Schedule, User } from '@sapira/shared';
import { ScheduleService } from '../services/schedule.service';
import { UseGuards } from '@nestjs/common';
import { CurrentUser, GqlAuthGuard } from '@sapira/nest-common';
import { SchedulePayload } from '../payloads/schedule.payload';
import { AddScheduleInput } from '../inputs/add-schedule.input';

@Resolver(() => Schedule)
export class ScheduleResolver {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Query(() => Schedule)
  @UseGuards(GqlAuthGuard)
  getSchedule(@Args('id') id: string): Promise<Schedule> {
    return this.scheduleService.findOne(id);
  }

  @Query(() => [Schedule])
  @UseGuards(GqlAuthGuard)
  getAllSchedules(@CurrentUser() currUser: User): Promise<Schedule[]> {
    return this.scheduleService.findAll(currUser);
  }

  @Query(() => [Schedule])
  @UseGuards(GqlAuthGuard)
  getAllSchedulesByTeacher(
    @Args('teacherId') id: string,
    @CurrentUser() currUser: User,
  ): Promise<Schedule[]> {
    return this.scheduleService.findAllByTeacher(id, currUser);
  }

  @Query(() => [Schedule])
  @UseGuards(GqlAuthGuard)
  getAllSchedulesByClass(
    @Args('classId') id: string,
    @CurrentUser() currUser: User,
  ): Promise<Schedule[]> {
    return this.scheduleService.findAllByClass(id, currUser);
  }

  @Query(() => [Schedule])
  @UseGuards(GqlAuthGuard)
  getAllSchedulesByCriteria(
    @CurrentUser() currUser: User,
    @Args('classId', { nullable: true }) classId?: string,
    @Args('teacherId', { nullable: true }) teacherId?: string,
  ): Promise<Schedule[]> {
    return this.scheduleService.findAllByCriteria(currUser, classId, teacherId);
  }

  @Mutation(() => SchedulePayload)
  @UseGuards(GqlAuthGuard)
  addSchedule(
    @Args('input') input: AddScheduleInput,
    @CurrentUser() currUser: User,
  ): Promise<SchedulePayload> {
    return this.scheduleService.add(input, currUser);
  }

  @Mutation(() => SchedulePayload)
  @UseGuards(GqlAuthGuard)
  removeSchedule(@Args('id') id: string): Promise<SchedulePayload> {
    return this.scheduleService.remove(id);
  }

  @Mutation(() => SchedulePayload)
  @UseGuards(GqlAuthGuard)
  removeSchedulesByClass(
    @Args('classId') id: string,
  ): Promise<SchedulePayload> {
    return this.scheduleService.removeAllByClass(id);
  }
}
