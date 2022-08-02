import { Reading } from '../../types';

export type DbObject<T> = { data: T; etag: string };
export type ReadingDb = DbObject<Reading[]>;
