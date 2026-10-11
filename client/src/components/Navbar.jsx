import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Leaf, Menu, X } from 'lucide-react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)
  return <header className="navbar"><Link to="/" className="brand" onClick={closeMenu}><span className="brand-icon"><Leaf size={20} /></span><span>naturequest<span className="brand-ai">.ai</span></span></Link><button className="mobile-menu-toggle" type="button" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X size={21}/> : <Menu size={21}/>}</button><nav className={menuOpen ? 'nav-open' : ''} aria-label="Main navigation"><NavLink to="/" end onClick={closeMenu}>Explore</NavLink><NavLink to="/create" onClick={closeMenu}>Create a quest <span className="nav-plus">+</span></NavLink><NavLink to="/history" onClick={closeMenu}>My journey</NavLink></nav><Link to="/create" className="nav-cta">Start exploring <span>↗</span></Link></header>
}
