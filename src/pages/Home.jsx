import React, { useMemo } from 'react';
import MetricCard from '../components/MetricCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Activity, AlertTriangle, CheckCircle, TrendingDown } from 'lucide-react';
import { useFilter } from '../context/FilterContext';

const Home = ({ data }) => {
  const { selectedIsland } = useFilter();
  // Calculations for Metrics
  const stats = useMemo(() => {
    if (!data.length) return null;
    
    // Filter data by selected region
    const filteredData = selectedIsland === 'Semua Wilayah' ? data : data.filter(d => d.Pulau === selectedIsland);
    if (!filteredData.length) return null;
    
    // Sort by Stunting Rate
    const sortedData = [...filteredData].sort((a, b) => b.Stunting_2023 - a.Stunting_2023);
    
    const nationalAvg = selectedIsland === 'Semua Wilayah' 
      ? 22.44 
      : Number((sortedData.reduce((acc, curr) => acc + curr.Stunting_2023, 0) / sortedData.length).toFixed(2));
    
    const aboveNational = selectedIsland === 'Semua Wilayah'
      ? 18
      : sortedData.filter(d => d.Stunting_2023 > nationalAvg).length;
    
    return {
      nationalAvg,
      highest: sortedData[0],
      lowest: sortedData[sortedData.length - 1],
      aboveNational,
      totalProvinces: sortedData.length,
      top5Highest: sortedData.slice(0, 5),
      top5Lowest: sortedData.slice(-5).reverse()
    };
  }, [data]);

  if (!stats) return null;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Pantau Kondisi Gizi Anak Bangsa 🇮🇩</h1>
        <p className="page-description">
          Dashboard interaktif untuk eksplorasi data prevalensi stunting dan determinannya di {selectedIsland}.
        </p>
      </div>

      <div className="grid-cols-4" style={{ marginBottom: '32px' }}>
        <MetricCard 
          title="Rata-rata Nasional (SKI 2023)" 
          value={`${stats.nationalAvg.toString().replace('.', ',')}%`}
          icon={<Activity size={24} />}
          color="var(--accent-color)"
          subtitle="Target menuju 5% pada 2045"
        />
        <MetricCard 
          title="Provinsi Tertinggi" 
          value={`${stats.highest.Stunting_2023.toString().replace('.', ',')}%`}
          subtitle={stats.highest.Provinsi}
          icon={<AlertTriangle size={24} />}
          color="var(--danger-color)"
          trend="up"
        />
        <MetricCard 
          title="Provinsi Terendah" 
          value={`${stats.lowest.Stunting_2023.toFixed(2).toString().replace('.', ',')}%`}
          subtitle={stats.lowest.Provinsi}
          icon={<CheckCircle size={24} />}
          color="var(--success-color)"
          trend="down"
        />
        <MetricCard 
          title="Di Atas Rata-rata" 
          value={`${stats.aboveNational} Prov`}
          subtitle={`Dari ${stats.totalProvinces} Provinsi`}
          icon={<TrendingDown size={24} />}
          color="var(--warning-color)"
        />
      </div>

      <div className="grid-cols-2">
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h3 style={{ fontWeight: 600, fontSize: '1.1rem' }}>Top 5 Provinsi Stunting Tertinggi</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Prioritas penanganan utama | <strong>Sumber: SKI 2023 (Kemenkes)</strong></p>
            </div>
            <div style={{ padding: '6px 12px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-color)', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 600 }}>
              Kritis
            </div>
          </div>
          <div style={{ height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.top5Highest} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" horizontal={false} />
                <XAxis type="number" stroke="var(--text-secondary)" domain={[0, 45]} tickFormatter={(val) => Number(val).toFixed(0)} />
                <YAxis dataKey="Provinsi" type="category" stroke="var(--text-secondary)" width={120} tick={{fontSize: 12, fill: 'var(--text-secondary)'}} />
                <Tooltip cursor={{fill: 'rgba(0,0,0,0.02)'}} formatter={(val) => Number(val).toFixed(1)} />
                <Bar dataKey="Stunting_2023" name="Prevalensi Stunting (%)" radius={[0, 4, 4, 0]} barSize={24}>
                  {stats.top5Highest.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="var(--accent-color)" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h3 style={{ fontWeight: 600, fontSize: '1.1rem' }}>Top 5 Provinsi Stunting Terendah</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Kinerja terbaik penanganan gizi | <strong>Sumber: SKI 2023 (Kemenkes)</strong></p>
            </div>
            <div style={{ padding: '6px 12px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 600 }}>
              Aman
            </div>
          </div>
          <div style={{ height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.top5Lowest} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" horizontal={false} />
                <XAxis type="number" stroke="var(--text-secondary)" domain={[0, 45]} tickFormatter={(val) => Number(val).toFixed(0)} />
                <YAxis dataKey="Provinsi" type="category" stroke="var(--text-secondary)" width={120} tick={{fontSize: 12, fill: 'var(--text-secondary)'}} />
                <Tooltip cursor={{fill: 'rgba(0,0,0,0.02)'}} formatter={(val) => Number(val).toFixed(1)} />
                <Bar dataKey="Stunting_2023" name="Prevalensi Stunting (%)" radius={[0, 4, 4, 0]} barSize={24}>
                  {stats.top5Lowest.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="var(--success-color)" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
