import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class as ClassEntity } from '@sapira/database';
import { ClassPayload } from './payloads/class.payload';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(ClassEntity)
    private readonly classRepository: Repository<ClassEntity>,
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
