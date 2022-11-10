import avro from 'avsc';
import { Reading } from '../types';
import { SangriaReact } from './sangria/react';

export const SangriaReadings = new SangriaReact<Reading>('readings', 10000);

/**
 * {
    book: string;
    startPage: number;
    startTime: number;
    endTime: number;
    endPage: number;
  }
 */
export const readingAvroType = avro.Type.forSchema({
  type: 'record',
  name: 'Pet',
  fields: [
    { name: 'book', type: 'string' },
    { name: 'startPage', type: 'int' },
    { name: 'startTime', type: 'long' },
    { name: 'endTime', type: 'long' },
    { name: 'endPage', type: 'int' },
  ],
});
