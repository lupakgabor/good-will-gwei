import {RefetchOptions} from "@tanstack/react-query";
import {useState} from "react";


export type Observer = (options?: (RefetchOptions | undefined)) => void;

export const useRefreshObserver = () => {
    const [observers, setObservers] = useState<Observer[]>([]);

    const subscribe = (fn: Observer) => {
        setObservers(prevState => [
            ...prevState,
            fn,
        ]);
    }

    const notify = () => {
        observers.forEach((observer) => observer());
    }

    return {
        subscribe,
        notify,
    }
}