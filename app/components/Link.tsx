import {Link as RemixLink, type LinkProps as Props} from '@remix-run/react';
import clsx from 'clsx';

/**
 * A re-usable link component that does all the link stuff.
 */
export default function Link({className, ...props}: Props) {
  return (
    <RemixLink
      className={clsx('text-blue-700 underline', className)}
      {...props}
    />
  );
}
