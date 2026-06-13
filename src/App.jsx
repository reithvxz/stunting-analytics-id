import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import DashboardLayout from './layouts/DashboardLayout';
import Home from './pages/Home';
import Overview from './pages/Overview';
import Determinants from './pages/Determinants';
import Regional from './pages/Regional';
import Dataset from './pages/Dataset';
import { fetchStuntingData } from './utils/data';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchStuntingData();
        const cleanData = result.filter(row => row.Provinsi);
        setData(cleanData);
      } catch (err) {
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Memuat Data Stunting...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-screen">
        <h2>Error Loading Data</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardLayout data={data} />} />
      </Routes>
    </Router>
  );
}

export default App;
