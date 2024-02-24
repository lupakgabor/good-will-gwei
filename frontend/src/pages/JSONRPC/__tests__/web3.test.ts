import { mockAddress, mockPrivateKey } from '@/__mocks__';
import { Wallet as EWallet, ethers } from 'ethers';
import { Mock, expect, vi } from 'vitest';
import { callRPC } from '../callRPC';
import type { Wallet } from '../types';
import { createCallData, createParamsSignature, fetchContractData, interactWithContract } from '../web3';

vi.mock('@/pages/JSONRPC/callRPC');
vi.mock('ethers');

vi.mock('react-toastify');
vi.stubEnv('VITE_CONTRACT_ADDRESS', '0xCONTRACT_ADDRESS');
const mockCallRPC = callRPC as Mock;
const mockEWallet = EWallet as unknown as Mock;
const mockAbiCoder = ethers.utils.AbiCoder as unknown as Mock;
const wallet: Wallet = { address: '0xWALLET_ADDRESS', privateKey: mockPrivateKey };

describe('createParamSignature', () => {
	it('should generate signature without any params', () => {
		const signature = createParamsSignature();

		expect(signature).eq('()');
	});
	it('should generate signature without single param', () => {
		const signature = createParamsSignature(['address']);

		expect(signature).eq('(address)');
	});
	it('should generate signature without multiple params', () => {
		const signature = createParamsSignature(['address', 'uint256']);

		expect(signature).eq('(address,uint256)');
	});
});

describe('createCallData', () => {
	it('generate manager function call data', () => {
		const callData = createCallData('manager');

		expect(callData).eq('0x481c6a75');
	});

	it('generate charities function call data', () => {
		const callData = createCallData('charities', ['address'], [mockAddress]);
		expect(callData).eq('0x2478239a00000000000000000000000011111111111111E2f8BD914875FB269941111111');
	});
});

describe('interactWithContract', () => {
	it('call rpc wil simple data', async () => {
		mockCallRPC.mockResolvedValue([mockAddress]);

		const response = await interactWithContract('manager');

		expect(response).eql([mockAddress]);
		expect(mockCallRPC).toHaveBeenCalledWith('eth_call', [
			{
				data: '0x481c6a75',
				to: '0xCONTRACT_ADDRESS',
			},
		]);
	});

	it('call rpc with params', async () => {
		mockCallRPC.mockResolvedValue([mockAddress]);

		const response = await interactWithContract('charities', ['0x22222'], {
			testData: 12,
		});

		expect(response).eql([mockAddress]);
		expect(mockCallRPC).toHaveBeenCalledWith('eth_call', [
			{
				data: '0x2478239a0000000000000000000000000000000000000000000000000000000000022222',
				to: '0xCONTRACT_ADDRESS',
				testData: 12,
			},
		]);
	});

	it('send transaction with wallet to rpc', async () => {
		const mockSignTransaction = vi.fn(() => 'Signed msg');
		mockCallRPC.mockResolvedValue([mockAddress]);
		mockEWallet.mockReturnValue({
			signTransaction: mockSignTransaction,
		});

		const response = await interactWithContract(
			'beTheManager',
			['0x22222'],
			{
				testData: 12,
			},
			wallet,
		);

		expect(response).eql([mockAddress]);
		expect(mockCallRPC).toHaveBeenNthCalledWith(1, 'eth_getTransactionCount', ['0xWALLET_ADDRESS', 'latest']);
		expect(mockCallRPC).toHaveBeenNthCalledWith(2, 'eth_sendRawTransaction', ['Signed msg']);
		expect(mockSignTransaction).toHaveBeenCalledWith({
			chainId: 11155111,
			data: '0x87a677bf0000000000000000000000000000000000000000000000000000000000022222',
			maxFeePerGas: '0x174876e800',
			maxPriorityFeePerGas: '0x012a05f200',
			nonce: [mockAddress],
			testData: 12,
			to: '0xCONTRACT_ADDRESS',
			type: 2,
		});
	});
});

describe('fetchContractData', () => {
	it('fetch manager data', async () => {
		mockCallRPC.mockResolvedValue([mockAddress]);
		mockAbiCoder.mockReturnValue({ decode: () => [mockAddress] });
		const manager = await fetchContractData('manager');

		expect(manager).eq(mockAddress);
	});

	it('fetch all charities', async () => {
		mockCallRPC.mockResolvedValue(['0x123234323423452345234523452345']);
		mockAbiCoder.mockReturnValue({ decode: () => [mockAddress, '0x222'] });
		const manager = await fetchContractData('getAllCharityAddress');

		expect(manager).eql([mockAddress, '0x222']);
	});
});
