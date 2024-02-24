import { abi } from '@/DonateABI';

export type abiFunctionNamesType = Extract<(typeof abi)[number], { type: 'function' }>['name'];

export type Wallet = {
	address: `0x${string}`;
	privateKey: string;
};
