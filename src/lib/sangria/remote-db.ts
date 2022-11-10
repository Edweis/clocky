import { Auth } from '@aws-amplify/auth';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { REGION } from '../aws-constants';

const BUCKET = import.meta.env.PROD
  ? 'clocky-database-prod'
  : 'clocky-database-dev';
const REMOTE_DB_BASE = 'users';
export const getRemoteDb = async <T>(path: string) => {
  const credentials = await Auth.currentCredentials();
  console.log({
    credentials,
    currentSession: await Auth.currentSession(),
    user: await Auth.currentUserInfo(),
  });
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
  return JSON.parse(str) as T[];
};
/** If this fail, you are probably logged out or offline */
export const setRemoteDb = async <T>(path: string, db: T[]) => {
  const credentials = await Auth.currentCredentials();
  const s3 = new S3Client({ credentials, region: REGION });
  const sub = credentials.identityId;
  const key = `${REMOTE_DB_BASE}/${sub}/${path}`;
  const object = await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: JSON.stringify(db),
    }),
  );
  return object.ETag;
};

export const setRemoteDbRaw = async <T>(path: string, data: Buffer) => {
  const credentials = await Auth.currentCredentials();
  const s3 = new S3Client({ credentials, region: REGION });
  const sub = credentials.identityId;
  const key = `${REMOTE_DB_BASE}/${sub}/${path}`;
  const object = await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: data,
    }),
  );
  return object.ETag;
};
