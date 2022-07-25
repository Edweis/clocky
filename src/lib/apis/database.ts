import {
  GetObjectAclCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import type { Credentials } from '@aws-sdk/types';
import { REGION } from './constants';

const Bucket = import.meta.env.PROD
  ? 'clocky-database-prod'
  : 'clocky-database-dev';
const keyPrefix = 'unauth';
export const getDatabase = async (
  userDir: string,
  credentials: Credentials,
) => {
  const s3 = new S3Client({ credentials, region: REGION });
  const Key = `${keyPrefix}/${userDir}`;
  const response = await s3.send(new GetObjectAclCommand({ Bucket, Key }));
  console.log('response---', response);
};

export const setDataBase = async (
  userDir: string,
  credentials: Credentials,
  data: string,
) => {
  const s3 = new S3Client({ credentials, region: REGION });
  const Key = `${keyPrefix}/${userDir}/database.bin`;
  const response = await s3.send(
    new PutObjectCommand({ Bucket, Key, Body: data }),
  );
  console.log('response---', response);
};
