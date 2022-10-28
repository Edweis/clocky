import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ReadingStep } from '../../types';
import Button from '../../components/Button';
import Input from '../../components/Input';

const schema = yup
  .object({
    book: yup.string().required(),
    startPage: yup.number().min(0).max(5000).required(),
  })
  .required();
export default function StartReading(props: {
  onSubmit: (reading: ReadingStep.InProgress) => void;
  reading: ReadingStep.Ready;
}) {
  const form = useForm({
    defaultValues: props.reading,
    resolver: yupResolver(schema),
  });
  useEffect(() => {
    form.reset(props.reading);
  }, [props.reading]);

  return (
    <div className="grid gap-3">
      <Input type="text" placeholder="Book name" {...form.register('book')} />
      <Input
        type="number"
        autoFocus
        placeholder="Page Start"
        inputMode="decimal"
        {...form.register('startPage')}
      />
      <div className="flex justify-center mt-3">
        <Button
          onClick={form.handleSubmit((nextReading) =>
            props.onSubmit({
              ...nextReading,
              startTime: new Date().getTime(),
            }),
          )}
        >
          Start reading !
        </Button>
      </div>
    </div>
  );
}
