import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import Sangria from '.';

export class SangriaReact<T> extends Sangria<T> {
  context = createContext<T[]>([]);

  useData() {
    return useContext(this.context);
  }

  // eslint-disable-next-line class-methods-use-this
  useDataInit() {
    const [, setData] = useState<T[]>([]);
    useEffect(() => {
      const id = this.subscribe((data) => setData(data));
      return () => this.unsubscribe(id);
    });
    return this;
  }
}

// export const ReadingContext = createContext<Reading[]>([]);
// export function useReadingsInit() {
//   const [data, setData] = useState([]);
//   const sangria = Sangria.path<Reading>('readings', 5000);
//   useEffect(() => {
//     const id = sangria.subscribe((data) => setReadings(data));
//     return () => sangria.unsubscribe(id);
//   });
//   return { data, sangria };
// }
// export function useReadings() {
//   return useContext(ReadingContext);
// }
