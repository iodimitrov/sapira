import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser, GqlAuthGuard } from '@sapira/nest-common';
import { Institution, User } from '@sapira/shared';
import { InstitutionService } from '../services/institution.service';
import { UpdateInstitutionInput } from '../inputs/update-institution.input';
import { InstitutionPayload } from '../payloads/institution.payload';
import { AddInstitutionInput } from '../inputs/add-institution.input';

@Resolver(() => Institution)
export class InstitutionResolver {
  constructor(private readonly institutionService: InstitutionService) {}

  @Query(() => Institution)
  @UseGuards(GqlAuthGuard)
  getInstitution(@CurrentUser() currUser: User): Promise<Institution> {
    return this.institutionService.findOne(currUser);
  }

  @Mutation(() => InstitutionPayload)
  addInstitution(
    @Args('input') input: AddInstitutionInput,
  ): Promise<InstitutionPayload> {
    return this.institutionService.add(input);
  }

  @Mutation(() => InstitutionPayload)
  @UseGuards(GqlAuthGuard)
  updateInstitution(
    @Args('input') input: UpdateInstitutionInput,
  ): Promise<InstitutionPayload> {
    return this.institutionService.update(input);
  }

  @Mutation(() => InstitutionPayload)
  @UseGuards(GqlAuthGuard)
  removeInstitution(
    @CurrentUser() currUser: User,
  ): Promise<InstitutionPayload> {
    return this.institutionService.remove(currUser);
  }
}
