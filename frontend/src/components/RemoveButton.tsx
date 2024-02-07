import {Button, Popconfirm} from "antd";

export const RemoveButton = ({onConfirm, disabled}: {onConfirm: () => void, disabled: boolean}) => (
    <Popconfirm
        title="Remove charity"
        description="Are you sure to remove this charity?"
        onConfirm={onConfirm}
        okText="Yes"
        cancelText="No"
    >
        <Button className='text-red-500' type="link" disabled={disabled}>Remove</Button>
    </Popconfirm>
);