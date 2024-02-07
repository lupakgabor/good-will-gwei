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
                    element={<WAGMI/>}
                    path="wagmi"
                />
            </Routes>
        </BrowserRouter>
        <ToastContainer />
    </React.StrictMode>,
)
