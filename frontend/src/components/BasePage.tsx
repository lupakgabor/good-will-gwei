import {ReactNode} from "react";
import { Layout } from 'antd';
import {Header} from "@/components/Header";
import {Footer} from "@/components/Footer";

type BasePageProps = {
    children: ReactNode;
}

export const BasePage = ({children}: BasePageProps) => {

    return (
        <Layout className="h-full">
            <Header />
            <Layout.Content className="mt-5 px-20">
                {children}
            </Layout.Content>
            <Footer />
        </Layout>
    );
}

