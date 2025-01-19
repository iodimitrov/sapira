import { Field, InputType, Int, registerEnumType } from '@nestjs/graphql';
import { ContractType } from '../teacher.model';
import { IsUUID } from 'class-validator';

registerEnumType(ContractType, {
    name: 'ContractType',
});

@InputType()
export class UpdateTeacherInput {
    @Field()
    @IsUUID('all')
    id: string;

    @Field({ nullable: true })
    education?: string;

    @Field(() => Int, { nullable: true })
    yearsExperience?: number;

    @Field(() => ContractType, { nullable: true })
    contractType?: ContractType;
}
