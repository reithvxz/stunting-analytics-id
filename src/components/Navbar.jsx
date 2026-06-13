import React, { useState, useEffect, useRef } from 'react';
import { useFilter } from '../context/FilterContext';
import { ChevronDown, Map } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { selectedIsland, setSelectedIsland, islands } = useFilter();
  const [activeSection, setActiveSection] = useState('overview');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { path: 'overview', label: 'Overview' },
    { path: 'status', label: 'Kinerja Pangan' },
    { path: 'determinants', label: 'Determinan' },
    { path: 'regional', label: 'Regional' },
    { path: 'advanced', label: 'Analisis Mendalam' },
    { path: 'dataset', label: 'Dataset' },
  ];

  const handleScroll = () => {
    const sections = navItems.map(item => item.path);
    const scrollPosition = window.scrollY + 120; // offset for sticky nav

    for (let i = sections.length - 1; i >= 0; i--) {
      const element = document.getElementById(sections[i]);
      if (element && scrollPosition >= element.offsetTop) {
        setActiveSection(sections[i]);
        break;
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  return (
    <nav className="topbar">
      <div className="topbar-container">
        <div 
          className="brand-section" 
          style={{ cursor: 'pointer' }}
          onClick={(e) => scrollToSection(e, 'home')}
        >
          <div className="brand-logo">
            <span className="logo-icon">📊</span>
          </div>
          <h2 className="brand-text">CegahStunting ID</h2>
        </div>

        <div className="topbar-nav">
          <div className="nav-pill-container">
            {navItems.map((item) => (
              <a
                key={item.path}
                href={`#${item.path}`}
                onClick={(e) => scrollToSection(e, item.path)}
                className={`nav-item-top ${activeSection === item.path ? 'active' : ''}`}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        <div className="topbar-right">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Wilayah:</span>
            <div className="custom-dropdown-container" ref={dropdownRef}>
              <div 
                className="custom-dropdown-trigger"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <Map size={16} color="var(--accent-color)" />
                <span style={{flex: 1}}>{selectedIsland}</span>
                <ChevronDown size={16} color="var(--text-secondary)" style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </div>
              
              {dropdownOpen && (
                <div className="custom-dropdown-menu">
                  <div 
                    className={`custom-dropdown-item ${selectedIsland === 'Semua Wilayah' ? 'active' : ''}`}
                    onClick={() => { 
                      setSelectedIsland('Semua Wilayah'); 
                      setDropdownOpen(false); 
                      document.getElementById('status')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Semua Wilayah
                  </div>
                  {islands.map(island => (
                    <div 
                      key={island}
                      className={`custom-dropdown-item ${selectedIsland === island ? 'active' : ''}`}
                      onClick={() => { 
                        setSelectedIsland(island); 
                        setDropdownOpen(false); 
                        document.getElementById('status')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      {island}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
