import {render, screen} from "@testing-library/react";
import {CharityCard} from "@/components";
import {mockAddresses, mockCharity} from "@/__mocks__";
import {expect} from "vitest";
import userEvent from "@testing-library/user-event";

const setUp = (walletAddress: string = '', owner: string = '') => {
    const onDonate = vi.fn();
    const onWithdraw = vi.fn();
    const onRemove = vi.fn();
    render(<CharityCard
        {...mockCharity}
        onDonate={onDonate}
        onWithdraw={onWithdraw}
        onRemove={onRemove}
        walletAddress={walletAddress}
        owner={owner}
    />)

    return {
        onDonate,
        onWithdraw,
        onRemove,
    }
}

describe('CharityCard', () => {
    it('should render without any provided address and disable all interaction', async () => {
        setUp()

        const donate = await screen.findByRole('button', {name: 'Donate'});
        const withdraw = await screen.findByRole('button', {name: 'Withdraw'});
        const remove = await screen.findByRole('button', {name: 'Remove'});

        expect(donate).toBeDisabled();
        expect(withdraw).toBeDisabled();
        expect(remove).toBeDisabled();
    });

    it('should only allow to Donate when wallet address provided', async () => {
        setUp(mockAddresses[1]);
        const donate = await screen.findByRole('button', {name: 'Donate'});
        const withdraw = await screen.findByRole('button', {name: 'Withdraw'});
        const remove = await screen.findByRole('button', {name: 'Remove'});

        expect(donate).toBeEnabled();
        expect(withdraw).toBeDisabled();
        expect(remove).toBeDisabled();
    });

    it('should only allow to Donate and Remove when we are the owner', async () => {
        const {onRemove} = setUp(mockAddresses[1], mockAddresses[1]);

        const donate = await screen.findByRole('button', {name: 'Donate'});
        const withdraw = await screen.findByRole('button', {name: 'Withdraw'});
        const remove = await screen.findByRole('button', {name: 'Remove'});

        await userEvent.click(remove);
        await userEvent.click(await screen.findByRole('button', {name: 'Yes'}));

        expect(onRemove).toBeCalledWith(mockCharity.withdrawAddress);
        expect(donate).toBeEnabled();
        expect(withdraw).toBeDisabled();
        expect(remove).toBeEnabled();
    });

    it('should only allow to Donate and Withdraw when address is the charityAddress', async () => {
        const {onWithdraw} = setUp(mockCharity.withdrawAddress, mockAddresses[1])

        const donate = await screen.findByRole('button', {name: 'Donate'});
        const withdraw = await screen.findByRole('button', {name: 'Withdraw'});
        const remove = await screen.findByRole('button', {name: 'Remove'});

        await userEvent.click(withdraw);
        await userEvent.click(await screen.findByRole('button', {name: 'Yes'}));

        expect(onWithdraw).toBeCalledWith();

        expect(donate).toBeEnabled();
        expect(withdraw).toBeEnabled();
        expect(remove).toBeDisabled();
    });
})