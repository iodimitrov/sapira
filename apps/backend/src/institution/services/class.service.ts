import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import {
  Class as ClassEntity,
  UserRole,
  User as UserEntity,
  TokenStatus,
} from '@sapira/database';
import { ClassPayload } from '../payloads/class.payload';
import { UserService } from '../../user/services/user.service';
import { StudentService } from '../../user/services/student.service';
import { TeacherService } from '../../user/services/teacher.service';
import { AddClassInput } from '../inputs/add-class.input';
import { UpdateClassInput } from '../inputs/update-class.input';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(ClassEntity)
    private readonly classRepository: Repository<ClassEntity>,

    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => StudentService))
    private readonly studentService: StudentService,
    @Inject(forwardRef(() => TeacherService))
    private readonly teacherService: TeacherService,
  ) {}

  async add(input: AddClassInput, currUser: UserEntity): Promise<ClassPayload> {
    const newClass = new ClassEntity();
    Object.assign(newClass, input);

    newClass.token = this.generateClassToken(newClass);
    newClass.tokenStatus = TokenStatus.ACTIVE;
    newClass.institution = (
      await this.userService.findOne(currUser.id)
    ).institution;

    if (input.teacherId) {
      newClass.teacher = await this.teacherService.findOne(input.teacherId);
    }
    try {
      return new ClassPayload((await this.classRepository.save(newClass)).id);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('[Add-Class] This Class already exists');
      }
      throw new InternalServerErrorException(error);
    }
  }

  async update(input: UpdateClassInput): Promise<ClassPayload> {
    const { id, ...data } = input;
    const { teacherId, ...info } = data;

    try {
      if (teacherId) {
        await this.classRepository.update(id, {
          ...info,
          teacher: await this.teacherService.findOne(teacherId),
        });
      } else {
        await this.classRepository.update(id, {
          ...info,
          teacher: null,
        });
      }
      return new ClassPayload(input.id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOneByToken(token: string): Promise<ClassEntity> {
    const cls = await this.classRepository.findOne({
      where: {
        token: token,
      },
    });

    if (!cls) {
      throw new NotFoundException(token);
    }

    return cls;
  }

  async findAll(currUser: UserEntity): Promise<ClassEntity[]> {
    const user = await this.userService.findOne(currUser.id);

    if (user.role === UserRole.STUDENT) {
      const cls = (await this.studentService.findOneByUserId(user.id)).class;

      if (!cls) {
        throw new NotFoundException('Class not found');
      }

      return await this.classRepository.find({
        join: {
          alias: 'subject',
          leftJoinAndSelect: {
            subjects: 'subject.subjects',
          },
        },
        where: { id: cls.id },
      });
    } else if (user.role === UserRole.TEACHER) {
      const teacher = await this.teacherService.findOneByUserId(user.id);
      const allClasses = await this.classRepository.find({
        join: {
          alias: 'subject',
          leftJoinAndSelect: {
            subjects: 'subject.subjects',
          },
        },
        where: {
          institution: user.institution,
        },
      });

      if (!teacher) {
        throw new NotFoundException('Teacher not found');
      }

      const tchSubjIds = teacher.subjects?.map((sbj) => sbj.id) || [];
      const teacherClasses = allClasses
        .filter((cls) =>
          cls.subjects.some((subject) => tchSubjIds.includes(subject.id)),
        )
        .map((cls) => ({
          ...cls,
          subjects: cls.subjects.filter((subject) =>
            tchSubjIds.includes(subject.id),
          ),
        }));

      return [
        ...new Set([
          ...allClasses.filter((cls) => cls?.teacher?.id === teacher.id),
          ...teacherClasses,
        ]),
      ];
    } else if (user.role === UserRole.ADMIN) {
      return this.classRepository.find({
        where: { institution: user.institution },
      });
    }

    return [];
  }

  async findAllByIds(ids: string[]): Promise<ClassEntity[]> {
    return this.classRepository.find({
      where: { id: In(ids) },
    });
  }

  async findOne(id: string): Promise<ClassEntity> {
    const cls = await this.classRepository.findOne({
      where: { id: id },
    });

    if (!cls) {
      throw new NotFoundException(id);
    }

    return cls;
  }

  async remove(id: string): Promise<ClassPayload> {
    await this.classRepository.delete(id);
    return new ClassPayload(id);
  }

  private generateClassToken(cls: ClassEntity): string {
    return (
      cls.number.toString() +
      '-' +
      cls.letter +
      '-' +
      Math.random().toString(36).substr(2, 2)
    );
  }
}
