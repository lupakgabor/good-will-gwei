import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export const useWallet = () => {
	const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner>();
	const [walletAddress, setWalletAddress] = useState<`0x${string}`>();

	const connectWallet = async () => {
		if (window.ethereum) {
			try {
				const provider = new ethers.providers.Web3Provider(window.ethereum);

				// MetaMask requires requesting permission to connect users accounts
				await provider.send('eth_requestAccounts', []);
				setSigner(provider.getSigner());
			} catch (error) {
				// @ts-ignore
				toast.error(`${error.message} 😥`);
			}
		} else {
			toast.error('You must install Metamask, a virtual Ethereum wallet, in your browser.');
		}
	};

	const getCurrentWalletConnected = async () => {
		if (window.ethereum) {
			try {
				const provider = new ethers.providers.Web3Provider(window.ethereum);
				setSigner(provider.getSigner());
			} catch (error) {
				// Pass: address can not be set, needs to connect wallet
			}
		}
	};

	const addWalletListener = () => {
		if (window.ethereum) {
			window.ethereum.on('accountsChanged', getCurrentWalletConnected);
		}
	};

	useEffect(() => {
		getCurrentWalletConnected();
		addWalletListener();
	}, []);

	useEffect(() => {
		(async () => setWalletAddress((await signer?.getAddress()) as `0x${string}`))();
	}, [signer]);

	return {
		connectWallet,
		walletAddress,
		signer,
	};
};
