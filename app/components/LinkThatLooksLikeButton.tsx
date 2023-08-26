import {Link} from '@remix-run/react';
import clsx from 'clsx';
import type {ComponentProps} from 'react';

const styles = {
  // prettier-ignore
  primary: 'bg-blue-600 text-white hover:bg-blue-800',
  // prettier-ignore
  secondary: 'border border-blue-600 bg-white text-blue-700 hover:bg-blue-800 hover:text-white',
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
        'flex items-center justify-center rounded-md px-4 py-3 font-medium',
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
