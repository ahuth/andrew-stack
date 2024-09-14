import {type LinkProps as Props, Link as RemixLink} from '@remix-run/react';
import clsx from 'clsx';

/**
 * A re-usable link component that does all the link stuff.
 */
export default function Link({className, ...props}: Props) {
  return (
    <RemixLink
      className={clsx(
        'border border-fuchsia-500 text-blue-700 underline',
        className,
      )}
      {...props}
    />
  );
}
