import type {Meta, StoryObj} from '@storybook/react';
import type {ComponentProps} from 'react';
import {RemixStub} from 'tests/createRemixStub';
import Link from './Link';

export default {
  component: Link,
  decorators: [
    (Story) => (
      <RemixStub>
        <Story />
      </RemixStub>
    ),
  ],
} satisfies Meta;

type Args = ComponentProps<typeof Link>;

export const Default: StoryObj<Args> = {
  args: {
    children: 'hello world',
    to: 'https://www.example.com',
  },
};
