import {BasePage, ContentBody, ContentHeader} from "@/components";
import {Button} from "antd";


const MAIN_COLOR = '#2535a0';

export const EthersJS = () => {
    return (<BasePage>
            <ContentHeader bgColor={MAIN_COLOR} title="Ethers.js">
                <Button type={'primary'} onClick={console.log} disabled>
                    Connect Wallet
				</Button>
            </ContentHeader>
            <ContentBody>
                Hello from Ethers.js!
            </ContentBody>
        </BasePage>
    )
}