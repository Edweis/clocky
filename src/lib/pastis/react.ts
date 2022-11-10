import { createContext, useContext, useEffect, useState } from 'react';
import Pastis from '.';

export class PastisReact<T> extends Pastis<T> {
  context = createContext<T[]>([]);

  useData() {
    return useContext(this.context);
  }

  // eslint-disable-next-line class-methods-use-this
  useDataInit() {
    // This can be fancier using
    // https://github.com/TanStack/query/blob/f6eeab079d88df811fd827767db1457083e85b01/packages/query-core/src/onlineManager.ts
    // and https://github.com/TanStack/query/blob/f6eeab079d88df811fd827767db1457083e85b01/packages/query-core/src/focusManager.ts
    const [, setData] = useState<T[]>([]);
    useEffect(() => this.subscribe((data) => setData(data)));
    return this;
  }
}
