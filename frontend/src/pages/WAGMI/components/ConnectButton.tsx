import {useAccount, useConnect, useDisconnect} from "wagmi";
import {Button} from "antd";
import {injected} from "wagmi/connectors";
import {formatAddress} from "@/pages/Alchemy/utils";
import {useEffect} from "react";
import {errorHandler} from "@/pages/WAGMI/utils";

export const ConnectButton = () => {
    const account = useAccount()
    const connect = useConnect()
    const {disconnect} = useDisconnect();

    useEffect(() => {
        errorHandler(connect.error)
    }, [connect.isError]);

    return (
        <div>
            {account.status !== 'connected' && (
                <Button type={"primary"} onClick={() => connect.connect({connector: injected()})}
                        loading={connect.isPending}>
                    Connect Wallet
                </Button>
            )}
            {account.status === 'connected' && (
                <Button type={"primary"} onClick={() => disconnect()}>
                    Disconnect: {formatAddress(account.address)}
                </Button>
            )}
        </div>
    )
}