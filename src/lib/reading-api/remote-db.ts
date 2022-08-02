import { Auth } from '@aws-amplify/auth';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { REGION } from '../aws-constants';
import { ReadingDb } from './types';

const getClient = async () => {
  const credentials = await Auth.currentCredentials();
  return new S3Client({ credentials, region: REGION });
};
const BUCKET = import.meta.env.PROD
  ? 'clocky-database-prod'
  : 'clocky-database-dev';
const REMOTE_DB_BASE = 'users';
const REMOTE_DB_FILE = 'data.json';
export const getRemoteDb = async (sub: string) => {
  const s3 = await getClient();
  const key = `${REMOTE_DB_BASE}/${sub}/${REMOTE_DB_FILE}`;
  const object = await s3.send(
    new GetObjectCommand({ Bucket: BUCKET, Key: key }),
  );
  console.log('getRemoteDb', object, typeof object);
  return JSON.parse(object.Body as any) as ReadingDb;
};
export const setRemoteDb = async (sub: string, db: ReadingDb) => {
  const s3 = await getClient();
  const key = `${REMOTE_DB_BASE}/${sub}/${REMOTE_DB_FILE}`;
  const object = await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: JSON.stringify(db),
    }),
  );
  return object.ETag;
};
