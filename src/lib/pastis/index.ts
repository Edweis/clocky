import { Buffer } from 'buffer';
import type avro from 'avsc';
import { readingSchema } from '../use-readings';
import { safeJsonParse, setEagerInterval } from './helpers';
import { getRemoteDb, setRemoteDb } from './remote-db';
import Subscriber from './subscriber';
// eslint-disable-next-line
const cache = new Map<string, Pastis<unknown>>();

function decodeAvroBuffer<T>(buffer: Buffer, type: avro.Type): T[] {
  let state = readingSchema.decode(buffer, 0);
  const result = [];
  while (state.offset > 0) {
    result.push(state.value);
    state = type.decode(buffer, state.offset);
  }
  return result;
}
export default class Pastis<T> extends Subscriber<T> {
  private path: string;

  constructor(path: string, refreshIntervalInMs: number) {
    super();
    this.path = `pastis-${path}`;
    setEagerInterval(this.path, () => this.syncRemote(), refreshIntervalInMs);
  }

  // CRUD
  get(): T[] {
    console.log('running get...');
    const localRaw = localStorage.getItem(this.path) || '[]';
    const localData = safeJsonParse(localRaw) || [];
    return localData;
  }

  append(datum: T) {
    console.log('running append...');
    const localData = this.get();
    this.setLocal([...localData, datum]);
  }

  private setLocal(data: T[]) {
    localStorage.setItem(this.path, JSON.stringify(data));
    Object.values(this.subscribers).forEach((s) => s(data));
  }

  // Remote
  private async syncRemote(): Promise<void> {
    const remoteDataAvro = await getRemoteDb<T>(`${this.path}.avro`).catch(
      (error) => {
        console.error('AVRO Failed safe:', error);
        return Buffer.from('');
      },
    );
    const remoteData = decodeAvroBuffer<T>(remoteDataAvro, readingSchema);

    const localData = this.get();
    const localVersion = localData.length;
    const remoteVersion = remoteData.length;
    console.log({ localVersion, remoteVersion });
    if (remoteVersion < localVersion) {
      const avroFile = Buffer.concat(
        localData.map((r) => readingSchema.toBuffer(r)),
      );
      await setRemoteDb(`${this.path}.avro`, avroFile);
    }
    if (localVersion < remoteVersion) this.setLocal(remoteData);
  }
}
