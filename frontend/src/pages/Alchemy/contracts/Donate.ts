import {default as DonateDefinition} from "@/Donate.json";
import {createAlchemyWeb3} from "@alch/alchemy-web3";

const web3 = createAlchemyWeb3(import.meta.env.VITE_RPC_URL);

export const donate = new web3.eth.Contract(
    // @ts-ignore
    DonateDefinition.abi,
    import.meta.env.VITE_CONTRACT_ADDRESS,
);
