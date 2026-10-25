import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, Clock, Menu, Sun, Moon, Bell, LogOut } from 'lucide-react';
import { ROLES, ROLE_PERMISSIONS } from '../data/initialData';
import NotificationDropdown from './NotificationDropdown';

export default function Navbar({
  currentRole,
  setCurrentRole,
  searchQuery,
  setSearchQuery,
  setMobileOpen,
  theme,
  toggleTheme,
  notifications,
  setNotifications,
  onNavigateTab,
  onSignOut,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeRoleData = ROLES.find((r) => r.id === currentRole) || ROLES[0];
  const roleConfig = ROLE_PERMISSIONS[currentRole] || ROLE_PERMISSIONS.admin;

  const unreadNotifs = notifications ? notifications.filter((n) => !n.read).length : 0;
  const hasCritical = notifications ? notifications.some((n) => !n.read && n.type === 'critical') : false;

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
          <Menu size={22} color="var(--navy-900)" />
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
        {/* Live Hospital Clock */}
        <div className="live-clock">
          <Clock size={14} />
          <span>
            {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {/* Theme Toggle (Dark / Light Mode) */}
        <button
          className="theme-toggle-btn"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? (
            <Sun size={18} className="theme-icon sun-icon" />
          ) : (
            <Moon size={18} className="theme-icon moon-icon" />
          )}
        </button>

        {/* Notification Bell Dropdown */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button
            className={`nav-icon-btn notif-bell-btn ${notifOpen ? 'active' : ''}`}
            onClick={() => setNotifOpen(!notifOpen)}
            aria-label="Hospital Notifications"
            title="Hospital Notifications & Alerts"
          >
            <Bell size={18} />
            {unreadNotifs > 0 && (
              <span className={`notif-unread-badge ${hasCritical ? 'badge-critical-pulse' : ''}`}>
                {unreadNotifs}
              </span>
            )}
          </button>

          {notifOpen && (
            <NotificationDropdown
              notifications={notifications}
              setNotifications={setNotifications}
              onClose={() => setNotifOpen(false)}
              onNavigateTab={onNavigateTab}
            />
          )}
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
            <ChevronDown size={14} color="var(--text-muted)" />
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
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>
                            {r.label}
                          </span>
                          <span
                            style={{
                              fontSize: '0.65rem',
                              fontWeight: 600,
                              color: isCurrent ? 'var(--accent-blue)' : 'var(--text-muted)',
                            }}
                          >
                            {perm?.badge}
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: '0.68rem',
                            color: 'var(--text-muted)',
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

        {/* Sign Out Button to return to Demo Sign-in */}
        {onSignOut && (
          <button
            className="nav-icon-btn logout-btn"
            onClick={onSignOut}
            title="Sign Out to Arogya Hospital Demo Screen"
            aria-label="Sign Out"
          >
            <LogOut size={16} />
          </button>
        )}
      </div>
    </header>
  );
}
