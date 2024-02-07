import {Button, Form, Input, Modal} from "antd";
import {useState} from "react";


type DonateButtonType = {
    charityName: string;
    onDonate: (amount: number) => void;
    disabled: boolean;
}

export const DonateButton = ({charityName, onDonate, disabled}: DonateButtonType) => {
    const [form] = Form.useForm();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <Button className='text-green-500' type="link" disabled={disabled} onClick={() => setIsOpen(true)}>Donate</Button>
            <Modal
                open={isOpen}
                title={`Donate to ${charityName}`}
                okText="Send"
                cancelText="Cancel"
                onCancel={() => setIsOpen(false)}
                onOk={() => {
                    form
                        .validateFields()
                        .then((values) => {
                            form.resetFields();
                            onDonate(values.amount);
                            setIsOpen(false);
                        })
                }}
            >
                <Form
                    form={form}
                    name="donate"
                    initialValues={{amount: 0.01}}
                >
                    <Form.Item
                        name="amount"
                        label="Amount"
                        rules={[{required: true, message: 'Please input the amount you wish to donate!'}]}
                    >
                        <Input type='number' addonAfter="ETH"/>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}