import { Field, InputType, Int, registerEnumType } from '@nestjs/graphql';
import { ContractType } from '../teacher.model';

registerEnumType(ContractType, {
    name: 'ContractType',
});

@InputType()
export class AddTeacherInput {
    @Field({ nullable: true })
    education?: string;

    @Field(() => Int, { nullable: true })
    yearsExperience?: number;

    @Field(() => ContractType, { nullable: true })
    contractType?: ContractType;

    @Field()
    teacherToken: string;
}
