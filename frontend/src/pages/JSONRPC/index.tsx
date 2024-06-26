import { AddCharityCard, AddCharityModal, BasePage, CharityCard, ContentHeader, Manager } from '@/components';
import { ContentBody } from '@/components/ContentBody';
import { Charity } from '@/types';
import { compareAddresses } from '@/utils';
import { Flex, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { ConnectButton } from './components';
import { useSendTransaction } from './hooks';
import { Wallet } from './types';
import { fetchContractData } from './web3';

const MAIN_COLOR = '#ecae7f';

export const JSONRPC = () => {
	const [wallet, setWallet] = useState<Wallet | null>(null);
	const { isLoading, sendTransaction } = useSendTransaction(wallet);
	const [manager, setManager] = useState<`0x${string}`>();
	const [charities, setCharities] = useState<Charity[]>([]);
	const [isCharitiesLoading, setIsCharityLoading] = useState(true);
	const [isNewCharityModalOpen, setIsNewCharityModalOpen] = useState(false);
	const isManager = compareAddresses(manager, wallet?.address);

	useEffect(() => {
		if (!isLoading) {
			fetchManager();
			fetchCharities();
		}
	}, [isLoading]);

	const fetchManager = async () => {
		setManager(await fetchContractData('manager'));
	};

	const fetchCharities = async () => {
		setIsCharityLoading(true);
		const addresses: `0x${string}`[] = (await fetchContractData('getAllCharityAddress')).filter((address: string) =>
			Number(address),
		);

		// TODO: batch request would be more efficient
		setCharities(
			(await Promise.all(addresses.map((address) => fetchContractData('charities', [address]))))?.map((data) => ({
				charityAddress: data[0] as `0x${string}`,
				name: data[1],
				description: data[2],
				balance: data[3] as unknown as bigint,
			})),
		);
		setIsCharityLoading(false);
	};

	const beTheManager = async () => {
		await sendTransaction('beTheManager', [], 26294);
	};

	const donateToCharity = async (address: `0x${string}`, amount: number) => {
		await sendTransaction('donate', [address], 46540, amount);
	};

	const addNewCharity = async (values: Charity) => {
		await sendTransaction('addCharity', [values.charityAddress, values.name, values.description], 250000);
	};

	const withdrawFunds = async () => {
		await sendTransaction('withdraw', [], 30980);
	};

	const removeCharity = async (address: string) => {
		await sendTransaction('removeCharity', [address], 70000);
	};

	return (
		<BasePage>
			<ContentHeader bgColor={MAIN_COLOR} title="JSON-RPC">
				<ConnectButton onSetWallet={setWallet} />
			</ContentHeader>
			<ContentBody>
				<Manager color={MAIN_COLOR} manager={manager} address={wallet?.address} onBeTheManager={beTheManager} />
				<Spin tip="Loading..." size="large" spinning={isCharitiesLoading}>
					<Flex wrap="wrap" gap="large" justify="center">
						{charities.map((charity) => (
							<CharityCard
								key={charity.charityAddress}
								charity={charity}
								manager={manager}
								walletAddress={wallet?.address}
								onDonate={donateToCharity}
								onWithdraw={withdrawFunds}
								onRemove={removeCharity}
							/>
						))}
						<AddCharityCard disabled={!wallet?.address || !isManager} onClick={() => setIsNewCharityModalOpen(true)} />
					</Flex>
				</Spin>
			</ContentBody>
			<AddCharityModal
				isOpen={isNewCharityModalOpen}
				handleClose={() => setIsNewCharityModalOpen(false)}
				onCreate={addNewCharity}
			/>
		</BasePage>
	);
};
