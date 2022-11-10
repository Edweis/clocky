import avro from 'avsc';
import { Reading } from '../types';
import { SangriaReact } from './sangria/react';

export const SangriaReadings = new SangriaReact<Reading>('readings', 10000);

export const readingSchema = avro.Type.forSchema({
  type: 'record',
  name: 'Reading',
  fields: [
    { name: 'book', type: 'string' },
    { name: 'startPage', type: 'int' },
    { name: 'startTime', type: 'long' },
    { name: 'endTime', type: 'long' },
    { name: 'endPage', type: 'int' },
  ],
});
