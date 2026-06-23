import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { ChevronDown, Layers } from 'lucide-react';

const geoUrl = "https://raw.githubusercontent.com/ghapsara/indonesia-atlas/master/provinsi/provinces-simplified-topo.json";

// Peta nama dari TopoJSON ke nama di CSV/Dataset
const mapPropToCSV = {
  'Aceh': 'ACEH',
  'Sumatera Utara': 'SUMATERA UTARA',
  'Sumatera Barat': 'SUMATERA BARAT',
  'Riau': 'RIAU',
  'Jambi': 'JAMBI',
  'Sumatera Selatan': 'SUMATERA SELATAN',
  'Bengkulu': 'BENGKULU',
  'Lampung': 'LAMPUNG',
  'Kepulauan Bangka Belitung': 'KEP. BANGKA BELITUNG',
  'Kepulauan Riau': 'KEP. RIAU',
  'Jakarta': 'DKI JAKARTA',
  'Jawa Barat': 'JAWA BARAT',
  'Jawa Tengah': 'JAWA TENGAH',
  'Yogyakarta': 'DI YOGYAKARTA',
  'Jawa Timur': 'JAWA TIMUR',
  'Banten': 'BANTEN',
  'Bali': 'BALI',
  'Nusa Tenggara Barat': 'NUSA TENGGARA BARAT',
  'Nusa Tenggara Timur': 'NUSA TENGGARA TIMUR',
  'Kalimantan Barat': 'KALIMANTAN BARAT',
  'Kalimantan Tengah': 'KALIMANTAN TENGAH',
  'Kalimantan Selatan': 'KALIMANTAN SELATAN',
  'Kalimantan Timur': 'KALIMANTAN TIMUR',
  'Kalimantan Utara': 'KALIMANTAN UTARA',
  'Sulawesi Utara': 'SULAWESI UTARA',
  'Sulawesi Tengah': 'SULAWESI TENGAH',
  'Sulawesi Selatan': 'SULAWESI SELATAN',
  'Sulawesi Tenggara': 'SULAWESI TENGGARA',
  'Gorontalo': 'GORONTALO',
  'Sulawesi Barat': 'SULAWESI BARAT',
  'Maluku': 'MALUKU',
  'Maluku Utara': 'MALUKU UTARA',
  'Papua Barat': 'PAPUA BARAT',
  'Papua': 'PAPUA'
};

const INDICATORS = [
  { id: 'Stunting_2023', label: 'Prevalensi Stunting (%)', type: 'bad', desc: 'Prevalensi Balita Stunting 2023' },
  { id: 'Kemiskinan_Total_2023', label: 'Kemiskinan Total (%)', type: 'bad', desc: 'Persentase Penduduk Miskin' },
  { id: 'Gap_Kemiskinan', label: 'Gap Kemiskinan Desa-Kota (%)', type: 'bad', desc: 'Selisih Kemiskinan Perdesaan dan Perkotaan' },
  { id: 'IPM_2023', label: 'Indeks Pembangunan Manusia (IPM)', type: 'good', desc: 'Indeks Pembangunan Manusia' },
  { id: 'Sanitasi_Layak_2023', label: 'Sanitasi Layak (%)', type: 'good', desc: 'Akses Sanitasi Layak (Pemanfaatan Pangan)' },
];

