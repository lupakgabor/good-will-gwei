import { BasePage } from '@/components';
import { Card, Flex, Typography } from 'antd';
import { Link } from 'react-router-dom';
import alchemy from '../../assets/alchemy.png';
import ethersjs from '../../assets/ethersjs.png';
import jsonRPC from '../../assets/json-rpc.jpg';
import wagmi from '../../assets/wagmi.png';

export const Home = () => {
	return (
		<BasePage>
			<Typography>
				<Typography.Title className="text-center !mb-10">Empower Charities with the Power of Web3</Typography.Title>

				<Typography.Paragraph className="text-center sm:!mb-10 text-xl px-2">
					Welcome to Good Will Gwei, the groundbreaking platform that revolutionizes the way we support charities. With
					the power of web3, we provide a secure and transparent environment for users to register various charity
					organizations and send donations directly to them.
				</Typography.Paragraph>
			</Typography>

			<Flex wrap="wrap" gap="large" justify="center">
				<Link to="/json-rpc">
					<Card hoverable className={'w-80'} cover={<img alt="json-rpc" src={jsonRPC} className="h-96 w-28" />}>
						<Card.Meta
							title="JSON-RPC"
							description="JSON-RPC is a stateless, light-weight remote procedure call (RPC) protocol."
						/>
					</Card>
				</Link>
				<Link to="/ethersjs">
					<Card hoverable className={'w-80'} cover={<img alt="ethersjs" src={ethersjs} className="h-96 w-28" />}>
						<Card.Meta
							title="Ethers.js"
							description="Compact library for interacting with the Ethereum Blockchain and its ecosystem."
						/>
					</Card>
				</Link>
				<Link to="/alchemy">
					<Card hoverable className={'w-80'} cover={<img alt="aclhemy" src={alchemy} className="h-96 w-28" />}>
						<Card.Meta
							title="Alchemy"
							description="The Alchemy SDK is the easiest way to connect your dApp to the blockchain."
						/>
					</Card>
				</Link>
				<Link to="/wagmi">
					<Card hoverable className={'w-80'} cover={<img alt="wagmi" src={wagmi} className="h-96 w-28" />}>
						<Card.Meta title="WAGMI" description="Type Safe, Extensible, and Modular by design." />
					</Card>
				</Link>
			</Flex>
		</BasePage>
	);
};
