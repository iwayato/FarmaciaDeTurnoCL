import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import { Analytics } from "@vercel/analytics/react"
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <ChakraProvider>
        <App />
        <Analytics/>
    </ChakraProvider>
)