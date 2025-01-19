import { nanoid } from 'nanoid';
import * as path from 'path';

export function createUniqueS3Key(name: string) {
  return `${nanoid()}${path.extname(name).toLowerCase()}`;
}
