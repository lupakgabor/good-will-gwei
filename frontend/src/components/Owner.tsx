import {compareAddresses, formatAddress} from "@/pages/Alchemy/utils";
import {Button} from "antd";

type OwnerProps = {
    color: string;
    owner: string;
    address: string;
}

export const Owner = ({color, owner, address}: OwnerProps) => {
    const isOwner = compareAddresses(owner, address);

    return (
        <div className="flex items-center justify-between mb-10">
            <h1 style={{color: color}}>{isOwner ? 'You are the owner!' : `Owner is: ${formatAddress(owner)}`}</h1>
            {(!isOwner && address) && <Button>Be the Owner!</Button>}
        </div>
    )
}