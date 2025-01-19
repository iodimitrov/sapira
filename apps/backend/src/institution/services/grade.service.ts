import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  StudentGrade as StudentGradeEntity,
  User as UserEntity,
  UserRole,
} from '@sapira/database';
import { AddGradeInput } from '../inputs/add-grade.input';
import { GradePayload } from '../payloads/grade.payload';
import { Repository } from 'typeorm';
import { UpdateGradeInput } from '../inputs/update-grade.input';
import { SubjectService } from './subject.service';
import { UserService } from '../../user/services/user.service';
import { ClassService } from './class.service';
import { StudentService } from '../../user/services/student.service';
import { TeacherService } from '../../user/services/teacher.service';

@Injectable()
export class GradeService {
  constructor(
    private readonly subjectService: SubjectService,
    private readonly userService: UserService,
    private readonly classService: ClassService,
    private readonly studentService: StudentService,
    private readonly teacherService: TeacherService,

    @InjectRepository(StudentGradeEntity)
    private readonly gradeRepository: Repository<StudentGradeEntity>,
  ) {}

  async add(input: AddGradeInput, currUser: UserEntity): Promise<GradePayload> {
    const newGrade = new StudentGradeEntity();
    const { subjectId, studentId, ...data } = input;
    Object.assign(newGrade, data);

    if (subjectId) {
      newGrade.subject = await this.subjectService.findOne(subjectId);
    }

    newGrade.fromUser = await this.userService.findOne(currUser.id);

    if (studentId) {
      newGrade.student = await this.studentService.findOne(studentId);
      const teacher = await this.teacherService.findOneByUserId(
        newGrade.fromUser.id,
      );

      if (
        !this.studentService.verifyTeacherToStudent(
          newGrade.student,
          teacher,
        ) &&
        newGrade.fromUser.role !== UserRole.ADMIN &&
        newGrade.fromUser.role !== UserRole.TEACHER
      ) {
        throw new UnauthorizedException(
          '[Add-Grade] Teacher can not grade this student',
        );
      }
    }

    if (newGrade.fromUser.role !== UserRole.TEACHER) {
      throw new UnauthorizedException('[Add-Grade] Invalid user role');
    }
    try {
      return new GradePayload((await this.gradeRepository.save(newGrade)).id);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('[Add-Grade] This grade already exists');
      }
      throw new InternalServerErrorException(error);
    }
  }

  async update(
    input: UpdateGradeInput,
    currUser: UserEntity,
  ): Promise<GradePayload> {
    const { gradeId, studentId, subjectId, ...data } = input;
    const grade = await this.gradeRepository.findOne({
      where: { id: gradeId },
    });

    if (grade) {
      Object.assign(grade, data);

      grade.student = await this.studentService.findOne(studentId);
      grade.fromUser = await this.userService.findOne(currUser.id);
      grade.subject = await this.subjectService.findOne(subjectId);

      await this.gradeRepository.save(grade);

      return new GradePayload(gradeId);
    } else {
      throw new NotFoundException('[Update-Grade] Grade Not Found.');
    }
  }

  async findAllByClass(
    classId: string,
    currUser: UserEntity,
  ): Promise<StudentGradeEntity[]> {
    currUser = await this.userService.findOne(currUser.id);
    const cls = await this.classService.findOne(classId);

    if (
      currUser.institution.id === cls.institution.id &&
      (currUser.role === UserRole.ADMIN || currUser.role === UserRole.TEACHER)
    ) {
      const grades = await this.gradeRepository.find({
        relations: ['student'],
      });

      return grades.filter((grade) => grade.student.class.id === cls.id);
    } else {
      throw new UnauthorizedException('[Grades-By-Class] Permission Denied');
    }
  }

  async findAllByInstruction(
    currUser: UserEntity,
  ): Promise<StudentGradeEntity[]> {
    const institution = await (
      await this.userService.findOne(currUser.id)
    ).institution;

    return (await this.gradeRepository.find()).filter(
      (grade) => grade.fromUser.institution.id === institution.id,
    );
  }

  async findAllForOneStudent(studentId: string): Promise<StudentGradeEntity[]> {
    const student = await this.studentService.findOne(studentId);
    const grades = await this.gradeRepository.find({
      where: { student: student },
    });

    if (!grades) {
      throw new NotFoundException(student.id);
    }

    return grades;
  }

  async findAllForOneSubject(subjectId: string): Promise<StudentGradeEntity[]> {
    const subject = await this.subjectService.findOne(subjectId);
    const grades = await this.gradeRepository.find({
      where: {
        subject: subject,
      },
    });

    if (!grades) {
      throw new NotFoundException(subject.id);
    }

    return grades.filter((grade) => grade.subject.id === subject.id);
  }

  async remove(gradeId: string): Promise<GradePayload> {
    await this.gradeRepository.delete(gradeId);

    return new GradePayload(gradeId);
  }
}
