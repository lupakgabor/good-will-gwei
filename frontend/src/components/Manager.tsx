import {compareAddresses, formatAddress} from "@/pages/Alchemy/utils";
import {Button} from "antd";

type ManagerProps = {
    color: string;
    manager?: string;
    address?: string;
    onBeTheManager: (address: string) => void;
}

export const Manager = ({color, manager, address, onBeTheManager}: ManagerProps) => {
    if (!manager && !address) {
        return null;
    }
    const isManager = compareAddresses(manager, address);

    return (
        <div className="flex items-center justify-between mb-10">
            <h1 style={{color: color}}>{isManager ? 'You are the manager!' : `Manager is: ${formatAddress(manager)}`}</h1>
            {!isManager && <Button disabled={!address} onClick={() => onBeTheManager(address!)}>Be the Manager!</Button>}
        </div>
    )
}