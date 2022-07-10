/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import { useCallback, useEffect, useState } from 'react';
import localforage from 'localforage';
import * as Automerge from 'automerge';
import { Reading } from '../types';
import { useLoadingEffect } from './use-loading';

const LS_KEY = 'automerge-db-2';
const HARRY = 'Harry Potter and the Order of the Phoenix';
const READINGS:Reading[] = [
  {
    book: HARRY,
    startPage: 15,
    endPage: 45,
    startTime: 1657355986444,
    endTime: 1657355986444 + 1000 * 60 * 17.6,
  },
  {
    book: HARRY,
    startPage: 45,
    endPage: 55,
    startTime: 1657355986445,
    endTime: 1657355986444 + 1000 * 60 * 14.2,
  },
];

type Db = {readings:Reading[]}
const getCachedReadings = async () => {
  const binary = await localforage.getItem<Automerge.BinaryDocument>(LS_KEY);
  let doc = Automerge.init<Db>();
  if (binary) {
    doc = Automerge.load<Db>(binary);
  } else {
    doc = Automerge.change(doc, 'init', (d) => {
      d.readings = READINGS;
    });
  }
  // eslint-disable-next-line no-promise-executor-return
  await new Promise<void>((resolve) => setTimeout(resolve, 1000));
  return doc;
};

const setCachedReadings = async (db:Db) => {
  const binary = Automerge.save(db);
  await localforage.setItem(LS_KEY, binary);
};

const EMPTY_STATE = Automerge.change(Automerge.init<Db>(), (doc) => {
  doc.readings = [];
});
export default function useReadings() {
  const [db, setDb] = useState<Db>(EMPTY_STATE);
  const loading = useLoadingEffect(async () => {
    const nextReadings = await getCachedReadings();
    setDb(nextReadings);
  }, []);
  const updateReadings = useCallback((fn:(r:Automerge.Proxy<Db>)=>void) => {
    const nextReadings = Automerge.change(db, fn);
    setDb(nextReadings);
  }, [db]);
  useEffect(() => { setCachedReadings(db); }, [db]);
  return [db, updateReadings] as const;
}
