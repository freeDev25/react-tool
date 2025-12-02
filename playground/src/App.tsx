import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Playground from './pages/Playground'
import Generate from './pages/Generate'
import Builder from './pages/Builder'

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Playground />} />
          <Route path="/generate" element={<Generate />} />
          <Route path="/builder" element={<Builder />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
