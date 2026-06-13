import React from 'react';
import Navbar from '../components/Navbar';
import Landing from '../pages/Landing';
import Home from '../pages/Home';
import Overview from '../pages/Overview';
import Determinants from '../pages/Determinants';
import Regional from '../pages/Regional';
import AdvancedAnalysis from '../pages/AdvancedAnalysis';
import Dataset from '../pages/Dataset';

const DashboardLayout = ({ data }) => {
  return (
    <div className="app-container">
      <div id="home">
        <Landing />
      </div>
      
      <div id="dashboard-content" style={{ position: 'relative' }}>
        <Navbar />
        
        <main className="main-content" style={{ paddingBottom: '100px' }}>
          <div id="overview" style={{ scrollMarginTop: '100px', marginBottom: '80px' }}>
            <Home data={data} />
          </div>
          
          <div id="status" style={{ scrollMarginTop: '100px', marginBottom: '80px' }}>
            <Overview data={data} />
          </div>
          
          <div id="determinants" style={{ scrollMarginTop: '100px', marginBottom: '80px' }}>
            <Determinants data={data} />
          </div>
          
          <section id="regional" style={{ minHeight: '100vh', paddingTop: '80px', paddingBottom: '40px' }}>
            <Regional data={data} />
          </section>
          
          {/* Advanced Analysis Section */}
          <section id="advanced" style={{ minHeight: '100vh', paddingTop: '80px', paddingBottom: '40px' }}>
            <AdvancedAnalysis data={data} />
          </section>

          {/* Dataset Section */}
          <section id="dataset" style={{ minHeight: '100vh', paddingTop: '80px', paddingBottom: '40px' }}>
            <Dataset />
          </section>
          
          <footer style={{ padding: '32px 24px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '48px', borderTop: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.3)' }}>
            <p style={{ margin: 0, fontWeight: 700, color: 'var(--text-primary)' }}>Kelompok E • Official Statistics SD-A1</p>
            <p style={{ margin: '8px 0 0 0', opacity: 0.8, lineHeight: 1.6 }}>
              164231023 Richard Raffael Dwi Nanda • 164231025 Rachel Sunarko • 164231053 Nadra Cinta Ruth Natalia S.<br/>
              164231088 Okan Athallah Maredith • 164231089 Muhammad Ilham Gustami
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
