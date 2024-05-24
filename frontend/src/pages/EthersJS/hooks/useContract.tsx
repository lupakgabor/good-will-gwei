import { abi } from '@/DonateABI';
import { Button } from 'antd';
import { ethers } from 'ethers';
import { useState } from 'react';
import { toast } from 'react-toastify';

const provider = new ethers.providers.JsonRpcProvider(import.meta.env.VITE_RPC_URL);
const contract = new ethers.Contract(import.meta.env.VITE_CONTRACT_ADDRESS, abi, provider);

export const useContract = (signer?: ethers.providers.JsonRpcSigner) => {
	const [isLoading, setIsLoading] = useState(false);

	const read = async (callback: (contract: ethers.Contract) => Promise<any>) => {
		return await callback(contract);
	};

	const write = async (callback: (contract: ethers.Contract) => Promise<any>) => {
		if (!signer) {
			toast.error('You have to connect your wallet to interact with the application!');
			return;
		}
		try {
			setIsLoading(true);

			const response = await callback(contract.connect(signer!));
			const toastId = toast.warning(
				<div className="flex justify-between items-center">
					Transaction is in progress...{' '}
					<Button href={`${import.meta.env.VITE_ETH_SCAN_URL}/tx/${response.hash}`} target="_blank">
						Check on Etherscan
					</Button>
				</div>,
				{
					position: 'top-center',
					autoClose: false,
					isLoading: true,
				},
			);
			const transaction = await response.wait();

			toast.dismiss(toastId);
			setIsLoading(false);
			if (transaction?.status === 1) {
				toast.success('Transactions successfully finished! 🎉');
			} else {
				toast.error(
					<div className="flex justify-between items-center">
						Something went wrong please check on Etherscan{' '}
						<Button href={`${import.meta.env.VITE_ETH_SCAN_URL}/tx/${response.hash}`} target="_blank">
							Check on Etherscan
						</Button>
					</div>,
					{
						position: 'top-center',
						autoClose: false,
					},
				);
			}
		} catch (error) {
			setIsLoading(false);
			// @ts-ignore
			toast.error(`${error.message} 😥`);
		}
	};

	return {
		isLoading,
		read,
		write,
	};
};
