import { useEffect, useState } from 'react';
import './App.css';
import { useForm } from 'react-hook-form';
import cn from 'classnames';

type InProgrssReading = {book:string, startPage:number, startTime:number }
type Reading = InProgrssReading & {endTime:number, endPage:number}
const formatTime = (elasped:number) => {
  const seconds = elasped % 60;
  const minutes = (elasped - seconds) / 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};
const HARRY = 'Harry Potter and the Order of the Phoenix';
const READINGS:Reading[] = [
  {
    book: HARRY,
    startPage: 15,
    endPage: 140,
    startTime: 1657355986444,
    endTime: 1657355986444 + 10000,
  },
];
function App() {
  const form = useForm<InProgrssReading>({
    defaultValues: READINGS[0],
  });
  const [reading, setReading] = useState<InProgrssReading|null>(null);
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
              ? form.handleSubmit((nextReading) => setReading(nextReading))
              : () => setReading(null)}
          >
            <div>
              {timer != null ? `Reading time: ${formatTime(timer)}` : 'Start reading !'}
            </div>
            {reading != null && <div>Click to end session</div>}
          </button>
        </div>
      </div>
    </div>
  );
} export default App;
