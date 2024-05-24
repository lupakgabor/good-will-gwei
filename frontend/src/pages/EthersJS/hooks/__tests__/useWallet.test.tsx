import { mockAddress } from '@/__mocks__/Address';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'react-toastify';
import { expect } from 'vitest';
import { useWallet } from '../useWallet';

vi.mock('react-toastify');

const WrapperComponent = () => {
	const { walletAddress, connectWallet } = useWallet();
	return (
		<div>
			<p>{walletAddress}</p>
			<button onClick={connectWallet}>Connect Wallet</button>
		</div>
	);
};

describe('useWallet', () => {
	describe('connectWallet', () => {
		it('should show a toast to install Metamask', async () => {
			window.ethereum = undefined;
			render(<WrapperComponent />);
			const connectWallet = await screen.findByRole('button');

			await userEvent.click(connectWallet);
			const address = screen.queryByText(mockAddress);

			await waitFor(() => expect(address).toBeFalsy());
			expect(toast.error).toBeCalledWith('You must install Metamask, a virtual Ethereum wallet, in your browser.');
		});
	});
});
