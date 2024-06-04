import {
	AddCharityCard,
	AddCharityModal,
	BasePage,
	CharityCard,
	ContentBody,
	ContentHeader,
	Manager,
} from '@/components';
import { compareAddresses } from '@/utils';
import { Flex, Spin } from 'antd';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from './components';
import { useFetchContractData, useRefreshObserver, useWriteContractData } from './hooks';

const MAIN_COLOR = '#747bff';

export const WAGMI = () => {
	const { subscribe, notify } = useRefreshObserver();
	const { manager, charities, isCharitiesLoading } = useFetchContractData(subscribe);
	const { beTheManager, addNewCharity, removeCharity, donateToCharity, withdrawFunds } = useWriteContractData(notify);

	const account = useAccount();
	const accountAddress = account.address as `0x${string}`;
	const isManager = compareAddresses(manager, accountAddress);
	const [isNewCharityModalOpen, setIsNewCharityModalOpen] = useState(false);

	return (
		<BasePage>
			<ContentHeader bgColor={MAIN_COLOR} title="WAGMI">
				<ConnectButton />
			</ContentHeader>
			<ContentBody>
				<Manager color={MAIN_COLOR} manager={manager} address={accountAddress} onBeTheManager={beTheManager} />
				<Spin tip="Loading..." size="large" spinning={isCharitiesLoading}>
					<Flex wrap="wrap" gap="large" justify="center">
						{charities.map((charity) => (
							<CharityCard
								key={charity.charityAddress}
								charity={charity}
								manager={manager}
								walletAddress={accountAddress}
								onDonate={donateToCharity}
								onWithdraw={withdrawFunds}
								onRemove={removeCharity}
							/>
						))}
						<AddCharityCard disabled={!account.address || !isManager} onClick={() => setIsNewCharityModalOpen(true)} />
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
