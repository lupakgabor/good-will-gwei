import { AppstoreOutlined, GithubOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Layout, Menu, theme } from 'antd';
import type { MenuProps } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const items: MenuProps['items'] = [
	{
		label: 'JSON-RPC',
		key: '/json-rpc',
		icon: <MailOutlined />,
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
		<Layout.Header className="flex items-center bg-white">
			<Link to="/">
				<div className="demo-logo text-black pr-10 font-bold text-3xl">
					Good <span style={{ color: colorPrimary }}>Will</span> Gwei
				</div>
			</Link>
			<Menu mode="horizontal" onClick={onClick} selectedKeys={[location.pathname]} items={items} className="flex-1" />
			<a href="https://github.com/lupakgabor/good-will-gwei" target="_blank" rel="noopener noreferrer">
				<Avatar size="large" className="text-white hover:bg-blue-500" icon={<GithubOutlined />} />
			</a>
		</Layout.Header>
	);
};
