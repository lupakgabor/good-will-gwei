import {mockAddress} from "@/__mocks__";
import {expect} from "vitest";
import {toast} from "react-toastify";
import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {useSendTransaction} from "../useSendTransaction";

vi.mock('react-toastify', () => {
    return {
        toast: {
            success: vi.fn(),
            warning: vi.fn(),
            error: vi.fn(),
        },
    };
});

vi.mock('alchemy-sdk', () => ({
    Alchemy: vi.fn(() => ({
        transact: {
            waitForTransaction: vi.fn(),
        },
    })),
    Network: 'test',
}));


type WrapperComponentType = {
    from: string;
    data: string;
    gas: number;
}

const WrapperComponent = ({from, data, gas}: WrapperComponentType) => {
    const {isLoading, sendTransaction} = useSendTransaction();
    return <div>
        <p>{isLoading ? 'Loading...' : 'Loaded'}</p>
        <button onClick={() => sendTransaction(from, data, gas)}>Send transaction</button>
    </div>;
};


describe('sendTransaction', () => {
    it('shows error because metamask is not installed', async () => {
        render(<WrapperComponent from={mockAddress} data='0x0' gas={100}/>);
        const button = await screen.findByRole('button');
        const text = await screen.findByText('Loaded');

        await userEvent.click(button);

        expect(text).toBeTruthy();
        expect(toast.error).toBeCalledWith('You must install Metamask, a virtual Ethereum wallet, in your browser.');
    });

    it('show error if user reverted the transaction', async () => {
        window.ethereum = {
            request: vi.fn(() => {
                throw Error("Reverted")
            })
        }
        render(<WrapperComponent from={mockAddress} data='0x0' gas={100}/>);
        const button = await screen.findByRole('button');
        const text = await screen.findByText('Loaded');

        await userEvent.click(button);

        expect(text).toBeTruthy();
        expect(toast.error).toBeCalledWith('Reverted 😥');
    });

    it('send transaction and show info', async () => {
        window.ethereum = {
            request: vi.fn(() => '0x123')
        }
        render(<WrapperComponent from={mockAddress} data='0x0' gas={100}/>);
        const button = await screen.findByRole('button');
        const text = await screen.findByText('Loaded');

        await userEvent.click(button);

        expect(text).toBeTruthy();
        expect(toast.warning).toBeCalledWith('Transactions successfully started! ⏳');
        expect(toast.success).toBeCalledWith('Transactions successfully finished! 🎉');
    });
});