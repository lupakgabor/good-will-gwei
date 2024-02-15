import {Card} from "antd";
import {Charity} from "@/types";
import {compareAddresses} from "@/pages/Alchemy/utils";
import {DonateButton, RemoveButton, WithdrawButton} from "@/components";
import {ethers} from "ethers";

type CharityCard = Charity & {
    onDonate: (address: string, amount: number) => void;
    onWithdraw: () => void;
    onRemove: (address: string) => void;
    walletAddress?: string;
    manager?: string;
}

export const CharityCard = (props: CharityCard) => {
    const isManager = props.manager && compareAddresses(props.walletAddress, props.manager);
    const isCharityManager = props.walletAddress && compareAddresses(props.charityAddress, props.walletAddress);

    return (
        <Card
            style={{width: 300}}
            cover={<img alt="example" src={`https://cataas.com/cat/cute?width=300&height=200&rand=${props.name}"`} />}
            actions={[
                <DonateButton
                    charityName={props.name}
                    onDonate={(amount) => props.onDonate(props.charityAddress, amount)}
                    disabled={!props.walletAddress}
                />,
                <WithdrawButton
                    onConfirm={() => props.onWithdraw()}
                    disabled={!isCharityManager}
                />,
                <RemoveButton
                    onConfirm={() => props.onRemove(props.charityAddress)}
                    disabled={!isManager}
                />,
            ]}
        >
            <div className="font-bold text-lg">{props.name}</div>
            <p className="h-28 text-ellipsis overflow-hidden">{props.description}</p>

            <div className="font-bold mt-3">Balance: {ethers.utils.formatEther(props.balance)}</div>
        </Card>
    )
}