const SpatialMap = ({ data }) => {
  const [selectedIndicatorId, setSelectedIndicatorId] = useState('Stunting_2023');
  const [tooltipContent, setTooltipContent] = useState('');
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

  const selectedIndicator = INDICATORS.find(ind => ind.id === selectedIndicatorId);

  // Proses dataset agar mudah dicari berdasarkan nama provinsi (menggunakan mapping)
  const mappedData = useMemo(() => {
    const map = {};
    data.forEach(d => {
      // Calculate derived metrics dynamically if needed
      const processedRow = { ...d };
      if (processedRow.Kemiskinan_Desa_2023 && processedRow.Kemiskinan_Kota_2023) {
        processedRow.Gap_Kemiskinan = processedRow.Kemiskinan_Desa_2023 - processedRow.Kemiskinan_Kota_2023;
      } else {
        processedRow.Gap_Kemiskinan = 0;
      }
      map[processedRow.Provinsi] = processedRow;
    });
    return map;
  }, [data]);

  // Buat domain color scale berdasarkan min dan max nilai indikator
  const colorScale = useMemo(() => {
    if (!data.length) return () => '#333';
    
    let min = Infinity;
    let max = -Infinity;

    Object.values(mappedData).forEach(row => {
      const val = row[selectedIndicatorId];
      if (val !== undefined && val !== null) {
        if (val < min) min = val;
        if (val > max) max = val;
      }
    });

    if (min === Infinity) min = 0;
    if (max === -Infinity) max = 100;

    // Warna: 
    // Jika type="bad" (stunting, miskin), nilai tinggi = merah, nilai rendah = hijau
    // Jika type="good" (IPM, sanitasi), nilai tinggi = biru/hijau, nilai rendah = merah/orange
    if (selectedIndicator.type === 'bad') {
      return scaleLinear()
        .domain([min, max])
        .range(["#10b981", "#ef4444"]); // Hijau -> Merah
    } else {
      return scaleLinear()
        .domain([min, max])
        .range(["#ef4444", "#3b82f6"]); // Merah -> Biru
    }
  }, [data, mappedData, selectedIndicatorId, selectedIndicator.type]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Control Panel */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 50 }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '4px' }}>Filter Peta Spasial</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>Pilih faktor determinan signifikan untuk divisualisasikan</p>
        </div>
        
        <div className="custom-dropdown-container" ref={dropdownRef} style={{ minWidth: '320px', zIndex: 20 }}>
          <div 
            className="custom-dropdown-trigger"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{ 
              background: 'rgba(255,255,255,0.05)', 
              borderColor: 'var(--glass-border)', 
              color: 'var(--text-primary)',
              padding: '12px 20px',
              borderRadius: '8px'
            }}
          >
            <Layers size={18} color="var(--accent-color)" />
            <span style={{flex: 1, textAlign: 'left'}}>{selectedIndicator.label}</span>
            <ChevronDown size={18} color="var(--text-secondary)" style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </div>
          
          {dropdownOpen && (
            <div className="custom-dropdown-menu" style={{ 
              background: 'var(--bg-color)', 
              border: '1px solid var(--glass-border)', 
              borderRadius: '8px', 
              boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
              marginTop: '8px',
              padding: '8px',
              zIndex: 30
            }}>
              {INDICATORS.map(ind => (
                <div 
                  key={ind.id}
                  className={`custom-dropdown-item ${selectedIndicatorId === ind.id ? 'active' : ''}`}
                  onClick={() => { 
                    setSelectedIndicatorId(ind.id); 
                    setDropdownOpen(false); 
                  }}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    color: selectedIndicatorId === ind.id ? 'var(--accent-color)' : 'var(--text-primary)',
                    background: selectedIndicatorId === ind.id ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                    fontWeight: selectedIndicatorId === ind.id ? 600 : 400
                  }}
                  onMouseEnter={(e) => {
                    if (selectedIndicatorId !== ind.id) {
                      e.target.style.background = 'rgba(255,255,255,0.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedIndicatorId !== ind.id) {
                      e.target.style.background = 'transparent';
                    }
                  }}
                >
                  {ind.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Map Container */}
      <div className="glass-panel" style={{ padding: '24px', position: 'relative' }}>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 600, textAlign: 'center', marginBottom: '8px', color: 'var(--text-primary)' }}>
          Peta Persebaran {selectedIndicator.label}
        </h3>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
          {selectedIndicator.desc}
        </p>

        {/* Legenda Warna */}
        <div className="glass-panel" style={{ position: 'absolute', bottom: '32px', left: '32px', padding: '16px', zIndex: 5 }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}>Legenda (Skala Warna)</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>Rendah</span>
            <div style={{ 
              width: '120px', height: '12px', borderRadius: '6px',
              background: `linear-gradient(to right, ${selectedIndicator.type === 'bad' ? '#10b981' : '#ef4444'}, ${selectedIndicator.type === 'bad' ? '#ef4444' : '#3b82f6'})` 
            }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>Tinggi</span>
          </div>
        </div>

        {/* Tooltip Overlay */}
        {tooltipContent && (
          <div style={{
            position: 'absolute',
            top: '32px',
            right: '32px',
            background: 'var(--bg-color)',
            border: '1px solid var(--accent-color)',
            padding: '16px',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
            pointerEvents: 'none',
            zIndex: 10,
            minWidth: '200px'
          }}>
            <div dangerouslySetInnerHTML={{ __html: tooltipContent }} />
          </div>
        )}

        <div style={{ height: '600px', width: '100%', background: 'rgba(0,0,0,0.1)', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
          <ComposableMap 
            projection="geoMercator"
            projectionConfig={{
              scale: 1200,
              center: [118, -2] // Center di tengah Indonesia
            }}
            style={{ width: "100%", height: "100%" }}
          >
            <ZoomableGroup zoom={1}>
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map(geo => {
                    const geoProvName = geo.properties.provinsi; // property Name dari TopoJSON ghapsara adalah "provinsi"
                    const csvProvName = mapPropToCSV[geoProvName];
                    const provData = mappedData[csvProvName];

                    let fillColor = "#333333"; // default blank
                    let val = null;

                      if (provData) {
                        val = provData[selectedIndicatorId];
                        if (val !== undefined && val !== null) {
                          fillColor = colorScale(val);
                        }
                      }

                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={fillColor}
                          stroke="rgba(255,255,255,0.2)"
                          strokeWidth={0.5}
                          style={{
                            default: { outline: "none", transition: "all 250ms" },
                            hover: { fill: "var(--accent-color)", outline: "none", cursor: "pointer", transition: "all 250ms" },
                            pressed: { outline: "none" },
                          }}
                          onMouseEnter={() => {
                            if (provData && val !== null) {
                              setTooltipContent(`
                                <h4 style="margin:0 0 8px 0; font-size:1.1rem; color:var(--text-primary); border-bottom:1px solid var(--glass-border); padding-bottom:8px;">${csvProvName}</h4>
                                <div style="font-size:0.9rem; color:var(--text-secondary);">
                                  ${selectedIndicator.label}: <strong style="color:var(--text-primary); font-size:1rem;">${Number(val).toFixed(2)}</strong>
                                </div>
                              `);
                            } else {
                              setTooltipContent(`
                                <h4 style="margin:0 0 8px 0; font-size:1.1rem; color:var(--text-primary); border-bottom:1px solid var(--glass-border); padding-bottom:8px;">${geoProvName}</h4>
                                <div style="font-size:0.9rem; color:#ef4444;">Data tidak tersedia</div>
                              `);
                            }
                          }}
                          onMouseLeave={() => {
                            setTooltipContent("");
                          }}
                        />
                      );
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>
        </div>
      </div>
    </div>
  );
};

export default SpatialMap;
