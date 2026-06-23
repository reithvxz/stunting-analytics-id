import React, { useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis, Cell } from 'recharts';
import { useFilter } from '../context/FilterContext';
import { Map, Share2, Layers, AlertOctagon, TrendingDown, TrendingUp, Droplets, Info, BarChart2, Activity, Target, ShoppingCart, Home, Heart, Filter } from 'lucide-react';

const AdvancedAnalysis = ({ data }) => {
  const { selectedIsland } = useFilter();

  const chartData = useMemo(() => {
    if (!data.length) return [];
    
    let filtered = selectedIsland === 'Semua Wilayah' ? data : data.filter(d => d.Pulau === selectedIsland);
    
    // Create approximate clusters based on Okan's K-Means logic
    // Klaster Ekstrem (PoU sangat tinggi, Stunting tinggi)
    // Klaster Menengah
    // Klaster Mapan (PoU rendah, Stunting rendah)
    return filtered.map(d => {
      let cluster = 'Menengah';
      let clusterColor = '#f59e0b'; // warning
      
      if (d.PoU_2023 > 21) {
        cluster = 'Ekstrem';
        clusterColor = '#ef4444'; // danger
      } else if (d.PoU_2023 < 10 && d.Stunting_2023 < 20) {
        cluster = 'Mapan';
        clusterColor = '#10b981'; // success
      }
      
      return {
        ...d,
        Cluster: cluster,
        ClusterColor: clusterColor
      };
    });
  }, [data, selectedIsland]);

  if (!chartData.length) return null;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-panel" style={{ padding: '12px' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>{data.Provinsi}</p>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Klaster: <span style={{color: data.ClusterColor, fontWeight: 'bold'}}>{data.Cluster}</span></p>
          <p style={{ fontSize: '14px', color: '#3b82f6', marginTop: '4px' }}>Stunting: {Number(data.Stunting_2023).toFixed(1)}%</p>
          <p style={{ fontSize: '14px', color: '#ef4444' }}>PoU: {Number(data.PoU_2023).toFixed(1)}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Analisis Mendalam (Eksplorasi Lanjutan)</h1>
        <p className="page-description">
          Menyajikan ekstraksi komprehensif dari 4 modul eksplorasi data (EDA, Kemiskinan, IPM, dan Infrastruktur Air Minum). Halaman ini memuat hasil pemodelan <em>Machine Learning</em>, statistika inferensial, serta analisis spasial mendalam untuk menyingkap pola struktural stunting di {selectedIsland}.
        </p>
      </div>

      {/* Insight Baru: Statistika Deskriptif & Ketimpangan */}
      <div className="glass-panel" style={{ padding: '32px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: '24px' }}>
          <div style={{ padding: '16px', background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', borderRadius: '16px' }}>
            <BarChart2 size={32} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>1. Statistika Deskriptif & Ketimpangan Wilayah</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '800px' }}>
              Analisis awal terhadap 34 provinsi di Indonesia pada tahun 2023 menunjukkan ketimpangan yang masif antar wilayah, menggarisbawahi bahwa stunting bukanlah masalah yang merata secara nasional, melainkan terpusat pada kantong-kantong kerentanan spesifik.
            </p>
          </div>
        </div>

        <div style={{ background: 'var(--bg-color)', padding: '24px', borderRadius: '12px', border: '1px solid var(--glass-border)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '12px', color: 'var(--text-primary)' }}>Disparitas Stunting (Max vs Min)</h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Rata-rata prevalensi stunting nasional berada di angka <strong>22.4%</strong>. Namun, angka ini menyembunyikan realitas ekstrem di lapangan. Rentang nilai (Min-Max) menunjukkan jarak yang sangat lebar: dari yang terbaik di angka <strong>7.2% (Bali)</strong> hingga yang terburuk mencapai <strong>37.9% (Papua)</strong>. Ketimpangan ini menegaskan perlunya pendekatan asimetris dalam kebijakan pengentasan stunting, bukan intervensi "satu solusi untuk semua".
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '12px', color: 'var(--text-primary)' }}>Variasi Faktor Determinan (CV)</h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Analisis <em>Coefficient of Variation (CV)</em> mengungkapkan bahwa <strong>Ketidakcukupan Pangan (PoU)</strong> memiliki keragaman spasial tertinggi (CV = 67.9%), disusul oleh <strong>Kemiskinan Desa</strong> (CV = 56.9%). Artinya, krisis ketersediaan pangan dan daya beli di perdesaan adalah anomali yang sangat spesifik secara geografis, tidak tersebar acak.
            </p>
          </div>
        </div>
      </div>

      {/* Insight Baru: Top Korelasi */}
      <div className="glass-panel" style={{ padding: '32px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: '24px' }}>
          <div style={{ padding: '16px', background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899', borderRadius: '16px' }}>
            <Activity size={32} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>2. Korelasi Terkuat: Triase Penyebab Utama</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '800px' }}>
              Uji korelasi Pearson dan Spearman terhadap belasan variabel ekonomi makro dan infrastruktur menghasilkan 4 faktor dengan asosiasi terkuat terhadap prevalensi stunting. Keempatnya memiliki <strong>p-value &lt; 0.01</strong> yang berarti sangat signifikan secara statistik.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', background: 'var(--bg-color)', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #10b981', gap: '20px' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '12px 16px', borderRadius: '8px', color: '#10b981', fontWeight: 800, fontSize: '1.2rem', minWidth: '100px', textAlign: 'center' }}>
              r = -0.545
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: 'var(--text-primary)' }}>1. Indeks Pembangunan Manusia (IPM)</h4>
              <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>Korelasi negatif terkuat. Wilayah dengan akses pendidikan dan kesehatan yang mapan secara absolut memiliki kasus stunting paling sedikit.</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'flex-start', background: 'var(--bg-color)', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #ef4444', gap: '20px' }}>
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '12px 16px', borderRadius: '8px', color: '#ef4444', fontWeight: 800, fontSize: '1.2rem', minWidth: '100px', textAlign: 'center' }}>
              r = +0.540
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: 'var(--text-primary)' }}>2. Kemiskinan Total (%)</h4>
              <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>Korelasi positif yang sangat ketat. Ketidakmampuan ekonomi membatasi akses rumah tangga terhadap protein hewani dan diversifikasi pangan pokok.</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'flex-start', background: 'var(--bg-color)', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #10b981', gap: '20px' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '12px 16px', borderRadius: '8px', color: '#10b981', fontWeight: 800, fontSize: '1.2rem', minWidth: '100px', textAlign: 'center' }}>
              r = -0.528
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: 'var(--text-primary)' }}>3. Pengeluaran Non-Makanan</h4>
              <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>Rumah tangga yang memiliki sisa uang untuk pengeluaran sekunder (kesehatan, sanitasi, gaya hidup sehat) cenderung memiliki balita yang lebih bergizi.</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'flex-start', background: 'var(--bg-color)', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #ef4444', gap: '20px' }}>
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '12px 16px', borderRadius: '8px', color: '#ef4444', fontWeight: 800, fontSize: '1.2rem', minWidth: '100px', textAlign: 'center' }}>
              r = +0.523
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: 'var(--text-primary)' }}>4. Kemiskinan Desa (%)</h4>
              <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>Stunting sejatinya adalah krisis yang berakar kuat di wilayah perdesaan (dibandingkan perkotaan yang hanya r = +0.056). Intervensi harus masif ke desa.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Okan's K-Means Clustering */}
      <div className="glass-panel" style={{ padding: '32px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: '32px' }}>
          <div style={{ padding: '16px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '16px' }}>
            <Layers size={32} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>3. Klasterisasi Multivariat (K-Means K=3)</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '800px' }}>
              Hasil pemodelan <em>Unsupervised Learning</em> (K-Means) pada variabel Ketidakcukupan Pangan (PoU) dan Stunting mengkonfirmasi adanya 3 kelompok kewilayahan yang tegas. Analisis <em>Silhouette Score</em> mengindikasikan struktur klaster yang solid, memisahkan wilayah <strong>Mapan</strong>, <strong>Menengah</strong>, dan <strong>Ekstrem</strong> secara signifikan.
            </p>
          </div>
        </div>

        <div className="grid-cols-2" style={{ gap: '32px' }}>
          <div style={{ height: '400px', background: 'var(--bg-color)', padding: '16px', borderRadius: '12px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" />
                <XAxis type="number" dataKey="PoU_2023" name="PoU" unit="%" stroke="var(--text-secondary)" domain={['dataMin - 2', 'dataMax + 2']} tickFormatter={(val) => Number(val).toFixed(0)} label={{ value: 'Ketidakcukupan Konsumsi Pangan (PoU %)', position: 'insideBottom', offset: -10, fill: 'var(--text-secondary)' }} />
                <YAxis type="number" dataKey="Stunting_2023" name="Stunting" unit="%" stroke="var(--text-secondary)" domain={['dataMin - 2', 'dataMax + 2']} tickFormatter={(val) => Number(val).toFixed(0)} label={{ value: 'Prevalensi Stunting (%)', angle: -90, position: 'insideLeft', fill: 'var(--text-secondary)' }} />
                <ZAxis dataKey="Provinsi" name="Provinsi" />
                <Tooltip content={<CustomTooltip />} cursor={{strokeDasharray: '3 3'}} />
                <Scatter name="Provinsi" data={chartData}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.ClusterColor} opacity={0.8} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '20px' }}>
            <div style={{ padding: '20px', borderLeft: '4px solid #ef4444', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '0 8px 8px 0' }}>
              <h4 style={{ color: '#ef4444', fontWeight: 700, fontSize: '1.1rem', marginBottom: '8px' }}>Klaster Ekstrem (Merah)</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                Terdapat <strong>4 Provinsi</strong>: NUSA TENGGARA TIMUR, MALUKU, PAPUA BARAT, PAPUA.<br/>
                Karakteristik: Kemiskinan ekstrim tinggi (&gt; 20%) dan prevalensi stunting sangat mengkhawatirkan.
              </p>
            </div>
            <div style={{ padding: '20px', borderLeft: '4px solid #f59e0b', background: 'rgba(245, 158, 11, 0.05)', borderRadius: '0 8px 8px 0' }}>
              <h4 style={{ color: '#f59e0b', fontWeight: 700, fontSize: '1.1rem', marginBottom: '8px' }}>Klaster Menengah (Kuning)</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                Terdapat <strong>25 Provinsi</strong> transisi dengan kerentanan sedang. Masih memiliki angka stunting di ambang batas peringatan WHO dengan ketersediaan pangan yang berfluktuasi.
              </p>
            </div>
            <div style={{ padding: '20px', borderLeft: '4px solid #10b981', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '0 8px 8px 0' }}>
              <h4 style={{ color: '#10b981', fontWeight: 700, fontSize: '1.1rem', marginBottom: '8px' }}>Klaster Mapan (Hijau)</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                Terdapat <strong>5 Provinsi</strong>: KEP. RIAU, DKI JAKARTA, DI YOGYAKARTA, BALI, KALIMANTAN TIMUR.<br/>
                Karakteristik: Kinerja penanganan stunting sangat baik (IPM tinggi) didukung akses pangan stabil.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Okan's Spatial Analysis */}
      <div className="glass-panel" style={{ padding: '32px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: '32px' }}>
          <div style={{ padding: '16px', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', borderRadius: '16px' }}>
            <Map size={32} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>4. Autokorelasi Spasial (Moran's I & LISA)</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '800px' }}>
              Menggunakan matriks bobot K-Nearest Neighbor (KNN, k=4) dan signifikansi permutasi (999x), analisis ini menguji asumsi bahwa kerentanan pangan <strong>bukan kejadian acak</strong>, melainkan membentuk pola pengelompokan geografis (*Spillover Effect*).
            </p>
          </div>
        </div>

        <div className="grid-cols-2" style={{ gap: '24px' }}>
          <div style={{ background: 'var(--bg-color)', padding: '24px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <Share2 size={24} color="#8b5cf6" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Indeks Moran Global</h3>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Moran's I (PoU)</span>
                <strong style={{ color: '#ef4444' }}>+0.440</strong>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#333', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '72%', height: '100%', background: '#ef4444' }}></div>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px', textAlign: 'right' }}>p-value = 0.001 (Sangat Signifikan)</p>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Moran's I (Stunting)</span>
                <strong style={{ color: '#f59e0b' }}>+0.331</strong>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#333', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '66%', height: '100%', background: '#f59e0b' }}></div>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px', textAlign: 'right' }}>p-value = 0.002 (Sangat Signifikan)</p>
            </div>
            
            <p style={{ marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.5, background: 'rgba(139, 92, 246, 0.05)', padding: '12px', borderRadius: '8px' }}>
              <strong>Interpretasi:</strong> Nilai Moran's I yang positif dan sangat signifikan menunjukkan bahwa wilayah dengan stunting/PoU tinggi cenderung berdekatan secara geografis dengan wilayah bernilai tinggi lainnya.
            </p>
          </div>

          <div style={{ background: 'var(--bg-color)', padding: '24px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <AlertOctagon size={24} color="#ef4444" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>LISA Hotspot Analysis</h3>
            </div>
            
            <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', borderLeft: '4px solid #ef4444', marginBottom: '20px' }}>
              <h4 style={{ color: '#ef4444', fontWeight: 600, marginBottom: '8px' }}>Hotspot High-High (Kerentanan Menular)</h4>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.5, color: 'var(--text-primary)' }}>
                Wilayah yang memiliki PoU tinggi dan dikelilingi oleh tetangga yang juga ber-PoU tinggi:
              </p>
              <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {['MALUKU', 'MALUKU UTARA', 'PAPUA BARAT', 'PAPUA'].map(prov => (
                  <span key={prov} style={{ padding: '4px 12px', background: '#ef4444', color: '#fff', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 500 }}>{prov}</span>
                ))}
              </div>
            </div>

            <div style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', borderLeft: '4px solid #10b981' }}>
              <h4 style={{ color: '#10b981', fontWeight: 600, marginBottom: '8px' }}>Coldspot Low-Low (Kawasan Resilien)</h4>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.5, color: 'var(--text-primary)' }}>
                Terdiri dari 21 Provinsi yang membentuk sabuk pengaman pangan (mayoritas Jawa, Sumatera, Bali, dan Kalimantan Raya).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Insight: Model Regresi Prediktif */}
      <div className="glass-panel" style={{ padding: '32px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: '32px' }}>
          <div style={{ padding: '16px', background: 'rgba(234, 88, 12, 0.1)', color: '#ea580c', borderRadius: '16px' }}>
            <TrendingDown size={32} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>5. Model Regresi Prediktif (Kemiskinan & IPM)</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '800px' }}>
              Berdasarkan pemodelan <em>Ordinary Least Squares (OLS)</em> terbaru, Kemiskinan dan Indeks Pembangunan Manusia (IPM) terbukti menjadi prediktor paling signifikan dan <em>robust</em> terhadap fluktuasi angka stunting di Indonesia tahun 2023.
            </p>
          </div>
        </div>

        <div className="grid-cols-2" style={{ gap: '24px' }}>
          {/* Card Regresi Kemiskinan */}
          <div style={{ background: 'var(--bg-color)', padding: '24px', borderRadius: '12px', borderTop: '4px solid #ef4444', borderLeft: '1px solid var(--glass-border)', borderRight: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ef4444' }}>Dampak Kemiskinan</h3>
              <TrendingUp size={20} color="#ef4444" />
            </div>
            <div style={{ background: 'rgba(0,0,0,0.03)', padding: '16px', borderRadius: '8px', fontFamily: 'monospace', marginBottom: '16px', fontSize: '0.9rem' }}>
              Stunting = 16.02 + <strong>0.635</strong> * Kemiskinan_Total
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
              Setiap kenaikan <strong>1% angka kemiskinan</strong> secara signifikan memicu kenaikan stunting sebesar <strong>0.635%</strong> (p-value = 0.0007, R² = 0.305). Kemiskinan menekan daya beli masyarakat terhadap pangan bergizi padat.
            </p>
          </div>

          {/* Card Regresi IPM */}
          <div style={{ background: 'var(--bg-color)', padding: '24px', borderRadius: '12px', borderTop: '4px solid #10b981', borderLeft: '1px solid var(--glass-border)', borderRight: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#10b981' }}>Dampak Pembangunan (IPM)</h3>
              <TrendingDown size={20} color="#10b981" />
            </div>
            <div style={{ background: 'rgba(0,0,0,0.03)', padding: '16px', borderRadius: '8px', fontFamily: 'monospace', marginBottom: '16px', fontSize: '0.9rem' }}>
              Stunting = 88.62 - <strong>0.898</strong> * IPM_2023
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
              Setiap kenaikan <strong>1 poin IPM</strong> sangat efektif mereduksi stunting sebesar <strong>0.898%</strong> (p-value = 0.001, R² = 0.288). Ini membuktikan bahwa investasi pada pendidikan dan kesehatan jangka panjang sangat krusial.
            </p>
          </div>
        </div>
      </div>

      {/* Container Grid untuk Panel 6-13 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px', marginBottom: '32px', alignItems: 'stretch' }}>
        
        {/* 6. Paradoks Infrastruktur Air Minum */}
        <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
            <div style={{ padding: '16px', background: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4', borderRadius: '16px' }}>
              <Droplets size={32} />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>6. Paradoks Infrastruktur Air Minum</h2>
              <p style={{ color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '16px' }}>
                Pengujian empiris menyingkap sebuah paradoks statistik: <strong>Akses Air Minum Layak tidak berpengaruh signifikan secara tunggal terhadap penurunan stunting</strong> (p-value &gt; 0.05).
              </p>
              <div style={{ background: 'rgba(6, 182, 212, 0.05)', padding: '20px', borderRadius: '12px', display: 'flex', gap: '16px', alignItems: 'flex-start', flexGrow: 1 }}>
                <Info size={24} color="#06b6d4" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  <strong>Diskusi Akademis:</strong> Hasil ini tidak mengisyaratkan bahwa air minum itu "tidak penting". Alih-alih, ia menyimpulkan bahwa <strong>pengadaan infrastruktur fisik (seperti pipanisasi) akan sia-sia jika tidak dibarengi dengan intervensi struktural</strong> seperti peningkatan daya beli (pengentasan kemiskinan) dan edukasi gizi (IPM). Infrastruktur adalah <em>enabler</em>, bukan solusi final.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 7. Target RPJMN vs Realita */}
        <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
            <div style={{ padding: '16px', background: 'rgba(234, 179, 8, 0.1)', color: '#eab308', borderRadius: '16px' }}>
              <Target size={32} />
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>7. Evaluasi Target RPJMN (14%) vs Realita Nasional</h2>
              <p style={{ color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '16px' }}>
                Pemerintah Indonesia menargetkan penurunan prevalensi stunting menjadi <strong>14%</strong> pada Rencana Pembangunan Jangka Menengah Nasional (RPJMN). Namun, analisis statistika deskriptif pada tahun 2023 menunjukkan bahwa rata-rata nasional masih tertahan di angka <strong>22.4%</strong>. Mayoritas provinsi (lebih dari 80%) masih berada jauh di atas ambang batas kritis yang ditetapkan WHO maupun target nasional.
              </p>
            </div>
          </div>
        </div>

        {/* 8. Pengaruh Pengeluaran */}
        <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
            <div style={{ padding: '16px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '16px' }}>
              <ShoppingCart size={32} />
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>8. Pengeluaran Non-Makanan vs Makanan</h2>
              <p style={{ color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '16px' }}>
                Sebuah temuan kontraintuitif muncul dari matriks korelasi: <strong>Pengeluaran Non-Makanan (r = -0.528) memiliki pengaruh yang lebih kuat</strong> dalam menurunkan stunting dibandingkan Pengeluaran Makanan (r = -0.397). Hal ini mengindikasikan bahwa keluarga yang mampu menyisihkan pendapatan untuk pendidikan, akses kesehatan yang layak, dan sanitasi, memiliki probabilitas jauh lebih tinggi untuk memiliki anak yang bebas stunting dibandingkan keluarga yang seluruh uangnya habis hanya untuk bertahan hidup membeli pangan dasar.
              </p>
            </div>
          </div>
        </div>

        {/* 9. Kesenjangan Desa Kota */}
        <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
            <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '16px' }}>
              <Home size={32} />
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>9. Kesenjangan Struktural: Perdesaan vs Perkotaan</h2>
              <p style={{ color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '16px' }}>
                Dekomposisi demografis menunjukkan bahwa stunting pada hakikatnya adalah <strong>krisis masyarakat perdesaan</strong>. Korelasi Kemiskinan Desa terhadap stunting sangat kuat (<strong>r = +0.523</strong>), berbanding terbalik dengan Kemiskinan Kota yang nyaris tidak berkorelasi (<strong>r = +0.056</strong>). Begitu pula dengan Air Minum Desa (r = -0.08) vs Air Minum Kota (r = -0.01). Kebijakan "pukul rata" antara desa dan kota terbukti tidak efektif karena lokus utama kerentanan kronis berada di pelosok desa.
              </p>
            </div>
          </div>
        </div>

        {/* 10. Sanitasi vs Air Minum */}
        <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
            <div style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '16px' }}>
              <Heart size={32} />
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>10. Prioritas Ekologis: Sanitasi Mendahului Air Minum</h2>
              <p style={{ color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '16px' }}>
                Dari dua indikator infrastruktur lingkungan, <strong>Sanitasi Layak (r = -0.418, p=0.015)</strong> terbukti signifikan memitigasi stunting, sedangkan Air Minum Layak (r = -0.176, p=0.325) tidak terbukti secara parsial. Interpretasi logisnya: penyediaan air bersih yang melimpah tidak akan berdampak pada kesehatan jika sanitasi dan manajemen limbah rumah tangga tetap buruk, karena patogen penyebab diare kronis (musuh utama penyerapan gizi balita) bersumber dari sanitasi yang tidak memadai.
              </p>
            </div>
          </div>
        </div>

        {/* 11. Regresi Gap Kemiskinan */}
        <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
            <div style={{ padding: '16px', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', borderRadius: '16px' }}>
              <Filter size={32} />
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>11. Model Multivariat: Efek "Gap" Kemiskinan</h2>
              <p style={{ color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '16px' }}>
                Pengembangan model regresi lebih lanjut (R² = 0.306) memasukkan variabel <em>Gap Kemiskinan Desa-Kota</em> bersamaan dengan <em>Kemiskinan Total</em>. Hasilnya, <code style={{background:'rgba(0,0,0,0.05)', padding:'2px 6px', borderRadius:'4px'}}>Stunting = 17.11 + 0.44(Kemiskinan Total) + 0.16(Gap Desa-Kota)</code>. Model ini secara brilian membuktikan bahwa selain tingkat kemiskinan secara absolut, <strong>ketimpangan (gap) antara desa dan kota</strong> secara mandiri menyumbang peningkatan angka stunting (koefisien positif +0.16), menegaskan bahwa keadilan spasial sama pentingnya dengan pertumbuhan ekonomi.
              </p>
            </div>
          </div>
        </div>

        {/* 12. Komponen Indeks Ketahanan Pangan (IKP) */}
        <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
            <div style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '16px' }}>
              <ShoppingCart size={32} />
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>12. Dekonstruksi Indeks Ketahanan Pangan (IKP) & Analisis Kuadran</h2>
              <p style={{ color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '16px' }}>
                Membedah IKP menjadi 3 komponen utama. Hasilnya sangat kontras: <strong>Ketersediaan Pangan</strong> tidak memiliki korelasi signifikan terhadap stunting (p = 0.733). Namun, <strong>Keterjangkauan Pangan</strong> (daya beli, r = -0.499) dan <strong>Pemanfaatan Pangan</strong> (sanitasi & air, r = -0.490) terbukti sebagai komponen yang paling krusial dalam pencegahan stunting. 
              </p>
              <p style={{ color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '16px' }}>
                Berdasarkan Analisis Kuadran IKP vs Stunting, 9 provinsi (sebagian besar di Indonesia Timur) masuk dalam <strong>Kuadran Prioritas</strong> (IKP Rendah, Stunting Tinggi). Sebaliknya, terdapat 8 provinsi <strong>Anomali</strong> (IKP Tinggi, Stunting Tinggi), yang mengindikasikan masalah murni di luar ketersediaan pangan seperti praktik pola asuh dan kualitas sanitasi pedesaan.
              </p>
            </div>
          </div>
        </div>

        {/* 13. Tiga Pilar IPM */}
        <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
            <div style={{ padding: '16px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '16px' }}>
              <Activity size={32} />
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>13. Dekonstruksi 3 Pilar Indeks Pembangunan Manusia (IPM)</h2>
              <p style={{ color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '16px' }}>
                Persamaan regresi <code>Stunting = 88.616 - 0.898(IPM)</code> membuktikan pengaruh kuat makro-pembangunan manusia. Penurunan stunting digerakkan oleh 3 pilar utama IPM: 
                <br/><br/>
                <strong>1. Dimensi Kesehatan:</strong> Kualitas layanan <em>Antenatal Care</em>, suplementasi gizi, dan penanganan infeksi pada 1000 Hari Pertama Kehidupan.<br/>
                <strong>2. Dimensi Pengetahuan:</strong> Berpengaruh langsung pada <em>health literacy</em> orang tua dalam mengadopsi praktik MP-ASI responsif dan kebersihan domestik.<br/>
                <strong>3. Dimensi Ekonomi:</strong> Kemampuan daya beli per kapita untuk menjangkau sumber protein hewani berkualitas tinggi (daging, telur, ikan, susu).
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdvancedAnalysis;
