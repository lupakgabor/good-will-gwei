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
import {useFetchContractData, useRefreshObserver, useWriteContractData} from "./hooks";
import {useAccount} from "wagmi";
import {Flex, Spin} from "antd";
import {compareAddresses} from "@/utils";
import {useState} from "react";


const MAIN_COLOR = '#747bff';

export const WAGMI = () => {
    const {subscribe, notify} = useRefreshObserver();
    const {manager, charities, isCharitiesLoading} = useFetchContractData(subscribe);
    const {beTheManager, addNewCharity, removeCharity, donateToCharity, withdrawFunds} = useWriteContractData(notify);

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
                <Spin tip='Loading...' size='large' spinning={isCharitiesLoading}>
                    <Flex justify='space-around'>
                        {charities.map(charity => <CharityCard
                            key={charity.charityAddress}
                            charity={charity}
                            manager={manager}
                            walletAddress={account.address}
                            onDonate={donateToCharity}
                            onWithdraw={withdrawFunds}
                            onRemove={removeCharity}
                        />)}
                        <AddCharityCard
                            disabled={!account.address || !isManager}
                            onClick={() => setIsNewCharityModalOpen(true)}
                        />
                    </Flex>
                </Spin>
            </ContentBody>
            <AddCharityModal
                isOpen={isNewCharityModalOpen}
                handleClose={() => setIsNewCharityModalOpen(false)}
                onCreate={addNewCharity}
            />
        </BasePage>
    )
}