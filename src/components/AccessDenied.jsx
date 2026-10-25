import React from 'react';
import { ShieldAlert, ArrowLeft, UserCheck } from 'lucide-react';
import { ROLE_PERMISSIONS, ROLES } from '../data/initialData';

export default function AccessDenied({ currentRole, tabName, onGoDashboard, onSwitchRole }) {
  const currentRoleData = ROLES.find((r) => r.id === currentRole) || ROLES[0];
  const roleConfig = ROLE_PERMISSIONS[currentRole] || ROLE_PERMISSIONS.admin;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        padding: '2rem 1rem',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          background: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#dc2626',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.25rem',
          boxShadow: '0 4px 12px rgba(220, 38, 38, 0.1)',
        }}
      >
        <ShieldAlert size={32} />
      </div>

      <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0b1e36', marginBottom: '0.5rem' }}>
        Access Restricted by Role
      </h2>

      <p style={{ maxWidth: '480px', fontSize: '0.875rem', color: '#64748b', lineHeight: '1.6', marginBottom: '1.25rem' }}>
        The <strong>{tabName.toUpperCase()}</strong> module is not authorized for your current role profile:{' '}
        <strong style={{ color: currentRoleData.color }}>{currentRoleData.label} ({roleConfig.badge})</strong>.
      </p>

      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '1rem 1.5rem',
          maxWidth: '480px',
          width: '100%',
          marginBottom: '1.5rem',
          boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
          textAlign: 'left',
          fontSize: '0.8rem',
        }}
      >
        <div style={{ fontWeight: 700, color: '#0b1e36', marginBottom: '0.25rem' }}>
          Role Authorization Summary:
        </div>
        <div style={{ color: '#475569', marginBottom: '0.5rem' }}>
          {roleConfig.description}
        </div>
        <div style={{ color: '#1d4ed8', fontWeight: 600 }}>
          Authorized access: {roleConfig.allowedTabs.join(', ')}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button className="btn btn-primary" onClick={onGoDashboard}>
          <ArrowLeft size={16} /> Return to Dashboard
        </button>
        {onSwitchRole && (
          <button className="btn btn-white" onClick={() => onSwitchRole('admin')}>
            <UserCheck size={16} /> Switch to Admin (Full Access)
          </button>
        )}
      </div>
    </div>
  );
}
