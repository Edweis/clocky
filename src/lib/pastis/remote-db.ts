import { Auth } from '@aws-amplify/auth';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Buffer } from 'buffer';
import { REGION } from '../aws-constants';

function toBuffer(view: Uint8Array): Buffer {
  const buf = Buffer.alloc(view.byteLength);
  view.forEach((v, i) => {
    buf[i] = v;
  });
  return buf;
}

const BUCKET = import.meta.env.PROD
  ? 'clocky-database-prod'
  : 'clocky-database-dev';
const REMOTE_DB_BASE = 'users';
export const getRemoteDb = async <T>(path: string) => {
  const credentials = await Auth.currentCredentials();
  const s3 = new S3Client({ credentials, region: REGION });
  const sub = credentials.identityId;
  const key = `${REMOTE_DB_BASE}/${sub}/${path}`;
  const object = await s3.send(
    new GetObjectCommand({ Bucket: BUCKET, Key: key }),
  );
  const stream = object.Body as ReadableStream;
  const reader = await stream.getReader().read();
  const buffer = toBuffer(reader.value);
  return buffer;
};

export const setRemoteDb = async <T>(path: string, data: Buffer) => {
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
