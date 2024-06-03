import { BasePage, ContentBody, ContentHeader } from '@/components';

import { createThirdwebClient } from 'thirdweb';
import { ConnectButton, ThirdwebProvider } from 'thirdweb/react';
import { createWallet } from 'thirdweb/wallets';

const MAIN_COLOR = '#c414b9';

const client = createThirdwebClient({ clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID });

const wallets = [createWallet('io.metamask')];

const Thirdweb = () => {
	return (
		<BasePage>
			<ContentHeader bgColor={MAIN_COLOR} title="thirdweb">
				<ConnectButton client={client} wallets={wallets} autoConnect theme="light" />
			</ContentHeader>
			<ContentBody>Hello from thirdweb!</ContentBody>
		</BasePage>
	);
};

export const ThirdwebWrapper = () => (
	<ThirdwebProvider>
		<Thirdweb />
	</ThirdwebProvider>
);
