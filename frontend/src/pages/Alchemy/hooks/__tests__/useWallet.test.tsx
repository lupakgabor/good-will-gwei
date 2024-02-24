import { mockAddress, mockAddresses } from '@/__mocks__/Address';
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

type setUpEthereumProps = {
	request?: () => string[];
};
const setUpEthereum = ({ request }: setUpEthereumProps) => {
	window.ethereum = {
		request: request ?? vi.fn(() => mockAddresses),
		on: vi.fn(),
	};
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

		it('should set the address', async () => {
			setUpEthereum({});
			render(<WrapperComponent />);

			const connectWallet = await screen.findByRole('button');

			await userEvent.click(connectWallet);
			const address = await screen.findByText(mockAddress);

			expect(address).toBeTruthy();
			expect(window.ethereum.request).toBeCalledWith({ method: 'eth_accounts' });
			expect(window.ethereum.request).toBeCalledWith({ method: 'eth_requestAccounts' });
			expect(toast.error).not.toBeCalled();
		});

		it('should show a toast error when connect is clicked', async () => {
			setUpEthereum({
				request: vi.fn(() => {
					throw Error('Invalid');
				}),
			});
			render(<WrapperComponent />);
			const connectWallet = await screen.findByRole('button');
			await userEvent.click(connectWallet);
			const address = screen.queryByText(mockAddress);

			await waitFor(() => expect(address).toBeFalsy());
			expect(window.ethereum.request).toBeCalledWith({ method: 'eth_accounts' });
			expect(window.ethereum.request).toBeCalledWith({ method: 'eth_requestAccounts' });
			expect(toast.error).toBeCalledWith('Invalid 😥');
		});
	});

	describe('getCurrentWalletConnected', () => {
		it('should set address automatically', async () => {
			setUpEthereum({});
			render(<WrapperComponent />);

			const address = await screen.findByText(mockAddress);

			expect(address).toBeTruthy();
			expect(toast.error).not.toBeCalled();
		});

		it('should show a toast error when auto set is not possible', async () => {
			setUpEthereum({
				request: vi.fn(() => {
					throw Error('Invalid auto setup');
				}),
			});
			render(<WrapperComponent />);

			const address = screen.queryByText(mockAddress);

			await waitFor(() => expect(address).toBeFalsy());
			expect(window.ethereum.request).toBeCalledWith({ method: 'eth_accounts' });
			expect(toast.error).toBeCalledWith('Invalid auto setup 😥');
		});
	});
});
