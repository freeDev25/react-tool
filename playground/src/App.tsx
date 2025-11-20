import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Playground from './pages/Playground'
import Generate from './pages/Generate'

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Playground />} />
          <Route path="/generate" element={<Generate />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
