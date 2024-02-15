import {useReadContract} from "wagmi";
import {abi} from "@/DonateABI";

export const useFetchManager = () => {
    const {data: manager} = useReadContract({
        abi: abi,
        address: import.meta.env.VITE_CONTRACT_ADDRESS,
        functionName: 'manager',
    });

    return manager;
}