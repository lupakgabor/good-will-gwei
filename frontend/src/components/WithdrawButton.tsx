import {Button, Popconfirm} from "antd";

export const WithdrawButton = ({onConfirm, disabled}: {onConfirm: () => void, disabled: boolean}) => (
    <Popconfirm
        title="Withdraw funds"
        description="Are you sure to withraw all funds"
        onConfirm={onConfirm}
        okText="Yes"
        cancelText="No"
    >
        <Button className='text-yellow-500' type="link" disabled={disabled}>Withdraw</Button>
    </Popconfirm>
)