import {AddCharityCard, AddCharityModal, BasePage, CharityCard, ContentHeader, Manager} from "@/components";
import {ContentBody} from "@/components/ContentBody";
import {ConnectButton, Wallet} from "./components";
import {useEffect, useState} from "react";
import {fetchContractData} from "./web3";
import {Charity} from "@/types";
import {Flex, Spin} from "antd";
import {compareAddresses} from "@/pages/Alchemy/utils";


const MAIN_COLOR = '#ecae7f'


export const JSONRPC = () => {
    const [wallet, setWallet] = useState<Wallet | null>(null)
    const [manager, setManager] = useState('');
    const [charities, setCharities] = useState<Charity[]>([])
    const [isCharitiesLoading, setIsCharityLoading] = useState(true);
    const [isNewCharityModalOpen, setIsNewCharityModalOpen] = useState(false);
    const isManager = compareAddresses(manager, wallet?.address);

    useEffect(() => {
        (async () => {
            fetchManager();
            fetchCharities();
        })();
    }, []);


    const fetchManager = async () => {
        setManager(await fetchContractData('manager'))
    }

    const fetchCharities = async () => {
        setIsCharityLoading(true);
        const addresses: `0x${string}`[] = (await fetchContractData('getAllCharityAddress'))
            .filter((address: string) => Number(address));

        // TODO: batch request would be more efficient
        setCharities((await Promise.all(
            addresses.map((address) => fetchContractData('charities', [address]))
        ))?.map((data) => ({
            charityAddress: data[0] as `0x${string}`,
            name: data[1],
            description: data[2],
            balance: data[3] as unknown as bigint,
        })));
        setIsCharityLoading(false);
    }

    return (
        <BasePage>
            <ContentHeader bgColor={MAIN_COLOR} title="JSON-RPC">
                <ConnectButton onSetWallet={setWallet}/>
            </ContentHeader>
            <ContentBody>
                <Manager color={MAIN_COLOR} manager={manager} address={wallet?.address} onBeTheManager={console.log}/>
                <Spin tip='Loading...' size='large' spinning={isCharitiesLoading}>
                    <Flex justify='space-around'>
                        {charities.map(charity => <CharityCard
                            key={charity.charityAddress}
                            {...charity}
                            manager={manager}
                            walletAddress={wallet?.address}
                            onDonate={console.log}
                            onWithdraw={console.log}
                            onRemove={console.log}
                        />)}
                        <AddCharityCard
                            disabled={!wallet?.address || !isManager}
                            onClick={() => setIsNewCharityModalOpen(true)}
                        />
                    </Flex>
                </Spin>
            </ContentBody>
            <AddCharityModal
                isOpen={isNewCharityModalOpen}
                handleClose={() => setIsNewCharityModalOpen(false)}
                onCreate={console.log}
            />
        </BasePage>
    )
}