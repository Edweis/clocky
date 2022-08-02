import { Auth } from '@aws-amplify/auth';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Reading } from '../../types';
import { REGION } from '../aws-constants';
import { ReadingDb } from './types';

const BUCKET = import.meta.env.PROD
  ? 'clocky-database-prod'
  : 'clocky-database-dev';
const REMOTE_DB_BASE = 'users';
export const getRemoteDb = async (path: string) => {
  const credentials = await Auth.currentCredentials();
  const s3 = new S3Client({ credentials, region: REGION });
  const sub = credentials.identityId;
  const key = `${REMOTE_DB_BASE}/${sub}/${path}`;
  const object = await s3.send(
    new GetObjectCommand({ Bucket: BUCKET, Key: key }),
  );
  console.log('getRemoteDb', object, typeof object);
  const stream = object.Body as ReadableStream;
  const reader = await stream.getReader().read();
  const str = new TextDecoder().decode(reader.value as any) as string;
  return JSON.parse(str) as Reading[];
};
export const setRemoteDb = async (path: string, db: Reading[]) => {
  const credentials = await Auth.currentCredentials();
  const s3 = new S3Client({ credentials, region: REGION });
  const sub = credentials.identityId;
  const key = `${REMOTE_DB_BASE}/${sub}/${path}`;
  // const object = await s3.send(
  //   new PutObjectCommand({
  //     Bucket: BUCKET,
  //     Key: key,
  //     Body: JSON.stringify(db),
  //   }),
  // );
  return 'etag'; // object.ETag;
};
