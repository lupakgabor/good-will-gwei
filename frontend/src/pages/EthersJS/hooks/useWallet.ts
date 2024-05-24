import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {ethers} from "ethers";

export const useWallet = () => {
	const [walletAddress, setWalletAddress] = useState<`0x${string}`>();

	const connectWallet = async () => {
		if (window.ethereum) {
			try {
				console.log('COOOOOOOOoooooooOOOOooo');
                const provider = new ethers.providers.Web3Provider(window.ethereum);
				console.log('COOOOOOOOoooooooOOOOooo', provider);

                // MetaMask requires requesting permission to connect users accounts
                await provider.send("eth_requestAccounts", []);
				console.log(provider.getSigner())
				console.log('COOOOOOOOoooooooOOOOooo', provider.getSigner());
                setWalletAddress(await provider.getSigner().getAddress() as `0x${string}`);
			} catch (error) {
				console.log('erre', error);
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
                setWalletAddress(await provider.getSigner().getAddress() as `0x${string}`);
			} catch (error) {
				// Pass: address can not be set, needs to connect wallet
			}
		}
	};

	const addWalletListener = () => {
		if (window.ethereum) {
			window.ethereum.on('accountsChanged', (accounts: `0x${string}`[]) => {
				if (accounts.length > 0) {
					setWalletAddress(accounts[0]);
				}
			});
		}
	};

	useEffect(() => {
		getCurrentWalletConnected();
		addWalletListener();
	}, []);

	return {
		connectWallet,
		walletAddress,
	};
};
