import {createTheme} from '@mantine/core';

/**
 * https://mantine.dev/theming/theme-object/
 */
export default createTheme({
  // Use Indigo instead of Blue as the primary color.
  primaryColor: 'indigo',
  // Darken the light color scheme shades a bit, to pass WCAG AA color contrast requirements.
  primaryShade: {light: 7, dark: 8},
  // Make text slightly bigger than the default.
  scale: 1.1,
});
