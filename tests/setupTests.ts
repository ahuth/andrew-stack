import {installGlobals} from '@remix-run/node';
import '@testing-library/jest-dom';

installGlobals();

// Silence a React log about its dev tools during tests.
// @ts-expect-error
globalThis.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {isDisabled: true};
