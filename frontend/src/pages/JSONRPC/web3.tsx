import {ethers, Wallet as EtherWallet} from "ethers";
import {bytesToHex, utf8ToBytes} from "ethereum-cryptography/utils";
import {keccak256} from "ethereum-cryptography/keccak";
import {abi} from "@/DonateABI";
import {Utils} from 'alchemy-sdk';
import {callRPC} from "@/pages/JSONRPC/callRPC";
import {abiFunctionNamesType, Wallet} from "@/pages/JSONRPC/types";

type RPCMessage = {
    data: string;
    value?: string;
    gasLimit?: string;
}

export const createParamsSignature = (params: string[] = []) => {
    return `(${params.join(',')})`
}

export const createCallData = (fnName: string, paramTypes: ("string" | "address" | "uint256")[] = [], params: `0x${string}`[] = []) => {
    let callData = bytesToHex(keccak256(utf8ToBytes(`${fnName}${createParamsSignature(paramTypes)}`)).slice(0, 4));

    if (params.length > 0) {
        params.forEach(param => {
            if (param.startsWith('0x')) {
                callData += param.slice(2).padStart(64, '0') // Remove 0x and add 0 to the beginning
            } else {
                throw Error('This type of param is not implemented!');
            }
        });
    }

    return `0x${callData}`;
}


export const interactWithContract = async (fnName: abiFunctionNamesType, parameters: `0x${string}`[] = [], transactionData = {}, wallet: Wallet | null = null) => {
    const abiFn = abi.find(fn => fn.type === 'function' && fn.name === fnName)
    const inputSignature = abiFn?.inputs.map(input => input.type);

    const transaction = {
        to: import.meta.env.VITE_CONTRACT_ADDRESS as string,
        data: createCallData(fnName, inputSignature, parameters),
        ...transactionData,
    };

    if (wallet) {
        return await callRPC(
            'eth_sendRawTransaction',
            [await signMessage(transaction, wallet)],
        )
    } else {
        return await callRPC(
            'eth_call',
            [transaction],
        )
    }


}


export const fetchContractData = async (fnName: abiFunctionNamesType, parameters: `0x${string}`[] = []) => {
    const abiFn = abi.find(fn => fn.type === 'function' && fn.name === fnName)
    const response = await interactWithContract(fnName, parameters);

    if (response) {
        // @ts-ignore
        const outputSignature = abiFn?.outputs.map(output => output.type);

        if (outputSignature.length > 0) {
            const output = (new ethers.utils.AbiCoder()).decode(outputSignature, response);
            return output.length === 1 ? output[0] : output;
        }
    }
}




const signMessage = async (message: RPCMessage, wallet: Wallet) => {
    // TODO: all this transaction data is required? How could these be more dynamic
    const transaction = {
        ...message,
        maxPriorityFeePerGas: Utils.parseUnits("5", "gwei").toHexString(),
        maxFeePerGas: Utils.parseUnits("100", "gwei").toHexString(),
        nonce: await getNonce(wallet.address),
        type: 2,
        chainId: 11155111, // Sepolia
    };

    return await (new EtherWallet(wallet.privateKey)).signTransaction(transaction);
}

const getNonce = async (address: string) => {
    return callRPC('eth_getTransactionCount', [address, 'latest']);
}

export const getTransactionReceipt = async (hash: string) => new Promise((resolve, reject) => {
    let tries = 0;
    const intervalId = setInterval(async () => {
        console.log('iiii id', intervalId);
        try {
            const transaction = await callRPC('eth_getTransactionReceipt', [hash])
            if (transaction) {
                resolve(transaction);
            } else {
                tries++;
                if (tries === 3) {
                    reject({message: 'Transaction time out!'});
                    clearInterval(intervalId);
                }
            }
        } catch (error) {
            reject(error);
            clearInterval(intervalId);
        }
    }, 4000)

    return;
});