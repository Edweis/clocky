const errorHandler: PagesFunction<any> = async ({ next }) => {
  try {
    console.log('errorHandler');
    return await next();
  } catch (err: any) {
    console.log(err);
    return new Response(`${err.message}\n${err.stack}`, { status: 500 });
  }
};

const hello: PagesFunction<any> = async ({ next }) => {
  const response = await next();
  response.headers.set('X-Hello', 'Hello from functions Middleware!');
  return response;
};

export const onRequest = []; // [errorHandler, hello];
