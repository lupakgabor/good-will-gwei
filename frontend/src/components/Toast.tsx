import { Button } from 'antd';

export const TransactionInProgress = ({ hash }: { hash: string }) => {
	return (
		<div className="flex justify-between items-center">
			Transaction is in progress...
			<Button href={`${import.meta.env.VITE_ETH_SCAN_URL}/tx/${hash}`} target="_blank">
				Check on Etherscan
			</Button>
		</div>
	);
};

export const TransactionFailed = ({ hash }: { hash: string }) => {
	return (
		<div className="flex justify-between items-center">
			Something went wrong please check on Etherscan
			<Button href={`${import.meta.env.VITE_ETH_SCAN_URL}/tx/${hash}`} target="_blank">
				Check on Etherscan
			</Button>
		</div>
	);
};
