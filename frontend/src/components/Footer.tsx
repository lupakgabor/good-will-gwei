import { Layout } from 'antd';

export const Footer = () => {
	return (
		<Layout.Footer style={{ textAlign: 'center' }}>
			Good Will Gwei ©{new Date().getFullYear()} Created by Gabor Lupak
		</Layout.Footer>
	);
};
