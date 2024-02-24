import { PlusOutlined } from '@ant-design/icons';
import { Card } from 'antd';

type NewCharityCardProps = {
	onClick: () => void;
	disabled: boolean;
};

export const AddCharityCard = ({ onClick, disabled }: NewCharityCardProps) => {
	return (
		<div className="relative">
			<Card
				style={{ width: 300 }}
				hoverable
				className="flex justify-center align-middle items-center flex-col h-full"
				onClick={onClick}
				cover={<PlusOutlined key="ellipsis" size={100} style={{ fontSize: '150px', color: '#08c' }} />}
			>
				<div className="font-bold text-lg">Add new charity!</div>
			</Card>
			{disabled && (
				<div
					className="bg-gray-300 bg-opacity-80 w-full h-full absolute top-0 rounded-xl cursor-not-allowed"
					data-testid="overlay"
				/>
			)}
		</div>
	);
};
