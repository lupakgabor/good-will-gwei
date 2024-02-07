import { useEffect, useState } from "react";
import {toast} from "react-toastify";


export const useWallet = () => {
    const [address, setAddress] = useState('');

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const addressArray = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
                setAddress(addressArray[0]);
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
                const addressArray = await window.ethereum.request({
                    method: "eth_accounts",
                });
                if (addressArray.length > 0) {
                    setAddress(addressArray[0]);
                }
            } catch (error) {
                // @ts-ignore
                toast.error(`${error.message} 😥`);
            }
        }
    };

    const addWalletListener = () => {
        if (window.ethereum) {
            window.ethereum.on("accountsChanged", (accounts: string[]) => {
                if (accounts.length > 0) {
                    setAddress(accounts[0]);
                }
            });
        }
    }


    useEffect(() => {
        getCurrentWalletConnected();
        addWalletListener();
    }, []);

    return {
        connectWallet,
        address,
    }
}