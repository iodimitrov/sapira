import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Institution as InstitutionEntity } from '@sapira/database';

@Injectable()
export class InstitutionService {
  constructor(
    @InjectRepository(InstitutionEntity)
    private readonly institutionRepository: Repository<InstitutionEntity>,
  ) {}

  async findOneByAlias(alias: string): Promise<InstitutionEntity> {
    const institution = await this.institutionRepository.findOne({
      where: { alias: alias },
    });

    if (!institution) {
      throw new NotFoundException(alias);
    }
    return institution;
  }
}
