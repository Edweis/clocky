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
import { setRemoteDb } from './remote-db';

export function useReadingsInit() {
  const [readings, setReadings] = useState<Reading[]>([]);
  const { user } = useAuth();
  const sub = user?.attributes.sub;
  const loading = useLoadingEffect(async () => {
    const nextDb = await getLocalDb<Reading[]>('readings');
    console.log('nextDb:', nextDb);
    setReadings(nextDb || []);
  }, []);
  const pushReading = useCallback(async (reading: Reading) => {
    setReadings((r) => [...r, reading]);
  }, []);
  useEffect(() => {
    // push readings to local/remote database
    if (readings.length === 0) return;
    setLocalDb('readings', readings);
    if (sub) setRemoteDb(`${sub}/readings.json`, readings);
  }, [readings]);
  return { readings, pushReading } as const;
}
export const ReadingsContext = createContext<
  ReturnType<typeof useReadingsInit>
  // eslint-disable-next-line @typescript-eslint/no-empty-function
>({ readings: [], pushReading: async () => {} });
export const useReadings = () => useContext(ReadingsContext);
