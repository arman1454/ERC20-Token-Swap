'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode, useState } from 'react'
import { type State, WagmiProvider } from 'wagmi'

import { getConfig } from './wagmi'
import '@rainbow-me/rainbowkit/styles.css';
import "@/styles/globals.css";

import {
    getDefaultConfig,
    RainbowKitProvider,
    lightTheme,
    darkTheme,
    midnightTheme
} from '@rainbow-me/rainbowkit';
import { merge } from 'lodash'

const myTheme = merge(midnightTheme(), {
    colors: {
        accentColor: "#18181b",
        accentColorForeground: "#fff",
    },
});
  

export function WalletProviders(props: {
    children: ReactNode
    initialState?: State
}) {
    const [config] = useState(() => getConfig())
    const [queryClient] = useState(() => new QueryClient())

    return (
        <WagmiProvider config={config} initialState={props.initialState}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider theme={myTheme}>
                    {props.children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    )
}

export default WalletProviders;
