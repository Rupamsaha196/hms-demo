import React, { useState } from 'react';
import { Ambulance, Plus, Phone, MapPin, AlertOctagon, CheckCircle2, ShieldAlert, Wrench } from 'lucide-react';
import Modal from '../components/Modal';

export default function AmbulanceView({ ambulanceList, setAmbulanceList, searchQuery }) {
  const [filterStatus, setFilterStatus] = useState('All');
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [selectedAmbulanceId, setSelectedAmbulanceId] = useState('');

  const [dispatchForm, setDispatchForm] = useState({
    caller: 'National 108 Emergency Control Room',
    destination: 'CarePulse Apex Trauma Center',
    patientType: 'Acute Cardiac Event',
    location: 'Sector 18, Ring Road, Delhi NCR',
    eta: '7 mins',
  });

  const filteredAmbulances = ambulanceList.filter((amb) => {
    const matchesStatus = filterStatus === 'All' || amb.status === filterStatus;
    const matchesSearch =
      amb.vehicleNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      amb.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      amb.model.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const availableUnits = ambulanceList.filter((a) => a.status === 'Available');

  const openDispatch = (ambId) => {
    setSelectedAmbulanceId(ambId);
    setIsDispatchModalOpen(true);
  };

  const handleConfirmDispatch = (e) => {
    e.preventDefault();
    if (!selectedAmbulanceId) return;

    setAmbulanceList(
      ambulanceList.map((amb) => {
        if (amb.id === selectedAmbulanceId) {
          return {
            ...amb,
            status: 'Dispatched',
            location: `En route to ${dispatchForm.location}`,
            currentDispatch: {
              caller: dispatchForm.caller,
              destination: dispatchForm.destination,
              patientType: dispatchForm.patientType,
              location: dispatchForm.location,
              eta: dispatchForm.eta,
              dispatchedAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            },
          };
        }
        return amb;
      })
    );

    setIsDispatchModalOpen(false);
  };

  const returnToBase = (ambId) => {
    setAmbulanceList(
      ambulanceList.map((amb) => {
        if (amb.id === ambId) {
          return {
            ...amb,
            status: 'Available',
            location: 'Hospital Emergency Bay A',
            currentDispatch: null,
          };
        }
        return amb;
      })
    );
  };

  const setReadyFromMaintenance = (ambId) => {
    setAmbulanceList(
      ambulanceList.map((amb) => {
        if (amb.id === ambId) {
          return {
            ...amb,
            status: 'Available',
            location: 'Hospital Emergency Bay B',
          };
        }
        return amb;
      })
    );
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Ambulance size={24} color="#0f2746" /> Emergency Ambulance Fleet
          </h1>
          <p className="page-subtitle">24/7 Mobile ICU & Basic Life Support dispatch, GPS status, and emergency response</p>
        </div>
        <div className="page-actions">
          <button
            className="btn btn-primary"
            disabled={availableUnits.length === 0}
            onClick={() => {
              if (availableUnits.length > 0) {
                openDispatch(availableUnits[0].id);
              }
            }}
          >
            <ShieldAlert size={16} /> Dispatch Next Available
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        {['All', 'Available', 'Dispatched', 'Maintenance'].map((status) => (
          <button
            key={status}
            className={`filter-tab ${filterStatus === status ? 'active' : ''}`}
            onClick={() => setFilterStatus(status)}
          >
            {status} ({status === 'All' ? ambulanceList.length : ambulanceList.filter((a) => a.status === status).length})
          </button>
        ))}
      </div>

      {/* Ambulance Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {filteredAmbulances.map((amb) => (
          <div
            key={amb.id}
            className="doctor-card"
            style={{
              borderLeft:
                amb.status === 'Available'
                  ? '4px solid #10b981'
                  : amb.status === 'Dispatched'
                  ? '4px solid #ef4444'
                  : '4px solid #f59e0b',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0b1e36' }}>{amb.vehicleNo}</span>
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
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1d4ed8' }}>{amb.model}</div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.1rem' }}>{amb.type}</div>

              {/* Status details */}
              <div
                style={{
                  marginTop: '0.75rem',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  background: amb.status === 'Dispatched' ? '#fef2f2' : '#f8fafc',
                  fontSize: '0.78rem',
                  color: '#334155',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MapPin size={14} color="#64748b" />
                  <span>Location: <strong>{amb.location}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Phone size={14} color="#64748b" />
                  <span>Driver: <strong>{amb.driverName}</strong> ({amb.driverPhone})</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.2rem' }}>
                  Equipment: {amb.equipment}
                </div>
              </div>

              {/* Dispatch details if en route */}
              {amb.status === 'Dispatched' && amb.currentDispatch && (
                <div
                  style={{
                    marginTop: '0.75rem',
                    padding: '0.75rem',
                    background: '#fff1f2',
                    borderRadius: '8px',
                    border: '1px solid #fecdd3',
                    fontSize: '0.78rem',
                  }}
                >
                  <div style={{ fontWeight: 700, color: '#9f1239', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <AlertOctagon size={14} /> Active Emergency Mission:
                  </div>
                  <div style={{ marginTop: '0.3rem', color: '#881337' }}>
                    <strong>Case:</strong> {amb.currentDispatch.patientType}
                  </div>
                  <div style={{ color: '#881337', fontSize: '0.72rem' }}>
                    Caller: {amb.currentDispatch.caller} • Dispatched: {amb.currentDispatch.dispatchedAt}
                  </div>
                  <div style={{ color: '#881337', fontSize: '0.72rem' }}>
                    ETA to scene: {amb.currentDispatch.eta}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div style={{ paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
              {amb.status === 'Available' && (
                <button
                  className="btn btn-sm btn-primary"
                  style={{ width: '100%' }}
                  onClick={() => openDispatch(amb.id)}
                >
                  <ShieldAlert size={14} /> Dispatch to Emergency
                </button>
              )}
              {amb.status === 'Dispatched' && (
                <button
                  className="btn btn-sm btn-white"
                  style={{ width: '100%', color: '#059669', borderColor: '#a7f3d0' }}
                  onClick={() => returnToBase(amb.id)}
                >
                  <CheckCircle2 size={14} color="#059669" /> Return to Base / Ready
                </button>
              )}
              {amb.status === 'Maintenance' && (
                <button
                  className="btn btn-sm btn-white"
                  style={{ width: '100%' }}
                  onClick={() => setReadyFromMaintenance(amb.id)}
                >
                  <Wrench size={14} /> Finish Service & Put on Duty
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Dispatch Modal */}
      <Modal isOpen={isDispatchModalOpen} onClose={() => setIsDispatchModalOpen(false)} title="Emergency Ambulance Dispatch">
        <form onSubmit={handleConfirmDispatch}>
          <div className="form-group">
            <label className="form-label">Select Ambulance Unit</label>
            <select
              className="form-control"
              value={selectedAmbulanceId}
              onChange={(e) => setSelectedAmbulanceId(e.target.value)}
            >
              {availableUnits.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.vehicleNo} - {a.model} ({a.type})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Emergency Nature / Patient Condition *</label>
            <input
              type="text"
              className="form-control"
              required
              placeholder="e.g. Severe chest pain / Acute Cardiac Arrest"
              value={dispatchForm.patientType}
              onChange={(e) => setDispatchForm({ ...dispatchForm, patientType: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Incident Location / Address *</label>
            <input
              type="text"
              className="form-control"
              required
              placeholder="e.g. Sector 18, Ring Road, Delhi NCR"
              value={dispatchForm.location}
              onChange={(e) => setDispatchForm({ ...dispatchForm, location: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Calling Agency / Source</label>
              <input
                type="text"
                className="form-control"
                value={dispatchForm.caller}
                onChange={(e) => setDispatchForm({ ...dispatchForm, caller: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Estimated Transit (ETA)</label>
              <input
                type="text"
                className="form-control"
                value={dispatchForm.eta}
                onChange={(e) => setDispatchForm({ ...dispatchForm, eta: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer" style={{ margin: '1.5rem -1.5rem -1.5rem', padding: '1rem 1.5rem' }}>
            <button type="button" className="btn btn-white" onClick={() => setIsDispatchModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-danger">
              Confirm Sirens & Dispatch
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
