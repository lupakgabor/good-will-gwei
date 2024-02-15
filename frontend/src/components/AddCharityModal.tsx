import {Form, Input, Modal} from 'antd';
import {Charity} from "@/types";
import {useState} from "react";

type AddCharityModalProps = {
    isOpen: boolean;
    handleClose: () => void;
    onCreate: (values: Charity) => void;
}

export const AddCharityModal = ({isOpen, handleClose, onCreate}: AddCharityModalProps) => {
    const [form] = Form.useForm();
    const [confirmLoading, setConfirmLoading] = useState(false);

    return (
        <>
            <Modal
                title="Add new charity"
                open={isOpen} onCancel={handleClose}
                confirmLoading={confirmLoading}
                onOk={async () => {
                    const values = await form.validateFields();
                    setConfirmLoading(true);
                    await onCreate(values);
                    setConfirmLoading(false);
                    form.resetFields();
                    handleClose();
                }}
            >
                <Form
                    form={form}
                    name="add-charity"
                    labelCol={{span: 8}}
                    wrapperCol={{span: 16}}
                    style={{maxWidth: 600}}
                    initialValues={{
                        charityAddress: '0x6e1c39Ee302e48Bf604A256b2Cb6f8e00c16cAEC',
                        name: 'Age Of Hope',
                        description: 'In addition to organizing camps, we organize regular fundraisers with the help of our sponsors and partner organizations.',
                    }}
                >
                    <Form.Item<Charity>
                        label="Address"
                        name="charityAddress"
                        rules={[{required: true, message: 'Please input address!'}]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item<Charity>
                        label="Name"
                        name="name"
                        rules={[{required: true, message: 'Please input name!'}]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item<Charity>
                        label="Description"
                        name="description"
                        rules={[{required: true, message: 'Please input description!'}]}
                    >
                        <Input.TextArea/>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};
