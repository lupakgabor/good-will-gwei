import {
	AddCharityCard,
	AddCharityModal,
	BasePage,
	CharityCard,
	ContentBody,
	ContentHeader,
	Manager,
} from '@/components';
import { Charity } from '@/types';
import { compareAddresses, formatAddress } from '@/utils';
import { Button, Flex, Spin } from 'antd';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { useContract } from './hooks/useContract';
import { useWallet } from './hooks/useWallet';

const MAIN_COLOR = '#2535a0';

export const EthersJS = () => {
	const { connectWallet, signer, walletAddress } = useWallet();
	const [manager, setManager] = useState<`0x${string}`>();
	const { isLoading, read, write } = useContract(signer);
	const [isCharitiesLoading, setIsCharityLoading] = useState(true);
	const [charities, setCharities] = useState<Charity[]>([]);
	const [isNewCharityModalOpen, setIsNewCharityModalOpen] = useState(false);

	useEffect(() => {
		if (!isLoading) {
			fetchManager();
			fetchCharities();
		}
	}, [isLoading]);

	const fetchManager = async () => {
		setManager(await read((contract) => contract.manager()));
	};

	const fetchCharities = async () => {
		setIsCharityLoading(true);
		const addresses: string[] = (await read((contract) => contract.getAllCharityAddress())).filter((address: string) =>
			Number(address),
		);

		// TODO: batch request would be more efficient
		setCharities(await Promise.all(addresses.map((address) => read((contract) => contract.charities(address)))));
		setIsCharityLoading(false);
	};

	const beTheManager = () => {
		write((contract) => contract.beTheManager());
	};

	const addNewCharity = async (values: Charity) => {
		write((contract) => contract.addCharity(values.charityAddress, values.name, values.description));
	};

	const donateToCharity = async (address: string, amount: number) => {
		write((contract) =>
			contract.donate(address, {
				value: ethers.utils.parseEther(amount.toString()),
			}),
		);
	};

	const withdrawFunds = async () => {
		write((contract) => contract.withdraw());
	};

	const removeCharity = async (address: string) => {
		write((contract) => contract.removeCharity(address));
	};

	return (
		<BasePage>
			<ContentHeader bgColor={MAIN_COLOR} title="Ethers.js">
				<Button type={'primary'} onClick={connectWallet}>
					{walletAddress && walletAddress.length > 0 ? `Connected: ${formatAddress(walletAddress)}` : 'Connect Wallet'}
				</Button>
			</ContentHeader>
			<ContentBody>
				<Manager color={MAIN_COLOR} manager={manager} address={walletAddress} onBeTheManager={beTheManager} />
				<Spin tip="Loading..." size="large" spinning={isCharitiesLoading}>
					<Flex wrap="wrap" gap="large" justify="center">
						{charities.map((charity) => (
							<CharityCard
								key={charity.charityAddress}
								charity={charity}
								manager={manager}
								walletAddress={walletAddress}
								onDonate={donateToCharity}
								onWithdraw={withdrawFunds}
								onRemove={removeCharity}
							/>
						))}
						<AddCharityCard
							disabled={!compareAddresses(manager, walletAddress)}
							onClick={() => setIsNewCharityModalOpen(true)}
						/>
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
