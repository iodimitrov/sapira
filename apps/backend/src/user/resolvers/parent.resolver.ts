import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser, GqlAuthGuard } from '@sapira/nest-common';
import { Parent, User } from '@sapira/shared';
import { ParentPayload } from '../payloads/parent.payload';
import { UpdateParentInput } from '../inputs/update-parent.input';
import { ParentService } from '../services/parent.service';

@Resolver(() => Parent)
export class ParentResolver {
  constructor(private readonly parentService: ParentService) {}

  @Query(() => Parent)
  @UseGuards(GqlAuthGuard)
  getParent(@Args('id') id: string): Promise<Parent> {
    return this.parentService.findOne(id);
  }

  @Query(() => Parent)
  @UseGuards(GqlAuthGuard)
  getParentFromCurrUser(@CurrentUser() currUser: User): Promise<Parent> {
    return this.parentService.findOneByUser(currUser);
  }

  @Query(() => [Parent])
  @UseGuards(GqlAuthGuard)
  getAllParents(@CurrentUser() currUser: User): Promise<Parent[]> {
    return this.parentService.findAll(currUser);
  }

  @Mutation(() => ParentPayload)
  @UseGuards(GqlAuthGuard)
  updateParent(
    @Args('input') input: UpdateParentInput,
  ): Promise<ParentPayload> {
    return this.parentService.update(input);
  }
}
