import {describe, it, expect} from 'vitest';
import {noteSchema} from './note.schema';

describe('noteSchema', () => {
  it('parses', () => {
    const result = noteSchema.parse({
      title: 'title',
      body: 'body',
    });

    expect(result).toEqual({
      title: 'title',
      body: 'body',
    });
  });

  it('requires title', () => {
    const result = noteSchema.safeParse({
      title: undefined,
      body: 'body',
    });

    expect(result.success).toBe(false);
  });

  it('does not allow an empty string as the title', () => {
    const result = noteSchema.safeParse({
      title: '',
      body: 'body',
    });

    expect(result.success).toBe(false);
  });

  it('requires body', () => {
    const result = noteSchema.safeParse({
      title: 'title',
      body: undefined,
    });

    expect(result.success).toBe(false);
  });

  it('does not allow an empty string as the body', () => {
    const result = noteSchema.safeParse({
      title: 'title',
      body: '',
    });

    expect(result.success).toBe(false);
  });
});
