import dayjs from 'dayjs';
import { groupBy, mapValues, max, sum } from 'lodash-es';
import formatTime from './lib/format-time';
import { Reading } from './types';

const DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
].map((d) => d.slice(0, 3));
const todayDow = dayjs().day();
const LAST_DAYS = Array(7)
  .fill(null)
  .map((e, i) => (todayDow + i + 1) % 7);
export default function Stats(props: { readings: Reading[] }) {
  const filteredReadings = props.readings.filter((r) =>
    dayjs(r.startTime).isAfter(dayjs().subtract(1, 'w').startOf('day')),
  );
  const perDay = groupBy(filteredReadings, (r) => dayjs(r.startTime).day());
  const countPerDay = mapValues(perDay, (rs) =>
    sum(rs.map((r) => r.endTime - r.startTime)),
  );
  const timePerDay = LAST_DAYS.map((e) => countPerDay[e.toString()] || 0).map(
    (e) => e / 1000,
  );
  const maxTime = max(timePerDay) || 1;
  return (
    <div className="grid grid-cols-7">
      {timePerDay.map((score, index) => (
        <div key={score} className="flex flex-col justify-end">
          <div className="flex flex-col">
            <span className="self-center">{formatTime(score)}</span>
            <div
              style={{ height: (score / maxTime) * 100 }}
              className="bg-blue-700 rounded-md w-4 self-center"
            ></div>
          </div>
          <div className=" text-center">{DAYS[LAST_DAYS[index]]}</div>
        </div>
      ))}
    </div>
  );
}
