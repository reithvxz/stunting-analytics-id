import React from 'react';

const Dataset = () => {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dokumentasi Dataset Gabungan (2023)</h1>
        <p className="page-description">
          Dataset besar ini disusun ulang dari 7 dataset mandiri agar seluruh variabel konsisten pada tahun 2023. Cakupan: 34 provinsi (struktur pra-pemekaran Papua).
        </p>
      </div>

      <div className="glass-panel" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--glass-border)' }}>
              <th style={{ padding: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Kolom</th>
              <th style={{ padding: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Deskripsi</th>
              <th style={{ padding: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Satuan</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
              <td style={{ padding: '12px', fontWeight: 500 }}>Stunting_2023</td>
              <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>Prevalensi balita stunting (SKI 2023 / Kemenkes)</td>
              <td style={{ padding: '12px' }}>%</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
              <td style={{ padding: '12px', fontWeight: 500 }}>PoU_2023</td>
              <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>Prevalensi Ketidakcukupan Konsumsi Pangan</td>
              <td style={{ padding: '12px' }}>%</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
              <td style={{ padding: '12px', fontWeight: 500 }}>Pengeluaran_Makanan_2023</td>
              <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>Rata-rata pengeluaran per kapita/bulan untuk makanan</td>
              <td style={{ padding: '12px' }}>Rp</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
              <td style={{ padding: '12px', fontWeight: 500 }}>Pangsa_Pangan_2023</td>
              <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>Makanan / Total × 100 (proxy kerentanan pangan)</td>
              <td style={{ padding: '12px' }}>%</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
              <td style={{ padding: '12px', fontWeight: 500 }}>Kemiskinan_Total_2023</td>
              <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>P0 jumlah/total (Semester 1 / Maret)</td>
              <td style={{ padding: '12px' }}>%</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
              <td style={{ padding: '12px', fontWeight: 500 }}>Sanitasi_Layak_2023</td>
              <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>RT akses sanitasi layak (perkotaan+perdesaan)</td>
              <td style={{ padding: '12px' }}>%</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
              <td style={{ padding: '12px', fontWeight: 500 }}>AirMinum_Total_2023</td>
              <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>RT akses air minum layak (perkotaan+perdesaan)</td>
              <td style={{ padding: '12px' }}>%</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
              <td style={{ padding: '12px', fontWeight: 500 }}>IPM_2023</td>
              <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>Indeks Pembangunan Manusia (UHH LF SP2020)</td>
              <td style={{ padding: '12px' }}>indeks</td>
            </tr>
            <tr>
              <td style={{ padding: '12px', fontWeight: 500 }}>IKPS_2023</td>
              <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>Indeks Khusus Penanganan Stunting</td>
              <td style={{ padding: '12px' }}>indeks</td>
            </tr>
          </tbody>
        </table>

        <div style={{ marginTop: '32px', padding: '16px', background: 'var(--bg-color)', borderRadius: '8px' }}>
          <h4 style={{ fontWeight: 600, marginBottom: '8px' }}>Catatan Metodologis Penting</h4>
          <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            <li><strong>Kemiskinan P0</strong> memakai rilis Semester 1 (Maret) 2023 karena kolom Tahunan kosong.</li>
            <li><strong>DKI Jakarta</strong> tidak memiliki nilai *_Desa (bernilai kosong). Ini bukan error.</li>
            <li><strong>Cakupan 34 Provinsi:</strong> 4 provinsi hasil pemekaran Papua (Papua Barat Daya, Selatan, Tengah, Pegunungan) dikeluarkan sesuai kesepakatan kelompok. Angka untuk Papua dan Papua Barat adalah residual dari BPS.</li>
            <li>IKPS dibawa dari kompilasi sebelumnya (nilai 2023).</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dataset;
