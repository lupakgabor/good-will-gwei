import { TransactionFailed, TransactionInProgress } from '@/components';
import { useEffect, useId } from 'react';
import { toast } from 'react-toastify';
import { useSendTransaction, useWaitForReceipt } from 'thirdweb/react';

export const useSendTx = () => {
	const toastId = useId();
	const { mutate: sendTx, data: transactionResult } = useSendTransaction();
	const { data: receipt, isLoading } = useWaitForReceipt(transactionResult);

	useEffect(() => {
		if (isLoading && transactionResult) {
			toast.warning(<TransactionInProgress hash={transactionResult.transactionHash!} />, {
				position: 'top-center',
				autoClose: false,
				isLoading: true,
				toastId,
			});
		}
	}, [isLoading]);

	useEffect(() => {
		if (receipt?.status === 'success') {
			toast.success('Transactions successfully finished! 🎉');
		} else if (receipt?.status === 'reverted') {
			toast.error(<TransactionFailed hash={transactionResult?.transactionHash!} />, {
				position: 'top-center',
				autoClose: false,
			});
		}
		if (receipt) {
			toast.dismiss(toastId);
		}
	}, [receipt?.status]);

	return sendTx;
};
