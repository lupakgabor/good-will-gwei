import {expect, Mock, vi} from "vitest";
import {ethers, Wallet as EWallet} from "ethers";
import {createCallData, createParamsSignature, fetchContractData, interactWithContract} from "../web3";
import {callRPC} from "../callRPC";
import type {Wallet} from "../types";


vi.mock("@/pages/JSONRPC/callRPC");
vi.mock('ethers');

vi.mock('react-toastify');
vi.stubEnv('VITE_CONTRACT_ADDRESS', '0x123456789')
const mockCallRPC = callRPC as Mock;
const mockEWallet = EWallet as unknown as Mock;
const mockAbiCoder = ethers.utils.AbiCoder as unknown as Mock;
const wallet: Wallet = {address: '0x111', privateKey: '0x4444'}

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
        const address = '0x0012';
        const callData = createCallData('charities',
            ['address'],
            [address]
        );
        expect(callData).eq('0x2478239a0000000000000000000000000000000000000000000000000000000000000012');
    });
});


describe('interactWithContract', () => {
    it('call rpc wil simple data', async () => {
        mockCallRPC.mockResolvedValue(['0x123']);

        const response = await interactWithContract('manager');

        expect(response).eql(['0x123']);
        expect(mockCallRPC).toHaveBeenCalledWith('eth_call', [{
            "data": "0x481c6a75",
            "to": "0x123456789",
        }])
    });

    it('call rpc with params', async () => {
        mockCallRPC.mockResolvedValue(['0x123']);

        const response = await interactWithContract('charities', ['0x22222'], {
            'testData': 12,
        });

        expect(response).eql(['0x123']);
        expect(mockCallRPC).toHaveBeenCalledWith('eth_call', [{
            "data": "0x2478239a0000000000000000000000000000000000000000000000000000000000022222",
            "to": "0x123456789",
            'testData': 12,
        }]);
    });

    it('send transaction with wallet to rpc', async () => {

        const mockSignTransaction = vi.fn(() => 'Signed msg');
        mockCallRPC.mockResolvedValue(['0x123']);
        mockEWallet.mockReturnValue({
            signTransaction: mockSignTransaction,
        })

        const response = await interactWithContract('beTheManager', ['0x22222'], {
            'testData': 12,
        }, wallet);

        expect(response).eql(['0x123']);
        expect(mockCallRPC).toHaveBeenNthCalledWith(1, 'eth_getTransactionCount', [
            "0x111",
            "latest",
        ]);
        expect(mockCallRPC).toHaveBeenNthCalledWith(2, 'eth_sendRawTransaction', [
            'Signed msg'
        ]);
        expect(mockSignTransaction).toHaveBeenCalledWith({
            "chainId": 11155111,
            "data": "0x87a677bf0000000000000000000000000000000000000000000000000000000000022222",
            "maxFeePerGas": "0x174876e800",
            "maxPriorityFeePerGas": "0x012a05f200",
            "nonce": [
                "0x123",
            ],
            "testData": 12,
            "to": "0x123456789",
            "type": 2,
        })
    });
});

describe('fetchContractData', () => {
    it('fetch manager data', async () => {
        mockCallRPC.mockResolvedValue(['0x123']);
        mockAbiCoder.mockReturnValue({decode: () => ['0x123']});
        const manager = await fetchContractData('manager');

        expect(manager).eq('0x123');
    });

    it('fetch all charities', async () => {
        mockCallRPC.mockResolvedValue(['0x123234323423452345234523452345']);
        mockAbiCoder.mockReturnValue({decode: () => ['0x123', '0x222']});
        const manager = await fetchContractData('getAllCharityAddress');

        expect(manager).eql(['0x123', '0x222']);
    });
});
