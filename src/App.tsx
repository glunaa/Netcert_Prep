import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import HomePage from './pages/HomePage'
import NetPlusPage from './pages/NetPlusPage'
import AWSPage from './pages/AWSPage'
import VLSMPage from './pages/VLSMPage'
import CLIPage from './pages/CLIPage'
import VPCPage from './pages/VPCPage'
import { NetPlusTestPage, AWSTestPage } from './pages/TestPages'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Nav />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/netplus" element={<NetPlusPage />} />
          <Route path="/netplus/test" element={<NetPlusTestPage />} />
          <Route path="/aws" element={<AWSPage />} />
          <Route path="/aws/test" element={<AWSTestPage />} />
          <Route path="/vlsm" element={<VLSMPage />} />
          <Route path="/cli" element={<CLIPage />} />
          <Route path="/vpc" element={<VPCPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}