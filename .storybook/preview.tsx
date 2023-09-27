import {MantineProvider} from '@mantine/core';
import FakeTimers from '@sinonjs/fake-timers';
import type {Preview} from '@storybook/react';
import React from 'react';

// Import Mantine's styles.
import '@mantine/core/styles.css';

// Import the Tailwind styles for the app.
import '../app/tailwind.css';

// Mock dates to ensure consistent Chromatic screenshots.
FakeTimers.install({now: new Date('2023-08-26T22:26:00'), toFake: ['Date']});

export default {
  decorators: [
    (Story) => (
      <MantineProvider>
        <Story />
      </MantineProvider>
    ),
  ],
} satisfies Preview;
