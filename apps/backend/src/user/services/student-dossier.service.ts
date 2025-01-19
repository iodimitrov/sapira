import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { StudentService } from './student.service';
import { SubjectService } from '../../institution/services/subject.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  StudentDossier as StudentDossierEntity,
  User as UserEntity,
  Student as StudentEntity,
  File as FileEntity,
} from '@sapira/database';
import { R2Service } from '@sapira/nest-common';
import { AddStudentDossierInput } from '../inputs/add-student-dossier.input';
import { StudentDossierPayload } from '../payloads/student-dossier.payload';
import { FindOneStudentDossierPayload } from '../payloads/find-one-student-dossier.payload';

@Injectable()
export class StudentDossierService {
  constructor(
    private readonly userService: UserService,
    private readonly studentService: StudentService,
    private readonly subjectService: SubjectService,
    private readonly r2Service: R2Service,

    @InjectRepository(StudentDossierEntity)
    private readonly studentDossierRepository: Repository<StudentDossierEntity>,
  ) {}

  async add(
    input: AddStudentDossierInput,
    currUser: UserEntity,
  ): Promise<StudentDossierPayload> {
    const newStudentDossier = new StudentDossierEntity();

    if (input.files) {
      const inputFiles = await Promise.all(input.files);

      for (const inputFile of inputFiles) {
        const fileMeta = await this.r2Service.uploadStream({
          originalName: inputFile.filename,
          mimeType: inputFile.mimetype,
          body: inputFile.createReadStream(),
          keyPath: input.studentId,
        });

        const files = newStudentDossier.files
          ? [...newStudentDossier.files]
          : [];
        const dossierFile = new FileEntity();

        dossierFile.key = fileMeta.Key!;

        files.push(dossierFile);

        newStudentDossier.files = files;
      }
    }

    if (input.message) {
      newStudentDossier.message = input.message;
    }

    if (input.studentId) {
      newStudentDossier.student = await this.studentService.findOne(
        input.studentId,
      );
    }

    if (input.subjectId) {
      newStudentDossier.subject = await this.subjectService.findOne(
        input.subjectId,
      );
    }

    newStudentDossier.fromUser = await this.userService.findOne(currUser.id);

    try {
      return new StudentDossierPayload(
        (await this.studentDossierRepository.save(newStudentDossier)).id,
      );
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(
          '[Add-Student-Dossier] This message already exists: ' + error,
        );
      }
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(studentId: string): Promise<FindOneStudentDossierPayload> {
    const student = await this.studentService.findOne(studentId);
    const studentDossierFiles =
      student.dossier
        ?.map((dossier: StudentDossierEntity) => dossier.files || [])
        .flat() || [];

    const files = await Promise.all(
      studentDossierFiles.map(async (file: FileEntity) => {
        file.publicUrl = await this.r2Service.getSignedUrl({ key: file.key });
        return file;
      }),
    );

    return new FindOneStudentDossierPayload(student.dossier || [], files);
  }

  async findAll(currUser: UserEntity): Promise<StudentDossierEntity[]> {
    return (await this.studentService.findAll(currUser))
      .map((student: StudentEntity) => student.dossier || [])
      .flat();
  }
}
