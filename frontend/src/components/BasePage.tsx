import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Layout } from 'antd';
import { ReactNode } from 'react';

type BasePageProps = {
	children: ReactNode;
};

export const BasePage = ({ children }: BasePageProps) => {
	return (
		<Layout className="h-full">
			<Header />
			<Layout.Content className="mt-5 px-20">{children}</Layout.Content>
			<Footer />
		</Layout>
	);
};
