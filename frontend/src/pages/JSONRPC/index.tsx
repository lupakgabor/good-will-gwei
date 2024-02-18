import {BasePage, ContentHeader} from "@/components";
import {ContentBody} from "@/components/ContentBody";
import {ConnectButton, Wallet} from "./components";
import {useState} from "react";

const MAIN_COLOR = '#ecae7f'


export const JSONRPC = () => {
    const [wallet, setWallet] = useState<Wallet | null>(null)

    return (
        <BasePage>
            <ContentHeader bgColor={MAIN_COLOR} title="JSON-RPC">
              <ConnectButton onSetWallet={setWallet}/>
            </ContentHeader>
            <ContentBody>
                <h3>Address {wallet?.address}</h3>
            </ContentBody>
        </BasePage>
    )
}