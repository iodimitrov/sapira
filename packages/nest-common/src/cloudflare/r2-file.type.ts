import { GetObjectCommandOutput } from '@aws-sdk/client-s3';

export type R2File = {
  originalName: string;
  mimeType: GetObjectCommandOutput['ContentType'];
  body: NonNullable<GetObjectCommandOutput['Body']>;
};
