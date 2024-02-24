import { mockAddress } from '@/__mocks__';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'react-toastify';
import { expect } from 'vitest';
import { useSendTransaction } from '../useSendTransaction';

vi.mock('react-toastify');
vi.mock('alchemy-sdk');

const WrapperComponent = () => {
	const { isLoading, sendTransaction } = useSendTransaction();
	return (
		<div>
			<p>{isLoading ? 'Loading...' : 'Loaded'}</p>
			<button onClick={() => sendTransaction(mockAddress, '0x0', 100)}>Send transaction</button>
		</div>
	);
};

describe('sendTransaction', () => {
	it('shows error because metamask is not installed', async () => {
		render(<WrapperComponent />);
		const button = await screen.findByRole('button');
		const text = await screen.findByText('Loaded');

		await userEvent.click(button);

		expect(text).toBeTruthy();
		expect(toast.error).toBeCalledWith('You must install Metamask, a virtual Ethereum wallet, in your browser.');
	});

	it('show error if user reverted the transaction', async () => {
		window.ethereum = {
			request: vi.fn(() => {
				throw Error('Reverted');
			}),
		};
		render(<WrapperComponent />);
		const button = await screen.findByRole('button');
		const text = await screen.findByText('Loaded');

		await userEvent.click(button);

		expect(text).toBeTruthy();
		expect(toast.error).toBeCalledWith('Reverted 😥');
	});

	it('send transaction and show info', async () => {
		window.ethereum = {
			request: vi.fn(() => '0x123'),
		};
		render(<WrapperComponent />);
		const button = await screen.findByRole('button');
		const text = await screen.findByText('Loaded');

		await userEvent.click(button);

		expect(text).toBeTruthy();
		expect(toast.warning).toBeCalled();
		expect(toast.error).toBeCalled();
	});
});
