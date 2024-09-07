import {useMatchesData} from './useMatchesData';
import type {User} from '~/models/user.server';

export function useUser(): User {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error(
      'No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead.',
    );
  }
  return maybeUser;
}

export function useOptionalUser(): User | undefined {
  const data = useMatchesData('root');
  if (!data || !isUser(data.user)) {
    return undefined;
  }
  return data.user;
}

function isUser(user: unknown): user is User {
  return (
    !!user &&
    typeof user === 'object' &&
    'email' in user &&
    typeof user.email === 'string'
  );
}
