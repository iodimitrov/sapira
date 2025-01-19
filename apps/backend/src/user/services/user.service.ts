import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { AddUserInput } from '../inputs/add-user.input';
import { GenerateUserTokenInput } from '../inputs/generate-user-token.input';
import { UpdateUserStatusInput } from '../inputs/update-user-status.input';
import { UpdateUserInput } from '../inputs/update-user.input';
import { GenerateUserTokenPayload } from '../payloads/generate-user-token.payload';
import { UserPayload } from '../payloads/user.payload';
import { User as UserEntity, UserRole } from '@sapira/database';
import { InstitutionService } from '../../institution/services/institution.service';
import { TeacherService } from './teacher.service';
import { StudentService } from './student.service';
import { ParentService } from './parent.service';
import { ClassService } from '../../institution/services/class.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @Inject(forwardRef(() => InstitutionService))
    private readonly institutionService: InstitutionService,
    @Inject(forwardRef(() => TeacherService))
    private readonly teacherService: TeacherService,
    @Inject(forwardRef(() => StudentService))
    private readonly studentService: StudentService,
    @Inject(forwardRef(() => ParentService))
    private readonly parentService: ParentService,
    @Inject(forwardRef(() => ClassService))
    private readonly classService: ClassService,
  ) {}

  async add(input: AddUserInput): Promise<UserPayload> {
    const user = new UserEntity();
    let resultUser: UserEntity | null = null;

    if (input.photo) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { photo, ...data } = input;
      Object.assign(user, data);
    } else {
      Object.assign(user, input);
    }

    if (!user || !user.registerToken) {
      throw new Error('Bad register token');
    }

    const [instAlias = '', userSpecific = ''] = user.registerToken.split('#');

    user.institution = await this.institutionService.findOneByAlias(instAlias);
    const [userRole = '', additionalProps = ''] = userSpecific.split('@');

    if (userRole !== 'a' && userRole !== 't' && additionalProps === '') {
      throw new Error('Bad register token');
    }

    try {
      user.password = await bcrypt.hash(user.password, 10);
      switch (userRole) {
        case 'a': {
          //admin
          user.role = UserRole.ADMIN;
          resultUser = await this.userRepository.save(user);
          break;
        }
        case 't': {
          //teacher
          user.role = UserRole.TEACHER;
          resultUser = await this.userRepository.save(user);
          const teacher = await this.teacherService.add(resultUser);
          if (additionalProps.length === 6 || additionalProps.length === 7) {
            this.teacherService.assignTeacherToClass(teacher, additionalProps);
          }
          break;
        }
        case 's': {
          //student
          user.role = UserRole.STUDENT;
          resultUser = await this.userRepository.save(user);
          this.studentService.add(resultUser, additionalProps);
          break;
        }
        case 'p': {
          //parent
          user.role = UserRole.PARENT;
          resultUser = await this.userRepository.save(user);
          const students = additionalProps.split(',');
          if (!students) {
            throw new Error('Parent without students');
          }
          this.parentService.add(resultUser, students);
          break;
        }
      }

      if (!resultUser) {
        throw new Error('User not created');
      }

      return new UserPayload(resultUser.id);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('[Add-User] The user already exists');
      }
      throw new InternalServerErrorException(error);
    }
  }

  async update(
    input: UpdateUserInput,
    currUser: UserEntity,
  ): Promise<UserPayload> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: currUser.id },
      });

      if (!user) {
        throw new NotFoundException(
          `[User-Update] User not found: ${currUser.id}`,
        );
      }

      Object.assign(user, input);

      await this.userRepository.save(user);
      return new UserPayload(currUser.id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateStatus(input: UpdateUserStatusInput): Promise<UserPayload> {
    const user = await this.userRepository.findOne({
      where: { id: input.id },
    });

    if (!user) {
      throw new NotFoundException(
        `[User-Update-Status] User not found: ${input.id}`,
      );
    }

    user.status = input.userStatus;

    try {
      await this.userRepository.save(user);
      return new UserPayload(input.id);
    } catch (error) {
      throw new Error(
        `[User-Update-Status] Status couldn't be updated. User: ${input.id}`,
      );
    }
  }

  async findAll(currUser: UserEntity): Promise<UserEntity[]> {
    const institution = (await this.userRepository.findOne({
      where: { id: currUser.id },
      relations: ['institution'],
    }))!.institution;

    return this.userRepository.find({
      where: { institution: institution },
    });
  }

  async findOne(id: string): Promise<UserEntity> {
    let user = await this.userRepository.findOne({
      where: { id: id },
    });

    if (!user) {
      user = await this.userRepository.findOne({
        where: { email: id },
      });
    }

    if (!user) {
      throw new NotFoundException(`[User-Find-One] User not found: ${id}`);
    }

    return user;
  }

  async remove(id: string): Promise<UserPayload> {
    await this.userRepository.delete(id);
    return new UserPayload(id);
  }

  async generateUserToken(
    user: UserEntity,
    input: GenerateUserTokenInput,
  ): Promise<GenerateUserTokenPayload> {
    const instAlias = (await this.userRepository.findOne({
      where: { id: user.id },
      relations: ['institution'],
    }))!.institution.alias;

    if (!input.role || input.role.length === 0) {
      throw new Error('Bad role');
    }

    const role = input.role[0];
    let token = instAlias + '#' + role + '@';

    if (input.classId) {
      const classToken = (await this.classService.findOne(input.classId)).token;
      token += classToken;
    }

    return new GenerateUserTokenPayload(token);
  }
}
