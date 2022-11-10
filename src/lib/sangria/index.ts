import { Buffer } from 'buffer';
import type avro from 'avsc';
import { readingAvroType } from '../use-readings';
import { safeJsonParse, setEagerInterval } from './helpers';
import {
  getRemoteDb,
  getRemoteDbRaw,
  setRemoteDb,
  setRemoteDbRaw,
} from './remote-db';
import Subscriber from './subscriber';
// eslint-disable-next-line
const cache = new Map<string, Sangria<unknown>>();

function decodeAvroBuffer(buffer: Buffer, type: avro.Type) {
  let state = readingAvroType.decode(buffer, 0);
  const result = [];
  while (state.offset > 0) {
    result.push(state.value);
    state = type.decode(buffer, state.offset);
  }
  return result;
}
export default class Sangria<T> extends Subscriber<T> {
  private path: string;

  constructor(path: string, refreshIntervalInMs: number) {
    super();
    this.path = `sangria-${path}`;
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
    const remoteData = await getRemoteDb<T>(this.path).catch((error) => {
      console.error('Failed safe:', error);
      return [];
    });
    const remoteDataAvro = await getRemoteDbRaw<T>(`${this.path}.avro`).catch(
      (error) => {
        console.error('AVRO Failed safe:', error);
        return Buffer.from('');
      },
    );
    console.log({ remoteDataAvro }, readingAvroType.toBuffer(this.get()[0]));

    const decodedAvro = decodeAvroBuffer(remoteDataAvro, readingAvroType);
    console.log({ decodedAvro });

    const localData = this.get();
    const localVersion = localData.length;
    const remoteVersion = remoteData.length;
    console.log({ localVersion, remoteVersion });
    if (remoteVersion < localVersion) {
      console.log('XXXXXX');
      await setRemoteDb(this.path, localData);
      const avroFile = Buffer.concat(
        localData.map((r) => readingAvroType.toBuffer(r)),
      );
      await setRemoteDbRaw(`${this.path}.avro`, avroFile);
    }
    if (localVersion < remoteVersion) this.setLocal(remoteData);
  }
}
