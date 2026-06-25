import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis, ReferenceLine } from 'recharts';
import { useFilter } from '../context/FilterContext';
import { AlertTriangle, TrendingUp } from 'lucide-react';

const Determinants = ({ data }) => {
  const { selectedIsland } = useFilter();

  const filteredData = selectedIsland === 'Semua Wilayah' ? data : data.filter(d => d.Pulau === selectedIsland);

  // Filter out data without the necessary values for clean scatter plots
  const validPouData = filteredData.filter(d => d.PoU_2023 != null && d.Stunting_2023 != null);
  const validPovertyData = filteredData.filter(d => d.Kemiskinan_Total_2023 != null && d.Stunting_2023 != null);
  const validSanitationData = filteredData.filter(d => d.Sanitasi_Layak_2023 != null && d.Stunting_2023 != null);
  const validIpmData = filteredData.filter(d => d.IPM_2023 != null && d.Stunting_2023 != null);

  const getTrendLine = (data, xKey, yKey) => {
    if (!data || data.length < 2) return null;
    const n = data.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    data.forEach(d => {
      const x = d[xKey];
      const y = d[yKey];
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumXX += x * x;
    });
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    const minX = Math.min(...data.map(d => d[xKey]));
    const maxX = Math.max(...data.map(d => d[xKey]));
    
    return [
      { x: minX, y: slope * minX + intercept },
      { x: maxX, y: slope * maxX + intercept }
    ];
  };

  const trendPou = getTrendLine(validPouData, 'PoU_2023', 'Stunting_2023');
  const trendPoverty = getTrendLine(validPovertyData, 'Kemiskinan_Total_2023', 'Stunting_2023');
  const trendSanitation = getTrendLine(validSanitationData, 'Sanitasi_Layak_2023', 'Stunting_2023');
  const trendIpm = getTrendLine(validIpmData, 'IPM_2023', 'Stunting_2023');

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-panel" style={{ padding: '12px' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>{data.Provinsi}</p>
          <p style={{ fontSize: '14px', color: '#3b82f6' }}>Stunting: {Number(data.Stunting_2023).toFixed(1)}%</p>
          {payload[0].name === "PoU" && <p style={{ fontSize: '14px', color: '#ef4444' }}>Ketidakcukupan Pangan (PoU): {Number(data.PoU_2023).toFixed(1)}%</p>}
          {payload[0].name === "Kemiskinan" && <p style={{ fontSize: '14px', color: '#f59e0b' }}>Kemiskinan: {Number(data.Kemiskinan_Total_2023).toFixed(1)}%</p>}
          {payload[0].name === "Sanitasi" && <p style={{ fontSize: '14px', color: '#10b981' }}>Sanitasi Layak: {Number(data.Sanitasi_Layak_2023).toFixed(1)}%</p>}
          {payload[0].name === "IPM" && <p style={{ fontSize: '14px', color: '#6366f1' }}>IPM: {Number(data.IPM_2023).toFixed(1)} Poin</p>}
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Analisis Determinan Pangan & Sosio-Ekonomi</h1>
        <p className="page-description">
          Mengeksplorasi korelasi antara prevalensi stunting dengan faktor-faktor determinan seperti Ketidakcukupan Pangan (PoU), Kemiskinan, dan Sanitasi di {selectedIsland}.
        </p>
      </div>

      <div className="glass-panel" style={{ marginBottom: '24px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', color: 'var(--danger-color)' }}>
            <AlertTriangle size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--danger-color)', marginBottom: '8px' }}>Insight Analisis: Peringatan Outlier PoU Wilayah Timur</h3>
            <p style={{ color: 'var(--text-primary)', lineHeight: 1.6 }}>
              Berdasarkan uji statistik, <strong>Prevalensi Ketidakcukupan Konsumsi Pangan (PoU)</strong> memiliki sebaran yang tidak normal (Shapiro-Wilk p &lt; 0,001) dengan outlier ekstrem di wilayah Indonesia Timur. 
              <strong> Papua (35,63%)</strong>, <strong>Maluku (30,27%)</strong>, dan <strong>Maluku Utara (29,56%)</strong> mencatat angka PoU tertinggi. Korelasi PoU–Stunting terbukti <strong>TIDAK SIGNIFIKAN</strong> secara statistik (Spearman +0,231, p=0,188). Pada regresi berganda (R²=0,320), PoU tidak signifikan (p=0,757), dan Kemiskinan menjadi satu-satunya prediktor signifikan (β=+0,552, p=0,031) di mana semua asumsi klasik (VIF &lt; 2,7, normalitas, dan homoskedastik) terbukti terpenuhi.
            </p>
          </div>
        </div>
      </div>

      <div className="grid-cols-2" style={{ marginBottom: '24px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h3 style={{ fontWeight: 600, fontSize: '1.1rem' }}>Ketidakcukupan Konsumsi Pangan (PoU)</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Korelasi: Spearman +0,231 (p=0,188, Tidak Signifikan)</p>
            </div>
            <div style={{ padding: '6px 12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 600 }}>
              Faktor 1
            </div>
          </div>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" />
                <XAxis type="number" dataKey="PoU_2023" name="PoU" unit="%" stroke="var(--text-secondary)" domain={['dataMin - 1', 'dataMax + 1']} tickFormatter={(val) => Number(val).toFixed(0)} label={{ value: 'Ketidakcukupan Konsumsi Pangan (%)', position: 'insideBottom', offset: -10, fill: 'var(--text-secondary)' }} />
                <YAxis type="number" dataKey="Stunting_2023" name="Stunting" unit="%" stroke="var(--text-secondary)" domain={['dataMin - 2', 'dataMax + 2']} tickFormatter={(val) => Number(val).toFixed(0)} label={{ value: 'Prevalensi Stunting (%)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' }, fill: 'var(--text-secondary)' }} />
                <ZAxis dataKey="Provinsi" name="Provinsi" />
                <Tooltip content={<CustomTooltip />} cursor={{strokeDasharray: '3 3'}} />
                <Scatter name="PoU" data={validPouData} fill="#ef4444" opacity={0.7} />
                {trendPou && <ReferenceLine segment={trendPou} stroke="var(--text-primary)" strokeDasharray="3 3" opacity={0.6} />}
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h3 style={{ fontWeight: 600, fontSize: '1.1rem' }}>Kemiskinan Total (2023)</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Korelasi: Pearson +0,552 (p=0,001, Signifikan)</p>
            </div>
            <div style={{ padding: '6px 12px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 600 }}>
              Faktor 2
            </div>
          </div>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" />
                <XAxis type="number" dataKey="Kemiskinan_Total_2023" name="Kemiskinan" unit="%" stroke="var(--text-secondary)" domain={['dataMin - 1', 'dataMax + 1']} tickFormatter={(val) => Number(val).toFixed(0)} label={{ value: 'Kemiskinan Total (%)', position: 'insideBottom', offset: -10, fill: 'var(--text-secondary)' }} />
                <YAxis type="number" dataKey="Stunting_2023" name="Stunting" unit="%" stroke="var(--text-secondary)" domain={['dataMin - 2', 'dataMax + 2']} tickFormatter={(val) => Number(val).toFixed(0)} label={{ value: 'Prevalensi Stunting (%)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' }, fill: 'var(--text-secondary)' }} />
                <ZAxis dataKey="Provinsi" name="Provinsi" />
                <Tooltip content={<CustomTooltip />} cursor={{strokeDasharray: '3 3'}} />
                <Scatter name="Kemiskinan" data={validPovertyData} fill="#f59e0b" opacity={0.7} />
                {trendPoverty && <ReferenceLine segment={trendPoverty} stroke="var(--text-primary)" strokeDasharray="3 3" opacity={0.6} />}
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid-cols-2" style={{ marginBottom: '24px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h3 style={{ fontWeight: 600, fontSize: '1.1rem' }}>Indeks Pembangunan Manusia (IPM) 2023</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Korelasi: Pearson -0,537 (p=0,0013, Signifikan)</p>
            </div>
            <div style={{ padding: '6px 12px', background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 600 }}>
              Faktor 3
            </div>
          </div>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" />
                <XAxis type="number" dataKey="IPM_2023" name="IPM" unit=" Poin" stroke="var(--text-secondary)" domain={['dataMin - 2', 'dataMax + 2']} tickFormatter={(val) => Number(val).toFixed(0)} label={{ value: 'Indeks Pembangunan Manusia (Poin)', position: 'insideBottom', offset: -10, fill: 'var(--text-secondary)' }} />
                <YAxis type="number" dataKey="Stunting_2023" name="Stunting" unit="%" stroke="var(--text-secondary)" domain={['dataMin - 2', 'dataMax + 2']} tickFormatter={(val) => Number(val).toFixed(0)} label={{ value: 'Prevalensi Stunting (%)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' }, fill: 'var(--text-secondary)' }} />
                <ZAxis dataKey="Provinsi" name="Provinsi" />
                <Tooltip content={<CustomTooltip />} cursor={{strokeDasharray: '3 3'}} />
                <Scatter name="IPM" data={validIpmData} fill="#6366f1" opacity={0.7} />
                {trendIpm && <ReferenceLine segment={trendIpm} stroke="var(--text-primary)" strokeDasharray="3 3" opacity={0.6} />}
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h3 style={{ fontWeight: 600, fontSize: '1.1rem' }}>Akses Sanitasi Layak (2023)</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Korelasi: Pearson -0,418 (p=0,015, Signifikan)</p>
            </div>
            <div style={{ padding: '6px 12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 600 }}>
              Faktor 4
            </div>
          </div>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" />
                <XAxis type="number" dataKey="Sanitasi_Layak_2023" name="Sanitasi" unit="%" stroke="var(--text-secondary)" domain={['dataMin - 5', 'dataMax + 5']} tickFormatter={(val) => Number(val).toFixed(0)} label={{ value: 'Akses Sanitasi Layak (%)', position: 'insideBottom', offset: -10, fill: 'var(--text-secondary)' }} />
                <YAxis type="number" dataKey="Stunting_2023" name="Stunting" unit="%" stroke="var(--text-secondary)" domain={['dataMin - 2', 'dataMax + 2']} tickFormatter={(val) => Number(val).toFixed(0)} label={{ value: 'Prevalensi Stunting (%)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' }, fill: 'var(--text-secondary)' }} />
                <ZAxis dataKey="Provinsi" name="Provinsi" />
                <Tooltip content={<CustomTooltip />} cursor={{strokeDasharray: '3 3'}} />
                <Scatter name="Sanitasi" data={validSanitationData} fill="#10b981" opacity={0.7} />
                {trendSanitation && <ReferenceLine segment={trendSanitation} stroke="var(--text-primary)" strokeDasharray="3 3" opacity={0.6} />}
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Determinants;
