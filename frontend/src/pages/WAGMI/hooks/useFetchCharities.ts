import {useReadContract, useReadContracts} from "wagmi";
import {Charity} from "@/types";
import {abi} from "@/DonateABI";


export const useFetchCharities = (): Charity[] => {
    const {data: addresses} = useReadContract({
        abi,
        address: import.meta.env.VITE_CONTRACT_ADDRESS,
        functionName: 'getAllCharityAddress',
    });

    const filteredAddresses = addresses?.filter((address: string) => Number(address))

    const {data: charityResults} = useReadContracts({
        contracts: filteredAddresses?.map((address) => ({
            abi,
            address: import.meta.env.VITE_CONTRACT_ADDRESS,
            functionName: 'charities',
            args: [address],
        })),
    });

    return charityResults
        ?.filter(data => data.status === 'success')
        .map(data => ({
            charityAddress: data.result![0],
            name: data.result![1],
            description: data.result![2],
            balance: Number(data.result![3]),
        })) ?? [];
}
