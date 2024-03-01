import {describe, it, expect} from 'vitest';
import {loginSchema} from './user.schema';

describe('loginSchema', () => {
  it('parses', () => {
    const result = loginSchema.parse({
      email: 'jane@example.com',
      password: 'coffee is life',
    });

    expect(result).toEqual({
      email: 'jane@example.com',
      password: 'coffee is life',
    });
  });

  it('requires an email address', () => {
    const result = loginSchema.safeParse({
      email: undefined,
      password: 'coffee is life',
    });

    if (result.success) {
      throw new Error('Expected result.success to be false');
    }

    expect(result.error.issues[0].message).toEqual('Email is required');
  });

  it('requires a valid email address', () => {
    const result = loginSchema.safeParse({
      email: 'hi',
      password: 'coffee is life',
    });

    if (result.success) {
      throw new Error('Expected result.success to be false');
    }

    expect(result.error.issues[0].message).toEqual('Email is invalid');
  });

  it('requires a password', () => {
    const result = loginSchema.safeParse({
      email: 'jane@example.com',
      password: undefined,
    });

    if (result.success) {
      throw new Error('Expected result.success to be false');
    }

    expect(result.error.issues[0].message).toEqual('Password is required');
  });
});
