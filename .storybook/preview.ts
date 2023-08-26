import FakeTimers from '@sinonjs/fake-timers';

// Import the Tailwind styles for the app.
import '../app/tailwind.css';

// Mock dates to ensure consistent Chromatic screenshots.
FakeTimers.install({now: new Date('2023-08-26T22:26:00'), toFake: ['Date']});
