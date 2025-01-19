import { Scalar, CustomScalar } from '@nestjs/graphql';
import {
  GraphQLError,
  GraphQLScalarSerializer,
  GraphQLScalarValueParser,
} from 'graphql';
import { FileUpload } from 'graphql-upload-minimal';

export interface Upload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => NodeJS.ReadableStream;
}

@Scalar('Upload')
export class UploadScalar implements CustomScalar<Promise<FileUpload>, any> {
  description = 'File upload scalar type';

  parseValue: GraphQLScalarValueParser<any>;
  serialize: GraphQLScalarSerializer<Promise<FileUpload>>;

  parseLiteral(): void {
    throw new GraphQLError('Upload scalar cannot be parsed from AST');
  }
}
