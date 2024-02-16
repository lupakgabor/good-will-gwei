import React from 'react'
import ReactDOM from 'react-dom/client'

import {Home} from "@/pages/Home";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {JSONRPC} from "@/pages/JSONRPC";
import {Alchemy} from "@/pages/Alchemy";
import {WAGMI} from "@/pages/WAGMI";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './index.css'
import {WagmiProvider} from "wagmi";
import {config} from "./wagmi";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route
                    element={<Home/>}
                    path="/"
                />
                <Route
                    element={<JSONRPC/>}
                    path="json-rpc"
                />
                <Route
                    element={<Alchemy/>}
                    path="alchemy"
                />
                <Route
                    element={(
                        <WagmiProvider config={config}>
                            <QueryClientProvider client={queryClient}>
                                <WAGMI/>
                            </QueryClientProvider>
                        </WagmiProvider>
                    )}
                    path="wagmi"
                />
            </Routes>
        </BrowserRouter>
        <ToastContainer/>
    </React.StrictMode>,
)
