import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  Message as MessageEntity,
  User as UserEntity,
  File as FileEntity,
  Student as StudentEntity,
  UserRole,
  MessageType,
} from '@sapira/database';
import { UserService } from '../../user/services/user.service';
import { StudentService } from '../../user/services/student.service';
import { ClassService } from '../../institution/services/class.service';
import { SubjectService } from '../../institution/services/subject.service';
import { MessagePayload } from '../payloads/message.payload';
import { AddMessageInput } from '../inputs/add-message.input';
import { UpdateMessageInput } from '../inputs/update-message.input';
import { MessagesByCriteriaInput } from '../inputs/messages-by-criteria.input';
import { R2Service } from '@sapira/nest-common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MessageService {
  constructor(
    private readonly userService: UserService,
    private readonly studentService: StudentService,
    private readonly classService: ClassService,
    private readonly subjectService: SubjectService,
    private readonly r2Service: R2Service,
    private readonly configService: ConfigService,
    // private readonly mailerService: MailerService,

    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
  ) {}

  async add(
    input: AddMessageInput,
    currUser: UserEntity,
  ): Promise<MessagePayload> {
    const newMessage = new MessageEntity();

    newMessage.fromUser = await this.userService.findOne(currUser.id);
    newMessage.messageType = input.messageType;

    const { toClassIds, toUserIds, subjectId, files, ...data } = input;

    Object.assign(newMessage, data);

    if (!toClassIds && !toUserIds) {
      throw new Error('[Create-Message] No data for message');
    }

    if (subjectId) {
      newMessage.subject = await this.subjectService.findOne(subjectId);
    }

    if (toClassIds) {
      newMessage.toClasses = await this.classService.findAllByIds(toClassIds);
    }

    if (toUserIds) {
      newMessage.toUsers = await this.userService.findAllByIds(toUserIds);
    }

    if (files) {
      const inputFiles = await Promise.all(files);

      for (const inputFile of inputFiles) {
        const fileMeta = await this.r2Service.uploadStream({
          originalName: inputFile.filename,
          keyPath: currUser.id,
          mimeType: inputFile.mimetype,
          body: inputFile.createReadStream(),
        });
        const files = newMessage.files ? [...newMessage.files] : [];
        const messageFile = new FileEntity();

        messageFile.key = fileMeta.Key!;

        files.push(messageFile);
        newMessage.files = files;
      }
    }

    const classUserEmails = (
      await this.studentService.findAllForEachClass(currUser, toClassIds || [])
    ).map((student: StudentEntity) => student.user.email);

    const userEmails = [
      ...new Set([
        ...classUserEmails,
        ...(newMessage.toUsers?.map((user) => user.email) || []),
      ]),
    ];

    try {
      const message = await this.messageRepository.save(newMessage);

      //TODO: integrate mailer service

      return new MessagePayload(message.id);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(
          '[Add-Message] This message already exists: ' + error,
        );
      }
      throw new InternalServerErrorException(error);
    }
  }

  async update(
    input: UpdateMessageInput,
    currUser: UserEntity,
  ): Promise<MessagePayload> {
    const message = await this.findOne(input.id);
    const newFiles = message.files ? [...message.files] : [];

    if (input.files) {
      const dataFiles = await Promise.all(input.files);

      for (const dataFile of dataFiles) {
        const fileMeta = await this.r2Service.uploadStream({
          originalName: dataFile.filename,
          keyPath: currUser.id,
          mimeType: dataFile.mimetype,
          body: dataFile.createReadStream(),
        });
        const messageFile = new FileEntity();

        messageFile.key = fileMeta.Key!;
        newFiles.push(messageFile);
      }
    }

    message.files = message.files ? newFiles : message.files;

    Object.assign(message, input);

    try {
      await this.messageRepository.save(message);
      return new MessagePayload(message.id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(currUser: UserEntity): Promise<MessageEntity[]> {
    const user = await this.userService.findOne(currUser.id);
    const allMessages = await this.messageRepository.find();

    let filteredMessages: MessageEntity[];

    if (user.role === UserRole.STUDENT) {
      const student = await this.studentService.findOneByUserId(user.id);
      filteredMessages = allMessages.filter((message) => {
        const toUserIds = message.toUsers?.map((u: UserEntity) => u.id) ?? [];
        const toClassIds = message.toClasses?.map((cls) => cls.id) ?? [];
        return (
          toUserIds.includes(user.id) || toClassIds.includes(student.class.id)
        );
      });
    } else {
      filteredMessages = allMessages.filter((message) => {
        const toUserIds = message.toUsers?.map((u: UserEntity) => u.id) ?? [];
        return message.fromUser.id === user.id || toUserIds.includes(user.id);
      });
    }

    return Promise.all(
      filteredMessages.map(async (message) => {
        if (!message.files) {
          message.files = [];
        }
        for (const file of message.files) {
          file.publicUrl = await this.r2Service.getSignedUrl({ key: file.key });
        }
        return message;
      }),
    );
  }

  async findOne(id: string): Promise<MessageEntity> {
    const message = await this.messageRepository.findOne({
      where: { id: id },
    });

    if (!message) {
      throw new NotFoundException(id);
    }
    message.files = await Promise.all(
      message.files?.map(async (file) => {
        file.publicUrl = await this.r2Service.getSignedUrl({ key: file.key });
        return file;
      }) || [],
    );
    return message;
  }

  async findByCriteria(
    currUser: UserEntity,
    input?: MessagesByCriteriaInput,
  ): Promise<MessageEntity[]> {
    const user = await this.userService.findOne(currUser.id);
    let messages: MessageEntity[] = [];

    if (!input || (!input.messageType && !input.messageStatus)) {
      return this.findAll(currUser);
    }

    if (user.role === UserRole.STUDENT) {
      const student = await this.studentService.findOneByUserId(user.id);
      if (input.messageType && input.messageStatus) {
        messages = await this.messageRepository.find({
          where: {
            messageType: input.messageType,
            status: input.messageStatus,
          },
        });
      } else if (!input.messageType) {
        messages = await this.messageRepository.find({
          where: {
            status: input.messageStatus,
          },
        });
      } else if (!input.messageStatus) {
        messages = await this.messageRepository.find({
          where: {
            messageType: input.messageType,
          },
        });

        messages = messages.filter(
          (msg) =>
            msg.toUsers?.map((usr) => usr.id).includes(user.id) ||
            msg.toClasses?.map((cls) => cls.id).includes(student.class.id),
        );
      }
    } else {
      if (input.messageType && input.messageStatus) {
        messages = await this.messageRepository.find({
          where: {
            fromUser: await this.userService.findOne(currUser.id),
            messageType: input.messageType,
            status: input.messageStatus,
          },
        });
      } else if (!input.messageType) {
        messages = await this.messageRepository.find({
          where: {
            fromUser: await this.userService.findOne(currUser.id),
            status: input.messageStatus,
          },
        });
      } else if (!input.messageStatus) {
        messages = await this.messageRepository.find({
          where: {
            fromUser: await this.userService.findOne(currUser.id),
            messageType: input.messageType,
          },
        });
      }
    }

    for (const message of messages) {
      message.files = message.files ?? [];
      for (const file of message.files) {
        file.publicUrl = await this.r2Service.getSignedUrl({ key: file.key });
      }
    }

    return messages;
  }

  async remove(id: string): Promise<MessagePayload> {
    await this.messageRepository.delete(id);
    return new MessagePayload(id);
  }
}
