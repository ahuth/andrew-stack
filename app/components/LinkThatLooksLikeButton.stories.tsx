import type {Meta, StoryObj} from '@storybook/react';
import type {ComponentProps} from 'react';
import LinkThatLooksLikeButton from './LinkThatLooksLikeButton';
import {RemixStub} from 'tests/createRemixStub';

export default {
  component: LinkThatLooksLikeButton,
  decorators: [
    (Story) => (
      <RemixStub>
        <Story />
      </RemixStub>
    ),
  ],
} satisfies Meta<typeof LinkThatLooksLikeButton>;

type Args = ComponentProps<typeof LinkThatLooksLikeButton>;

export const Primary: StoryObj<Args> = {
  args: {
    children: 'Example',
    to: 'www.example.com',
    type: 'primary',
  },
};

export const Secondary: StoryObj<Args> = {
  args: {
    ...Primary.args,
    type: 'secondary',
  },
};
