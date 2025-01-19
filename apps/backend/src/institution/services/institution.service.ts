import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Institution as InstitutionEntity,
  User as UserEntity,
} from '@sapira/database';
import { InstitutionPayload } from '../payloads/institution.payload';
import { AddInstitutionInput } from '../inputs/add-institution.input';
import { UpdateInstitutionInput } from '../inputs/update-institution.input';
import { UserService } from '../../user/services/user.service';

@Injectable()
export class InstitutionService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,

    @InjectRepository(InstitutionEntity)
    private readonly institutionRepository: Repository<InstitutionEntity>,
  ) {}

  async add(input: AddInstitutionInput): Promise<InstitutionPayload> {
    const institution = new InstitutionEntity();

    Object.assign(institution, input);

    try {
      return new InstitutionPayload(
        (await this.institutionRepository.save(institution)).id,
      );
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(
          '[Add-Institution] This institution already exists',
        );
      }
      throw new InternalServerErrorException(error);
    }
  }

  async update(input: UpdateInstitutionInput): Promise<InstitutionPayload> {
    const { id, ...data } = input;

    if (
      await this.institutionRepository.findOne({
        where: { id },
      })
    ) {
      this.institutionRepository.update(id, data);
      return new InstitutionPayload(id);
    } else {
      throw new NotFoundException(
        '[Update-Institution] Institution Not Found.',
      );
    }
  }

  findAll(): Promise<InstitutionEntity[]> {
    return this.institutionRepository.find();
  }

  async findOne(user: UserEntity): Promise<InstitutionEntity> {
    const institution = (await this.userService.findOne(user.id)).institution;

    if (!institution) {
      throw new NotFoundException();
    }

    return institution;
  }

  async findOneByAlias(alias: string): Promise<InstitutionEntity> {
    const institution = await this.institutionRepository.findOne({
      where: { alias: alias },
    });

    if (!institution) {
      throw new NotFoundException(alias);
    }
    return institution;
  }

  async remove(currUser: UserEntity): Promise<InstitutionPayload> {
    const instId = (await this.userService.findOne(currUser.id)).institution.id;

    await this.institutionRepository.delete(instId);

    return new InstitutionPayload(instId);
  }
}
