import { errorHandler } from '@/pages/WAGMI/utils';
import { formatAddress } from '@/utils';
import { Button } from 'antd';
import { useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

export const ConnectButton = () => {
	const account = useAccount();
	const connect = useConnect();
	const { disconnect } = useDisconnect();

	useEffect(() => {
		errorHandler(connect.error);
	}, [connect.isError]);

	return (
		<div>
			{account.status !== 'connected' && (
				<Button type={'primary'} onClick={() => connect.connect({ connector: injected() })} loading={connect.isPending}>
					Connect Wallet
				</Button>
			)}
			{account.status === 'connected' && (
				<Button type={'primary'} onClick={() => disconnect()}>
					Disconnect: {formatAddress(account.address as `0x${string}`)}
				</Button>
			)}
		</div>
	);
};
