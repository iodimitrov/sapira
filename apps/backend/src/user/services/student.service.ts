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
import { ClassService } from '../../institution/services/class.service';
import {
  Student as StudentEntity,
  User as UserEntity,
  Subject as SubjectEntity,
  Teacher as TeacherEntity,
  UserRole,
} from '@sapira/database';
import { GetStudentTokenPayload } from '../payloads/get-student-token.payload';
import { StudentPayload } from '../payloads/student.payload';
import { UpdateStudentRecordInput } from '../inputs/update-student-record.input';
import { UserService } from './user.service';
import { UpdateStudentInput } from '../inputs/update-student.input';
import { TeacherService } from './teacher.service';

@Injectable()
export class StudentService {
  constructor(
    @Inject(forwardRef(() => ClassService))
    private readonly classService: ClassService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => TeacherService))
    private readonly teacherService: TeacherService,
    @InjectRepository(StudentEntity)
    private readonly studentRepository: Repository<StudentEntity>,
  ) {}

  async add(user: UserEntity, classToken?: string): Promise<StudentEntity> {
    const student = new StudentEntity();
    // {lastCharOfEmail}{2randomChars}{classNumber}{classLetter}{firstLetterFirstName}{firstLetterMiddleName}{firstLetterLastName}
    student.user = user;
    let lastEmailChar = user.email.split('@')[0]!;
    lastEmailChar = lastEmailChar[lastEmailChar.length - 1]!;
    const twoRandoms = Math.random().toString(36).substr(2, 2);
    const firstThree =
      user.firstName[0]! + user.middleName[0]! + user.lastName[0]!;

    if (classToken) {
      student.token = classToken;
      student.class = await this.classService.findOneByToken(classToken);

      if (!student.class) {
        throw new NotFoundException('[Add-Student] Class not found');
      }

      const classNumber = student.class.number;
      const classLetter = student.class.letter;

      student.token =
        lastEmailChar + twoRandoms + classNumber + classLetter + firstThree;
    }
    try {
      return this.studentRepository.save(student);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('This student already exists: ' + error);
      }
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string): Promise<StudentEntity> {
    const student = await this.studentRepository.findOne({
      where: { id },
    });

    if (!student) {
      throw new NotFoundException(id);
    }

    // TODO: get student dossier files

    return student;
  }

  async findOneByUserId(id: string): Promise<StudentEntity> {
    const student = (await this.studentRepository.find()).find(
      (student) => student.user.id === id,
    );

    if (!student) {
      throw new NotFoundException(id);
    }

    return student;
  }

  async findAllByIds(ids: string[]): Promise<StudentEntity[]> {
    return this.studentRepository.find({
      where: {
        id: In(ids),
      },
    });
  }

  async getToken(currUser: UserEntity): Promise<GetStudentTokenPayload> {
    const token = (
      await this.studentRepository.findOne({
        where: { user: await this.userService.findOne(currUser.id) },
      })
    )?.token;

    if (!token) {
      throw new NotFoundException('[Get-Token]: No Student Token was Found');
    }

    return new GetStudentTokenPayload(token);
  }

  async update(input: UpdateStudentInput): Promise<StudentPayload> {
    const { id, ...data } = input;
    try {
      if (data.classId) {
        const { classId, ...info } = data;
        await this.studentRepository.update(id, {
          ...info,
          class: await this.classService.findOne(classId),
        });
      } else {
        await this.studentRepository.update(id, data);
      }

      return new StudentPayload(id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async updateRecord(input: UpdateStudentRecordInput): Promise<StudentPayload> {
    const student = await this.studentRepository.findOne({
      where: { id: input.id },
    });

    if (!student) {
      throw new NotFoundException('[UpdateRecord-Student]: No student Found');
    }

    if (input.recordMessage) {
      student.recordMessage = input.recordMessage;
    }

    this.studentRepository.save(student);
    return new StudentPayload(student.id);
  }

  async findAll(currUser: UserEntity): Promise<StudentEntity[]> {
    const user = await this.userService.findOne(currUser.id);
    const students = await this.studentRepository.find();

    if (user.role === UserRole.ADMIN) {
      return students.filter(
        (student) => student.user.institution.id === user.institution.id,
      );
    }
    const usersIds = (await this.userService.findAll(currUser)).map(
      (user: UserEntity) => user?.id,
    );

    return students.filter((student) => usersIds.includes(student?.user?.id));
  }

  async verifyTeacherToStudent(
    student: StudentEntity,
    teacher: TeacherEntity,
  ): Promise<boolean> {
    const cls = await this.classService.findOne(student.class.id);
    teacher = await this.teacherService.findOneByUserId(teacher.user.id);

    return (
      teacher.subjects
        ?.map((subject: SubjectEntity) => subject.id)
        .some((id: string) =>
          cls.subjects?.map((subject) => subject.id).includes(id),
        ) || false
    );
  }

  async findAllForEachClass(
    currUser: UserEntity,
    classesIds: string[],
  ): Promise<StudentEntity[]> {
    const usersIds = (await this.userService.findAll(currUser)).map(
      (user: UserEntity) => user?.id,
    );
    const students = await this.studentRepository.find();

    return students.filter(
      (student) =>
        usersIds.includes(student?.user?.id) &&
        classesIds.includes(student.class.id),
    );
  }
}
