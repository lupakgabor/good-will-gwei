import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
// import '@testing-library/jest-dom/extend-expect';

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
	cleanup();
	vi.clearAllMocks();
	vi.resetAllMocks();
});
