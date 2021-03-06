/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import Cookie from 'js-cookie';
import { useCallback, useEffect, useState } from 'react';
import localforage from 'localforage';
import * as Automerge from 'automerge';
import ky from 'ky';
import { Reading } from '../types';
import { useLoadingEffect } from './use-loading';

const LS_KEY = 'automerge-db-4';
const COOKIE_ETAG = 'cookie-etag';

const r2Api = ky.create({
  timeout: 2000,
  retry: 0,
  prefixUrl: import.meta.env.DEV
    ? 'http://localhost:8787'
    : 'https://clocky-api.edweis.workers.dev',
});

const setETag = (etag: string) =>
  Cookie.set(COOKIE_ETAG, etag, { sameSite: 'Lax' });
const getETag = () => Cookie.get(COOKIE_ETAG);

type Db = { readings: Reading[] };
const getCachedDb = async () => {
  console.log('getCachedDb START');
  const binary = await localforage.getItem<Automerge.BinaryDocument>(LS_KEY);
  console.log('getCachedDb END ', binary);
  if (binary == null) return null;
  return Automerge.load<Db>(binary);
};

const getRemoteEtag = async () => {
  console.log('getRemoteEtag');
  const response = await r2Api.head(LS_KEY).catch((error) => {
    console.warn(error);
    return { headers: new Headers() };
  });
  const etag = response.headers.get('etag') || null;
  console.log('getRemoteEtag', { etag });
  return etag;
};
const getRemoteDb = async () => {
  const response = await r2Api.get(LS_KEY);
  console.log('getRemoteDb', { response });
  const bytesArray = new Uint8Array(
    await response.arrayBuffer(),
  ) as Automerge.BinaryDocument;
  console.log('getRemoteDb', { bytesArray });
  const remoteDb = Automerge.load<Db>(bytesArray);
  setETag(response.headers.get('etag') as string);
  console.log('getRemoteDb', { remoteDb });
  return remoteDb;
};

const setCachedDb = async (db: Db) => {
  const binary = Automerge.save(db);
  console.log('setCachedDb');
  await localforage.setItem(LS_KEY, binary);
};
const setRemoteDb = async (db: Db) => {
  console.log('setRemoteDb: WILL PUSH !');
  const binary = Automerge.save(db);
  const response = await r2Api.put(LS_KEY, { body: binary });
  console.log('setRemoteDb" pushed !', response.headers);
  setETag(response.headers.get('etag') as string);
};

const EMPTY_STATE = Automerge.change(Automerge.init<Db>(), (doc) => {
  doc.readings = [];
});

export default function useReadings() {
  const [db, setDb] = useState<Db>(EMPTY_STATE);
  const loading = useLoadingEffect(async () => {
    const localDb = await getCachedDb();
    console.log('useReading:', { localDb });
    if (localDb != null) setDb(localDb);

    const eTag = await getRemoteEtag();
    const localETag = getETag();
    console.log('useReading: Checking...', { eTag, localETag });
    if (eTag == null)
      return console.log('Remote unreachable, nothing to update');
    if (localETag === eTag)
      return console.log('useReading: Up to date !', { eTag });
    let remoteDb = await getRemoteDb();
    if (localDb) {
      remoteDb = Automerge.merge(localDb, remoteDb);
      setRemoteDb(remoteDb); // async
    }
    console.log('useReading: Will set');
    setCachedDb(remoteDb); // async
    return setDb(remoteDb);
  }, []);
  const updateReadings = useCallback(
    (fn: (r: Automerge.Proxy<Db>) => void) => {
      const nextDb = Automerge.change(db, fn);
      setDb(nextDb);
      setCachedDb(nextDb); // async
      setRemoteDb(nextDb); // async
    },
    [db],
  );
  return [db, updateReadings] as const;
}
