import {installGlobals} from '@remix-run/node';
import '@testing-library/jest-dom/vitest';

installGlobals();

// @ts-expect-error Silence a React log about its dev tools during tests.
globalThis.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {isDisabled: true};
