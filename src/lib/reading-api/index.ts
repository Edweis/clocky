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
    const nextDb = await getLocalDb<Reading[]>('readings');
    console.log('nextDb:', { nextDb });
    setReadings(nextDb || []);
  }, []);
  const pushReading = useCallback(
    async (reading: Reading) => {
      const nextReadings = [...readings, reading];
      setReadings(nextReadings);
      await setLocalDb('readings', nextReadings);
      await setRemoteDb(`readings.json`, nextReadings);
    },
    [readings],
  );
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
