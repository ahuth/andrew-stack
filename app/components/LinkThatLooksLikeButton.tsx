import {Link} from '@remix-run/react';
import clsx from 'clsx';
import type {ComponentProps} from 'react';

const styles = {
  // prettier-ignore
  primary: 'bg-blue-500 px-4 py-3 font-medium text-white hover:bg-blue-600',
  // prettier-ignore
  secondary: 'border border-transparent bg-white px-4 py-3 text-base font-medium text-blue-700 shadow-sm hover:bg-blue-50 sm:px-8',
};

type Props = ComponentProps<typeof Link> & {
  type?: 'primary' | 'secondary';
};

export default function LinkThatLooksLikeButton({
  children,
  className,
  type,
  ...rest
}: Props) {
  return (
    <Link
      className={clsx(
        'flex items-center justify-center rounded-md',
        !type && styles.secondary,
        type === 'secondary' && styles.secondary,
        type === 'primary' && styles.primary,
        className,
      )}
      {...rest}
    >
      {children}
    </Link>
  );
}
