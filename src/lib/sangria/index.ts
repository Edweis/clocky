import { safeJsonParse, setEagerInterval } from './helpers';
import { getRemoteDb, setRemoteDb } from './remote-db';
import Subscriber from './subscriber';

// eslint-disable-next-line
const cache = new Map<string, Sangria<unknown>>();

export default class Sangria<T> extends Subscriber<T> {
  private path: string;

  constructor(path: string, period: number) {
    super();
    this.path = `sangria-${path}`;
    setEagerInterval(this.path, () => this.syncRemote(), period);
  }

  // static path<T>(path: string, period = 5000) {
  //   const cached = cache.get(path);
  //   if (cached) return cached as Sangria<T>;
  //   return new Sangria<T>(path, period);
  // }

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
    const localData = this.get();
    const currentVersion = localData.length;
    const nextVersion = remoteData.length;
    console.log({ currentVersion, nextVersion });
    if (nextVersion < currentVersion) await setRemoteDb(this.path, localData);
    if (currentVersion < nextVersion) this.setLocal(remoteData);
  }
}
