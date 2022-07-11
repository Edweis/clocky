import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Button from '../components/Button';
import Input from '../components/Input';
import formatTime from '../lib/format-time';
import { InProgressReading, Reading } from '../types';

const schema:yup.SchemaOf<{endPage:number}> = yup.object({
  endPage: yup.number().min(yup.ref('$min')).required(),
}).required();
export default function ReadingProgress(props:{
    reading:InProgressReading,
    onSubmit:(reading:Reading)=>void
}) {
  const { reading } = props;
  const form = useForm({
    defaultValues: { endPage: reading.startPage },
    resolver: yupResolver(schema, { context: { min: reading.startPage } }),
  });
  const [timer, setTimer] = useState<number>(0);
  const [pausedAt, setPausedAt] = useState<number | null>(null);
  useEffect(() => {
    const interval = setInterval(() => { setTimer((t) => (t || 0) + 1); }, 1000);
    return () => clearInterval(interval);
  }, [reading]);
  if (pausedAt != null) {
    return (
      <div className="grid gap-2">
        <Input
          label="End Page"
          type="number"
          autoFocus
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          placeholder={reading.startPage.toString()}
        />
        <div className="flex justify-center">
          <Button onClick={
            form.handleSubmit(({ endPage }) => props.onSubmit({
              ...props.reading, endTime: pausedAt, endPage,
            }))
}
          >
            All good!
          </Button>
        </div>
      </div>
    );
  }
  return (
    <Button
      className="w-full inline-flex justify-between my-20"
      onClick={() => setPausedAt(new Date().getTime())}
    >
      <div>
        Reading time:
        {' '}
        {formatTime(timer)}
      </div>
      <div>Click to end session</div>
    </Button>
  );
}
