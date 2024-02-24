import { mockAddress } from '@/__mocks__';
import { getTransactionReceipt, interactWithContract } from '@/pages/JSONRPC/web3';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'react-toastify';
import { Mock, expect } from 'vitest';
import { Wallet, abiFunctionNamesType } from '../../types';
import { useSendTransaction } from '../useSendTransaction';

vi.mock('@/pages/JSONRPC/web3');
vi.mock('react-toastify');
const mockInteractWithContract = interactWithContract as Mock;
const mockGetTransactionReceipt = getTransactionReceipt as Mock;

type WrapperComponentType = {
	fnName: abiFunctionNamesType;
	parameters?: `0x${string}`[];
};

const WrapperComponent = ({ fnName, parameters }: WrapperComponentType) => {
	const wallet: Wallet = { address: mockAddress, privateKey: '0x4444' };
	const { isLoading, sendTransaction } = useSendTransaction(wallet);
	return (
		<div>
			<p>{isLoading ? 'Loading...' : 'Loaded'}</p>
			<button onClick={() => sendTransaction(fnName, parameters)}>Send transaction</button>
		</div>
	);
};

describe('sendTransaction', () => {
	it('send transaction without any error', async () => {
		render(<WrapperComponent fnName={'beTheManager'} />);
		const button = await screen.findByRole('button');
		const text = await screen.findByText('Loaded');
		mockInteractWithContract.mockResolvedValue('0x00023');

		await userEvent.click(button);

		expect(text).toBeTruthy();
		expect(toast.success).toBeCalledWith('Transactions successfully finished! 🎉');
		expect(toast.dismiss).toBeCalled();
	});

	it('transaction hash return with error', async () => {
		render(<WrapperComponent fnName={'beTheManager'} />);
		const button = await screen.findByRole('button');
		mockInteractWithContract.mockResolvedValue('0x00023');
		mockGetTransactionReceipt.mockRejectedValue('Hash not found!');

		await userEvent.click(button);

		expect(toast.error).toBeCalled();
		expect(toast.dismiss).toBeCalled();
	});
});
