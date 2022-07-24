import {
  S3Client,
  GetObjectCommand,
  CompleteMultipartUploadCommandOutput,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

const s3 = new S3Client({
  region: 'ap-southeast-1',
  credentials: {
    accessKeyId: 'AKIAWNUSTGS2DMLVMKGZ',
    secretAccessKey: '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',
  },
});

const Bucket =
  process.env.NODE_ENV === 'production'
    ? 'clocky-database-prod'
    : 'clocky-database-dev';
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,HEAD,PUT,OPTIONS',
  'Access-Control-Expose-Headers': 'etag,test',
  'Access-Control-Max-Age': '86400',
};

const headers = new Headers({
  ...CORS_HEADERS,
  'Cache-Control': 'max-age=30',
});
const toArray = <T>(obj: T | T[]) => (Array.isArray(obj) ? obj : [obj]);
export const onRequestGet: PagesFunction = async ({ params }) => {
  const [Key] = toArray(params.path);
  console.log({ Key });
  const response = await s3.send(new GetObjectCommand({ Bucket, Key }));

  if (response.Body === null)
    return new Response('Object Not Found', { status: 404 });
  headers.set('etag', response.ETag as string);
  return new Response(response.Body, { headers });
};

export const onRequestHead: PagesFunction = async ({ params, env }) => {
  const [Key] = toArray(params.path);
  const response = await s3.send(new GetObjectCommand({ Bucket, Key }));
  if (response.Body === null)
    return new Response('Object Not Found', { status: 404, headers });
  headers.set('etag', response.ETag as string);
  return new Response(null, { headers });
};

export const onRequestPut: PagesFunction = async ({ params, request }) => {
  const [Key] = toArray(params.path);
  const parallelUploads3 = new Upload({
    client: s3,
    params: { Bucket, Key, Body: request.body },
  });
  const response =
    (await parallelUploads3.done()) as CompleteMultipartUploadCommandOutput;
  if (response.ETag == null)
    return new Response('Fail to upload', { status: 500, headers });
  headers.set('etag', response.ETag);
  return new Response(null, { headers });
};
