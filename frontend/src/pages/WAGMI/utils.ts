import {toast} from "react-toastify";

type ErrorHandlerProps = {
    message: string;
    details?: string;
}

export const errorHandler = (error?: ErrorHandlerProps | null) => {
    if (error) {
        if ('details' in error) {
            toast.error(error.details)
        } else {
            toast.error(error.message)
        }
    }
}