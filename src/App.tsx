import { useEffect, useState } from 'react';
import './App.css';
import { useForm } from 'react-hook-form';
import cn from 'classnames';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Reading, InProgressReading } from './types';
import useReadings from './lib/reading-api';

dayjs.extend(relativeTime);
const formatTime = (elasped:number) => {
  const rounded = Math.floor(elasped);
  const seconds = rounded % 60;
  const minutes = (rounded - seconds) / 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};
const computeSpeed = (reading:Reading) => {
  const pages = reading.endPage - reading.startPage;
  const timeInMs = reading.endTime - reading.startTime;
  const timeInMin = timeInMs / 1000 / 60;
  return (timeInMin / pages).toFixed(2);
};
const DEFAULT_READING = { book: 'Some book', startPage: 1 };
function App() {
  const [{ readings }, updateReadings] = useReadings();

  const lastReading = readings[readings.length - 1] || DEFAULT_READING;
  const form = useForm<InProgressReading>({
    defaultValues: {
      book: lastReading.book,
      startPage: lastReading.endPage,
    },
  });
  const [reading, setReading] = useState<InProgressReading|null>(null);
  const [timer, setTimer] = useState<number|null>(null);
  useEffect(() => {
    if (reading == null) return setTimer(null);
    setTimer(0);
    const interval = setInterval(() => { setTimer((t) => (t || 0) + 1); }, 1000);
    return () => clearInterval(interval);
  }, [reading]);
  return (
    <div className="container mx-auto mt-2 px-2">
      <h1 className="text-2xl text-center">Clocky</h1>
      <div className="grid gap-3">
        <div>
          <h2 className="text-xl">Start new read</h2>
          <label htmlFor="book" className="block text-sm font-medium text-gray-700">
            Book Name
          </label>
          <div className="mt-1">
            <input
              id="book"
              disabled={reading != null}
              type="text"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Harry Potter and the Order of the Phoenix"
              {...form.register('book')}
            />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Page start
          </label>
          <div className="mt-1">
            <input
              type="number"
              disabled={reading != null}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="130"
              {...form.register('startPage')}
            />
          </div>
        </div>
        <div className="flex justify-center mt-3">
          <button
            type="button"
            className={cn(
              { 'w-full': reading != null },
              'text-center inline-flex justify-between items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-black bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
            )}
            onClick={reading == null
              ? form.handleSubmit((nextReading) => setReading({
                ...nextReading,
                startTime: new Date().getTime(),
              }))
              : () => {
                updateReadings((doc) => {
                  doc.readings.push({
                    ...reading,
                    endPage: reading.startPage + 10,
                    endTime: new Date().getTime(),
                  });
                });
                setReading(null);
              }}
          >
            <div>
              {timer != null ? `Reading time: ${formatTime(timer)}` : 'Start reading !'}
            </div>
            {reading != null && <div>Click to end session</div>}
          </button>
        </div>
        <div>
          <h2 className="text-xl">Past reads</h2>
          <ul className="divide-y divide-gray-200 border">
            {/* {loading && <li className="py-4 flex"> ... </li>} */}
            {[...readings].reverse().map((r) => (
              <li key={r.startTime} className="py-4 flex">
                <div className="mx-3 w-full">
                  <p className="flex justify-between text-sm font-medium text-gray-900">
                    <span>
                      {formatTime((r.endTime - r.startTime) / 1000)}
                      {' - page '}
                      {r.startPage}
                      -
                      {r.endPage}
                    </span>
                    <span>
                      {computeSpeed(r)}
                      {' '}
                      min/pages
                    </span>

                  </p>
                  <p className="flex justify-between text-sm text-gray-500">
                    <span className="max-w-[60%] truncate">
                      {r.book}
                    </span>
                    <span>
                      {dayjs(r.startTime).fromNow()}
                    </span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
} export default App;
