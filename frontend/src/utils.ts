export const formatAddress = (address?: `0x${string}`) => {
	if (!address || address.length !== 42 || !address.startsWith('0x')) {
		return 'Not valid address!';
	}
	return String(address).substring(0, 6) + '...' + String(address).substring(38);
};

export const compareAddresses = (addressA?: `0x${string}`, addressB?: `0x${string}`) => {
	if (!addressA || !addressB) {
		return false;
	}
	return addressA.toLowerCase() === addressB.toLowerCase();
};
