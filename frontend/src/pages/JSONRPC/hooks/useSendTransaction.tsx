import { TransactionInProgress } from '@/components';
import { Utils } from 'alchemy-sdk';
import { Button } from 'antd';
import { useState } from 'react';
import { toast } from 'react-toastify';
import type { Wallet, abiFunctionNamesType } from '../types';
import { getTransactionReceipt, interactWithContract } from '../web3';

export const useSendTransaction = (wallet: Wallet | null) => {
	const [isLoading, setIsLoading] = useState(false);
	const sendTransaction = async (
		fnName: abiFunctionNamesType,
		parameters: (`0x${string}` | string)[] = [],
		gas: number = 21000,
		value: number = 0,
	) => {
		if (wallet) {
			setIsLoading(true);
			const hash = await interactWithContract(
				fnName,
				parameters,
				{
					value: Utils.parseEther(value.toString()).toHexString(),
					gasLimit: gas.toString(),
				},
				wallet,
			);

			if (hash) {
				const toastId = toast.warning(<TransactionInProgress hash={hash!} />, {
					position: 'top-center',
					autoClose: false,
					isLoading: true,
				});
				try {
					await getTransactionReceipt(hash);
					toast.success('Transactions successfully finished! 🎉');
				} catch (error) {
					toast.error(
						<div className="flex justify-between items-center">
							Something went wrong please check on Etherscan{' '}
							<Button href={`${import.meta.env.VITE_ETH_SCAN_URL}/tx/${hash}`} target="_blank">
								Check on Etherscan
							</Button>
						</div>,
						{
							position: 'top-center',
							autoClose: false,
						},
					);
				}

				toast.dismiss(toastId);
			}
			setIsLoading(false);
		} else {
			toast.error('You must connect a wallet.');
		}
	};

	return {
		isLoading,
		sendTransaction,
	};
};
