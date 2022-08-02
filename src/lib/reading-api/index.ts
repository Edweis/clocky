import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Reading } from '../../types';
import { useLoadingEffect } from '../use-loading';
import { getLocalDb, setLocalDb } from './local-db';

export function useReadingsInit() {
  const [readings, setReadings] = useState<Reading[]>([]);
  // const { user } = useAuth();
  // const sub = user?.attributes.sub || 'unauth';
  const loading = useLoadingEffect(async () => {
    const nextDb = await getLocalDb<Reading[]>('readings');
    console.log('nextDb:', nextDb);
    setReadings(nextDb || []);
  }, []);
  const pushReading = useCallback(async (reading: Reading) => {
    setReadings((r) => [...r, reading]);
  }, []);
  useEffect(() => {
    if (readings.length > 0) setLocalDb('readings', readings);
  }, [readings]);
  return { readings, pushReading } as const;
}
export const ReadingsContext = createContext<
  ReturnType<typeof useReadingsInit>
  // eslint-disable-next-line @typescript-eslint/no-empty-function
>({ readings: [], pushReading: async () => {} });
export const useReadings = () => useContext(ReadingsContext);
