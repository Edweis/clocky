import './App.css';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useEffect, useState } from 'react';
import { ReadingStep } from './types';
import useReadings from './lib/reading-api';
import PastReads from './PastReads';
import StartReading from './ReadingSteps/StartReading';
import ReadingProgress from './ReadingSteps/ReadingProgress';
import PausedReading from './ReadingSteps/PausedReading';
import Stats from './Stats';

dayjs.extend(relativeTime);
const DEFAULT_READING = { book: 'Some book', endPage: 1 };

function App() {
  const [{ readings }, updateReadings] = useReadings();
  const lastReading = readings[readings.length - 1] || DEFAULT_READING;
  const DEFAULT_STEP = {
    state: 'ready' as const,
    data: { book: lastReading.book, startPage: lastReading.endPage },
  };
  const [step, setStep] = useState<ReadingStep.State>(DEFAULT_STEP);
  useEffect(() => {
    setStep(DEFAULT_STEP);
  }, [lastReading.startTime]);
  console.log('App', { step });
  return (
    <div className="container mx-auto pt-2 px-2 bg-yellow-400">
      <h1 className="text-5xl text-center my-6">Clocky</h1>
      <div className="grid gap-4">
        <div className="h-[40vh] flex flex-col justify-center">
          {step.state === 'ready' && (
            <StartReading
              onSubmit={(data) =>
                setStep({ state: 'in-progress' as const, data })
              }
              reading={step.data}
            />
          )}
          {step.state === 'in-progress' && (
            <ReadingProgress
              onSubmit={(data) => setStep({ state: 'paused', data })}
              reading={step.data}
            />
          )}
          {step.state === 'paused' && (
            <PausedReading
              onSubmit={(data) => {
                updateReadings((doc) => doc.readings.push(data));
                setStep({ state: 'ready', data });
              }}
              reading={step.data}
            />
          )}
        </div>
        <div>
          <h2 className="text-xl">Streak</h2>
          <Stats readings={readings} />
        </div>
        <div>
          <h2 className="text-xl">Past reads</h2>
          <PastReads readings={readings} />
        </div>
      </div>
    </div>
  );
}
export default App;
