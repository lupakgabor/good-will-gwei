import { contract } from '@/pages/Thirdweb/constants';
import { Charity } from '@/types';
import { useEffect, useState } from 'react';
import { readContract } from 'thirdweb';
import { useReadContract } from 'thirdweb/react';

export const useReadCharities = () => {
	const [charities, setCharities] = useState<Charity[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	const { data: addresses } = useReadContract({
		contract,
		method: 'getAllCharityAddress',
	});

	useEffect(() => {
		if (addresses) {
			setIsLoading(true);
			const filteredAddresses = addresses?.filter((address: string) => Number(address));

			Promise.all(
				filteredAddresses.map(async (address) => {
					return await readContract({
						contract: contract,
						method: 'charities',
						params: [address],
					});
				}),
			).then((charityResults) => {
				const charities: Charity[] =
					charityResults.map((data) => ({
						charityAddress: data[0] as `0x${string}`,
						name: data[1],
						description: data[2],
						balance: data[3] as unknown as bigint,
					})) ?? [];
				setCharities(charities);
				setIsLoading(false);
			});
		}
	}, [addresses]);

	return {
		charities,
		isLoading,
	};
};
