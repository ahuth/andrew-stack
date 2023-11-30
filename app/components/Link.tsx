import JoyLink from '@mui/joy/Link';
import {Link as RemixLink} from '@remix-run/react';
import type {ComponentProps} from 'react';

type Props = ComponentProps<typeof RemixLink> & ComponentProps<typeof JoyLink>;

/**
 * Combination of the [Mantine Anchor](https://mantine.dev/core/anchor/) and [Remix Link](https://remix.run/docs/en/main/components/link).
 *
 * Needed so we get the Mantine styling but tie into react-router properly.
 */
export default function Link(props: Props) {
  return <JoyLink component={RemixLink} underline="always" {...props} />;
}
