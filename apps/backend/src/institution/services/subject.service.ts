import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { TeacherService } from '../../user/services/teacher.service';
import { UserService } from '../../user/services/user.service';
import { ClassService } from './class.service';
import { StudentService } from '../../user/services/student.service';
import { ParentService } from '../../user/services/parent.service';

import {
  Subject as SubjectEntity,
  User as UserEntity,
  Teacher as TeacherEntity,
  Class as ClassEntity,
  UserRole,
} from '@sapira/database';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { AddSubjectInput } from '../inputs/add-subject.input';
import { SubjectPayload } from '../payloads/subject.payload';
import { UpdateSubjectInput } from '../inputs/update-subject.input';

@Injectable()
export class SubjectService {
  constructor(
    private readonly teacherService: TeacherService,
    private readonly userService: UserService,
    private readonly classService: ClassService,
    private readonly studentService: StudentService,
    private readonly parentService: ParentService,

    @InjectRepository(SubjectEntity)
    private readonly subjectRepository: Repository<SubjectEntity>,
  ) {}

  async add(
    input: AddSubjectInput,
    currUser: UserEntity,
  ): Promise<SubjectPayload> {
    const newSubject = new SubjectEntity();

    Object.assign(newSubject, input);
    newSubject.institution = (
      await this.userService.findOne(currUser.id)
    ).institution;

    if (input.classId) {
      newSubject.class = await this.classService.findOne(input.classId);
    }
    if (input.teachersIds) {
      const tchrs: TeacherEntity[] = [];

      for (const id of input.teachersIds) {
        tchrs.push(await this.teacherService.findOne(id));
      }

      newSubject.teachers = tchrs;
    }

    try {
      return new SubjectPayload(
        (await this.subjectRepository.save(newSubject)).id,
      );
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(
          '[Add-Subject] This subject already exists: ' + error,
        );
      }
      throw new InternalServerErrorException(error);
    }
  }

  async update(input: UpdateSubjectInput): Promise<SubjectPayload> {
    const { id, ...data } = input;

    try {
      let subjectClass: ClassEntity;
      const subject = await this.subjectRepository.findOne({
        where: { id },
      });

      if (!subject) {
        throw new NotFoundException(id);
      }

      const { classId, teachersIds, ...info } = data;

      if (classId) {
        subjectClass = await this.classService.findOne(classId);
        subject.class = subjectClass;
      }

      if (teachersIds) {
        subject.teachers = await this.teacherService.findAllByIds(teachersIds);
      }

      Object.assign(subject, info);
      await this.subjectRepository.save(subject);

      return new SubjectPayload(id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(currUser: UserEntity): Promise<SubjectEntity[]> {
    const user = await this.userService.findOne(currUser.id);
    const institution = user.institution;

    if (user.role === UserRole.STUDENT) {
      const student = await this.studentService.findOneByUserId(currUser.id);

      return this.subjectRepository.find({
        where: {
          institution: institution,
          class: student.class,
        },
      });
    } else if (user.role === UserRole.TEACHER) {
      const teacher = await this.teacherService.findOneByUserId(currUser.id);
      let subjects = await this.subjectRepository.find({
        where: {
          institution: teacher.user.institution,
        },
      });

      subjects = subjects.filter(
        (subject) => subject.teachers && subject.teachers.length > 0,
      );

      return subjects.filter((subject) => {
        const teacherIds = subject.teachers?.map((teacher) => teacher.id) || [];
        return teacherIds.includes(teacher.id);
      });
    } else if (user.role === UserRole.PARENT) {
      const parents = await this.parentService.findOneByUser(currUser);
      const classes = parents.students.map((student) => student.class);

      return this.subjectRepository.find({
        where: {
          class: {
            id: In(classes.map((cls) => cls.id)),
          },
        },
      });
    } else {
      return this.subjectRepository.find({
        where: { institution: institution },
      });
    }
  }

  async findOne(id: string): Promise<SubjectEntity> {
    const subject = await this.subjectRepository.findOne({
      where: { id: id },
    });

    if (!subject) {
      throw new NotFoundException(id);
    }

    return subject;
  }

  async remove(id: string): Promise<SubjectPayload> {
    await this.subjectRepository.delete(id);
    return new SubjectPayload(id);
  }
}
