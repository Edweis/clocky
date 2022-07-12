import dayjs from 'dayjs';
import { Reading } from './types';

const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
].map((d) => d.slice(0, 3));
const LAST_DAYS = [...DAYS, ...DAYS];
const now = dayjs().startOf('d');
const rdTime = () => 30 + 10 * (Math.random() - 0.5);
export default function Stats(props: { readings: Reading[] }) {
  const data = Array(7)
    .fill(null)
    .map((e, i) => rdTime());
  return (
    <div className="grid grid-cols-7">
      {DAYS.map((d, index) => (
        <div key={d} className="flex flex-col justify-end">
          <div style={{ height: data[6 - index] * 5 }} className="bg-blue-500">
            {data[6 - index].toFixed(2)}
          </div>
          <div className="bg-green-400 text-center">{d}</div>
        </div>
      ))}
    </div>
  );
}
