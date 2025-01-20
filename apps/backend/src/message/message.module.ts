import { forwardRef, Module } from '@nestjs/common';
import { Message as MessageEntity } from '@sapira/database';
import { UserModule } from '../user/user.module';
import { InstitutionModule } from '../institution/institution.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudflareModule } from '@sapira/nest-common';
import { MessageService } from './services/message.service';
import { MessageResolver } from './resolvers/message.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([MessageEntity]),
    forwardRef(() => InstitutionModule),
    forwardRef(() => UserModule),
    CloudflareModule,
  ],
  providers: [MessageResolver, MessageService],
  exports: [MessageService],
})
export class MessageModule {}
