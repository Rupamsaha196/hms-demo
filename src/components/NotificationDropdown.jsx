import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Ambulance,
  Shield,
  Trash2,
  Check,
  Zap,
} from 'lucide-react';

export default function NotificationDropdown({
  notifications,
  setNotifications,
  onClose,
  onNavigateTab,
}) {
  const [filter, setFilter] = useState('all');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const markSingleRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const deleteNotification = (id, e) => {
    e.stopPropagation();
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const simulateUrgentAlert = () => {
    const alerts = [
      {
        title: 'Trauma Code Red Alert',
        message: 'Ambulance AMB-01 inbound with multi-trauma patient. ETA 4 mins.',
        type: 'critical',
        category: 'Emergency',
      },
      {
        title: 'Stat Troponin-I Lab Critical',
        message: 'Patient OPD-101 (Rajesh Sharma) cardiac marker elevated.',
        type: 'warning',
        category: 'Clinical',
      },
      {
        title: 'New Appointment Booked',
        message: 'Patient Sneha Patil booked consultation with Dr. Rajesh Kulkarni.',
        type: 'info',
        category: 'Appointments',
      },
    ];
    const picked = alerts[Math.floor(Math.random() * alerts.length)];
    const newNotif = {
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      ...picked,
      time: 'Just now',
      read: false,
    };
    setNotifications([newNotif, ...notifications]);
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'critical') return n.type === 'critical' || n.type === 'warning';
    return true;
  });

  const getIcon = (item) => {
    if (item.category === 'Emergency') return <Ambulance size={16} color="#e11d48" />;
    if (item.category === 'Appointments') return <Calendar size={16} color="#0284c7" />;
    if (item.category === 'System' || item.category === 'Security') return <Shield size={16} color="#4f46e5" />;
    if (item.type === 'critical') return <AlertTriangle size={16} color="#dc2626" />;
    if (item.type === 'warning') return <AlertCircle size={16} color="#d97706" />;
    if (item.type === 'success') return <CheckCircle2 size={16} color="#059669" />;
    return <Bell size={16} color="#0284c7" />;
  };

  return (
    <div className="notification-dropdown-menu">
      {/* Header */}
      <div className="notif-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Bell size={17} color="var(--accent-blue)" />
          <span className="notif-title">Notifications</span>
          {unreadCount > 0 && (
            <span className="notif-badge-count">{unreadCount} new</span>
          )}
        </div>
        {unreadCount > 0 && (
          <button className="notif-action-btn" onClick={markAllRead} title="Mark all read">
            <Check size={14} /> Mark all read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="notif-filter-bar">
        <button
          className={`notif-filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({notifications.length})
        </button>
        <button
          className={`notif-filter-tab ${filter === 'unread' ? 'active' : ''}`}
          onClick={() => setFilter('unread')}
        >
          Unread ({unreadCount})
        </button>
        <button
          className={`notif-filter-tab ${filter === 'critical' ? 'active' : ''}`}
          onClick={() => setFilter('critical')}
        >
          Critical Alerts
        </button>
      </div>

      {/* Notification List */}
      <div className="notif-list">
        {filteredNotifications.length === 0 ? (
          <div className="notif-empty-state">
            <CheckCircle2 size={32} color="#94a3b8" />
            <p>No notifications in this view</p>
          </div>
        ) : (
          filteredNotifications.map((n) => (
            <div
              key={n.id}
              className={`notif-item ${!n.read ? 'unread' : ''}`}
              onClick={() => {
                markSingleRead(n.id);
                if (n.category === 'Appointments' && onNavigateTab) {
                  onNavigateTab('appointments');
                  onClose();
                } else if (n.category === 'Emergency' && onNavigateTab) {
                  onNavigateTab('ambulance');
                  onClose();
                }
              }}
            >
              <div className={`notif-icon-box notif-icon-${n.type}`}>
                {getIcon(n)}
              </div>
              <div className="notif-content">
                <div className="notif-top-row">
                  <span className="notif-item-title">{n.title}</span>
                  <span className="notif-time">{n.time}</span>
                </div>
                <p className="notif-message">{n.message}</p>
                <div className="notif-footer-row">
                  <span className="notif-category-pill">{n.category}</span>
                  <button
                    className="notif-delete-btn"
                    onClick={(e) => deleteNotification(n.id, e)}
                    title="Dismiss"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              {!n.read && <span className="notif-unread-dot" />}
            </div>
          ))
        )}
      </div>

      {/* Footer Quick Action */}
      <div className="notif-dropdown-footer">
        <button className="notif-simulate-btn" onClick={simulateUrgentAlert}>
          <Zap size={14} /> Simulate Hospital Alert
        </button>
      </div>
    </div>
  );
}
