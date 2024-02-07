import {toast} from "react-toastify";
import {useState} from "react";
import {Alchemy, Network} from "alchemy-sdk";


const settings = {
    apiKey: import.meta.env.VITE_ALCHEMY_API_KEY, // Replace with your Alchemy API Key.
    network: Network.ETH_SEPOLIA, // Replace with your network.
};

const alchemy = new Alchemy(settings);

export const useSendTransaction = () => {
    const [isLoading, setIsLoading] = useState(false);
    const sendTransaction = async (from: string, data: string, gas: number) => {
        if (window.ethereum) {
            const transactionParameters = {
                to: import.meta.env.VITE_CONTRACT_ADDRESS,
                from,
                data,
                gas,
            };
            try {
                const txHash = await window.ethereum.request({
                    method: "eth_sendTransaction",
                    params: [transactionParameters],
                });
                setIsLoading(true);
                toast.warning("Transactions successfully started! ⏳");
                const response = await alchemy.transact.waitForTransaction(txHash)

                console.log('res', response);
                setIsLoading(false);
                toast.success("Transactions successfully finished! 🎉");
            } catch (error) {
                // @ts-ignore
                toast.error(`${error.message} 😥`);
            }
        } else {
            toast.error('You must install Metamask, a virtual Ethereum wallet, in your browser.');
        }
    }

    return {
        isLoading,
        sendTransaction,
    }
}