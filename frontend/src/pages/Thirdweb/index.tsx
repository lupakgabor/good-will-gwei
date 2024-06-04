import {
	AddCharityCard,
	AddCharityModal,
	BasePage,
	CharityCard,
	ContentBody,
	ContentHeader,
	Manager,
} from '@/components';

import { client, contract, wallets } from '@/pages/Thirdweb/constants';
import { useReadCharities } from '@/pages/Thirdweb/hooks/useReadCharities';
import { useSendTx } from '@/pages/Thirdweb/hooks/useSendTx';
import { Charity } from '@/types';
import { compareAddresses } from '@/utils';
import { Flex, Spin } from 'antd';
import { useState } from 'react';
import { PreparedTransaction, prepareContractCall, toWei } from 'thirdweb';
import { ConnectButton, ThirdwebProvider, useActiveAccount, useReadContract } from 'thirdweb/react';

const MAIN_COLOR = '#c414b9';

const Thirdweb = () => {
	const account = useActiveAccount();
	const sendTx = useSendTx();

	const { data: manager } = useReadContract({
		contract,
		method: 'manager',
	});
	const { charities, isLoading: isCharitiesLoading } = useReadCharities();

	const accountAddress = account?.address as `0x${string}`;
	const managerAddress = manager as `0x${string}`;
	const isManager = compareAddresses(managerAddress, accountAddress);
	const [isNewCharityModalOpen, setIsNewCharityModalOpen] = useState(false);

	const beManager = async () => {
		sendTx(
			prepareContractCall({
				contract,
				method: 'beTheManager',
			}) as PreparedTransaction,
		);
	};

	const donateToCharity = (address: `0x${string}`, amount: number) => {
		sendTx(
			prepareContractCall({
				contract,
				method: 'donate',
				params: [address],
				value: toWei(amount.toString()),
			}) as PreparedTransaction,
		);
	};
	const withdrawFunds = () => {
		sendTx(
			prepareContractCall({
				contract,
				method: 'withdraw',
			}) as PreparedTransaction,
		);
	};

	const removeCharity = (address: `0x${string}`) => {
		sendTx(
			prepareContractCall({
				contract,
				method: 'removeCharity',
				params: [address],
			}) as PreparedTransaction,
		);
	};
	const addNewCharity = (values: Charity) => {
		sendTx(
			prepareContractCall({
				contract,
				method: 'addCharity',
				params: [values.charityAddress, values.name, values.description],
			}) as PreparedTransaction,
		);
	};

	return (
		<BasePage>
			<ContentHeader bgColor={MAIN_COLOR} title="thirdweb">
				<ConnectButton client={client} wallets={wallets} autoConnect theme="light" />
			</ContentHeader>
			<ContentBody>
				<Manager color={MAIN_COLOR} manager={managerAddress} address={accountAddress} onBeTheManager={beManager} />
				<Spin tip="Loading..." size="large" spinning={isCharitiesLoading}>
					<Flex wrap="wrap" gap="large" justify="center">
						{charities.map((charity) => (
							<CharityCard
								key={charity.charityAddress}
								charity={charity}
								manager={managerAddress}
								walletAddress={accountAddress}
								onDonate={donateToCharity}
								onWithdraw={withdrawFunds}
								onRemove={removeCharity}
							/>
						))}
						<AddCharityCard disabled={!account?.address || !isManager} onClick={() => setIsNewCharityModalOpen(true)} />
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

export const ThirdwebWrapper = () => (
	<ThirdwebProvider>
		<Thirdweb />
	</ThirdwebProvider>
);
