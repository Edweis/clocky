import dayjs from 'dayjs';
import formatTime from '../lib/format-time';
import useReadings from '../lib/reading-api';
import type { Reading } from '../types';

const computeSpeed = (reading: Reading) => {
  const pages = reading.endPage - reading.startPage;
  const timeInMs = reading.endTime - reading.startTime;
  const timeInMin = timeInMs / 1000 / 60;
  return (timeInMin / pages).toFixed(2);
};
export default function PastReads() {
  const [{ readings }] = useReadings();
  const reversed = [...readings].reverse();
  if (reversed.length === 0) return <div>No past reads</div>;
  return (
    <ul className="divide-y divide-black border border-black">
      {reversed.map((r) => (
        <li key={r.startTime} className="py-4 flex">
          <div className="mx-3 w-full">
            <p className="flex justify-between text-sm font-medium text-gray-900">
              <span>
                {formatTime((r.endTime - r.startTime) / 1000)}
                {' - page '}
                {r.startPage}-{r.endPage}
              </span>
              <span>{computeSpeed(r)} min/pages</span>
            </p>
            <p className="flex justify-between text-sm text-gray-700">
              <span className="max-w-[60%] truncate">{r.book}</span>
              <span>{dayjs(r.startTime).fromNow()}</span>
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
