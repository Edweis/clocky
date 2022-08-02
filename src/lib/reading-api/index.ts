import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Reading } from '../../types';
import { useAuth } from '../auth';
import { useLoadingEffect } from '../use-loading';
import { getLocalDb, setLocalDb } from './local-db';
import { getRemoteDb, setRemoteDb } from './remote-db';

export function useReadingsInit() {
  const [readings, setReadings] = useState<Reading[]>([]);
  const { user } = useAuth();
  const loading = useLoadingEffect(async () => {
    const nextDb = await getLocalDb<Reading[]>('readings/data');
    const nextEtag = await getLocalDb<string>('readings/etag');
    console.log('nextDb:', { nextDb, nextEtag });
    setReadings(nextDb || []);
  }, []);
  const pushReading = useCallback(async (reading: Reading) => {
    setReadings((r) => [...r, reading]);
  }, []);
  useEffect(() => {
    if (readings.length === 0) return;
    // push readings to local database
    setLocalDb('readings', readings);
    if (user == null) return;
    // push readings to remote database
    setRemoteDb(`readings.json`, readings);
  }, [readings]);
  useEffect(() => {
    if (user == null) return;
    getRemoteDb('readings.json').then((nextDb) => setReadings(nextDb));
  }, [user == null]);
  return { readings, pushReading } as const;
}
export const ReadingsContext = createContext<
  ReturnType<typeof useReadingsInit>
  // eslint-disable-next-line @typescript-eslint/no-empty-function
>({ readings: [], pushReading: async () => {} });
export const useReadings = () => useContext(ReadingsContext);
