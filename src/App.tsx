import './App.css';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useEffect, useState } from 'react';
import { ReadingStep, Reading } from './types';
import useReadings from './lib/reading-api';
import PastReads from './PastReads';
import StartReading from './ReadingSteps/StartReading';
import ReadingProgress from './ReadingSteps/ReadingProgress';

dayjs.extend(relativeTime);
const DEFAULT_READING = { book: 'Some book', endPage: 1 };

function App() {
  const [{ readings }, updateReadings] = useReadings();
  const lastReading = readings[readings.length - 1] || DEFAULT_READING;
  const [step, setStep] = useState<ReadingStep.State>({
    state: 'ready',
    data: { book: lastReading.book, startPage: lastReading.endPage },
  });
  return (
    <div className="container mx-auto pt-2 px-2 bg-yellow-100">
      <h1 className="text-3xl text-center my-2">Clocky</h1>
      <div className="grid gap-3">
        <div>
          {step.state === 'ready' && (
          <StartReading
            onSubmit={(nextReading) => {
              updateReadings((doc) => doc.readings.push(nextReading));
            }}
            reading={step.data}
          />
          )}
          {step.state === 'in-progress' && (
            <ReadingProgress />
          )}
        </div>
        <div>
          <h2 className="text-xl">Past reads</h2>
          <PastReads readings={readings} />
        </div>
      </div>
    </div>
  );
} export default App;
