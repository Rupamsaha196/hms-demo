import React, { useState } from 'react';
import { Bed, Plus, CheckCircle, UserCheck, AlertTriangle, Sparkles, Filter } from 'lucide-react';
import Modal from '../components/Modal';

export default function IpdView({ bedsList, setBedsList, doctorsList, searchQuery }) {
  const [selectedWard, setSelectedWard] = useState('All');
  const [isAdmitModalOpen, setIsAdmitModalOpen] = useState(false);
  const [selectedBedId, setSelectedBedId] = useState('');

  // Admit Form State
  const [admitForm, setAdmitForm] = useState({
    patientName: '',
    age: '',
    gender: 'Male',
    bedId: '',
    doctor: doctorsList[0]?.name || 'Dr. Emily Carter',
    diagnosis: '',
  });

  const wards = ['All', 'ICU', 'General Ward A', 'Deluxe Private'];

  const filteredBeds = bedsList.filter((b) => {
    const matchesWard = selectedWard === 'All' || b.ward === selectedWard;
    const matchesSearch =
      b.bedNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.patientName && b.patientName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (b.doctor && b.doctor.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesWard && matchesSearch;
  });

  const availableBeds = bedsList.filter((b) => b.status === 'Available');

  const openAdmitForBed = (bedId) => {
    setSelectedBedId(bedId);
    setAdmitForm((prev) => ({ ...prev, bedId: bedId }));
    setIsAdmitModalOpen(true);
  };

  const handleAdmit = (e) => {
    e.preventDefault();
    if (!admitForm.patientName || !admitForm.bedId) return;

    setBedsList(
      bedsList.map((bed) => {
        if (bed.id === admitForm.bedId) {
          return {
            ...bed,
            status: 'Occupied',
            patientName: admitForm.patientName,
            age: parseInt(admitForm.age, 10) || 35,
            doctor: admitForm.doctor,
            admittedOn: new Date().toISOString().split('T')[0],
            diagnosis: admitForm.diagnosis || 'Observation & Inpatient Care',
          };
        }
        return bed;
      })
    );

    setIsAdmitModalOpen(false);
    setAdmitForm({
      patientName: '',
      age: '',
      gender: 'Male',
      bedId: '',
      doctor: doctorsList[0]?.name || 'Dr. Emily Carter',
      diagnosis: '',
    });
  };

  const dischargePatient = (bedId) => {
    if (window.confirm('Discharge this patient and mark bed for sanitization?')) {
      setBedsList(
        bedsList.map((bed) => {
          if (bed.id === bedId) {
            return {
              ...bed,
              status: 'Cleaning',
              patientName: null,
              doctor: null,
              diagnosis: null,
              admittedOn: null,
            };
          }
          return bed;
        })
      );
    }
  };

  const markBedReady = (bedId) => {
    setBedsList(
      bedsList.map((bed) => (bed.id === bedId ? { ...bed, status: 'Available' } : bed))
    );
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Bed size={24} color="#0f2746" /> IPD (Inpatient Department)
          </h1>
          <p className="page-subtitle">Wards, bed occupancy matrix, inpatient tracking and admissions</p>
        </div>
        <div className="page-actions">
          <button
            className="btn btn-primary"
            onClick={() => {
              if (availableBeds.length > 0) {
                setAdmitForm((prev) => ({ ...prev, bedId: availableBeds[0].id }));
              }
              setIsAdmitModalOpen(true);
            }}
          >
            <Plus size={16} /> Admit Patient
          </button>
        </div>
      </div>

      {/* Ward Filter Tabs */}
      <div className="filter-tabs">
        {wards.map((ward) => (
          <button
            key={ward}
            className={`filter-tab ${selectedWard === ward ? 'active' : ''}`}
            onClick={() => setSelectedWard(ward)}
          >
            {ward} (
            {ward === 'All' ? bedsList.length : bedsList.filter((b) => b.ward === ward).length})
          </button>
        ))}
      </div>

      {/* Visual Bed Matrix */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <span>Hospital Bed Grid & Ward Status</span>
          </div>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.78rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: 10, height: 10, background: '#10b981', borderRadius: '2px' }}></span> Available
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: 10, height: 10, background: '#ef4444', borderRadius: '2px' }}></span> Occupied
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: 10, height: 10, background: '#f59e0b', borderRadius: '2px' }}></span> Cleaning
            </span>
          </div>
        </div>
        <div className="card-body">
          <div className="bed-grid">
            {filteredBeds.map((bed) => (
              <div
                key={bed.id}
                className={`bed-box ${
                  bed.status === 'Occupied'
                    ? 'occupied'
                    : bed.status === 'Available'
                    ? 'available'
                    : 'cleaning'
                }`}
              >
                <div className="bed-header">
                  <div>
                    <span className="bed-num">{bed.bedNumber}</span>
                    <div className="bed-ward">{bed.ward} • {bed.type}</div>
                  </div>
                  <span
                    className={`badge ${
                      bed.status === 'Available'
                        ? 'badge-success'
                        : bed.status === 'Occupied'
                        ? 'badge-danger'
                        : 'badge-warning'
                    }`}
                  >
                    {bed.status}
                  </span>
                </div>

                {bed.status === 'Occupied' && (
                  <div className="bed-patient-info">
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{bed.patientName}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      Diagnosis: {bed.diagnosis}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#1e3a8a', marginTop: '0.2rem' }}>
                      Incharge: {bed.doctor}
                    </div>
                  </div>
                )}

                {bed.status === 'Available' && (
                  <div style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 600, padding: '0.5rem 0' }}>
                    Bed is sanitized and ready for admission.
                  </div>
                )}

                {bed.status === 'Cleaning' && (
                  <div style={{ fontSize: '0.78rem', color: '#b45309', padding: '0.5rem 0' }}>
                    Sanitization & linen change in progress.
                  </div>
                )}

                <div style={{ marginTop: 'auto', paddingTop: '0.5rem', display: 'flex', gap: '0.4rem' }}>
                  {bed.status === 'Available' && (
                    <button
                      className="btn btn-sm btn-white"
                      style={{ width: '100%' }}
                      onClick={() => openAdmitForBed(bed.id)}
                    >
                      <UserCheck size={14} color="#1d4ed8" /> Admit Here
                    </button>
                  )}
                  {bed.status === 'Occupied' && (
                    <button
                      className="btn btn-sm btn-white"
                      style={{ width: '100%', color: '#dc2626' }}
                      onClick={() => dischargePatient(bed.id)}
                    >
                      Discharge & Clear
                    </button>
                  )}
                  {bed.status === 'Cleaning' && (
                    <button
                      className="btn btn-sm btn-primary"
                      style={{ width: '100%', fontSize: '0.75rem' }}
                      onClick={() => markBedReady(bed.id)}
                    >
                      <Sparkles size={13} /> Mark Sanitized
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inpatient Admitted Roster */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <span>Currently Admitted Inpatients Roster</span>
          </div>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-responsive">
            <table className="hms-table">
              <thead>
                <tr>
                  <th>Bed #</th>
                  <th>Ward</th>
                  <th>Patient Name</th>
                  <th>Age</th>
                  <th>Admitted Date</th>
                  <th>Primary Physician</th>
                  <th>Diagnosis</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bedsList
                  .filter((b) => b.status === 'Occupied')
                  .map((bed) => (
                    <tr key={bed.id}>
                      <td style={{ fontWeight: 800, color: '#0b1e36' }}>{bed.bedNumber}</td>
                      <td>{bed.ward}</td>
                      <td style={{ fontWeight: 700 }}>{bed.patientName}</td>
                      <td>{bed.age} yrs</td>
                      <td style={{ color: '#475569' }}>{bed.admittedOn}</td>
                      <td style={{ fontWeight: 600, color: '#1e3a8a' }}>{bed.doctor}</td>
                      <td style={{ color: '#334155' }}>{bed.diagnosis}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="btn btn-sm btn-white"
                          style={{ color: '#dc2626' }}
                          onClick={() => dischargePatient(bed.id)}
                        >
                          Discharge
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Admit Patient Modal */}
      <Modal isOpen={isAdmitModalOpen} onClose={() => setIsAdmitModalOpen(false)} title="Admit Patient to IPD">
        <form onSubmit={handleAdmit}>
          <div className="form-group">
            <label className="form-label">Patient Full Name *</label>
            <input
              type="text"
              className="form-control"
              required
              placeholder="e.g. Margaret Thatcher"
              value={admitForm.patientName}
              onChange={(e) => setAdmitForm({ ...admitForm, patientName: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Age</label>
              <input
                type="number"
                className="form-control"
                placeholder="Age"
                value={admitForm.age}
                onChange={(e) => setAdmitForm({ ...admitForm, age: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Assign Bed *</label>
              <select
                className="form-control"
                required
                value={admitForm.bedId}
                onChange={(e) => setAdmitForm({ ...admitForm, bedId: e.target.value })}
              >
                <option value="">Select an available bed</option>
                {availableBeds.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.bedNumber} ({b.ward} - {b.type})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Primary Attending Physician</label>
            <select
              className="form-control"
              value={admitForm.doctor}
              onChange={(e) => setAdmitForm({ ...admitForm, doctor: e.target.value })}
            >
              {doctorsList.map((doc) => (
                <option key={doc.id} value={doc.name}>
                  {doc.name} ({doc.specialty})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Admitting Diagnosis & Notes</label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="e.g. Acute appendicitis under pre-op preparation"
              value={admitForm.diagnosis}
              onChange={(e) => setAdmitForm({ ...admitForm, diagnosis: e.target.value })}
            />
          </div>

          <div className="modal-footer" style={{ margin: '1.5rem -1.5rem -1.5rem', padding: '1rem 1.5rem' }}>
            <button type="button" className="btn btn-white" onClick={() => setIsAdmitModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={availableBeds.length === 0}>
              {availableBeds.length === 0 ? 'No Available Beds' : 'Confirm Admission'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
