import React from 'react';
import {
  Users,
  Bed,
  Stethoscope,
  Ambulance,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  FileText,
  Activity,
  ArrowRight,
} from 'lucide-react';
import StatCard from '../components/StatCard';

export default function DashboardView({
  opdList,
  bedsList,
  doctorsList,
  ambulanceList,
  billingsList,
  transactionsList,
  radiologyList,
  pathologyList,
  setActiveTab,
  currentRole,
}) {
  const waitingOpd = opdList.filter((p) => p.status === 'Waiting').length;
  const occupiedBeds = bedsList.filter((b) => b.status === 'Occupied').length;
  const availableDoctors = doctorsList.filter((d) => d.status === 'Available').length;
  const readyAmbulances = ambulanceList.filter((a) => a.status === 'Available').length;

  const totalIncome = transactionsList
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactionsList
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalIncome - totalExpense;

  return (
    <div>
      {/* Role Reminder Banner */}
      <div className="role-banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Activity size={18} />
          <span>
            Logged in as <strong>{currentRole.toUpperCase()}</strong>. You have permissions tailored for hospital
            coordination.
          </span>
        </div>
        <span className="role-banner-tag">Navy & White Edition</span>
      </div>

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Hospital Overview Dashboard</h1>
          <p className="page-subtitle">Real-time metrics, emergency bay status, and clinical operations</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-white" onClick={() => setActiveTab('opd')}>
            <PlusCircle size={16} /> New OPD Token
          </button>
          <button className="btn btn-primary" onClick={() => setActiveTab('ambulance')}>
            <Ambulance size={16} /> Emergency Ambulance
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="stat-grid">
        <StatCard
          label="Today's OPD Queue"
          value={opdList.length}
          subtext={`${waitingOpd} currently waiting`}
          icon={Users}
          color="#15325b"
        />
        <StatCard
          label="IPD Bed Occupancy"
          value={`${occupiedBeds}/${bedsList.length}`}
          subtext={`${bedsList.length - occupiedBeds} beds available`}
          icon={Bed}
          color="#0284c7"
        />
        <StatCard
          label="Doctors on Duty"
          value={`${availableDoctors}/${doctorsList.length}`}
          subtext="Ready for consultation"
          icon={Stethoscope}
          color="#0d9488"
        />
        <StatCard
          label="Ambulance Fleet"
          value={`${readyAmbulances}/${ambulanceList.length}`}
          subtext="Units in ready state"
          icon={Ambulance}
          color="#e11d48"
        />
        <StatCard
          label="Net Cash Flow"
          value={`₹${netBalance.toLocaleString()}`}
          subtext={`Income: ₹${totalIncome.toLocaleString()} | Exp: ₹${totalExpense.toLocaleString()}`}
          icon={TrendingUp}
          color="#10b981"
        />
      </div>

      {/* Two Column Grid for Live Department Details */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.25rem' }}>
        
        {/* OPD Live Feed */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Users size={18} color="#15325b" />
              <span>Current OPD Queue</span>
            </div>
            <button
              className="btn btn-sm btn-white"
              onClick={() => setActiveTab('opd')}
              style={{ fontSize: '0.75rem' }}
            >
              View All <ArrowRight size={13} />
            </button>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <div className="table-responsive">
              <table className="hms-table">
                <thead>
                  <tr>
                    <th>Token</th>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {opdList.slice(0, 4).map((patient) => (
                    <tr key={patient.id}>
                      <td>
                        <span
                          style={{
                            fontWeight: 800,
                            padding: '0.2rem 0.5rem',
                            background: '#f1f5f9',
                            borderRadius: '4px',
                            color: '#0f172a',
                          }}
                        >
                          {patient.token}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{patient.patientName}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          {patient.gender}, {patient.age} yrs • {patient.department}
                        </div>
                      </td>
                      <td style={{ color: '#1e293b', fontWeight: 500 }}>{patient.doctor}</td>
                      <td>
                        <span
                          className={`badge ${
                            patient.status === 'Completed'
                              ? 'badge-success'
                              : patient.status === 'In Consultation'
                              ? 'badge-info'
                              : 'badge-warning'
                          }`}
                        >
                          {patient.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Live Doctor Duty Roster */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Stethoscope size={18} color="#0d9488" />
              <span>Active Doctors Roster</span>
            </div>
            <button
              className="btn btn-sm btn-white"
              onClick={() => setActiveTab('doctors')}
              style={{ fontSize: '0.75rem' }}
            >
              All Doctors <ArrowRight size={13} />
            </button>
          </div>
          <div className="card-body" style={{ padding: '0.75rem 1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {doctorsList.slice(0, 4).map((doc) => (
                <div
                  key={doc.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.5rem 0',
                    borderBottom: '1px solid #f1f5f9',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        background: doc.avatarBg,
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                      }}
                    >
                      {doc.name.replace('Dr. ', '').charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#0f172a' }}>{doc.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {doc.specialty} • Room: {doc.room}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`badge ${
                      doc.status === 'Available'
                        ? 'badge-success'
                        : doc.status === 'In Consultation'
                        ? 'badge-info'
                        : doc.status === 'In Surgery'
                        ? 'badge-danger'
                        : 'badge-warning'
                    }`}
                  >
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Diagnostic Feeds (Radiology & Pathology) */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <FileText size={18} color="#0284c7" />
              <span>Diagnostic Tests (Rad & Path)</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className="btn btn-sm btn-white"
                onClick={() => setActiveTab('radiology')}
                style={{ fontSize: '0.72rem' }}
              >
                Radiology
              </button>
              <button
                className="btn btn-sm btn-white"
                onClick={() => setActiveTab('pathology')}
                style={{ fontSize: '0.72rem' }}
              >
                Pathology
              </button>
            </div>
          </div>
          <div className="card-body" style={{ padding: '0.75rem 1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Latest Scans & Tests
              </div>
              {radiologyList.slice(0, 2).map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.4rem 0',
                    borderBottom: '1px solid #f1f5f9',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{item.scanType}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      {item.patientName} • {item.doctor}
                    </div>
                  </div>
                  <span
                    className={`badge ${
                      item.status === 'Report Ready' || item.status === 'Completed'
                        ? 'badge-success'
                        : 'badge-warning'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}

              {pathologyList.slice(0, 2).map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.4rem 0',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{item.testName}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      {item.patientName} • {item.category}
                    </div>
                  </div>
                  <span
                    className={`badge ${
                      item.status === 'Result Verified' ? 'badge-success' : 'badge-warning'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ambulance & Emergency Bay */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Ambulance size={18} color="#e11d48" />
              <span>Ambulance Emergency Dispatch</span>
            </div>
            <button
              className="btn btn-sm btn-white"
              onClick={() => setActiveTab('ambulance')}
              style={{ fontSize: '0.75rem' }}
            >
              Fleet Control <ArrowRight size={13} />
            </button>
          </div>
          <div className="card-body" style={{ padding: '0.75rem 1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {ambulanceList.map((amb) => (
                <div
                  key={amb.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.5rem',
                    borderRadius: '8px',
                    background: amb.status === 'Dispatched' ? '#fef2f2' : '#f8fafc',
                    border: amb.status === 'Dispatched' ? '1px solid #fecaca' : '1px solid #e2e8f0',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a' }}>
                      {amb.vehicleNo} • {amb.model}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      Driver: {amb.driverName} ({amb.driverPhone})
                    </div>
                  </div>
                  <span
                    className={`badge ${
                      amb.status === 'Available'
                        ? 'badge-success'
                        : amb.status === 'Dispatched'
                        ? 'badge-danger'
                        : 'badge-warning'
                    }`}
                  >
                    {amb.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
