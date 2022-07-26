import { useEffect, useState } from 'react';
import Button from '../components/Button';
import formatTime from '../lib/format-time';
import { ReadingStep } from '../types';

export default function ReadingProgress(props: {
  reading: ReadingStep.InProgress;
  onSubmit: (reading: ReadingStep.Paused) => void;
}) {
  const { reading } = props;
  const [timer, setTimer] = useState<number>(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((new Date().getTime() - reading.startTime) / 1000);
    }, 1000);
    return () => clearInterval(interval);
  }, [reading]);

  return (
    <Button
      className="w-full inline-flex justify-between my-20"
      onClick={() =>
        props.onSubmit({ ...reading, endTime: new Date().getTime() })
      }
    >
      <div>Reading time: {formatTime(Math.trunc(timer))}</div>
      <div>Click to end session</div>
    </Button>
  );
}
