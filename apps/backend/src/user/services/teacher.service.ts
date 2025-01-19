import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Teacher as TeacherEntity,
  User as UserEntity,
  Class as ClassEntity,
} from '@sapira/database';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(TeacherEntity)
    private readonly teacherRepository: Repository<TeacherEntity>,
    @InjectRepository(ClassEntity)
    private readonly classRepository: Repository<ClassEntity>,
  ) {}

  add(user: UserEntity): Promise<TeacherEntity> {
    const newTeacher = new TeacherEntity();
    if (user) {
      newTeacher.user = user;
    }

    try {
      return this.teacherRepository.save(newTeacher);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(
          '[Add-Teacher] This teacher already exists',
        );
      }
      throw new InternalServerErrorException(error);
    }
  }

  async assignTeacherToClass(
    teacher: TeacherEntity,
    token: string,
  ): Promise<ClassEntity> {
    const cls = await this.classRepository.findOne({
      where: { token: token },
    });

    if (!cls) {
      throw new ConflictException(
        '[Assign-Teacher-To-Class] This class does not exist',
      );
    }

    cls.teacher = teacher;
    const { id, ...data } = cls;

    await this.classRepository.update(id, data);

    return cls;
  }
}
