import type {Meta, StoryObj} from '@storybook/react';
import type {ComponentProps} from 'react';
import TextAreaField from './TextAreaField';

export default {
  component: TextAreaField,
} satisfies Meta;

type Args = ComponentProps<typeof TextAreaField>;

export const Default: StoryObj<Args> = {
  args: {
    fieldLabel: 'Type a note',
  },
};

export const Error: StoryObj<Args> = {
  args: {
    fieldLabel: 'Type a note',
    error: 'Not that one',
  },
};
