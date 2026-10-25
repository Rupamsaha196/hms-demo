import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, Clock, Shield, Menu } from 'lucide-react';
import { ROLES, ROLE_PERMISSIONS } from '../data/initialData';

export default function Navbar({
  currentRole,
  setCurrentRole,
  searchQuery,
  setSearchQuery,
  setMobileOpen,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const dropdownRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Click outside listener for dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeRoleData = ROLES.find((r) => r.id === currentRole) || ROLES[0];
  const roleConfig = ROLE_PERMISSIONS[currentRole] || ROLE_PERMISSIONS.admin;

  return (
    <header className="top-navbar">
      <div className="nav-left">
        {/* Mobile Hamburger Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation menu"
          title="Open Menu"
        >
          <Menu size={22} color="#0f2746" />
        </button>

        {/* Global Search Input */}
        <div className="search-input-wrapper">
          <Search />
          <input
            type="text"
            placeholder="Search patient, doctor, bill, test..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="nav-right">
        {/* Live Hospital Clock (hidden on narrow phones to prevent overflow) */}
        <div className="live-clock">
          <Clock size={14} />
          <span>
            {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {/* Role Switcher with RBAC indicator */}
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <button
            className="role-switcher-dropdown"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            title="Switch User Role to test Role-Based Access Control"
          >
            <div className="role-avatar" style={{ backgroundColor: activeRoleData.color }}>
              {activeRoleData.label.charAt(0)}
            </div>
            <div className="role-details">
              <div className="role-name">{activeRoleData.name}</div>
              <div className="role-badge">
                {activeRoleData.label} • {roleConfig.badge}
              </div>
            </div>
            <ChevronDown size={14} color="#64748b" />
          </button>

          {dropdownOpen && (
            <div className="role-dropdown-menu">
              <div className="role-dropdown-header">
                <span>Switch Role (RBAC Demo)</span>
              </div>
              <div className="role-dropdown-list">
                {ROLES.map((r) => {
                  const perm = ROLE_PERMISSIONS[r.id];
                  const isCurrent = currentRole === r.id;
                  return (
                    <div
                      key={r.id}
                      className={`role-dropdown-item ${isCurrent ? 'active' : ''}`}
                      onClick={() => {
                        setCurrentRole(r.id);
                        setDropdownOpen(false);
                      }}
                    >
                      <div
                        className="role-avatar"
                        style={{ backgroundColor: r.color, width: 28, height: 28, fontSize: '0.72rem' }}
                      >
                        {r.label.charAt(0)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>
                            {r.label}
                          </span>
                          <span
                            style={{
                              fontSize: '0.65rem',
                              fontWeight: 600,
                              color: isCurrent ? '#1d4ed8' : '#64748b',
                            }}
                          >
                            {perm?.badge}
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: '0.68rem',
                            color: '#64748b',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {r.name}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
