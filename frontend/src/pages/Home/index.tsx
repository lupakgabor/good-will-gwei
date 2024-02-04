import {BasePage} from "@/components";
import {Card, Flex, Typography} from "antd";
import jsonRPC from "../../assets/json-rpc.jpg";
import alchemy from "../../assets/alchemy.png";
import wagmi from "../../assets/wagmi.png";
import {Link} from "react-router-dom";

export const Home = () => {
    return (
        <BasePage>
            <Typography>
                <Typography.Title className="text-center !mx-10 !mb-10">Empower Charities with the Power of
                    Web3</Typography.Title>

                <Typography.Paragraph className="text-center mx-32 !mb-10 text-xl">
                    Welcome to Good Will Gwei, the groundbreaking platform that revolutionizes the way we support
                    charities.
                    With the power of web3, we provide a secure and transparent environment for users to register
                    various
                    charity organizations and send donations directly to them.
                </Typography.Paragraph>
            </Typography>


            <Flex justify='space-around'>
                <Link to="/json-rpc" className="w-1/4">
                    <Card
                        hoverable
                        cover={<img alt="json-rpc" src={jsonRPC} className="h-96"/>}
                    >
                        <Card.Meta title="JSON-RPC"
                                   description="JSON-RPC is a stateless, light-weight remote procedure call (RPC) protocol."/>
                    </Card>
                </Link>
                <Link to="/alchemy" className="w-1/4">
                    <Card
                        hoverable

                        cover={<img alt="aclhemy" src={alchemy} className="h-96"/>}
                    >
                        <Card.Meta title="Alchemy"
                                   description="The Alchemy SDK is the easiest way to connect your dApp to the blockchain."/>
                    </Card>
                </Link>
                <Link to="/wagmi" className="w-1/4">
                    <Card
                        hoverable
                        cover={<img alt="wagmi" src={wagmi} className="h-96"/>}
                    >
                        <Card.Meta title="WAGMI"
                                   description="Type Safe, Extensible, and Modular by design. Build high-performance blockchain frontends."/>
                    </Card>
                </Link>
            </Flex>
        </BasePage>
    )
}