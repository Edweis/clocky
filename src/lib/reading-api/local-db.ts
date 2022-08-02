import localforage from 'localforage';

export const getLocalDb = async <T>(path: string) =>
  localforage.getItem<T>(path);
export const setLocalDb = async <T>(path: string, db: T) => {
  console.log('Setting local db', { path, db });
  await localforage.setItem(path, db);
};
