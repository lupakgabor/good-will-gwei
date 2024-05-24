import { abi } from '@/DonateABI';
import { BasePage, ContentBody, ContentHeader, Manager } from '@/components';
import { formatAddress } from '@/utils';
import { Button } from 'antd';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useWallet } from './hooks/useWallet';

const MAIN_COLOR = '#2535a0';

export const EthersJS = () => {
	const { connectWallet, walletAddress } = useWallet();
	const [manager, setManager] = useState<`0x${string}`>();

	const provider = new ethers.providers.JsonRpcProvider(import.meta.env.VITE_RPC_URL);
	const contract = new ethers.Contract(import.meta.env.VITE_CONTRACT_ADDRESS, abi, provider);

	useEffect(() => {
		if (!window.ethereum) {
			toast.warning('You must install Metamask to interact with this website!');
		}
		fetchManager();
	}, []);

	const fetchManager = async () => {
		setManager(await contract.manager());
	};

	return (
		<BasePage>
			<ContentHeader bgColor={MAIN_COLOR} title="Ethers.js">
				<Button type={'primary'} onClick={connectWallet}>
					{walletAddress && walletAddress.length > 0 ? `Connected: ${formatAddress(walletAddress)}` : 'Connect Wallet'}
				</Button>
			</ContentHeader>
			<ContentBody>
				<Manager color={MAIN_COLOR} manager={manager} address={walletAddress} onBeTheManager={console.log} />
			</ContentBody>
		</BasePage>
	);
};
