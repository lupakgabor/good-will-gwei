import { Button, Popconfirm } from 'antd';

type WithdrawButtonProps = {
	onConfirm: () => void;
	disabled: boolean;
};

export const WithdrawButton = ({ onConfirm, disabled }: WithdrawButtonProps) => (
	<Popconfirm
		title="Withdraw funds"
		description="Are you sure to withraw all funds"
		onConfirm={onConfirm}
		okText="Yes"
		cancelText="No"
	>
		<Button className="text-yellow-500" type="link" disabled={disabled}>
			Withdraw
		</Button>
	</Popconfirm>
);
