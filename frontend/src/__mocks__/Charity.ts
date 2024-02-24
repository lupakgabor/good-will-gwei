import { mockAddresses } from '@/__mocks__/Address';
import { Charity } from '@/types';

export const mockCharity: Charity = {
	charityAddress: mockAddresses[0],
	name: 'Age of Hope',
	description:
		'In addition to organizing camps, we organize regular fundraisers with the help of our sponsors and partner organizations.',
	balance: 123,
};

export const mockCharities: Charity[] = [
	mockCharity,
	{
		charityAddress: mockAddresses[1],
		name: 'WFP',
		description:
			'The World Food Programme is an international organization within the United Nations that provides food assistance worldwide.',
		balance: 300000,
	},
];
