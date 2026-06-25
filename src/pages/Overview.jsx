import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine,
  ScatterChart, Scatter, ZAxis
} from 'recharts';
import { useFilter } from '../context/FilterContext';

const Overview = ({ data }) => {
  const { selectedIsland } = useFilter();

  const chartData = useMemo(() => {
    if (!data.length) return [];
    
    let filtered = selectedIsland === 'Semua Wilayah' ? data : data.filter(d => d.Pulau === selectedIsland);
    
    // Sort by IKPS for the bar chart
    return [...filtered].sort((a, b) => b.IKPS_2023 - a.IKPS_2023);
  }, [data, selectedIsland]);

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

  const trendIpm = useMemo(() => getTrendLine(chartData, 'IPM_2023', 'Stunting_2023'), [chartData]);

  if (!chartData.length) return null;

  const pouData = [...chartData].sort((a, b) => b.PoU_2023 - a.PoU_2023);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Kinerja Pangan & Gizi Komposit</h1>
        <p className="page-description">
          Menampilkan Indeks Khusus Penanganan Stunting (IKPS) dan Prevalensi Ketidakcukupan Konsumsi Pangan (PoU) tahun 2023 di {selectedIsland}.
        </p>
      </div>

      <div className="grid-cols-2" style={{ marginBottom: '24px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontWeight: 600, fontSize: '1.2rem' }}>Indeks Khusus Penanganan Stunting (IKPS)</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Makin tinggi nilai IKPS, makin baik kinerja penanganan</p>
          </div>
          <div style={{ height: '720px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" horizontal={false} />
                <XAxis type="number" stroke="var(--text-secondary)" domain={[40, 90]} tickFormatter={(val) => Number(val).toFixed(0)} />
                <YAxis dataKey="Provinsi" type="category" stroke="var(--text-secondary)" width={150} tick={{fontSize: 10, fill: 'var(--text-secondary)'}} interval={0} />
                <Tooltip cursor={{fill: 'rgba(0,0,0,0.02)'}} formatter={(val) => Number(val).toFixed(2)} />
                <Bar dataKey="IKPS_2023" name="Skor IKPS 2023" radius={[0, 4, 4, 0]} barSize={16}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.IKPS_2023 > 75 ? "var(--success-color)" : "var(--accent-color)"} />
                  ))}
                </Bar>
                <ReferenceLine x={75} stroke="var(--success-color)" strokeDasharray="3 3" label={{ position: 'top', value: 'Target 75', fill: 'var(--success-color)', fontSize: 12 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontWeight: 600, fontSize: '1.2rem' }}>Ketidakcukupan Konsumsi Pangan (PoU)</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Peringatan: Terdapat Outlier Ekstrem di Wilayah Timur | <strong>Sumber: Bapanas/BPS 2023</strong></p>
          </div>
          <div style={{ height: '720px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pouData} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" horizontal={false} />
                <XAxis type="number" stroke="var(--text-secondary)" domain={[0, 40]} tickFormatter={(val) => Number(val).toFixed(0)} />
                <YAxis dataKey="Provinsi" type="category" stroke="var(--text-secondary)" width={150} tick={{fontSize: 10, fill: 'var(--text-secondary)'}} interval={0} />
                <Tooltip cursor={{fill: 'rgba(0,0,0,0.02)'}} formatter={(val) => Number(val).toFixed(2) + '%'} />
                <Bar dataKey="PoU_2023" name="Prevalensi PoU (%)" radius={[0, 4, 4, 0]} barSize={16}>
                  {pouData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.PoU_2023 > 20 ? "var(--danger-color)" : "var(--warning-color)"} />
                  ))}
                </Bar>
                <ReferenceLine x={21.53} stroke="var(--danger-color)" strokeDasharray="3 3" label={{ position: 'top', value: 'Batas Outlier (21.5%)', fill: 'var(--danger-color)', fontSize: 12 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontWeight: 600, fontSize: '1.2rem' }}>Korelasi IPM dan Stunting 2023</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Indeks Pembangunan Manusia (IPM) berkorelasi negatif kuat dengan stunting | <strong>Sumber: SKI 2023 (Kemenkes) / BPS 2023</strong></p>
        </div>
        <div style={{ height: '350px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" />
              <XAxis type="number" dataKey="IPM_2023" name="IPM 2023" stroke="var(--text-secondary)" domain={['dataMin - 1', 'dataMax + 1']} tickFormatter={(val) => Number(val).toFixed(1)} label={{ value: 'Indeks Pembangunan Manusia (Poin)', position: 'insideBottom', offset: -10, fill: 'var(--text-secondary)' }} />
              <YAxis type="number" dataKey="Stunting_2023" name="Stunting (%)" stroke="var(--text-secondary)" domain={[0, 45]} tickFormatter={(val) => Number(val).toFixed(0)} label={{ value: 'Prevalensi Stunting (%)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' }, fill: 'var(--text-secondary)' }} />
              <ZAxis type="category" dataKey="Provinsi" name="Provinsi" />
              <Tooltip cursor={{strokeDasharray: '3 3'}} formatter={(val) => Number(val).toFixed(1)} />
              <Scatter name="Provinsi" data={chartData} fill="var(--accent-color)" />
              {trendIpm && <ReferenceLine segment={trendIpm} stroke="var(--text-primary)" strokeDasharray="3 3" opacity={0.6} />}
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Overview;
