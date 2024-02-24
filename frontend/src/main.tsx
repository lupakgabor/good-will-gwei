import React from 'react';
import ReactDOM from 'react-dom/client';

import { Alchemy } from '@/pages/Alchemy';
import { Home } from '@/pages/Home';
import { JSONRPC } from '@/pages/JSONRPC';
import { WAGMI } from '@/pages/WAGMI';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { WagmiProvider } from 'wagmi';
import './index.css';
import { config } from './wagmi';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<BrowserRouter>
			<Routes>
				<Route element={<Home />} path="/" />
				<Route element={<JSONRPC />} path="json-rpc" />
				<Route element={<Alchemy />} path="alchemy" />
				<Route
					element={
						<WagmiProvider config={config}>
							<QueryClientProvider client={queryClient}>
								<WAGMI />
							</QueryClientProvider>
						</WagmiProvider>
					}
					path="wagmi"
				/>
			</Routes>
		</BrowserRouter>
		<ToastContainer />
	</React.StrictMode>,
);
