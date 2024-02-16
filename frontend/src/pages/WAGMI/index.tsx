import {
    AddCharityCard,
    AddCharityModal,
    BasePage,
    CharityCard,
    ContentBody,
    ContentHeader,
    Manager
} from "@/components";
import {ConnectButton} from "./components";
import {useFetchCharities, useFetchContractData, useRefreshObserver, useWriteContractData} from "./hooks";
import {useAccount} from "wagmi";
import {Flex} from "antd";
import {compareAddresses} from "@/pages/Alchemy/utils";
import {useState} from "react";


const MAIN_COLOR = '#747bff';

export const WAGMI = () => {
    const {subscribe, notify} = useRefreshObserver();
    const {manager} = useFetchContractData(subscribe);
    const {beTheManager} = useWriteContractData(notify);

    const charities = useFetchCharities();
    const account = useAccount();
    const isManager = compareAddresses(manager, account.address);
    const [isNewCharityModalOpen, setIsNewCharityModalOpen] = useState(false);


    return (
        <BasePage>
            <ContentHeader bgColor={MAIN_COLOR} title="WAGMI">
                <ConnectButton/>
            </ContentHeader>
            <ContentBody>
                <Manager
                    color={MAIN_COLOR}
                    manager={manager}
                    address={account.address} onBeTheManager={beTheManager}
                />

                <Flex justify='space-around'>
                    {charities.map(charity => <CharityCard
                        key={charity.charityAddress}
                        {...charity}
                        manager={manager}
                        walletAddress={account.address}
                        onDonate={console.log}
                        onWithdraw={console.log}
                        onRemove={console.log}
                    />)}
                    <AddCharityCard
                        disabled={!account.address || !isManager}
                        onClick={() => setIsNewCharityModalOpen(true)}
                    />
                </Flex>
            </ContentBody>
            <AddCharityModal
                isOpen={isNewCharityModalOpen}
                handleClose={() => setIsNewCharityModalOpen(false)}
                onCreate={console.log}
            />
        </BasePage>
    )
}