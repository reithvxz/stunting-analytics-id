import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { useFilter } from '../context/FilterContext';
import SpatialMap from '../components/SpatialMap';
import ErrorBoundary from '../ErrorBoundary';

const Regional = ({ data }) => {
  const { selectedIsland } = useFilter();

  // Aggregate data by Island (Pulau) or Province if island is selected
  const regionalData = useMemo(() => {
    if (!data.length) return [];

    if (selectedIsland !== 'Semua Wilayah') {
      const islandData = data.filter(d => d.Pulau === selectedIsland);
      return islandData.map(d => ({
        Name: d.Provinsi,
        Stunting: d.Stunting_2023 || 0,
        PoU: d.PoU_2023 || 0,
        Kemiskinan: d.Kemiskinan_Total_2023 || 0,
        IKPS: d.IKPS_2023 || 0,
        Sanitasi: d.Sanitasi_Layak_2023 || 0,
      })).sort((a, b) => b.Stunting - a.Stunting);
    }

    const islands = {};
    
    data.forEach(row => {
      const pulau = row.Pulau;
      if (!pulau) return;
      
      if (!islands[pulau]) {
        islands[pulau] = {
          Pulau: pulau,
          count: 0,
          Stunting_2023: 0,
          PoU_2023: 0,
          Kemiskinan_Total_2023: 0,
          IKPS_2023: 0,
          Sanitasi_Layak_2023: 0
        };
      }
      
      islands[pulau].count += 1;
      islands[pulau].Stunting_2023 += (row.Stunting_2023 || 0);
      islands[pulau].PoU_2023 += (row.PoU_2023 || 0);
      islands[pulau].Kemiskinan_Total_2023 += (row.Kemiskinan_Total_2023 || 0);
      islands[pulau].IKPS_2023 += (row.IKPS_2023 || 0);
      islands[pulau].Sanitasi_Layak_2023 += (row.Sanitasi_Layak_2023 || 0);
    });

    // Calculate averages
    return Object.values(islands).map(island => ({
      Name: island.Pulau,
      Stunting: Number((island.Stunting_2023 / island.count).toFixed(2)),
      PoU: Number((island.PoU_2023 / island.count).toFixed(2)),
      Kemiskinan: Number((island.Kemiskinan_Total_2023 / island.count).toFixed(2)),
      IKPS: Number((island.IKPS_2023 / island.count).toFixed(2)),
      Sanitasi: Number((island.Sanitasi_Layak_2023 / island.count).toFixed(2)),
    })).sort((a, b) => b.Stunting - a.Stunting); // sort by stunting desc

  }, [data, selectedIsland]);

  const unitName = selectedIsland === 'Semua Wilayah' ? 'Pulau' : 'Provinsi';

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Analisis Regional: {selectedIsland}</h1>
        <p className="page-description">
          Membandingkan indikator stunting, Ketidakcukupan Pangan (PoU), kemiskinan, IKPS, dan sanitasi antar {unitName.toLowerCase()} untuk melihat disparitas wilayah.
        </p>
      </div>

      <div className="grid-cols-2" style={{ marginBottom: '24px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h3 style={{ fontWeight: 600, fontSize: '1.1rem' }}>Prevalensi Stunting 2023 (%)</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Data per {unitName}</p>
            </div>
            <div style={{ padding: '6px 12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 600 }}>
              {selectedIsland === 'Semua Wilayah' ? 'Agregat' : 'Detail'}
            </div>
          </div>
          <div style={{ height: '350px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionalData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
                <XAxis dataKey="Name" stroke="var(--text-secondary)" angle={-45} textAnchor="end" height={60} tick={{fontSize: 10, fill: 'var(--text-secondary)'}} interval={0} />
                <YAxis stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)'}} tickFormatter={(val) => Number(val).toFixed(0)} />
                <Tooltip cursor={{fill: 'rgba(0,0,0,0.02)'}} formatter={(val) => Number(val).toFixed(1)} />
                <Bar dataKey="Stunting" fill="var(--danger-color)" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h3 style={{ fontWeight: 600, fontSize: '1.1rem' }}>Ketidakcukupan Konsumsi Pangan (PoU)</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Data per {unitName}</p>
            </div>
            <div style={{ padding: '6px 12px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 600 }}>
              {selectedIsland === 'Semua Wilayah' ? 'Agregat' : 'Detail'}
            </div>
          </div>
          <div style={{ height: '350px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionalData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
                <XAxis dataKey="Name" stroke="var(--text-secondary)" angle={-45} textAnchor="end" height={60} tick={{fontSize: 10, fill: 'var(--text-secondary)'}} interval={0} />
                <YAxis stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)'}} tickFormatter={(val) => Number(val).toFixed(0)} />
                <Tooltip cursor={{fill: 'rgba(0,0,0,0.02)'}} formatter={(val) => Number(val).toFixed(1)} />
                <Bar dataKey="PoU" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid-cols-1">
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h3 style={{ fontWeight: 600, fontSize: '1.1rem' }}>Profil Wilayah: Radar Indikator 2023</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Catatan: IKPS & Sanitasi (Makin Tinggi Makin Baik), Stunting, Kemiskinan & PoU (Makin Rendah Makin Baik)</p>
            </div>
            <div style={{ padding: '6px 12px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 600 }}>
              Multivariate
            </div>
          </div>
          <div style={{ height: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={regionalData}>
                <PolarGrid stroke="var(--glass-border)" />
                <PolarAngleAxis dataKey="Name" stroke="var(--text-secondary)" tick={{fontSize: 12}} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="Stunting" dataKey="Stunting" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
                <Radar name="PoU" dataKey="PoU" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
                <Radar name="Kemiskinan" dataKey="Kemiskinan" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                <Radar name="IKPS" dataKey="IKPS" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                <Tooltip contentStyle={{ background: 'var(--glass-bg)', borderColor: 'var(--glass-border)' }} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Render Spatial Map at the bottom, passing the full dataset so the map can always render Indonesia */}
      <div style={{ marginTop: '64px', borderTop: '1px solid var(--glass-border)', paddingTop: '48px' }}>
        <div className="page-header" style={{ marginBottom: '48px' }}>
          <h1 className="page-title">Peta Spasial</h1>
          <p className="page-description">
            Visualisasi geografis distribusi stunting dan faktor determinannya di Indonesia.
          </p>
        </div>
        <ErrorBoundary>
          <SpatialMap data={data} />
        </ErrorBoundary>
      </div>

    </div>
  );
};

export default Regional;
