import { formatAddress } from '@/utils';
import { Button, Form, Input, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { useLocalStorage } from '../hooks';
import type { Wallet } from '../types';
import { getAddressFromPrivateKey } from '../utils';

type ConnectButtonType = {
	onSetWallet: (wallet: Wallet | null) => void;
};

export const ConnectButton = ({ onSetWallet }: ConnectButtonType) => {
	const [form] = Form.useForm();
	const [isOpen, setIsOpen] = useState(false);
	const localStorageWallet = useLocalStorage<Wallet | null>('wallet', null);

	const disconnectWallet = () => {
		localStorageWallet.setValue(null);
	};

	useEffect(() => {
		onSetWallet(localStorageWallet.storedValue);
	}, [localStorageWallet.storedValue]);

	return (
		<div>
			{!localStorageWallet.storedValue?.address && (
				<Button type={'primary'} onClick={() => setIsOpen(true)} loading={isOpen}>
					Connect Wallet
				</Button>
			)}
			{localStorageWallet.storedValue?.address && (
				<Button type={'primary'} onClick={disconnectWallet}>
					Disconnect: {formatAddress(localStorageWallet.storedValue.address)}
				</Button>
			)}
			<Modal
				open={isOpen}
				title="Connect Wallet"
				okText="Connect"
				cancelText="Cancel"
				onCancel={() => setIsOpen(false)}
				onOk={async () => {
					const values = await form.validateFields();
					localStorageWallet.setValue({
						address: getAddressFromPrivateKey(values.privateKey),
						privateKey: values.privateKey,
					});
					form.resetFields();
					setIsOpen(false);
				}}
			>
				<Form form={form} name="donate">
					<Form.Item
						className="my-5"
						name="privateKey"
						label="Private key"
						rules={[{ message: 'Private key needs to start 0x and has to be 66 characters', min: 66, max: 66 }]}
					>
						<Input />
					</Form.Item>
					<p className="text-red-500 text-center">
						Never give your private key to anyone! Use predefined ones instead!
					</p>
				</Form>
				<div className="grid">
					{TEST_PRIVATE_KEY.map((key) => (
						<Button key={key} className="my-1" onClick={() => form.setFieldValue('privateKey', key)}>
							Set predefined key: {key.substring(0, 10) + '...'}
						</Button>
					))}
				</div>
			</Modal>
		</div>
	);
};

const TEST_PRIVATE_KEY: `0x${string}`[] = [
	'0x0df58b5d8c2695a3b77a92169784c451e10c8b4e4a33d681e90228a1ca8e164a',
	'0x3ab2579e74b2f91a37d762d25418854a2787f681b017897c99f0b145098aaa1b',
	'0xdc921d27d367c2f87706aef853647b7547d43f76aca9a56e62f38eb325439c92',
];
