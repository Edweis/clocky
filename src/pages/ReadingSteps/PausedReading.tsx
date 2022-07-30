import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Reading, ReadingStep } from '../../types';
import Input from '../../components/Input';
import Button from '../../components/Button';

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
    resolver: yupResolver(schema),
    context: { min: reading.startPage },
  });
  console.log({ PausedReading: reading });

  return (
    <div className="grid gap-4">
      <Input
        label="End Page"
        type="number"
        autoFocus
        inputMode="decimal"
        placeholder={`Started from page ${reading.startPage.toString()} until page ...`}
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
