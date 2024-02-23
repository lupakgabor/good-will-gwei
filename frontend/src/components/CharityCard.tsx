import {Card} from "antd";
import {Charity} from "@/types";
import {compareAddresses} from "@/utils";
import {DonateButton, RemoveButton, WithdrawButton} from "@/components";
import {ethers} from "ethers";

type CharityCard = {
    charity: Charity;
    onDonate: (address: `0x${string}`, amount: number) => void;
    onWithdraw: () => void;
    onRemove: (address: `0x${string}`) => void;
    walletAddress?: `0x${string}`;
    manager?: `0x${string}`;
}

export const CharityCard = (props: CharityCard) => {
    const isManager = props.manager && compareAddresses(props.walletAddress, props.manager);
    const isCharityManager = props.walletAddress && compareAddresses(props.charity.charityAddress, props.walletAddress);

    return (
        <Card
            style={{width: 300}}
            cover={<img alt="example" src={`https://cataas.com/cat/cute?width=300&height=200&rand=${props.charity.name}"`} />}
            actions={[
                <DonateButton
                    charityName={props.charity.name}
                    onDonate={(amount) => props.onDonate(props.charity.charityAddress, amount)}
                    disabled={!props.walletAddress}
                />,
                <WithdrawButton
                    onConfirm={() => props.onWithdraw()}
                    disabled={!isCharityManager}
                />,
                <RemoveButton
                    onConfirm={() => props.onRemove(props.charity.charityAddress)}
                    disabled={!isManager}
                />,
            ]}
        >
            <div className="font-bold text-lg">{props.charity.name}</div>
            <p className="h-28 text-ellipsis overflow-hidden">{props.charity.description}</p>

            <div className="font-bold mt-3">Balance: {ethers.utils.formatEther(props.charity.balance)}</div>
        </Card>
    )
}