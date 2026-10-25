import React from 'react';

export default function StatCard({ label, value, subtext, icon: Icon, color = '#15325b' }) {
  return (
    <div className="stat-card" style={{ borderLeft: `4px solid ${color}` }}>
      <div className="stat-info">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
        {subtext && <span className="stat-sub">{subtext}</span>}
      </div>
      {Icon && (
        <div className="stat-icon-box" style={{ color: color, background: `${color}12` }}>
          <Icon size={22} />
        </div>
      )}
    </div>
  );
}
