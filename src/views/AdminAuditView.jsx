import React, { useState } from 'react';
import {
  ShieldCheck,
  FileCheck,
  Users,
  Download,
  CheckCircle2,
  Lock,
  Server,
  Plus,
  Radio,
  FileText,
  Shield,
  Eye,
  Terminal,
  Zap,
} from 'lucide-react';
import Modal from '../components/Modal';
import StatCard from '../components/StatCard';

const AUDIT_CATEGORIES = [
  'All',
  'Authentication',
  'OPD',
  'IPD',
  'Appointments',
  'Pathology',
  'Radiology',
  'Billing',
  'Ambulance',
  'Security',
  'System',
];

export default function AdminAuditView({
  auditLogsList,
  setAuditLogsList,
  systemUsersList,
  setSystemUsersList,
  emergencyAlert,
  setEmergencyAlert,
  searchQuery,
  onShowToast,
}) {
  const [activeSubTab, setActiveSubTab] = useState('audit'); // 'audit' or 'admin'
  const [catFilter, setCatFilter] = useState('All');
  const [sevFilter, setSevFilter] = useState('All');
  const [inspectEvent, setInspectEvent] = useState(null);

  // New User Modal State
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    role: 'Doctor',
    department: 'General Medicine',
    accessLevel: 'Clinical',
  });

  // Security Policy State
  const [enforce2FA, setEnforce2FA] = useState(true);
  const [ipGeofence, setIpGeofence] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30');

  // Audit Metrics
  const totalAuditEvents = auditLogsList.length;
  const criticalCount = auditLogsList.filter((l) => l.severity === 'critical').length;
  const warningCount = auditLogsList.filter((l) => l.severity === 'warning').length;
  const activeStaffCount = systemUsersList.filter((u) => u.status === 'Active').length;

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(auditLogsList, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `carepulse_audit_log_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    if (onShowToast) {
      onShowToast({
        title: 'Audit Log Exported',
        message: `Exported ${auditLogsList.length} immutable audit records to JSON.`,
        type: 'success',
      });
    }
  };

  const handleExportCSV = () => {
    const headers = ['Event ID', 'Timestamp', 'Action', 'Category', 'Severity', 'User', 'Role', 'IP Address', 'Details'];
    const rows = auditLogsList.map((l) => [
      l.id,
      `"${l.timestamp}"`,
      `"${l.action}"`,
      `"${l.category}"`,
      `"${l.severity}"`,
      `"${l.user}"`,
      `"${l.role}"`,
      `"${l.ipAddress}"`,
      `"${l.details.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `carepulse_audit_log_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();

    if (onShowToast) {
      onShowToast({
        title: 'CSV Exported',
        message: 'Compliance audit trail exported as CSV.',
        type: 'success',
      });
    }
  };

  const triggerTestAuditEvent = () => {
    const actions = [
      {
        action: 'MANUAL_INTEGRITY_CHECK',
        category: 'Security',
        severity: 'info',
        details: 'Admin initiated cryptographic verification of IPD electronic medical records',
      },
      {
        action: 'EHR_ACCESS_VERIFIED',
        category: 'OPD',
        severity: 'info',
        details: 'Verified patient record hash matches blockchain audit baseline',
      },
      {
        action: 'PRIVILEGE_ELEVATION_TEST',
        category: 'Authentication',
        severity: 'warning',
        details: 'Attempted role credential verification for emergency OT override',
      },
    ];
    const picked = actions[Math.floor(Math.random() * actions.length)];
    const newLog = {
      id: `AUD-${9030 + auditLogsList.length}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      ...picked,
      user: 'Dr. Arunabh Sengupta',
      role: 'Super Admin',
      ipAddress: '192.168.1.101',
    };

    setAuditLogsList([newLog, ...auditLogsList]);

    if (onShowToast) {
      onShowToast({
        title: 'Audit Event Recorded',
        message: `Generated log ${newLog.id} (${newLog.action}).`,
        type: 'info',
      });
    }
  };

  const toggleUserStatus = (userId) => {
    setSystemUsersList(
      systemUsersList.map((u) => {
        if (u.id === userId) {
          const newStatus = u.status === 'Active' ? 'Suspended' : 'Active';
          if (onShowToast) {
            onShowToast({
              title: `User ${newStatus}`,
              message: `${u.name} is now ${newStatus}.`,
              type: newStatus === 'Active' ? 'success' : 'warning',
            });
          }
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
  };

  const toggleUser2FA = (userId) => {
    setSystemUsersList(
      systemUsersList.map((u) => {
        if (u.id === userId) {
          const nextVal = !u.twoFactor;
          if (onShowToast) {
            onShowToast({
              title: '2FA Updated',
              message: `2FA ${nextVal ? 'enabled' : 'disabled'} for ${u.name}.`,
              type: 'info',
            });
          }
          return { ...u, twoFactor: nextVal };
        }
        return u;
      })
    );
  };

  const handleAddUserSubmit = (e) => {
    e.preventDefault();
    if (!newUserForm.name || !newUserForm.email) return;

    const nextId = `USR-0${systemUsersList.length + 1}`;
    const newUser = {
      id: nextId,
      name: newUserForm.name,
      email: newUserForm.email,
      role: newUserForm.role,
      department: newUserForm.department,
      status: 'Active',
      twoFactor: true,
      lastLogin: 'Never',
      accessLevel: newUserForm.accessLevel,
    };

    setSystemUsersList([...systemUsersList, newUser]);
    setIsAddUserModalOpen(false);

    if (onShowToast) {
      onShowToast({
        title: 'User Provisioned',
        message: `${newUser.name} assigned ${newUser.role} credentials.`,
        type: 'success',
      });
    }

    setNewUserForm({
      name: '',
      email: '',
      role: 'Doctor',
      department: 'General Medicine',
      accessLevel: 'Clinical',
    });
  };

  // Filtered Audit Logs
  const filteredAuditLogs = auditLogsList.filter((log) => {
    const term = (searchQuery || '').toLowerCase();
    const matchesSearch =
      log.action.toLowerCase().includes(term) ||
      log.details.toLowerCase().includes(term) ||
      log.user.toLowerCase().includes(term) ||
      log.role.toLowerCase().includes(term) ||
      log.ipAddress.toLowerCase().includes(term) ||
      log.id.toLowerCase().includes(term);

    const matchesCat = catFilter === 'All' || log.category === catFilter;
    const matchesSev = sevFilter === 'All' || log.severity === sevFilter.toLowerCase();

    return matchesSearch && matchesCat && matchesSev;
  });

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="badge badge-danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span className="status-dot-pulse" style={{ width: 6, height: 6, background: '#ef4444' }} />
            CRITICAL
          </span>
        );
      case 'warning':
        return <span className="badge badge-warning">WARNING</span>;
      default:
        return <span className="badge badge-info">INFO</span>;
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <ShieldCheck size={24} color="var(--accent-blue)" /> Administration & Compliance Audit
          </h1>
          <p className="page-subtitle">
            Immutable system audit logs, security policies, and medical staff authorization control
          </p>
        </div>
        <div className="page-actions">
          {activeSubTab === 'audit' ? (
            <>
              <button className="btn btn-white" onClick={triggerTestAuditEvent}>
                <Zap size={15} color="var(--accent-blue)" /> Test Audit Event
              </button>
              <button className="btn btn-white" onClick={handleExportCSV}>
                <Download size={15} /> Export CSV
              </button>
              <button className="btn btn-primary" onClick={handleExportJSON}>
                <FileCheck size={15} /> Export JSON Ledger
              </button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={() => setIsAddUserModalOpen(true)}>
              <Plus size={16} /> Provision Staff User
            </button>
          )}
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="stat-grid">
        <StatCard
          label="Audit Ledger Logs"
          value={totalAuditEvents}
          subtext="Cryptographically sealed entries"
          icon={FileText}
          color="#15325b"
        />
        <StatCard
          label="NABH & HIPAA Retention"
          value="7 Years"
          subtext="Tamper-evident compliant"
          icon={Lock}
          color="#0d9488"
        />
        <StatCard
          label="Security Status"
          value={criticalCount === 0 ? 'Protected' : `${criticalCount} Alerts`}
          subtext={`${warningCount} advisory notices`}
          icon={Shield}
          color={criticalCount === 0 ? '#10b981' : '#e11d48'}
        />
        <StatCard
          label="Authorized Staff"
          value={`${activeStaffCount}/${systemUsersList.length}`}
          subtext="Active credentialed users"
          icon={Users}
          color="#0284c7"
        />
      </div>

      {/* Sub-tab Navigation */}
      <div className="admin-subtab-bar">
        <button
          className={`admin-subtab-btn ${activeSubTab === 'audit' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('audit')}
        >
          <FileCheck size={16} /> Compliance Audit Trail
        </button>
        <button
          className={`admin-subtab-btn ${activeSubTab === 'admin' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('admin')}
        >
          <Users size={16} /> User & Security Administration
        </button>
      </div>

      {/* TAB 1: AUDIT TRAIL */}
      {activeSubTab === 'audit' && (
        <>
          {/* Audit Filters Card */}
          <div className="card" style={{ marginBottom: '1.25rem' }}>
            <div className="filter-controls-row">
              <div className="filter-pills-group">
                <span className="filter-label">Category:</span>
                {AUDIT_CATEGORIES.slice(0, 7).map((c) => (
                  <button
                    key={c}
                    className={`filter-pill ${catFilter === c ? 'active' : ''}`}
                    onClick={() => setCatFilter(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <div className="filter-pills-group" style={{ marginLeft: 'auto' }}>
                <span className="filter-label">Severity:</span>
                {['All', 'Info', 'Warning', 'Critical'].map((s) => (
                  <button
                    key={s}
                    className={`filter-pill ${sevFilter === s ? 'active' : ''}`}
                    onClick={() => setSevFilter(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Audit Table */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Terminal size={18} color="var(--accent-blue)" />
                <span>Live Audit Stream ({filteredAuditLogs.length} Records)</span>
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Immutable Real-time Append Log
              </span>
            </div>
            <div className="table-responsive">
              <table className="hms-table">
                <thead>
                  <tr>
                    <th>Log ID & Time</th>
                    <th>Action</th>
                    <th>Category</th>
                    <th>Severity</th>
                    <th>Operator</th>
                    <th>Terminal / IP</th>
                    <th>Event Details</th>
                    <th style={{ textAlign: 'right' }}>Inspect</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAuditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                        <ShieldCheck size={36} color="var(--text-light)" style={{ marginBottom: '0.5rem' }} />
                        <p>No audit events match the active filter criteria.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredAuditLogs.map((log) => (
                      <tr key={log.id}>
                        <td>
                          <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.8rem' }}>{log.id}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{log.timestamp}</div>
                        </td>
                        <td>
                          <span className="code-pill">{log.action}</span>
                        </td>
                        <td>
                          <span className="notif-category-pill">{log.category}</span>
                        </td>
                        <td>{getSeverityBadge(log.severity)}</td>
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.8rem' }}>{log.user}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{log.role}</div>
                        </td>
                        <td>
                          <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {log.ipAddress}
                          </span>
                        </td>
                        <td style={{ maxWidth: '320px' }}>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {log.details}
                          </div>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            className="btn btn-sm btn-white"
                            onClick={() => setInspectEvent(log)}
                            title="Inspect Cryptographic Event"
                          >
                            <Eye size={13} color="var(--accent-blue)" /> Inspect
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* TAB 2: SYSTEM & USER ADMINISTRATION */}
      {activeSubTab === 'admin' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Hospital Infrastructure Health Card */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Server size={18} color="var(--accent-blue)" />
                <span>Hospital Infrastructure & Health Metrics</span>
              </div>
              <span className="badge badge-success">Systems Operational</span>
            </div>
            <div className="card-body">
              <div className="infra-grid">
                <div className="infra-metric-box">
                  <span className="infra-label">PostgreSQL Master Cluster</span>
                  <span className="infra-value" style={{ color: '#059669' }}>Synchronized</span>
                  <span className="infra-sub">Latency: 14ms | Replica: Active</span>
                </div>
                <div className="infra-metric-box">
                  <span className="infra-label">Uptime Availability</span>
                  <span className="infra-value">99.98%</span>
                  <span className="infra-sub">34 days, 11 hours continuous</span>
                </div>
                <div className="infra-metric-box">
                  <span className="infra-label">Encrypted Snapshot Vault</span>
                  <span className="infra-value" style={{ color: '#0284c7' }}>BKP-20261024-04</span>
                  <span className="infra-sub">Auto backup in 4h 15m</span>
                </div>
                <div className="infra-metric-box">
                  <span className="infra-label">HIPAA Audit Retention</span>
                  <span className="infra-value">Immutable</span>
                  <span className="infra-sub">Write-Once-Read-Many (WORM)</span>
                </div>
              </div>
            </div>
          </div>

          {/* User Management Table */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Users size={18} color="var(--accent-blue)" />
                <span>Authorized Hospital Personnel & Access Credentials</span>
              </div>
              <button className="btn btn-sm btn-primary" onClick={() => setIsAddUserModalOpen(true)}>
                <Plus size={14} /> Add User
              </button>
            </div>
            <div className="table-responsive">
              <table className="hms-table">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Name & Email</th>
                    <th>Role & Dept</th>
                    <th>Access Level</th>
                    <th>2FA Security</th>
                    <th>Status</th>
                    <th>Last Active</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {systemUsersList.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <span className="id-pill">{user.id}</span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{user.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{user.role}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.department}</div>
                      </td>
                      <td>
                        <span className="badge badge-info">{user.accessLevel}</span>
                      </td>
                      <td>
                        <button
                          className={`badge ${user.twoFactor ? 'badge-success' : 'badge-warning'}`}
                          style={{ cursor: 'pointer', border: 'none' }}
                          onClick={() => toggleUser2FA(user.id)}
                          title="Click to toggle 2FA"
                        >
                          <Lock size={11} style={{ marginRight: 3 }} />
                          {user.twoFactor ? '2FA Active' : '2FA Off'}
                        </button>
                      </td>
                      <td>
                        <span className={`badge ${user.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                          {user.status}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.lastLogin}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="btn btn-sm btn-white"
                          onClick={() => toggleUserStatus(user.id)}
                        >
                          {user.status === 'Active' ? 'Suspend' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Security Policy Settings & Emergency Broadcast */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Lock size={18} color="var(--accent-blue)" />
                <span>Hospital Security & Emergency Broadcast Controls</span>
              </div>
            </div>
            <div className="card-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                {/* Security Policies */}
                <div className="policy-box">
                  <div className="policy-item">
                    <div>
                      <div className="policy-title">Enforce Multi-Factor Authentication (2FA)</div>
                      <div className="policy-desc">Mandate OTP/Authenticator for all clinical staff login</div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={enforce2FA}
                        onChange={(e) => {
                          setEnforce2FA(e.target.checked);
                          if (onShowToast) onShowToast({ title: 'Policy Updated', message: `2FA requirement ${e.target.checked ? 'enforced' : 'relaxed'}.`, type: 'info' });
                        }}
                      />
                      <span className="toggle-slider" />
                    </label>
                  </div>

                  <div className="policy-item">
                    <div>
                      <div className="policy-title">Hospital LAN IP Geofencing</div>
                      <div className="policy-desc">Restrict EHR access to hospital intranet (192.168.1.0/24)</div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={ipGeofence}
                        onChange={(e) => {
                          setIpGeofence(e.target.checked);
                          if (onShowToast) onShowToast({ title: 'Policy Updated', message: `IP Whitelist ${e.target.checked ? 'enabled' : 'disabled'}.`, type: 'info' });
                        }}
                      />
                      <span className="toggle-slider" />
                    </label>
                  </div>

                  <div className="policy-item">
                    <div>
                      <div className="policy-title">Session Inactivity Timeout</div>
                      <div className="policy-desc">Auto-logout workstations left unattended</div>
                    </div>
                    <select
                      className="form-control"
                      style={{ width: '110px', fontSize: '0.8rem' }}
                      value={sessionTimeout}
                      onChange={(e) => setSessionTimeout(e.target.value)}
                    >
                      <option value="15">15 mins</option>
                      <option value="30">30 mins</option>
                      <option value="60">60 mins</option>
                    </select>
                  </div>
                </div>

                {/* Emergency Broadcast Control */}
                <div className="policy-box" style={{ background: 'var(--bg-main)', border: '1px solid var(--border-light)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <Radio size={18} color="#dc2626" />
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                      Hospital-wide Emergency Broadcast
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                    Displays a high-visibility emergency alert banner across all active terminal sessions.
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Broadcast Status:</span>
                    <button
                      className={`btn btn-sm ${emergencyAlert.active ? 'btn-danger' : 'btn-white'}`}
                      onClick={() => {
                        const next = !emergencyAlert.active;
                        setEmergencyAlert({ ...emergencyAlert, active: next });
                        if (onShowToast) {
                          onShowToast({
                            title: next ? 'Emergency Broadcast Active' : 'Emergency Broadcast Cleared',
                            message: next ? 'Alert is live across all hospital terminals.' : 'Normal operations resumed.',
                            type: next ? 'error' : 'success',
                          });
                        }
                      }}
                    >
                      {emergencyAlert.active ? 'Disable Broadcast' : 'Activate Broadcast'}
                    </button>
                  </div>

                  {emergencyAlert.active && (
                    <input
                      type="text"
                      className="form-control"
                      value={emergencyAlert.message}
                      onChange={(e) => setEmergencyAlert({ ...emergencyAlert, message: e.target.value })}
                      placeholder="Emergency alert message..."
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inspect Audit Event Modal */}
      {inspectEvent && (
        <Modal
          isOpen={!!inspectEvent}
          onClose={() => setInspectEvent(null)}
          title={`Cryptographic Audit Verification • ${inspectEvent.id}`}
          maxWidth="640px"
        >
          <div>
            <div className="inspect-banner">
              <CheckCircle2 size={18} color="#059669" />
              <span>SHA-256 Checksum Verified: Tamper-proof WORM Record</span>
            </div>

            <div className="inspect-details-grid">
              <div>
                <span className="inspect-label">Log ID:</span>
                <span className="inspect-val">{inspectEvent.id}</span>
              </div>
              <div>
                <span className="inspect-label">Recorded Timestamp:</span>
                <span className="inspect-val">{inspectEvent.timestamp}</span>
              </div>
              <div>
                <span className="inspect-label">Action Identifier:</span>
                <span className="inspect-val code-pill">{inspectEvent.action}</span>
              </div>
              <div>
                <span className="inspect-label">Department / Module:</span>
                <span className="inspect-val">{inspectEvent.category}</span>
              </div>
              <div>
                <span className="inspect-label">Authenticated User:</span>
                <span className="inspect-val">{inspectEvent.user} ({inspectEvent.role})</span>
              </div>
              <div>
                <span className="inspect-label">Client Terminal IP:</span>
                <span className="inspect-val" style={{ fontFamily: 'monospace' }}>{inspectEvent.ipAddress}</span>
              </div>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <span className="inspect-label">Details / Event Payload:</span>
              <div className="inspect-code-block">
                {inspectEvent.details}
              </div>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <span className="inspect-label">Cryptographic Seal (SHA-256 Digest):</span>
              <div className="inspect-hash-box">
                {`sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855-${inspectEvent.id}`}
              </div>
            </div>

            <div className="modal-footer" style={{ marginTop: '1.25rem', padding: '0.75rem 0 0', borderTop: '1px solid var(--border-light)' }}>
              <button className="btn btn-primary" onClick={() => setInspectEvent(null)}>
                Close Inspector
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Staff User Modal */}
      <Modal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        title="Provision Hospital Staff Account"
        maxWidth="520px"
      >
        <form onSubmit={handleAddUserSubmit}>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              required
              className="form-control"
              placeholder="e.g. Dr. Rajesh Kulkarni"
              value={newUserForm.name}
              onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label">Hospital Email Address *</label>
            <input
              type="email"
              required
              className="form-control"
              placeholder="name@carepulse.hms"
              value={newUserForm.email}
              onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Role Profile *</label>
              <select
                className="form-control"
                value={newUserForm.role}
                onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
              >
                <option value="Doctor">Doctor</option>
                <option value="Staff">Nursing Staff</option>
                <option value="Receptionist">Receptionist</option>
                <option value="Accountant">Accountant</option>
                <option value="Super Admin">Super Admin</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Department *</label>
              <select
                className="form-control"
                value={newUserForm.department}
                onChange={(e) => setNewUserForm({ ...newUserForm, department: e.target.value })}
              >
                <option value="Cardiology">Cardiology</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Neurology">Neurology</option>
                <option value="General Medicine">General Medicine</option>
                <option value="Radiology">Radiology</option>
                <option value="Pathology">Pathology</option>
                <option value="Front Desk & Admissions">Front Desk & Admissions</option>
                <option value="Accounts & Finance">Accounts & Finance</option>
                <option value="Administration">Administration</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">Authorization Tier</label>
            <select
              className="form-control"
              value={newUserForm.accessLevel}
              onChange={(e) => setNewUserForm({ ...newUserForm, accessLevel: e.target.value })}
            >
              <option value="Clinical Standard">Clinical Standard</option>
              <option value="Clinical Senior">Clinical Senior</option>
              <option value="Front Desk">Front Desk</option>
              <option value="Finance Master">Finance Master</option>
              <option value="Tier 1 (Master Admin)">Tier 1 (Master Admin)</option>
            </select>
          </div>

          <div className="modal-footer" style={{ padding: '0.75rem 0 0', borderTop: '1px solid var(--border-light)' }}>
            <button type="button" className="btn btn-white" onClick={() => setIsAddUserModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Plus size={16} /> Create User Account
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
