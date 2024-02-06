import {ReactNode} from "react";
import {theme} from "antd";


export const ContentBody = ({children}: { children: ReactNode }) => {
    const {
        token: {colorBgContainer},
    } = theme.useToken();

    return (
        <div
            className="p-10 min-h-80 rounded-b-md"
            style={{
                background: colorBgContainer,
            }}>
            {children}
        </div>
    )
}