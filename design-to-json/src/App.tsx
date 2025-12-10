import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Home from './pages/Home';
import CraftHome from './pages/CraftHome'
import { ToastProvider } from './context/ToastContext'

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/craft" element={<CraftHome />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  )
}

export default App
