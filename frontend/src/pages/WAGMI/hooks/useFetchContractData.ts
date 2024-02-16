import {Observer} from "./useRefreshObserver";
import {useReadContract} from "wagmi";
import {abi} from "@/DonateABI";
import {useEffect} from "react";

export const useFetchContractData = (subscribe: (fn: Observer) => void) => {
    const {data: manager, refetch: refetchManager} = useReadContract({
        abi: abi,
        address: import.meta.env.VITE_CONTRACT_ADDRESS,
        functionName: 'manager',
        scopeKey: 'fetchManager',
    });

    useEffect(() => {
        subscribe(refetchManager);
    }, []);

    return {
        manager,
    }
}