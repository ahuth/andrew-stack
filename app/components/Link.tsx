import {Anchor, type AnchorProps} from '@mantine/core';
import {Link as RemixLink} from '@remix-run/react';
import type {ComponentProps} from 'react';

type Props = ComponentProps<typeof RemixLink> & AnchorProps;

/**
 * Combination of the [Mantine Anchor](https://mantine.dev/core/anchor/) and [Remix Link](https://remix.run/docs/en/main/components/link).
 *
 * Needed so we get the Mantine styling but tie into react-router properly.
 */
export default function Link(props: Props) {
  return <Anchor component={RemixLink} underline="always" {...props} />;
}
