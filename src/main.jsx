import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import store from './services/store'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LoginContextProvider } from './LoginContext'

const queryClient = new QueryClient()
const root = ReactDOM.createRoot(document.getElementById('root'))
const renderApp = () => {
    root.render(
        <LoginContextProvider>
            <QueryClientProvider client={queryClient}>
                <App />
            </QueryClientProvider>
        </LoginContextProvider>
    )
}
renderApp()
store.subscribe(renderApp)