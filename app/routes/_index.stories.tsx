import type {Meta, StoryObj} from '@storybook/react';
import Index from './_index';
import {RemixStub} from 'tests/createRemixStub';

export default {
  component: Index,
} satisfies Meta;

export const Default: StoryObj = {
  render: () => (
    <RemixStub>
      <Index />
    </RemixStub>
  ),
};
