import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'

const HomePage = lazy(() => import('./pages/HomePage'))
const NetPlusPage = lazy(() => import('./pages/NetPlusPage'))
const AWSPage = lazy(() => import('./pages/AWSPage'))
const VLSMPage = lazy(() => import('./pages/VLSMPage'))
const CLIPage = lazy(() => import('./pages/CLIPage'))
const VPCPage = lazy(() => import('./pages/VPCPage'))
const FlashcardPage = lazy(() => import('./pages/FlashcardPage'))
const SubnetDrillPage = lazy(() => import('./pages/SubnetDrillPage'))
const SearchPage = lazy(() => import('./pages/SearchPage'))
const NetPlusTestPage = lazy(() =>
  import('./pages/TestPages').then(m => ({ default: m.NetPlusTestPage }))
)
const AWSTestPage = lazy(() =>
  import('./pages/TestPages').then(m => ({ default: m.AWSTestPage }))
)

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="w-6 h-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Nav />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/netplus" element={<NetPlusPage />} />
            <Route path="/netplus/test" element={<NetPlusTestPage />} />
            <Route path="/aws" element={<AWSPage />} />
            <Route path="/aws/test" element={<AWSTestPage />} />
            <Route path="/vlsm" element={<VLSMPage />} />
            <Route path="/cli" element={<CLIPage />} />
            <Route path="/vpc" element={<VPCPage />} />
            <Route path="/flashcards" element={<FlashcardPage />} />
            <Route path="/subnet-drill" element={<SubnetDrillPage />} />
            <Route path="/search" element={<SearchPage />} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  )
}
