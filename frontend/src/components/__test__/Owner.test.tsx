import {render, screen, waitFor} from "@testing-library/react";
import {Manager} from "../Manager";
import {mockAddress, mockAddresses} from "@/__mocks__/Address";
import {expect} from "vitest";
import userEvent from "@testing-library/user-event";


describe('Manager', () => {
    it('should render manager correctly', async () => {
        render(<Manager color="#fff" manager={mockAddress} address={mockAddress} onBeTheManager={vi.fn} />);

        const button = screen.queryByRole('button');
        const text = await screen.findByText("You are the manager!");

        await waitFor(() => expect(button).toBeFalsy());
        expect(text).toBeTruthy();
    });

    it('should render not manager correctly', async () => {
        const onBeTheManager = vi.fn()
        render(<Manager color="#fff" manager={mockAddress} address={mockAddresses[1]} onBeTheManager={onBeTheManager} />);

        const button = await screen.findByRole('button');
        const text = await screen.findByText('Manager is: 0x1111...1111');
        await userEvent.click(button);

        expect(button).toBeTruthy();
        expect(text).toBeTruthy();
        expect(onBeTheManager).toBeCalledWith(mockAddresses[1]);
    });

    it('should not display anything when the addresses are empty', async () => {
        render(<Manager color="#fff" manager='' address='' onBeTheManager={vi.fn} />);

        const button = screen.queryByRole('button');
        const text = screen.queryByText('Manager is');

        await waitFor(() => expect(button).toBeFalsy());
        await waitFor(() => expect(text).toBeFalsy());
    });

    it('should disabled the button if address is missing', async () => {
        render(<Manager color="#fff" manager={mockAddress} address='' onBeTheManager={vi.fn} />);

        const button = await screen.findByRole('button');

        expect(button).toBeDisabled()
    })
})