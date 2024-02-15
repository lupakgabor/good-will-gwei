import {BasePage, ContentBody, ContentHeader} from "@/components";
import {ConnectButton} from "./components";

const MAIN_COLOR = '#747bff';

export const WAGMI = () => {
    return (
        <BasePage>
            <ContentHeader bgColor={MAIN_COLOR} title="WAGMI">
                <ConnectButton />
            </ContentHeader>
            <ContentBody>
                <div>
                    WAGMI
                </div>
            </ContentBody>
        </BasePage>
    )
}