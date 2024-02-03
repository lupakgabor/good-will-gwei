import {ReactNode} from "react";

type BasePageProps = {
    children: ReactNode;
}

export const BasePage = ({children}: BasePageProps) => {
    return (
        <div>
            NAVBAR
            {children}
        </div>
    )
}