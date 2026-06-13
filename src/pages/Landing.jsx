import React from 'react';
import { Database, Activity, PieChart, Map, Brain } from 'lucide-react';
import './Landing.css';

const Landing = () => {
  return (
    <div className="landing-container">
      <nav className="landing-nav-pill">
        <div className="landing-brand">
          <span className="logo-icon-small">📊</span>
          <span className="brand-text-small">CegahStunting ID</span>
        </div>
        <a href="#overview" onClick={(e) => {
              e.preventDefault();
              document.getElementById('overview').scrollIntoView({ behavior: 'smooth' });
            }} className="landing-login-btn">
          Dashboard
        </a>
      </nav>
      
      <main className="hero-section">
        <div className="hero-content">
          <div className="hero-badge" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Database size={16} color="var(--accent-color)" /> Data SSGI 2023 Terbaru
          </div>
          <h1 className="hero-title">
            Pantau Stunting <br /> dengan Mudah.
          </h1>
          <p className="hero-subtitle">
            Dashboard interaktif untuk menganalisis gizi anak bangsa.<br/>
            Sehingga Anda bisa mengambil keputusan yang tepat.
          </p>
          <div className="hero-actions">
            <a href="#overview" onClick={(e) => {
              e.preventDefault();
              document.getElementById('overview').scrollIntoView({ behavior: 'smooth' });
            }} className="hero-btn primary">
              Mulai Jelajahi ↓
            </a>
            <a href="#dataset" onClick={(e) => {
              e.preventDefault();
              document.getElementById('dataset').scrollIntoView({ behavior: 'smooth' });
            }} className="hero-btn secondary">
              Lihat Dataset
            </a>
          </div>

          <div className="landing-features">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Activity size={24} />
              </div>
              <span className="feature-title">Kinerja Pangan</span>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <PieChart size={24} />
              </div>
              <span className="feature-title">Determinan</span>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Map size={24} />
              </div>
              <span className="feature-title">Regional</span>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Brain size={24} />
              </div>
              <span className="feature-title">Analisis Mendalam</span>
            </div>
          </div>
        </div>
      </main>

      <div className="scroll-pill">
        SCROLL ↓
      </div>
    </div>
  );
};

export default Landing;
