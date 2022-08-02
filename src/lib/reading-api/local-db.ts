import localforage from 'localforage';

export const getLocalDb = async <T>(path: string) =>
  localforage.getItem<T>(path);
export const setLocalDb = async <T>(path: string, db: T) =>
  localforage.setItem(path, db);
