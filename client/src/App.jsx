import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import CreateQuest from './pages/CreateQuest.jsx'
import History from './pages/History.jsx'

export default function App() {
  return <div className="app-shell"><Navbar/><Routes><Route path="/" element={<Home/>}/><Route path="/create" element={<CreateQuest/>}/><Route path="/history" element={<History/>}/><Route path="*" element={<Home/>}/></Routes><footer className="site-footer"><a className="brand" href="/"><span className="brand-icon"><span>✿</span></span><span>naturequest<span className="brand-ai">.ai</span></span></a><span>Made for the joy of getting a little lost.</span><span>GO ON, TAKE THE LONG WAY HOME&nbsp; ↗</span></footer></div>
}
