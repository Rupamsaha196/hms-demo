import React from 'react';
import {
  LayoutDashboard,
  Users,
  Bed,
  Scan,
  FlaskConical,
  Stethoscope,
  Receipt,
  TrendingUp,
  Ambulance,
  HeartPulse,
  X,
  Shield,
  CalendarClock,
  ShieldCheck,
} from 'lucide-react';
import { ROLE_PERMISSIONS, ROLES } from '../data/initialData';

export default function Sidebar({ activeTab, setActiveTab, currentRole, mobileOpen, setMobileOpen }) {
  const allMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'opd', label: 'OPD', icon: Users },
    { id: 'ipd', label: 'IPD', icon: Bed },
    { id: 'appointments', label: 'Appointments', icon: CalendarClock },
    { id: 'radiology', label: 'Radiology', icon: Scan },
    { id: 'pathology', label: 'Pathology', icon: FlaskConical },
    { id: 'doctors', label: 'Doctor Available', icon: Stethoscope },
    { id: 'billings', label: 'Billings', icon: Receipt },
    { id: 'finances', label: 'Expenses or Income', icon: TrendingUp },
    { id: 'ambulance', label: 'Ambulance', icon: Ambulance },
    { id: 'admin-audit', label: 'Admin & Audit', icon: ShieldCheck },
  ];

  const roleConfig = ROLE_PERMISSIONS[currentRole] || ROLE_PERMISSIONS.admin;
  const currentRoleData = ROLES.find((r) => r.id === currentRole) || ROLES[0];

  // Role-based filtered menu items without any module numbers
  const menuItems = allMenuItems.filter((item) =>
    roleConfig.allowedTabs.includes(item.id)
  );

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    if (setMobileOpen) {
      setMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation drawer"
        />
      )}

      <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
            <div className="sidebar-logo-icon">
              <HeartPulse size={20} color="#0b1e36" strokeWidth={2.5} />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div className="sidebar-logo-text">Arogya Hospital</div>
              <div className="sidebar-logo-sub">Advanced Multi-Specialty HMS</div>
            </div>
          </div>

          {/* Close button on mobile screens */}
          <button
            className="mobile-close-btn"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Current Active Role Indicator Badge without module numbers */}
        <div className="sidebar-role-badge-box">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
            <Shield size={13} color="#94a3b8" />
            <span style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8' }}>
              Access Profile
            </span>
          </div>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>
            {currentRoleData.label} ({roleConfig.badge})
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-title">Navigation</div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`nav-item-btn ${isActive ? 'active' : ''}`}
                onClick={() => handleSelectTab(item.id)}
              >
                <div className="nav-item-content">
                  <Icon className="nav-icon" size={18} />
                  <span className="nav-item-text">{item.label}</span>
                </div>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="hospital-status-pill">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span className="status-dot-pulse"></span>
              <span style={{ color: '#e2e8f0', fontWeight: 600 }}>Emergency 24/7</span>
            </div>
            <span style={{ color: '#94a3b8', fontSize: '0.7rem' }}>Live</span>
          </div>
        </div>
      </aside>
    </>
  );
}
