import { Reading } from '../types';
import { SangriaReact } from './sangria/react';

export const SangriaReadings = new SangriaReact<Reading>('readings', 5000);
