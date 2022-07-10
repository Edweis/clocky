import './App.css';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { InProgressReading } from './types';
import useReadings from './lib/reading-api';
import PastReads from './PastReads';
import StartReading from './StartReading';

dayjs.extend(relativeTime);

function App() {
  const [{ readings }, updateReadings] = useReadings();

  const saveReading = async (nextReading:InProgressReading) => {
    updateReadings((doc) => {
      doc.readings.push({
        ...nextReading,
        endPage: Number(nextReading.startPage) + 10,
        endTime: new Date().getTime(),
      });
    });
  };
  return (
    <div className="container mx-auto mt-2 px-2">
      <h1 className="text-2xl text-center">Clocky</h1>
      <div className="grid gap-3">
        <div>
          <StartReading
            onSubmit={saveReading}
            lastReading={readings[readings.length - 1] || null}
          />
        </div>
        <div>
          <h2 className="text-xl">Past reads</h2>
          <PastReads readings={readings} />
        </div>
      </div>
    </div>
  );
} export default App;
