import { compareAddresses, formatAddress } from '@/utils';
import { Button } from 'antd';

type ManagerProps = {
	color: string;
	manager?: `0x${string}`;
	address?: `0x${string}`;
	onBeTheManager: (address: `0x${string}`) => void;
	loading?: boolean;
};

export const Manager = ({ color, manager, address, onBeTheManager, loading }: ManagerProps) => {
	if (!manager && !address) {
		return null;
	}
	const isManager = compareAddresses(manager, address);

	return (
		<div className="flex items-center justify-between mb-10">
			<h1 style={{ color: color }}>{isManager ? 'You are the manager!' : `Manager is: ${formatAddress(manager)}`}</h1>
			{!isManager && (
				<Button disabled={!address || !manager} onClick={() => onBeTheManager(address!)} loading={loading}>
					Be the Manager!
				</Button>
			)}
		</div>
	);
};
