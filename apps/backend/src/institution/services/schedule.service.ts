import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  Schedule as ScheduleEntity,
  User as UserEntity,
} from '@sapira/database';
import { Repository } from 'typeorm';
import { UserService } from '../../user/services/user.service';
import { TeacherService } from '../../user/services/teacher.service';
import { ClassService } from './class.service';
import { SubjectService } from './subject.service';
import { AddScheduleInput } from '../inputs/add-schedule.input';
import { SchedulePayload } from '../payloads/schedule.payload';

@Injectable()
export class ScheduleService {
  constructor(
    private readonly subjectService: SubjectService,
    private readonly classService: ClassService,
    private readonly teacherService: TeacherService,
    private readonly userService: UserService,

    @InjectRepository(ScheduleEntity)
    private readonly scheduleRepository: Repository<ScheduleEntity>,
  ) {}

  async add(
    input: AddScheduleInput,
    currUser: UserEntity,
  ): Promise<SchedulePayload> {
    const newSchedule = new ScheduleEntity();
    const { subjectId, classId, ...data } = input;

    newSchedule.institution = (
      await this.userService.findOne(currUser.id)
    ).institution;

    if (data.teachersIds) {
      const { teachersIds, ...info } = data;

      newSchedule.teachers =
        await this.teacherService.findAllByIds(teachersIds);
      Object.assign(newSchedule, info);
    } else {
      Object.assign(newSchedule, data);
    }

    newSchedule.subject = await this.subjectService.findOne(subjectId);
    newSchedule.class = await this.classService.findOne(classId);

    try {
      return new SchedulePayload(
        (await this.scheduleRepository.save(newSchedule)).id,
      );
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(
          '[Add-Schedule] This Schedule already exists',
        );
      }
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string): Promise<ScheduleEntity> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id },
    });

    if (!schedule) {
      throw new NotFoundException(id);
    }

    return schedule;
  }

  async findAll(currUser: UserEntity): Promise<ScheduleEntity[]> {
    const institution = (await this.userService.findOne(currUser.id))
      .institution;

    return this.scheduleRepository.find({
      where: { institution: institution },
    });
  }

  async findAllByTeacher(
    teacherId: string,
    currUser: UserEntity,
  ): Promise<ScheduleEntity[]> {
    const institution = (await this.userService.findOne(currUser.id))
      .institution;
    const schedules = await this.scheduleRepository.find({
      where: { institution: institution },
    });

    return schedules.filter((schedule) =>
      schedule.teachers?.map((teacher) => teacher.user.id).includes(teacherId),
    );
  }

  async findAllByClass(
    classId: string,
    currUser: UserEntity,
  ): Promise<ScheduleEntity[]> {
    const institution = (await this.userService.findOne(currUser.id))
      .institution;
    const schedules = await this.scheduleRepository.find({
      where: { institution: institution },
    });

    return schedules.filter((schedule) => schedule.class.id === classId);
  }

  async findAllByCriteria(
    currUser: UserEntity,
    classId?: string,
    teacherId?: string,
  ): Promise<ScheduleEntity[]> {
    const institution = (await this.userService.findOne(currUser.id))
      .institution;
    const schedules = await this.scheduleRepository.find({
      where: { institution: institution },
    });

    if (classId) {
      return schedules.filter((schedule) => schedule.class.id === classId);
    } else {
      return schedules.filter((schedule) =>
        schedule.teachers
          ?.map((teacher) => teacher.user.id)
          .includes(teacherId!),
      );
    }
  }

  async remove(id: string): Promise<SchedulePayload> {
    await this.scheduleRepository.delete(id);
    return new SchedulePayload(id);
  }

  async removeAllByClass(classId: string): Promise<SchedulePayload> {
    const scheduleClass = await this.classService.findOne(classId);

    await this.scheduleRepository.delete({ class: scheduleClass });
    return new SchedulePayload(classId);
  }
}
