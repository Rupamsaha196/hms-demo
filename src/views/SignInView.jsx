import React, { useState } from 'react';
import {
  HeartPulse,
  Shield,
  ArrowRight,
  Sun,
  Moon,
  CheckCircle2,
  Lock,
  Stethoscope,
  Users,
  Bed,
  Receipt,
  CalendarClock,
  Bell,
  Sparkles,
} from 'lucide-react';
import { ROLES, ROLE_PERMISSIONS } from '../data/initialData';

export default function SignInView({ onSignIn, theme, toggleTheme }) {
  const [selectedRole, setSelectedRole] = useState('admin');

  const handleEnterPortal = (roleId = selectedRole) => {
    onSignIn(roleId);
  };

  const getRoleIcon = (roleId) => {
    switch (roleId) {
      case 'admin':
        return Shield;
      case 'doctor':
        return Stethoscope;
      case 'staff':
        return Bed;
      case 'receptionist':
        return Users;
      case 'accountant':
        return Receipt;
      default:
        return HeartPulse;
    }
  };

  return (
    <div className="signin-page-wrapper">
      {/* Top Bar on Sign-in Page */}
      <header className="signin-topbar">
        <div className="signin-topbar-left">
          <div className="signin-logo-badge">
            <HeartPulse size={22} color="#ffffff" strokeWidth={2.5} />
          </div>
          <div>
            <span className="signin-brand-title">Arogya Hospital</span>
            <span className="signin-brand-tag">Enterprise Healthcare Portal</span>
          </div>
        </div>

        <div className="signin-topbar-right">
          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun size={18} className="theme-icon sun-icon" />
            ) : (
              <Moon size={18} className="theme-icon moon-icon" />
            )}
          </button>
        </div>
      </header>

      {/* Main Sign-In Hero Content */}
      <div className="signin-content-container">
        {/* Left Visual Hospital Showcase Card */}
        <div className="signin-hero-card">
          <div className="signin-hospital-header">
            <div className="signin-large-icon">
              <HeartPulse size={36} color="#ffffff" strokeWidth={2.5} />
            </div>
            <div>
              <span className="signin-hospital-super">WELCOME TO</span>
              <h1 className="signin-hospital-name">Arogya Hospital</h1>
              <p className="signin-hospital-desc">
                Tertiary Care Super-Specialty Medical Center & Research Institute
              </p>
            </div>
          </div>

          <div className="signin-features-list">
            <div className="signin-feature-item">
              <div className="signin-feature-icon">
                <CalendarClock size={18} color="#38bdf8" />
              </div>
              <div>
                <div className="signin-feature-title">Smart Appointment Scheduling</div>
                <div className="signin-feature-desc">Interactive time-slot matrix and real-time reminders</div>
              </div>
            </div>

            <div className="signin-feature-item">
              <div className="signin-feature-icon">
                <Bell size={18} color="#f59e0b" />
              </div>
              <div>
                <div className="signin-feature-title">Live Hospital Notifications</div>
                <div className="signin-feature-desc">Real-time trauma dispatch, lab troponin alerts & system broadcasts</div>
              </div>
            </div>

            <div className="signin-feature-item">
              <div className="signin-feature-icon">
                <Shield size={18} color="#34d399" />
              </div>
              <div>
                <div className="signin-feature-title">Administration & Tamper-Proof Audit</div>
                <div className="signin-feature-desc">HIPAA/NABH 7-year immutable audit trail with SHA-256 seal</div>
              </div>
            </div>

            <div className="signin-feature-item">
              <div className="signin-feature-icon">
                <Sparkles size={18} color="#a78bfa" />
              </div>
              <div>
                <div className="signin-feature-title">Refined Dark / Light Theme</div>
                <div className="signin-feature-desc">Designed with high-contrast medical ergonomics</div>
              </div>
            </div>
          </div>

          {/* Accreditations Bar */}
          <div className="signin-accreditations">
            <span className="signin-badge-pill">NABH Accredited</span>
            <span className="signin-badge-pill">24/7 Trauma Bay</span>
            <span className="signin-badge-pill">ISO 9001:2015</span>
            <span className="signin-badge-pill">Zero-Trust Security</span>
          </div>
        </div>

        {/* Right Sign-in Form Card */}
        <div className="signin-form-card">
          <div className="signin-form-header">
            <div className="demo-access-pill">
              <span className="status-dot-pulse" style={{ background: '#10b981' }} />
              Demo Mode Active • No Credentials Required
            </div>
            <h2 className="signin-portal-title">Sign in to Hospital Portal</h2>
            <p className="signin-portal-sub">
              Select your role profile below for instant 1-click access to <strong>Arogya Hospital</strong>:
            </p>
          </div>

          {/* 1-Click Role Profiles Selector */}
          <div className="signin-roles-grid">
            {ROLES.map((role) => {
              const Icon = getRoleIcon(role.id);
              const perm = ROLE_PERMISSIONS[role.id];
              const isSelected = selectedRole === role.id;
              return (
                <div
                  key={role.id}
                  className={`signin-role-option ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedRole(role.id)}
                >
                  <div
                    className="signin-role-avatar"
                    style={{ backgroundColor: role.color }}
                  >
                    <Icon size={16} color="#ffffff" />
                  </div>
                  <div className="signin-role-meta">
                    <div className="signin-role-top">
                      <span className="signin-role-label">{role.label}</span>
                      <span className="signin-role-badge">{perm.badge}</span>
                    </div>
                    <div className="signin-role-person">{role.name}</div>
                    <div className="signin-role-desc">{role.title}</div>
                  </div>
                  <div className="signin-radio-indicator">
                    {isSelected && <CheckCircle2 size={16} color="#1d4ed8" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Notice: No password needed */}
          <div className="signin-credentials-notice">
            <Lock size={15} color="#059669" />
            <span>
              SSO Auto-Authentication enabled for demo. No username or password needed.
            </span>
          </div>

          {/* Primary Action Button */}
          <button
            className="signin-submit-btn"
            onClick={() => handleEnterPortal(selectedRole)}
          >
            <span>Enter Arogya Hospital as {ROLES.find((r) => r.id === selectedRole)?.label}</span>
            <ArrowRight size={18} />
          </button>

          {/* Quick 1-Click Fast Enter for Any Role */}
          <div className="signin-quick-links">
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Quick Jump:</span>
            {ROLES.map((r) => (
              <button
                key={r.id}
                className="signin-quick-btn"
                onClick={() => handleEnterPortal(r.id)}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="signin-footer">
        <div>© 2026 Arogya Hospital & Research Institute. All rights reserved.</div>
        <div>CarePulse Navy Medical Management System • v2.4 Enterprise Edition</div>
      </footer>
    </div>
  );
}
