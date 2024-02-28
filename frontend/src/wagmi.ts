import { http, createConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

export const config = createConfig({
	chains: [sepolia],
	connectors: [
		injected(),
		// coinbaseWallet({ appName: 'Create Wagmi' }),
		// walletConnect({ projectId: import.meta.env.VITE_WC_PROJECT_ID }),
	],
	transports: {
		[sepolia.id]: http(import.meta.env.VITE_RPC_URL),
	},
});

declare module 'wagmi' {
	interface Register {
		config: typeof config;
	}
}
