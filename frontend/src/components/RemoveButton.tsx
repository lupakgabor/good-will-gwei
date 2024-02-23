import {Button, Popconfirm} from "antd";

type RemoveButtonProps = {
    onConfirm: () => void;
    disabled: boolean;
}


export const RemoveButton = ({onConfirm, disabled}: RemoveButtonProps) => (
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