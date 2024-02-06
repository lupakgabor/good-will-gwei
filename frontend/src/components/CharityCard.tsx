import {Card} from "antd";
import {Charity} from "@/types";

export const CharityCard = (props: Charity) => {
    return (
        <Card
            style={{width: 300}}
            cover={<img alt="example" src="http://placekitten.com/g/200/100"/>}
            actions={[
                <div>Donate</div>,
                <div>Withdraw</div>,
            ]}
        >
            <div className="font-bold text-lg">{props.name}</div>
            <div>{props.description}</div>

            <div>Balance: {props.balance}</div>
        </Card>
    )
}