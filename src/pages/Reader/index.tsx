import { useEffect, useState } from 'react';
import useReadings from '../../lib/reading-api';
import { ReadingStep } from '../../types';
import PausedReading from '../ReadingSteps/PausedReading';
import ReadingProgress from '../ReadingSteps/ReadingProgress';
import StartReading from '../ReadingSteps/StartReading';

const DEFAULT_READING = { book: 'Some book', endPage: 1 };

export default function Reader() {
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

  if (step.state === 'ready')
    return (
      <StartReading
        onSubmit={(data) => setStep({ state: 'in-progress' as const, data })}
        reading={step.data}
      />
    );
  if (step.state === 'in-progress')
    return (
      <ReadingProgress
        onSubmit={(data) => setStep({ state: 'paused', data })}
        reading={step.data}
      />
    );
  if (step.state === 'paused')
    return (
      <PausedReading
        onSubmit={(data) => {
          updateReadings((doc) => doc.readings.push(data));
          setStep({ state: 'ready', data });
        }}
        reading={step.data}
      />
    );
  throw Error('state is unknown');
}
