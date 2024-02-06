import {ReactNode} from "react";
import {render, waitFor, screen} from "@testing-library/react";
import {Alchemy} from "../";
import {mockAddress, mockCharity} from "@/__mocks__";


vi.mock('@/components/BasePage',    () => ({
    BasePage: ({children}: {children: ReactNode}) => <div>{children}</div>
}));

vi.mock('../contracts/Donate', () => ({
    donate: {
        methods: {
            owner: vi.fn(() => vi.fn(() => mockAddress)),
            charities: vi.fn(() => vi.fn(() => mockCharity)),
        }
    },
}));

vi.mock('../hooks/useWallet', () => ({
    useWallet: () => ({address: mockAddress, connectWallet: vi.fn()})
}))

describe('Alchemy', () => {
    it('should render correctly', async () => {
        await waitFor(() => render( <Alchemy />));

        await screen.findByText('You are the owner!');
        await screen.findAllByText('Age of Hope');
        await screen.findByText('Add new charity!');
    })
});