import {Observer} from "./useRefreshObserver";
import {useReadContract, useReadContracts} from "wagmi";
import {abi} from "@/DonateABI";
import {useEffect} from "react";
import {Charity} from "@/types";

export const useFetchContractData = (subscribe: (fn: Observer) => void) => {
    const {data: manager, refetch: refetchManager} = useReadContract({
        abi: abi,
        address: import.meta.env.VITE_CONTRACT_ADDRESS,
        functionName: 'manager',
    });

    const {data: addresses, refetch: refetchAddresses} = useReadContract({
        abi,
        address: import.meta.env.VITE_CONTRACT_ADDRESS,
        functionName: 'getAllCharityAddress',
    });


    const filteredAddresses = addresses?.filter((address: string) => Number(address));

    const {data: charityResults, refetch: refetchContracts, isPending: isCharitiesLoading} = useReadContracts({
        contracts: filteredAddresses?.map((address) => ({
            abi,
            address: import.meta.env.VITE_CONTRACT_ADDRESS,
            functionName: 'charities',
            args: [address],
        })),
    });

    const charities: Charity[] = charityResults
        ?.filter(data => data.status === 'success')
        .map((data) => ({
            charityAddress: data.result![0] as `0x${string}`,
            name: data.result![1],
            description: data.result![2],
            balance: data.result![3] as unknown as bigint,
        })) ?? [];

    useEffect(() => {
        subscribe(refetchManager);
        subscribe(refetchAddresses);
        subscribe(refetchContracts);
    }, []);

    return {
        manager,
        charities,
        isCharitiesLoading,
    }
}