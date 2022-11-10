import { describe, it, expect } from 'vitest';
import avro from 'avsc';

const type = avro.Type.forSchema({
  type: 'record',
  name: 'Pet',
  fields: [
    {
      name: 'kind',
      type: { type: 'enum', name: 'PetKind', symbols: ['CAT', 'DOG'] },
    },
    { name: 'name', type: 'string' },
  ],
});
describe('avro', () => {
  it('serial test', async () => {
    const obj = { kind: 'CAT', name: 'Bob' };
    const res = type.toBuffer(obj);
    console.log(res);
    expect(type.fromBuffer(res)).toEqual(obj);
  });
});
