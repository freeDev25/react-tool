import './App.css'
import Home from './pages/Home'
import { ToastProvider } from './context/ToastContext'

function App() {
  return (
    <ToastProvider>
      <Home />
    </ToastProvider>
  )
}

export default App
