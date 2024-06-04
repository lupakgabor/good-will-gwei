import { abi } from '@/DonateABI';
import { createThirdwebClient, defineChain, getContract } from 'thirdweb';
import { sepolia } from 'thirdweb/chains';
import { createWallet } from 'thirdweb/wallets';

export const client = createThirdwebClient({
	clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID,
	config: {
		rpc: import.meta.env.VITE_RPC_URL,
	},
});

export const chain = defineChain({
	id: sepolia.id,
	rpc: import.meta.env.VITE_RPC_URL,
});
export const wallets = [createWallet('io.metamask')];

export const contract = getContract({
	client,
	chain,
	address: import.meta.env.VITE_CONTRACT_ADDRESS,
	abi,
});
