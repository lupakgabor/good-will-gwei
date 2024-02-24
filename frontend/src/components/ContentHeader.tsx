import { ReactNode } from 'react';

type ContentHeaderProps = {
	bgColor: string;
	title: string;
	children: ReactNode;
};

export const ContentHeader = ({ bgColor, title, children }: ContentHeaderProps) => {
	return (
		<div
			style={{ backgroundColor: bgColor }}
			className="min-h-16 w-full rounded-t-md flex items-center justify-between"
		>
			<h1 className="text-xl font-bold ml-5 text-white">{title}</h1>
			<div className="mr-5">{children}</div>
		</div>
	);
};
