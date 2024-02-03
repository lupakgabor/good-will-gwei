import {ReactNode} from "react";
import { Layout, theme} from 'antd';
import {Header} from "@/components/Header";
import {Footer} from "@/components/Footer";

type BasePageProps = {
    children: ReactNode;
}

export const BasePage = ({children}: BasePageProps) => {
    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();

    return (
        <Layout className="h-full">
            <Header />
            <Layout.Content className="mt-5 px-20">
                <div
                    className="p-10 min-h-80"
                    style={{
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    {children}
                </div>
            </Layout.Content>
            <Footer />
        </Layout>
    );
}

