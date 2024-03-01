import {Link as RemixLink, type LinkProps as Props} from '@remix-run/react';
import clsx from 'clsx';

/**
 * Remix link styled to look like a link (blue, underline, etc).
 */
export default function Link({className, ...props}: Props) {
  return (
    <RemixLink
      className={clsx('text-blue-700 underline', className)}
      {...props}
    />
  );
}
