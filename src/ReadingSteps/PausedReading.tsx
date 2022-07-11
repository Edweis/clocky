import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Reading, ReadingStep } from '../types';
import Input from '../components/Input';
import Button from '../components/Button';

const schema: yup.SchemaOf<{ endPage: number }> = yup
  .object({
    endPage: yup.number().min(yup.ref('$min')).required(),
  })
  .required();
export default function PausedReading(props: {
  reading: ReadingStep.Paused;
  onSubmit: (reading: Reading) => void;
}) {
  const { reading } = props;
  const form = useForm({
    defaultValues: { endPage: reading.startPage },
    resolver: yupResolver(schema),
    context: { min: reading.startPage },
  });
  console.log({ PausedReading: reading });
  return (
    <div className="grid gap-2">
      <Input
        label="End Page"
        type="number"
        autoFocus
        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
        placeholder={reading.startPage.toString()}
        {...form.register('endPage')}
      />
      <div className="flex justify-center">
        <Button
          onClick={form.handleSubmit(({ endPage }) =>
            props.onSubmit({ ...props.reading, endPage }),
          )}
        >
          All good!
        </Button>
      </div>
    </div>
  );
}
