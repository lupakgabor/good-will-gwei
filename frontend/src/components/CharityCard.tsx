import {Card} from "antd";
import {Charity} from "@/types";
import {compareAddresses} from "@/pages/Alchemy/utils";
import {DonateButton, RemoveButton, WithdrawButton} from "@/components";
import {ethers} from "ethers";

type CharityCard = Charity & {
    onDonate: (address: string, amount: number) => void;
    onWithdraw: () => void;
    onRemove: (address: string) => void;
    walletAddress: string;
    owner: string;
}

export const CharityCard = (props: CharityCard) => {
    const isOwner = props.owner && compareAddresses(props.walletAddress, props.owner);
    const isCharityOwner = props.walletAddress && compareAddresses(props.withdrawAddress, props.walletAddress);

    return (
        <Card
            style={{width: 300}}
            cover={<img alt="example" src="http://placekitten.com/g/200/150"/>}
            actions={[
                <DonateButton
                    charityName={props.name}
                    onDonate={(amount) => props.onDonate(props.withdrawAddress, amount)}
                    disabled={!props.walletAddress}
                />,
                <WithdrawButton
                    onConfirm={() => props.onWithdraw()}
                    disabled={!isCharityOwner}
                />,
                <RemoveButton
                    onConfirm={() => props.onRemove(props.withdrawAddress)}
                    disabled={!isOwner}
                />,
            ]}
        >
            <div className="font-bold text-lg">{props.name}</div>
            <div>{props.description}</div>

            <div>Balance: {ethers.utils.formatEther(props.balance)}</div>
        </Card>
    )
}