import { Scalar, CustomScalar } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
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

  parseValue(value: unknown): Promise<FileUpload> {
    return value as Promise<FileUpload>;
  }

  serialize(): Promise<FileUpload> {
    throw new GraphQLError('Upload scalar cannot be serialized');
  }

  parseLiteral(): Promise<FileUpload> {
    throw new GraphQLError('Upload scalar cannot be parsed from AST');
  }
}
