import {useEffect, useState} from "react";
import {Button, Flex} from "antd";
import {toast} from "react-toastify";
import {Charity} from "@/types";
import {
    BasePage,
    ContentHeader,
    AddCharityCard,
    Manager,
    AddCharityModal,
    CharityCard,
    ContentBody
} from "@/components";
import {useWallet, useSendTransaction} from "./hooks";
import {compareAddresses, formatAddress} from "./utils";
import {donate} from "./contracts/Donate";

const MAIN_COLOR = '#21aeef';

export const Alchemy = () => {
    const {isLoading, sendTransaction} = useSendTransaction();
    const {connectWallet, walletAddress} = useWallet();
    const [manager, setManager] = useState('');
    const [isNewCharityModalOpen, setIsNewCharityModalOpen] = useState(false);
    const [charities, setCharities] = useState<Charity[]>([])
    const isManager = compareAddresses(manager, walletAddress);
    const disableEdit = walletAddress === null || !window.ethereum;

    useEffect(() => {
        if (!window.ethereum) {
            toast.warning('You must install Metamask to interact with this website!')
        }
    }, []);

    useEffect(() => {
        if (!isLoading) {
            fetchManager();
            fetchCharities();
        }
    }, [isLoading]);

    const fetchManager = async () => {
        setManager(await donate.methods.manager().call());
    }

    const fetchCharities = async () => {
        const addresses: string[] = (await donate.methods.getAllCharityAddress().call())
            .filter((address: string) => Number(address));

        // TODO: batch request would be more efficient
        setCharities(await Promise.all(
            addresses.map((address) => donate.methods.charities(address).call())
        ))
    }

    const beTheManager = async (address: string) => {
        const callData = donate.methods.beTheManager().encodeABI();
        await sendTransaction(address, callData, 150000);
    }

    const addNewCharity = async (values: Charity) => {
        const callData = donate.methods.addCharity(values.charityAddress, values.name, values.description).encodeABI();
        await sendTransaction(walletAddress, callData, 250000);
    }

    const donateToCharity = async (address: string, amount: number) => {
        const callData = donate.methods.donate(address).encodeABI();
        await sendTransaction(walletAddress, callData, 150000, amount);
    }

    const withdrawFunds = async () => {
        const callData = donate.methods.withdraw().encodeABI();
        await sendTransaction(walletAddress, callData, 150000);
    }

    const removeCharity = async (address: string) => {
        const callData = donate.methods.removeCharity(address).encodeABI();
        await sendTransaction(walletAddress, callData, 150000);
    }

    return (
        <BasePage>
            <ContentHeader bgColor={MAIN_COLOR} title="Alchemy">
                <Button type={"primary"} onClick={connectWallet}>
                    {walletAddress.length > 0 ? `Connected: ${formatAddress(walletAddress)}` : 'Connect Wallet'}
                </Button>
            </ContentHeader>
            <ContentBody>
                <Manager color={MAIN_COLOR} manager={manager} address={walletAddress} onBeTheManager={beTheManager}/>
                <Flex justify='space-around'>
                    {charities.map(charity => <CharityCard
                        key={charity.charityAddress}
                        {...charity}
                        manager={manager}
                        walletAddress={walletAddress}
                        onDonate={donateToCharity}
                        onWithdraw={withdrawFunds}
                        onRemove={removeCharity}
                    />)}
                    <AddCharityCard
                        disabled={disableEdit || !isManager}
                        onClick={() => setIsNewCharityModalOpen(true)}
                    />
                </Flex>
            </ContentBody>
            <AddCharityModal
                isOpen={isNewCharityModalOpen}
                handleClose={() => setIsNewCharityModalOpen(false)}
                onCreate={addNewCharity}
            />
        </BasePage>
    )
}