import {render, screen, waitFor} from "@testing-library/react";
import {Owner} from "../Owner";
import {mockAddress, mockAddresses} from "@/__mocks__/Address";
import {expect} from "vitest";


describe('Owner', () => {
    it('should render owner correctly', async () => {
        render(<Owner color="#fff" owner={mockAddress} address={mockAddress} />);

        const button = screen.queryByRole('button');
        const text = await screen.findByText("You are the owner!");

        await waitFor(() => expect(button).toBeFalsy());
        expect(text).toBeTruthy();
    });

    it('should render not owner correctly', async () => {
        render(<Owner color="#fff" owner={mockAddress} address={mockAddresses[1]} />);

        const button = await screen.findByRole('button');
        const text = await screen.findByText('Owner is: 0x1111...1111');

        expect(button).toBeTruthy();
        expect(text).toBeTruthy();
    });

      it('should render not owner correctly when address is empty', async () => {
        render(<Owner color="#fff" owner={mockAddress} address='' />);

        const button = screen.queryByRole('button');
        const text = screen.queryByText('Owner is');

        await waitFor(() => expect(button).toBeFalsy());
        await waitFor(() => expect(text).toBeFalsy());
    });

    it('should not display anything when the addresses are empty', async () => {
        render(<Owner color="#fff" owner='' address='' />);

        const button = screen.queryByRole('button');
        const text = screen.queryByText('Owner is');

        await waitFor(() => expect(button).toBeFalsy());
        await waitFor(() => expect(text).toBeFalsy());
    });
})