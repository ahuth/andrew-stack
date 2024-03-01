import {it, expect} from 'vitest';
import {loader} from './health';

it('returns ok', () => {
  const result = loader();
  expect(result.status).toEqual(200);
});
