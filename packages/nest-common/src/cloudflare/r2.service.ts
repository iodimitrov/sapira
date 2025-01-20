import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import contentDisposition from 'content-disposition';
import * as path from 'path';
import { Readable } from 'stream';
import { createUniqueS3Key } from '../utils';
import { R2File } from './r2-file.type';

@Injectable()
export class R2Service {
  public readonly bucket: string;
  public readonly r2: S3Client;

  private readonly logger = new Logger(R2Service.name);

  constructor(private readonly configService: ConfigService) {
    const accountId = this.configService.getOrThrow<string>(
      'CLOUDFLARE_ACCOUNT_ID',
    );
    const accessKeyId =
      this.configService.getOrThrow<string>('R2_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.getOrThrow<string>(
      'R2_SECRET_ACCESS_KEY',
    );

    this.r2 = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      requestChecksumCalculation: 'WHEN_REQUIRED',
      responseChecksumValidation: 'WHEN_REQUIRED',
    });
    this.bucket = this.configService.getOrThrow<string>('R2_BUCKET');
  }

  public async fileExists(key: string): Promise<boolean> {
    try {
      await this.r2.send(
        new HeadObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      );
      return true;
    } catch {
      return false;
    }
  }

  async uploadFile(args: {
    originalName: string;
    name?: string;
    keyPath?: string;
    mimeType: string;
    body: string | Uint8Array | Buffer;
  }) {
    const { originalName, keyPath = '', mimeType, body, name } = args;
    let sanitizedName = originalName.replace(/[^a-zA-Z0-9!_.*'()-]/gi, '');
    const baseKey = name ?? createUniqueS3Key(sanitizedName);

    if (!sanitizedName || sanitizedName === path.extname(sanitizedName)) {
      sanitizedName = baseKey;
    }

    const key = path.join(keyPath, baseKey);

    await this.r2.send(
      new PutObjectCommand({
        ContentDisposition: contentDisposition(sanitizedName, {
          type: 'inline',
        }),
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: mimeType,
      }),
    );

    return key;
  }

  async uploadStream(args: {
    originalName: string;
    name?: string;
    keyPath?: string;
    mimeType: string;
    body: Readable;
    cacheControl?: string;
  }) {
    const {
      originalName,
      keyPath = '',
      mimeType,
      body,
      name,
      cacheControl,
    } = args;
    let sanitizedName = originalName.replace(/[^a-zA-Z0-9!_.*'()-]/gi, '');
    const baseKey = name ?? createUniqueS3Key(sanitizedName);

    if (!sanitizedName || sanitizedName === path.extname(sanitizedName)) {
      sanitizedName = baseKey;
    }

    const key = path.join(keyPath, baseKey);

    const upload = new Upload({
      client: this.r2,
      params: {
        CacheControl: cacheControl,
        ContentDisposition: contentDisposition(sanitizedName, {
          type: 'inline',
        }),
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: mimeType,
      },
    });

    return upload.done();
  }

  async deleteFileByKey(key: string): Promise<void> {
    await this.r2.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
  }

  async downloadFileByKey(key: string): Promise<R2File | null> {
    try {
      const file = await this.r2.send(
        new GetObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      );

      if (!file.Body) {
        return null;
      }

      let originalName: string | undefined;

      if (file.ContentDisposition) {
        originalName = contentDisposition.parse(file.ContentDisposition)
          .parameters.filename;
      }

      if (!originalName) {
        originalName = key.substring(key.lastIndexOf('/') + 1);
      }

      return {
        originalName,
        mimeType: file.ContentType,
        body: file.Body,
      };
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }

  async getSignedUrl(args: { key: string; expiresIn?: number }) {
    const { key, expiresIn = 900 } = args;

    return getSignedUrl(
      this.r2,
      new GetObjectCommand({ Bucket: this.bucket, Key: key }),
      { expiresIn },
    );
  }

  async listObjectsByPrefix(prefix: string) {
    const objects = await this.r2.send(
      new ListObjectsV2Command({
        Bucket: this.bucket,
        Prefix: prefix,
      }),
    );

    if (!objects.Contents) {
      return [];
    }

    return objects.Contents;
  }
}
