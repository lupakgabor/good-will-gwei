

export const formatAddress = (address: string) => {
    if (address.length !== 42 || !address.startsWith('0x')) {
        return 'Not valid address!';
    }
    return String(address).substring(0, 6) + "..." + String(address).substring(38);
}

export const compareAddresses = (addressA: string, addressB: string) => {
    return addressA.toLowerCase() === addressB.toLowerCase();
}