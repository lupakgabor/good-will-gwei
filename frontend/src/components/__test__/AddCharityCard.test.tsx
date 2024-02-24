import { AddCharityCard } from '@/components';
import { render, screen, waitFor } from '@testing-library/react';

describe('AddCharityCard', () => {
	it('should render correctly', async () => {
		const onClick = vi.fn();
		render(<AddCharityCard disabled={false} onClick={onClick} />);

		const overlay = screen.queryByTestId('overlay');
		const text = await screen.findByText('Add new charity!');

		await waitFor(() => expect(overlay).toBeFalsy());
		expect(text).toBeTruthy();
	});

	it('should render an overlay when disabled', async () => {
		const onClick = vi.fn();
		render(<AddCharityCard disabled onClick={onClick} />);

		const overlay = screen.findByTestId('overlay');

		expect(overlay).toBeTruthy();
	});
});
