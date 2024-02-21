import {callRPC} from "../callRPC";
import {expect} from "vitest";
import {toast} from "react-toastify";

vi.mock('react-toastify', () => {
    return {
        toast: {
            error: vi.fn(),
        },
    };
});
describe('callRPC', () => {
    it('call RPC without any error', async () => {
        // @ts-ignore
        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => {
                    return Promise.resolve({
                        result: `0x123`,
                    });
                },
            })
        );

        const response = await callRPC('test', ['param1', 'param2']);

        expect(global.fetch).toHaveBeenCalledWith(import.meta.env.VITE_RPC_URL, {
            method: "POST",
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'test',
                params: ['param1', 'param2'],
            }),
        });

        expect(response).eq('0x123');
    });

    it('call RPC with RPC error', async () => {
        // @ts-ignore
        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => {
                    return Promise.resolve({
                        error: {
                            message: 'Error given by RPC Call',
                        },
                    });
                },
            })
        );

        await callRPC('test', ['param1', 'param2']);

        expect(toast.error).toBeCalledWith('Error given by RPC Call');
    });
    it('should catch unknown error', async () => {
        // @ts-ignore
        global.fetch = vi.fn(() =>
            Promise.reject('Error from communication.')
        );

        await callRPC('test', ['param1', 'param2']);

        expect(toast.error).toBeCalledWith('Unknown Error');
    });
    it('should catch communication errors', async () => {
        // @ts-ignore
        global.fetch = vi.fn(() => {
            throw Error('Error from communication.')
        });

        await callRPC('test', ['param1', 'param2']);

        expect(toast.error).toBeCalledWith('Error from communication.');
    });
})