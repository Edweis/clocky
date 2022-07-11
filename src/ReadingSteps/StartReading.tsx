import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { from } from 'automerge';
import { InProgressReading, Reading } from '../types';
import Button from '../components/Button';
import ReadingProgress from './ReadingProgress';
import Input from '../components/Input';

const DEFAULT_READING = { book: 'Some book', endPage: 1 };
export default function StartReading(props:{
    onSubmit:(reading:Reading)=>void,
     lastReading:Reading|null}) {
  const form = useForm<Pick<Reading, 'book'| 'startPage'>>();

  const [reading, setReading] = useState<InProgressReading|null>(null);
  useEffect(() => {
    // reset fields when readings changes
    const lastReading = props.lastReading || DEFAULT_READING;
    console.log({ lastReading }, 'value Set ');
    form.reset({
      book: lastReading.book,
      startPage: lastReading.endPage,
    });
  }, [props.lastReading]);

  if (reading != null) {
    return (
      <ReadingProgress
        reading={reading}
        onSubmit={(nextReading) => {
          props.onSubmit(nextReading);
          setReading(null);
        }}
      />
    );
  }
  return (
    <div>
      <Input
        label="Book name"
        disabled={reading != null}
        type="text"
        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
        placeholder="Harry Potter and the Order of the Phoenix"
        {...form.register('book')}
      />
      <Input
        label="Page start"
        type="number"
        disabled={reading != null}
        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
        placeholder="130"
        {...form.register('startPage')}
      />
      <div className="flex justify-center mt-3">
        <Button onClick={form.handleSubmit((nextReading) => setReading({
          ...nextReading,
          startTime: new Date().getTime(),
        }))}
        >
          Start reading !
        </Button>
      </div>
    </div>
  );
}
