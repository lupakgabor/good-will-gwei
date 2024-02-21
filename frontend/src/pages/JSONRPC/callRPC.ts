import {toast} from "react-toastify";

export const callRPC = async (method: string, params: any[]) => {
    try {
        const response = await fetch(import.meta.env.VITE_RPC_URL, {
            method: "POST",
            body: JSON.stringify({
                jsonrpc: '2.0',
                method,
                params,
            }),
        });

        const json = await response.json();

        if ('error' in json) {
            toast.error(json.error.message);
        } else {
            return json.result;
        }
    } catch (error) {
        let message = 'Unknown Error'
        if (error instanceof Error) message = error.message
        toast.error(message);
    }
}