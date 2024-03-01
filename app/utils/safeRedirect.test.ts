import {it, expect} from 'vitest';
import {safeRedirect} from './safeRedirect';

it('returns the default redirect when no destination is provided', () => {
  expect(safeRedirect(null)).toEqual('/');
});

it('allows customizing the default redirect', () => {
  expect(safeRedirect(null, '/cats')).toEqual('/cats');
});

it('returns the default redirect when a non-string destination is provided', () => {
  // @ts-expect-error Bad type intentionally passed here.
  expect(safeRedirect(5)).toEqual('/');
});

it('returns the default redirect if the destination starts with //', () => {
  expect(safeRedirect('//somewhere')).toEqual('/');
});

it('returns the default redirect if the destination does not start with a slash', () => {
  expect(safeRedirect('./foo/bar')).toEqual('/');
});

it('returns the provided value if it is a string that starts with /', () => {
  expect(safeRedirect('/coffee')).toEqual('/coffee');
});
