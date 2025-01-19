import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Parent as ParentEntity, User as UserEntity } from '@sapira/database';
import { Repository } from 'typeorm';
import { StudentService } from './student.service';

@Injectable()
export class ParentService {
  constructor(
    private readonly studentService: StudentService,

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
}
