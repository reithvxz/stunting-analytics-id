import React from 'react';
import './MetricCard.css';

const MetricCard = ({ title, value, subtitle, icon, trend, trendValue, color = 'var(--accent-color)' }) => {
  return (
    <div className="glass-panel metric-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column' }}>
      <div className="metric-header" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <div style={{ width: '12px', height: '12px', borderRadius: '4px', backgroundColor: color }}></div>
        <h3 className="metric-title" style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-primary)', fontWeight: 500 }}>{title}</h3>
      </div>
      
      <div className="metric-body" style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '28px', flexWrap: 'wrap' }}>
        <div className="metric-value" style={{ fontSize: '3.2rem', fontWeight: 700, letterSpacing: '-1.5px', color: 'var(--text-primary)', lineHeight: 1 }}>
          {value}
        </div>
        {trendValue && (
          <span className={`metric-trend ${trend === 'down' ? 'trend-down' : trend === 'up' ? 'trend-up' : 'trend-neutral'}`} style={{ padding: '6px 12px', fontSize: '0.85rem', fontWeight: 700, borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            {trend === 'down' ? '↘' : trend === 'up' ? '↗' : '→'} {Math.abs(trendValue)}%
          </span>
        )}
      </div>

      <div className="metric-divider" style={{ width: '40px', height: '2px', backgroundColor: 'var(--glass-border)', marginBottom: '28px' }}></div>
      
      <div className="metric-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto' }}>
        <div className="metric-subtitle" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, maxWidth: '70%', lineHeight: 1.4 }}>
          {subtitle}
        </div>
        <div className="metric-icon" style={{ opacity: 0.3, color: 'var(--text-primary)' }}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
