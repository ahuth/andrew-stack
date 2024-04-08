import type {Meta, StoryObj} from '@storybook/react';
import {RemixStub} from 'tests/createRemixStub';
import Index from './_index';

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
