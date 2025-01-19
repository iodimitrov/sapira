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
  Teacher as TeacherEntity,
  User as UserEntity,
  Class as ClassEntity,
} from '@sapira/database';
import { TeacherPayload } from '../payloads/teacher.payload';
import { UpdateTeacherInput } from '../inputs/update-teacher.input';
import { UserService } from './user.service';
import { ClassService } from '../../institution/class.service';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(TeacherEntity)
    private readonly teacherRepository: Repository<TeacherEntity>,
    @InjectRepository(ClassEntity)
    private readonly classRepository: Repository<ClassEntity>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => ClassService))
    private readonly classService: ClassService,
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

  async update(input: UpdateTeacherInput): Promise<TeacherPayload> {
    const { id, ...data } = input;

    try {
      await this.teacherRepository.update(id, data);
      return new TeacherPayload(id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(currUser: UserEntity): Promise<TeacherEntity[]> {
    const usersIds = (await this.userService.findAll(currUser)).map(
      (user: UserEntity) => user.id,
    );
    const teachers = await this.teacherRepository.find();

    return teachers.filter((teacher) => usersIds.includes(teacher.user.id));
  }

  async findAvailableClassTeachers(
    currUser: UserEntity,
    id?: string,
  ): Promise<TeacherEntity[]> {
    const classTeachersIds = (await this.classService.findAll(currUser))
      .filter((currClass) => currClass.teacher)
      .map((currClass) => currClass.teacher.id);
    const includedClass = id ? await this.classService.findOne(id) : null;
    const usersIds = (await this.userService.findAll(currUser)).map(
      (user: UserEntity) => user.id,
    );
    const teachers = await this.teacherRepository.find();

    return teachers.filter(
      (teacher) =>
        usersIds.includes(teacher.user.id) &&
        (!classTeachersIds.includes(teacher.id) ||
          includedClass?.teacher?.id === teacher.id),
    );
  }

  async findOne(id: string): Promise<TeacherEntity> {
    const teacher = await this.teacherRepository.findOne({
      where: { id },
    });

    if (!teacher) {
      throw new NotFoundException(id);
    }
    return teacher;
  }

  async findOneByUserId(id: string): Promise<TeacherEntity> {
    const teachers = await this.teacherRepository.find({
      join: {
        alias: 'subject',
        leftJoinAndSelect: {
          subjects: 'subject.subjects',
        },
      },
    });
    const teacher = teachers.find((teacher) => teacher.user.id === id);

    if (!teacher) {
      throw new NotFoundException(id);
    }

    return teacher;
  }

  async remove(id: string): Promise<TeacherPayload> {
    await this.teacherRepository.delete(id);
    return new TeacherPayload(id);
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
