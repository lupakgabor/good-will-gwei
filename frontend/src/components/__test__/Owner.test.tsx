import {render, screen, waitFor} from "@testing-library/react";
import {Owner} from "../Owner";
import {mockAddress, mockAddresses} from "@/__mocks__/Address";
import {expect} from "vitest";
import userEvent from "@testing-library/user-event";


describe('Owner', () => {
    it('should render owner correctly', async () => {
        render(<Owner color="#fff" owner={mockAddress} address={mockAddress} onBeTheOwner={vi.fn} />);

        const button = screen.queryByRole('button');
        const text = await screen.findByText("You are the owner!");

        await waitFor(() => expect(button).toBeFalsy());
        expect(text).toBeTruthy();
    });

    it('should render not owner correctly', async () => {
        const onBeTheOwner = vi.fn()
        render(<Owner color="#fff" owner={mockAddress} address={mockAddresses[1]} onBeTheOwner={onBeTheOwner} />);

        const button = await screen.findByRole('button');
        const text = await screen.findByText('Owner is: 0x1111...1111');
        await userEvent.click(button);

        expect(button).toBeTruthy();
        expect(text).toBeTruthy();
        expect(onBeTheOwner).toBeCalledWith(mockAddresses[1]);
    });

    it('should not display anything when the addresses are empty', async () => {
        render(<Owner color="#fff" owner='' address='' onBeTheOwner={vi.fn} />);

        const button = screen.queryByRole('button');
        const text = screen.queryByText('Owner is');

        await waitFor(() => expect(button).toBeFalsy());
        await waitFor(() => expect(text).toBeFalsy());
    });

    it('should disabled the button if address is missing', async () => {
        render(<Owner color="#fff" owner={mockAddress} address='' onBeTheOwner={vi.fn} />);

        const button = await screen.findByRole('button');

        expect(button).toBeDisabled()
    })
})