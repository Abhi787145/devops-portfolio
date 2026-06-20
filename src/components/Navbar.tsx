import React, { useState, useEffect } from 'react';
import './styles/Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <a href="#" class="logo">
          <span class="console-prefix">devops-console:</span><span class="console-user">~asharma</span>
        </a>
        <nav className={`nav-menu ${mobileOpen ? 'open' : ''}`}>
          <a href="#overview" className="nav-link" onClick={() => setMobileOpen(false)}>Overview</a>
          <a href="#about" className="nav-link" onClick={() => setMobileOpen(false)}>About</a>
          <a href="#infrastructure" className="nav-link" onClick={() => setMobileOpen(false)}>Infrastructure</a>
          <a href="#pipelines" className="nav-link" onClick={() => setMobileOpen(false)}>Pipelines</a>
          <a href="#projects" className="nav-link" onClick={() => setMobileOpen(false)}>Projects</a>
          <a href="#experience" className="nav-link" onClick={() => setMobileOpen(false)}>Experience</a>
          <a href="#credentials" className="nav-link" onClick={() => setMobileOpen(false)}>Credentials</a>
          <a href="#contact" className="nav-link contact-btn-nav" onClick={() => setMobileOpen(false)}>Contact Gateway</a>
        </nav>
        <button 
          className="mobile-toggle" 
          onClick={() => setMobileOpen(!mobileOpen)} 
          aria-label="Toggle Menu"
        >
          <i className={`fa-solid ${mobileOpen ? 'fa-xmark' : 'fa-bars-staggered'}`}></i>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
