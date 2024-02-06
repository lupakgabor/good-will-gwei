import {Charity} from "@/types";
import { mockAddresses} from "@/__mocks__/Address";

export const mockCharity: Charity = {
    withdrawAddress: mockAddresses[0],
    name: 'Age of Hope',
    description: 'In addition to organizing camps, we organize regular fundraisers with the help of our sponsors and partner organizations.',
    balance: 123,
    imageUrl: 'https//mock.aoh',
}

export const mockCharities: Charity[] = [
    mockCharity,
    {
        withdrawAddress: mockAddresses[1],
        name: 'WFP',
        description: 'The World Food Programme is an international organization within the United Nations that provides food assistance worldwide.',
        balance: 300000,
        imageUrl: 'https//mock.wfp',
    }
]