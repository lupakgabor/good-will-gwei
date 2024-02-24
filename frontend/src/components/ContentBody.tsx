import { theme } from 'antd';
import { ReactNode } from 'react';

type ContentBodyProps = {
	children: ReactNode;
};

export const ContentBody = ({ children }: ContentBodyProps) => {
	const {
		token: { colorBgContainer },
	} = theme.useToken();

	return (
		<div
			className="p-10 min-h-80 rounded-b-md"
			style={{
				background: colorBgContainer,
			}}
		>
			{children}
		</div>
	);
};
