import {toast} from "react-toastify";
import {useState} from "react";
import {Alchemy, Network} from "alchemy-sdk";
import {Button} from "antd";
import {ethers} from "ethers";

const settings = {
    apiKey: import.meta.env.VITE_ALCHEMY_API_KEY,
    network: Network.ETH_SEPOLIA,
};

const alchemy = new Alchemy(settings);

export const useSendTransaction = () => {
    const [isLoading, setIsLoading] = useState(false);

    const sendTransaction = async (from: `0x${string}`, data: string, gas: number, value: number = 0) => {
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
                        Transaction is in progress... <Button href={`${import.meta.env.VITE_ETH_SCAN_URL}/tx/${txHash}`}
                                                              target="_blank">Check on Etherscan</Button>
                    </div>), {
                    position: "top-center",
                    autoClose: false,
                    isLoading: true,
                });

                const transaction = await alchemy.transact.waitForTransaction(txHash);

                toast.dismiss(toastId);
                setIsLoading(false);
                if (transaction?.status === 1) {
                    toast.success("Transactions successfully finished! 🎉");
                } else {
                    toast.error((
                        <div className='flex justify-between items-center'>
                            Something went wrong please check on Etherscan <Button
                            href={`${import.meta.env.VITE_ETH_SCAN_URL}/tx/${txHash}`}
                            target="_blank">Check on Etherscan</Button>
                        </div>), {
                        position: "top-center",
                        autoClose: false,
                    });
                }
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