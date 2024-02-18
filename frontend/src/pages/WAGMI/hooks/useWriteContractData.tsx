import {useWaitForTransactionReceipt, useWriteContract} from "wagmi";
import {toast} from "react-toastify";
import {abi} from "@/DonateABI";
import {useEffect, useId} from "react";
import {TransactionFailed, TransactionInProgress} from "@/components";
import {errorHandler} from "@/pages/WAGMI/utils";
import {Charity} from "@/types";
import {ethers} from "ethers";


export const useWriteContractData = (notify: () => void) => {
    const {writeContract} = useWriteContractHandler(notify);

    const beTheManager = () => {
        writeContract({
            abi,
            address: import.meta.env.VITE_CONTRACT_ADDRESS,
            functionName: 'beTheManager',
            args: [],
        });
    };

    const addNewCharity = (values: Charity) => {
        writeContract({
            abi,
            address: import.meta.env.VITE_CONTRACT_ADDRESS,
            functionName: 'addCharity',
            args: [values.charityAddress, values.name, values.description],
        });
    };

    const removeCharity = (address: `0x${string}`) => {
        writeContract({
            abi,
            address: import.meta.env.VITE_CONTRACT_ADDRESS,
            functionName: 'removeCharity',
            args: [address],
        });
    };

    const donateToCharity = (address: `0x${string}`, amount: number) => {
        writeContract({
            abi,
            address: import.meta.env.VITE_CONTRACT_ADDRESS,
            functionName: 'donate',
            args: [address],
            value: ethers.utils.parseEther((amount).toString()).toBigInt(),
        });
    };

    const withdrawFunds = () => {
        writeContract({
            abi,
            address: import.meta.env.VITE_CONTRACT_ADDRESS,
            functionName: 'withdraw',
            args: [],
        });
    };

    return {
        beTheManager,
        addNewCharity,
        removeCharity,
        donateToCharity,
        withdrawFunds,
    }
}

const useWriteContractHandler = (notify: () => void) => {
    const toastId = useId();

    const {data: hash, writeContract} = useWriteContract({
        mutation: {
            onError: errorHandler,
        }
    });

    const waitFor = useWaitForTransactionReceipt({
        hash,
    });

    useEffect(() => {
        if (waitFor.isLoading) {
            toast.warning(<TransactionInProgress hash={hash!}/>, {
                position: "top-center",
                autoClose: false,
                isLoading: true,
                toastId,
            });
        }

    }, [waitFor.isLoading]);

    useEffect(() => {
        if (waitFor.isSuccess) {
            notify();
            toast.success("Transactions successfully finished! 🎉");
        }
        if (waitFor.isError) {
            console.log('Wait error', waitFor)
            toast.error(<TransactionFailed hash={hash!}/>, {
                position: "top-center",
                autoClose: false,
            });
        }
        if (waitFor.isSuccess || waitFor.isError) {
            toast.dismiss(toastId);
        }
    }, [waitFor.isSuccess, waitFor.isError]);

    return {
        writeContract,
    }
}


