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

async function fetch(request: Request, env: Env, ctx: ExecutionContext) {
  const headers = new Headers({
    ...CORS_HEADERS,
    'Cache-Control': 'max-age=30',
  });
  const url = new URL(request.url);
  const key = url.pathname.slice(1);
  console.log({
    url: url.toJSON(),
    key,
    env,
    ctx,
  });

  if (key == null || key === '')
    return new Response('Object key is missing', { status: 404, headers });

  // PUT
  if (request.method === 'PUT') {
    const response = await env.MY_BUCKET.put(key, request.body);
    const expire = new Date().getTime() / 1000 + 60 * 10000;
    headers.set('etag', response.etag);
    headers.set('expires', expire.toString());
    return new Response('PUT Ok', { headers });
  }
  // HEAD
  if (request.method === 'HEAD') {
    const object = await env.MY_BUCKET.head(key);
    if (object === null)
      return new Response('Object Not Found', { status: 404, headers });

    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    return new Response(null, { headers });
  }
  if (request.method === 'OPTIONS') return new Response(null, { headers });

  // GET
  if (request.method === 'GET') {
    const object = await env.MY_BUCKET.get(key);
    if (object === null)
      return new Response('Object Not Found', { status: 404 });

    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    return new Response(object.body, { headers });
  }

  return new Response('Method Not Allowed', {
    status: 405,
    headers: { Allow: 'PUT, GET, DELETE', ...headers },
  });
}
export default { fetch };
