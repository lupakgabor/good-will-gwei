import {useEffect, useState} from "react";
import {Button, Flex} from "antd";
import {toast} from "react-toastify";
import {Charity} from "@/types";
import {BasePage, ContentHeader, AddCharityCard, Owner, AddCharityModal, CharityCard, ContentBody} from "@/components";
import {useWallet, useSendTransaction} from "./hooks";
import {compareAddresses, formatAddress} from "./utils";
import {donate} from "./contracts/Donate";


const MAIN_COLOR = '#21aeef';

// TODO: fetch this data from contract
const charitiesAddress = [
    '0x11512b94f41729e2f8bd914875fb269941977644',
    '0x316b6f634d700762de60dd9912019327c56c66ae',
    '0x6e1c39Ee302e48Bf604A256b2Cb6f8e00c16cAEC',
]

export const Alchemy = () => {
    const {isLoading, sendTransaction} = useSendTransaction();
    const {connectWallet, address} = useWallet();
    const [owner, setOwner] = useState('');
    const [isNewCharityModalOpen, setIsNewCharityModalOpen] = useState(false);
    const [charities, setCharities] = useState<Charity[]>([])
    const isOwner = compareAddresses(owner, address);
    const disableEdit = address === null || !window.ethereum;

    useEffect(() => {
        if (!window.ethereum) {
            toast.warning('You must install Metamask to interact with this website!')
        }
    }, []);

    useEffect(() => {
        if (!isLoading) {
            fetchOwner();
            fetchCharities(charitiesAddress);
        }
    }, [isLoading]);

    const fetchOwner = async () => {
        setOwner(await donate.methods.owner().call());
    }

    const fetchCharities = async (addresses: string[]) => {
        // TODO: batch request would be more efficient
        setCharities(await Promise.all(
            addresses.map((address) => donate.methods.charities(address).call())
        ))
    }

    const beTheOwner = async (address: string) => {
        const callData = donate.methods.beTheOwner().encodeABI();
        await sendTransaction(address, callData, 50000);
    }

    const addNewCharity = async (values: Charity) => {
        const callData = donate.methods.addCharity(values.withdrawAddress, values.name, values.description).encodeABI();
        await sendTransaction(address, callData, 150000);
    }

    return (
        <BasePage>
            <ContentHeader bgColor={MAIN_COLOR} title="Alchemy">
                <Button type={"primary"} onClick={connectWallet}>
                    {address.length > 0 ? `Connected: ${formatAddress(address)}` : 'Connect Wallet'}
                </Button>
            </ContentHeader>
            <ContentBody>
                <Owner color={MAIN_COLOR} owner={owner} address={address} onBeTheOwner={beTheOwner}/>
                <Flex justify='space-around'>
                    {charities.map(charity => <CharityCard key={charity.withdrawAddress} {...charity} />)}
                    <AddCharityCard disabled={disableEdit || !isOwner} onClick={() => setIsNewCharityModalOpen(true)}/>
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