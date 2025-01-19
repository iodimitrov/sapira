import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Class as ClassEntity,
  UserRole,
  User as UserEntity,
} from '@sapira/database';
import { ClassPayload } from '../payloads/class.payload';
import { UserService } from '../../user/services/user.service';
import { StudentService } from '../../user/services/student.service';
import { TeacherService } from '../../user/services/teacher.service';

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
}
