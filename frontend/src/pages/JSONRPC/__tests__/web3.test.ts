import {createCallData, createParamsSignature, fetchContractData} from "../web3";

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


describe('fetchContractData', () => {
    it('fetch manager data', async () => {
        // @ts-ignore
        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => {
                    return Promise.resolve({
                        result: `0x${'123'.padStart(64, '0')}`,
                    });
                },
            })
        );
        const manager = await fetchContractData('manager');

        expect(manager).eq(`0x${'123'.padStart(40, '0')}`);
    });
});