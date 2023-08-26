import type {Meta, StoryObj} from '@storybook/react';
import type {ComponentProps} from 'react';
import InputField from './InputField';

export default {
  component: InputField,
} satisfies Meta;

type Args = ComponentProps<typeof InputField>;

export const Default: StoryObj<Args> = {
  args: {
    fieldLabel: 'Coffee?',
  },
};

export const Error: StoryObj<Args> = {
  args: {
    fieldLabel: 'Coffee?',
    error: 'Moar!',
  },
};
