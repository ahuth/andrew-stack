import {composeStories} from '@storybook/react';
import {render, screen} from '@testing-library/react';
import * as stories from './TextAreaField.stories';

const {Default} = composeStories(stories);

it('uses the provided id if present', () => {
  render(<Default fieldLabel="cats" id="the-id" />);
  const input = screen.getByLabelText('cats');
  expect(input.id).toEqual('the-id');
});
