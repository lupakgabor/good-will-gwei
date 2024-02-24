import { ConnectButton } from '@/pages/JSONRPC/components';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { FormItemProps, ModalProps } from 'antd';
import { ReactNode } from 'react';

vi.mock('antd', async (importOriginal) => {
	const mod = await importOriginal<typeof import('antd')>();

	const mockForm = ({ children }: { children: ReactNode }) => <div>{children}</div>;

	mockForm.useForm = () => [vi.fn];
	mockForm.Item = (props: FormItemProps) => (
		<div>
			<label htmlFor={props.name}>{props.label}</label>
			<input id={props.name} type="text" value="" onChange={vi.fn()} />
		</div>
	);

	return {
		...mod,
		Form: mockForm,
		Modal: (props: ModalProps) => {
			if (props.open) {
				return <div>{props.children}</div>;
			} else {
				return null;
			}
		},
	};
});

describe('ConnectButton', () => {
	it('should render connect button', async () => {
		render(<ConnectButton onSetWallet={vi.fn()} />);

		const connect = screen.getByRole('button', {
			name: 'Connect Wallet',
		});
		const privateKeyInput = screen.queryByLabelText('Private key');

		expect(privateKeyInput).not.toBeInTheDocument();
		expect(connect).toBeInTheDocument();
	});

	it('should render disconnect button', async () => {
		localStorage.setItem(
			'wallet',
			JSON.stringify({
				address: '0x0123456789101112131415161718192021222322',
				privateKey: '0x0000',
			}),
		);
		render(<ConnectButton onSetWallet={vi.fn()} />);

		const connect = screen.getByRole('button', {
			name: 'Disconnect: 0x0123...2322',
		});

		expect(connect).toBeInTheDocument();
		localStorage.setItem('wallet', '');
	});

	it('should render modal', async () => {
		render(<ConnectButton onSetWallet={vi.fn()} />);

		const connect = screen.getByRole('button', {
			name: 'Connect Wallet',
		});
		await userEvent.click(connect);

		const privateKeyInput = await screen.findByLabelText('Private key');

		expect(privateKeyInput).toBeInTheDocument();
	});
});
