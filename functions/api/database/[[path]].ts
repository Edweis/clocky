export interface Env {
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  MY_BUCKET: R2Bucket;
}
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

export const onRequestGet: PagesFunction<Env> = async ({ params, env }) => {
  const key = params.path as string;
  console.log({ params, env });
  const object = await env.MY_BUCKET.get(key);
  if (object === null) return new Response('Object Not Found', { status: 404 });

  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  return new Response(object.body, { headers });
};

export const onRequestHead: PagesFunction<Env> = async ({ params, env }) => {
  const key = params.path as string;
  const object = await env.MY_BUCKET.head(key);
  if (object === null)
    return new Response('Object Not Found', { status: 404, headers });

  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  return new Response(null, { headers });
};
