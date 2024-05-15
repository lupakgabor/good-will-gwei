import { AppstoreOutlined, GithubOutlined, MailOutlined, SettingOutlined, CloudOutlined } from '@ant-design/icons';
import { Alert, Avatar, Layout, Menu, theme } from 'antd';
import type { MenuProps } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const items: MenuProps['items'] = [
	{
		label: 'JSON-RPC',
		key: '/json-rpc',
		icon: <MailOutlined />,
	},
	{
		label: 'Ethers.js',
		key: '/ethersjs',
		icon: <CloudOutlined />,
	},
	{
		label: 'Alchemy',
		key: '/alchemy',
		icon: <AppstoreOutlined />,
	},
	{
		label: 'WAGMI',
		key: '/wagmi',
		icon: <SettingOutlined />,
	},
];

export const Header = () => {
	const {
		token: { colorPrimary },
	} = theme.useToken();
	const navigate = useNavigate();
	const location = useLocation();

	const onClick: MenuProps['onClick'] = (e) => {
		navigate(e.key);
	};

	return (
		<div>
			<Layout.Header className="flex items-center bg-white sm:px-4 px-2">
				<Link to="/">
					<div className="demo-logo text-black sm:pr-10 font-bold sm:text-3xl text-xl">
						<span className="max-sm:hidden">
							Good <span style={{ color: colorPrimary }}>Will</span> Gwei
						</span>
						<span className="sm:hidden">
							G<span style={{ color: colorPrimary }}>W</span>G
						</span>
					</div>
				</Link>
				<Menu
					style={{ flex: 'auto', minWidth: 0 }}
					mode="horizontal"
					onClick={onClick}
					selectedKeys={[location.pathname]}
					items={items}
				/>
				<a href="https://github.com/lupakgabor/good-will-gwei" target="_blank" rel="noopener noreferrer">
					<Avatar size={40} className="text-white hover:bg-blue-500" icon={<GithubOutlined />} />
				</a>
			</Layout.Header>
			<Alert
				message={
					<span>
						This is only a Sepolia <b>Testnet</b> application!
					</span>
				}
				type="warning"
				banner
			/>
		</div>
	);
};
