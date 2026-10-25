import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AccessDenied from './components/AccessDenied';
import DashboardView from './views/DashboardView';
import OpdView from './views/OpdView';
import IpdView from './views/IpdView';
import AppointmentsView from './views/AppointmentsView';
import RadiologyView from './views/RadiologyView';
import PathologyView from './views/PathologyView';
import DoctorAvailableView from './views/DoctorAvailableView';
import BillingsView from './views/BillingsView';
import ExpensesIncomeView from './views/ExpensesIncomeView';
import AmbulanceView from './views/AmbulanceView';
import AdminAuditView from './views/AdminAuditView';
import SignInView from './views/SignInView';
import { AlertTriangle, X, CheckCircle2, AlertCircle, Info } from 'lucide-react';

import {
  INITIAL_OPD,
  INITIAL_BEDS,
  INITIAL_APPOINTMENTS,
  INITIAL_RADIOLOGY,
  INITIAL_PATHOLOGY,
  INITIAL_DOCTORS,
  INITIAL_BILLINGS,
  INITIAL_TRANSACTIONS,
  INITIAL_AMBULANCES,
  INITIAL_AUDIT_LOGS,
  INITIAL_SYSTEM_USERS,
  INITIAL_NOTIFICATIONS,
  ROLE_PERMISSIONS,
  ROLES,
} from './data/initialData';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentRole, setCurrentRole] = useState('admin');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  // Theme state (Dark Mode / Light Mode)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('carepulse_theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('carepulse_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Hospital state
  const [opdList, setOpdList] = useState(INITIAL_OPD);
  const [bedsList, setBedsList] = useState(INITIAL_BEDS);
  const [appointmentsList, setAppointmentsList] = useState(INITIAL_APPOINTMENTS);
  const [radiologyList, setRadiologyList] = useState(INITIAL_RADIOLOGY);
  const [pathologyList, setPathologyList] = useState(INITIAL_PATHOLOGY);
  const [doctorsList, setDoctorsList] = useState(INITIAL_DOCTORS);
  const [billingsList, setBillingsList] = useState(INITIAL_BILLINGS);
  const [transactionsList, setTransactionsList] = useState(INITIAL_TRANSACTIONS);
  const [ambulanceList, setAmbulanceList] = useState(INITIAL_AMBULANCES);

  // Administration, Audit & Notification state
  const [auditLogsList, setAuditLogsList] = useState(INITIAL_AUDIT_LOGS);
  const [systemUsersList, setSystemUsersList] = useState(INITIAL_SYSTEM_USERS);
  const [notificationsList, setNotificationsList] = useState(INITIAL_NOTIFICATIONS);
  const [emergencyAlert, setEmergencyAlert] = useState({
    active: false,
    message: 'TRAUMA MASS CASUALTY PROTOCOL ACTIVE - ALL SURGICAL UNITS STAND BY',
  });

  // Real-time Toast Notifications state
  const [toasts, setToasts] = useState([]);

  const showToast = ({ title, message, type = 'info' }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    const newToast = { id, title, message, type };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((current) => current.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  };

  // Global helper to log audit events
  const logAuditEvent = ({ action, category, severity = 'info', details }) => {
    const activeRoleData = ROLES.find((r) => r.id === currentRole) || ROLES[0];
    const newLog = {
      id: `AUD-${9030 + auditLogsList.length}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      action,
      category,
      severity,
      user: activeRoleData.name,
      role: activeRoleData.label,
      ipAddress: '192.168.1.101',
      details,
    };
    setAuditLogsList((prev) => [newLog, ...prev]);
  };

  // Global helper to add notification
  const notify = ({ title, message, type = 'info', category = 'Clinical' }) => {
    const newNotif = {
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      title,
      message,
      type,
      category,
      time: 'Just now',
      read: false,
    };
    setNotificationsList((prev) => [newNotif, ...prev]);
    showToast({ title, message, type });
  };

  // RBAC permission check
  const roleConfig = ROLE_PERMISSIONS[currentRole] || ROLE_PERMISSIONS.admin;
  const isTabAllowed = roleConfig.allowedTabs.includes(activeTab);

  const handleRoleChange = (newRole) => {
    setCurrentRole(newRole);
    const targetPerms = ROLE_PERMISSIONS[newRole] || ROLE_PERMISSIONS.admin;
    const activeRoleObj = ROLES.find((r) => r.id === newRole) || ROLES[0];
    showToast({
      title: 'Role Profile Switched',
      message: `Active profile: ${activeRoleObj.label} (${targetPerms.badge})`,
      type: 'info',
    });
    logAuditEvent({
      action: 'ROLE_SWITCH',
      category: 'Authentication',
      severity: 'info',
      details: `Switched active RBAC context to ${activeRoleObj.label} (${targetPerms.badge})`,
    });
    if (!targetPerms.allowedTabs.includes(activeTab)) {
      setActiveTab('dashboard');
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        {/* Toast Notification Container */}
        <div className="toast-container">
          {toasts.map((toast) => (
            <div key={toast.id} className={`toast-card toast-${toast.type}`}>
              <div className="toast-icon">
                {toast.type === 'success' && <CheckCircle2 size={18} color="#059669" />}
                {toast.type === 'warning' && <AlertCircle size={18} color="#d97706" />}
                {toast.type === 'error' && <AlertTriangle size={18} color="#dc2626" />}
                {toast.type === 'info' && <Info size={18} color="#0284c7" />}
              </div>
              <div className="toast-body">
                <div className="toast-title">{toast.title}</div>
                <div className="toast-message">{toast.message}</div>
              </div>
              <button className="toast-close-btn" onClick={() => removeToast(toast.id)}>
                <X size={14} />
              </button>
            </div>
          ))}
        </div>

        <SignInView
          onSignIn={(selectedRole) => {
            const chosenRole = selectedRole || 'admin';
            setCurrentRole(chosenRole);
            setIsAuthenticated(true);
            const roleObj = ROLES.find((r) => r.id === chosenRole) || ROLES[0];
            showToast({
              title: 'Welcome to Arogya Hospital',
              message: `Signed in as ${roleObj.name} (${roleObj.label}).`,
              type: 'success',
            });
            logAuditEvent({
              action: 'DEMO_SIGNIN',
              category: 'Authentication',
              severity: 'info',
              details: `User entered Arogya Hospital portal as ${roleObj.label} (${roleObj.name})`,
            });
          }}
          theme={theme}
          toggleTheme={toggleTheme}
        />
      </>
    );
  }

  return (
    <div className="app-container">
      {/* Toast Notification Container */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast-card toast-${toast.type}`}>
            <div className="toast-icon">
              {toast.type === 'success' && <CheckCircle2 size={18} color="#059669" />}
              {toast.type === 'warning' && <AlertCircle size={18} color="#d97706" />}
              {toast.type === 'error' && <AlertTriangle size={18} color="#dc2626" />}
              {toast.type === 'info' && <Info size={18} color="#0284c7" />}
            </div>
            <div className="toast-body">
              <div className="toast-title">{toast.title}</div>
              <div className="toast-message">{toast.message}</div>
            </div>
            <button className="toast-close-btn" onClick={() => removeToast(toast.id)}>
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentRole={currentRole}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="main-wrapper">
        <Navbar
          currentRole={currentRole}
          setCurrentRole={handleRoleChange}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setMobileOpen={setMobileOpen}
          theme={theme}
          toggleTheme={toggleTheme}
          notifications={notificationsList}
          setNotifications={setNotificationsList}
          onNavigateTab={setActiveTab}
          onSignOut={() => {
            setIsAuthenticated(false);
            showToast({
              title: 'Signed Out',
              message: 'Returned to Arogya Hospital demo sign-in.',
              type: 'info',
            });
          }}
        />

        {/* Emergency Broadcast Banner if active */}
        {emergencyAlert.active && (
          <div className="emergency-broadcast-banner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span className="status-dot-pulse" style={{ background: '#ffffff' }} />
              <AlertTriangle size={18} color="#ffffff" />
              <strong>HOSPITAL EMERGENCY BROADCAST:</strong> {emergencyAlert.message}
            </div>
            <button
              className="emergency-dismiss-btn"
              onClick={() => setEmergencyAlert({ ...emergencyAlert, active: false })}
              title="Acknowledge Alert"
            >
              Acknowledge
            </button>
          </div>
        )}

        <main className="content-area">
          {!isTabAllowed ? (
            <AccessDenied
              currentRole={currentRole}
              tabName={activeTab}
              onGoDashboard={() => setActiveTab('dashboard')}
              onSwitchRole={handleRoleChange}
            />
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <DashboardView
                  opdList={opdList}
                  bedsList={bedsList}
                  doctorsList={doctorsList}
                  ambulanceList={ambulanceList}
                  billingsList={billingsList}
                  transactionsList={transactionsList}
                  radiologyList={radiologyList}
                  pathologyList={pathologyList}
                  appointmentsList={appointmentsList}
                  setActiveTab={setActiveTab}
                  currentRole={currentRole}
                />
              )}

              {activeTab === 'opd' && (
                <OpdView
                  opdList={opdList}
                  setOpdList={setOpdList}
                  doctorsList={doctorsList}
                  searchQuery={searchQuery}
                  onLogAudit={logAuditEvent}
                  onNotify={notify}
                  onShowToast={showToast}
                />
              )}

              {activeTab === 'ipd' && (
                <IpdView
                  bedsList={bedsList}
                  setBedsList={setBedsList}
                  doctorsList={doctorsList}
                  searchQuery={searchQuery}
                  onLogAudit={logAuditEvent}
                  onNotify={notify}
                  onShowToast={showToast}
                />
              )}

              {activeTab === 'appointments' && (
                <AppointmentsView
                  appointmentsList={appointmentsList}
                  setAppointmentsList={setAppointmentsList}
                  doctorsList={doctorsList}
                  searchQuery={searchQuery}
                  onLogAudit={logAuditEvent}
                  onNotify={notify}
                  onShowToast={showToast}
                />
              )}

              {activeTab === 'radiology' && (
                <RadiologyView
                  radiologyList={radiologyList}
                  setRadiologyList={setRadiologyList}
                  doctorsList={doctorsList}
                  searchQuery={searchQuery}
                  onLogAudit={logAuditEvent}
                  onNotify={notify}
                  onShowToast={showToast}
                />
              )}

              {activeTab === 'pathology' && (
                <PathologyView
                  pathologyList={pathologyList}
                  setPathologyList={setPathologyList}
                  doctorsList={doctorsList}
                  searchQuery={searchQuery}
                  onLogAudit={logAuditEvent}
                  onNotify={notify}
                  onShowToast={showToast}
                />
              )}

              {activeTab === 'doctors' && (
                <DoctorAvailableView
                  doctorsList={doctorsList}
                  setDoctorsList={setDoctorsList}
                  searchQuery={searchQuery}
                  onLogAudit={logAuditEvent}
                  onNotify={notify}
                  onShowToast={showToast}
                />
              )}

              {activeTab === 'billings' && (
                <BillingsView
                  billingsList={billingsList}
                  setBillingsList={setBillingsList}
                  searchQuery={searchQuery}
                  setTransactionsList={setTransactionsList}
                  transactionsList={transactionsList}
                  onLogAudit={logAuditEvent}
                  onNotify={notify}
                  onShowToast={showToast}
                />
              )}

              {activeTab === 'finances' && (
                <ExpensesIncomeView
                  transactionsList={transactionsList}
                  setTransactionsList={setTransactionsList}
                  searchQuery={searchQuery}
                  onLogAudit={logAuditEvent}
                  onNotify={notify}
                  onShowToast={showToast}
                />
              )}

              {activeTab === 'ambulance' && (
                <AmbulanceView
                  ambulanceList={ambulanceList}
                  setAmbulanceList={setAmbulanceList}
                  searchQuery={searchQuery}
                  onLogAudit={logAuditEvent}
                  onNotify={notify}
                  onShowToast={showToast}
                />
              )}

              {activeTab === 'admin-audit' && (
                <AdminAuditView
                  auditLogsList={auditLogsList}
                  setAuditLogsList={setAuditLogsList}
                  systemUsersList={systemUsersList}
                  setSystemUsersList={setSystemUsersList}
                  emergencyAlert={emergencyAlert}
                  setEmergencyAlert={setEmergencyAlert}
                  searchQuery={searchQuery}
                  onShowToast={showToast}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
