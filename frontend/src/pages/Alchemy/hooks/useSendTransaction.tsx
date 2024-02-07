import {toast} from "react-toastify";
import {useState} from "react";
import {Alchemy, Network} from "alchemy-sdk";
import {Button} from "antd";
import {ethers} from "ethers";

const settings = {
    apiKey: import.meta.env.VITE_ALCHEMY_API_KEY, // Replace with your Alchemy API Key.
    network: Network.ETH_SEPOLIA, // Replace with your network.
};

const alchemy = new Alchemy(settings);

export const useSendTransaction = () => {
    const [isLoading, setIsLoading] = useState(false);

    const sendTransaction = async (from: string, data: string, gas: number, value: number = 0) => {
        if (window.ethereum) {
            const weiAmount = ethers.utils.parseEther((value).toString());
            const transactionParameters = {
                to: import.meta.env.VITE_CONTRACT_ADDRESS,
                from,
                data,
                gas,
                value: weiAmount.toHexString(),
            };
            try {
                const txHash = await window.ethereum.request({
                    method: "eth_sendTransaction",
                    params: [transactionParameters],
                });
                setIsLoading(true);
                const toastId = toast.warning((
                    <div className='flex justify-between items-center'>
                        Transaction is in progress... <Button href={`${import.meta.env.VITE_ETH_SCAN_URL}/tx/${txHash}`} target="_blank">Check on Etherscan</Button>
                    </div>), {
                    position: "top-center",
                    autoClose: false,
                    isLoading: true,
                });
                await alchemy.transact.waitForTransaction(txHash)
                // TODO: need to fetch transaction result because it could be rejected by the smart contract

                toast.dismiss(toastId);
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