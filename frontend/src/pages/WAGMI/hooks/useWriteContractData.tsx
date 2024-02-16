import {useWaitForTransactionReceipt, useWriteContract} from "wagmi";
import {toast} from "react-toastify";
import {abi} from "@/DonateABI";
import {useEffect, useId} from "react";
import {TransactionFailed, TransactionInProgress} from "@/components";
import {errorHandler} from "@/pages/WAGMI/utils";


export const useWriteContractData = (notify: () => void) => {
    const { writeContract } = useWriteContractHandler(notify);

    const beTheManager = () => {
        writeContract({
            abi,
            address: import.meta.env.VITE_CONTRACT_ADDRESS,
            functionName: 'beTheManager',
            args: [],
        });
    }

    return {
        beTheManager,
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


