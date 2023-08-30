import {composeStories} from '@storybook/react';
import {render, screen} from '@testing-library/react';
import * as stories from './InputField.stories';

const {Default} = composeStories(stories);

it('uses the provided id if present', () => {
  render(<Default fieldLabel="coffee" id="the-id" />);
  const input = screen.getByLabelText('coffee');
  expect(input.id).toEqual('the-id');
});
