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
import { Student as StudentEntity, User as UserEntity } from '@sapira/database';

@Injectable()
export class StudentService {
  constructor(
    @Inject(forwardRef(() => ClassService))
    private readonly classService: ClassService,
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
}
