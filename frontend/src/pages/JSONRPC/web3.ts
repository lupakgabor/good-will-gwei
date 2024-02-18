import {ethers} from "ethers";
import {bytesToHex, utf8ToBytes} from "ethereum-cryptography/utils";
import {keccak256} from "ethereum-cryptography/keccak";
import {abi} from "@/DonateABI";


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


type fnNameType = Extract<typeof abi[number], { "type": "function" }>['name'];

export const fetchRPC = async (body: string) => {
   return await fetch(import.meta.env.VITE_RPC_URL, {
        method: "POST",
        body,
    });
}

export const fetchContractData = async (fnName: fnNameType, parameters: `0x${string}`[] = []) => {
    const abiFn = abi.find(fn => fn.type === 'function' && fn.name === fnName)
    const inputSignature = abiFn?.inputs.map(input => input.type);

    const abiCoder = new ethers.utils.AbiCoder()

    const data = {
        jsonrpc: '2.0',
        method: 'eth_call',
        params: [{
            data: createCallData(fnName, inputSignature, parameters),
            to: import.meta.env.VITE_CONTRACT_ADDRESS,
        }],
    }

    const response = await fetchRPC(JSON.stringify(data));

    const json = await response.json();
    console.log('Contract call response', json);

    if ('error' in json) {
        throw Error(json.error.message);
    }

    // @ts-ignore
    const outputSignature = abiFn?.outputs.map(output => output.type);

    if (outputSignature.length > 0) {
        const output = abiCoder.decode(outputSignature, json.result);
        return output.length === 1 ? output[0] : output;
    }
}