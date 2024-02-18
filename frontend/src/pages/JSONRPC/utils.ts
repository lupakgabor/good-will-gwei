import {keccak256} from "ethereum-cryptography/keccak";
import {secp256k1} from "ethereum-cryptography/secp256k1";
import {toHex} from "viem";

export const getAddressFromPrivateKey = (key: string): `0x${string}` => {
    if (key.length === 66) {
        const publicKey = secp256k1.getPublicKey(key.slice(2, 66), false);
        // The first byte indicates the format of the key, whether it is in the compressed format or not.
        const publicKeyWithoutCompressionByte = publicKey.slice(1);

        const kek = keccak256(publicKeyWithoutCompressionByte);

        // Address is the last 20 bytes of the hash of the public key
        return toHex(kek.slice(-20));

    } else {
        throw Error('Private key has to be 66 characters.')
    }
}