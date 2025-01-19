import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Parent as ParentEntity, User as UserEntity } from '@sapira/database';
import { Repository } from 'typeorm';
import { StudentService } from './student.service';
import { UpdateParentInput } from '../inputs/update-parent.input';
import { ParentPayload } from '../payloads/parent.payload';
import { UserService } from './user.service';

@Injectable()
export class ParentService {
  constructor(
    private readonly studentService: StudentService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,

    @InjectRepository(ParentEntity)
    private readonly parentRepository: Repository<ParentEntity>,
  ) {}

  async add(user: UserEntity, childrenIds: string[]): Promise<ParentEntity> {
    const newParent = new ParentEntity();

    newParent.user = user;

    newParent.students = await this.studentService.findAllByIds(childrenIds);

    try {
      return this.parentRepository.save(newParent);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('[Add-Parent] This parent already exists');
      }
      throw new InternalServerErrorException(error);
    }
  }

  async update(input: UpdateParentInput): Promise<ParentPayload> {
    const { id, ...data } = input;

    try {
      await this.parentRepository.update(id, data);
      return new ParentPayload(id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(currUser: UserEntity): Promise<ParentEntity[]> {
    const usersIds = (await this.userService.findAll(currUser)).map(
      (user: UserEntity) => user.id,
    );
    const parents = await this.parentRepository.find();

    return parents.filter((parent) => usersIds.includes(parent.user.id));
  }

  async findOne(id: string): Promise<ParentEntity> {
    const parent = await this.parentRepository.findOne({
      where: { id: id },
    });

    if (!parent) {
      throw new NotFoundException(id);
    }

    return parent;
  }

  async findOneByUser(currUser: UserEntity): Promise<ParentEntity> {
    const parent = await this.parentRepository.findOne({
      where: {
        user: {
          id: currUser.id,
        },
      },
    });

    if (!parent) {
      throw new NotFoundException(currUser.id);
    }

    return parent;
  }
}
