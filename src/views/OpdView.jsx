import React, { useState } from 'react';
import { Users, Plus, CheckCircle2, Clock, PlayCircle, Search, Filter } from 'lucide-react';
import Modal from '../components/Modal';

export default function OpdView({ opdList, setOpdList, doctorsList, searchQuery }) {
  const [filterStatus, setFilterStatus] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New OPD Form state
  const [formData, setFormData] = useState({
    patientName: '',
    age: '',
    gender: 'Male',
    phone: '',
    department: 'General Medicine',
    doctor: doctorsList[0]?.name || 'Dr. Amit Verma',
    fee: 500,
    symptoms: '',
  });

  const handleRegister = (e) => {
    e.preventDefault();
    if (!formData.patientName || !formData.age) return;

    const nextTokenNum = opdList.length + 1;
    const formattedToken = `T-${nextTokenNum < 10 ? '0' + nextTokenNum : nextTokenNum}`;
    const newEntry = {
      id: `OPD-${100 + nextTokenNum}`,
      token: formattedToken,
      patientName: formData.patientName,
      age: parseInt(formData.age, 10),
      gender: formData.gender,
      phone: formData.phone || '+91 98201 11223',
      department: formData.department,
      doctor: formData.doctor,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      fee: Number(formData.fee),
      status: 'Waiting',
      symptoms: formData.symptoms || 'Routine checkup',
    };

    setOpdList([newEntry, ...opdList]);
    setIsModalOpen(false);
    setFormData({
      patientName: '',
      age: '',
      gender: 'Male',
      phone: '',
      department: 'General Medicine',
      doctor: doctorsList[0]?.name || 'Dr. Amit Verma',
      fee: 500,
      symptoms: '',
    });
  };

  const updateStatus = (id, newStatus) => {
    setOpdList(
      opdList.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  // Filtered list
  const filteredPatients = opdList.filter((item) => {
    const matchesFilter = filterStatus === 'All' || item.status === filterStatus;
    const matchesSearch =
      item.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.token.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Users size={24} color="#0f2746" /> OPD (Outpatient Department)
          </h1>
          <p className="page-subtitle">Manage patient queues, token issuance, and doctor consultations</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} /> Register OPD Patient
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        {['All', 'Waiting', 'In Consultation', 'Completed'].map((status) => (
          <button
            key={status}
            className={`filter-tab ${filterStatus === status ? 'active' : ''}`}
            onClick={() => setFilterStatus(status)}
          >
            {status} ({status === 'All' ? opdList.length : opdList.filter((p) => p.status === status).length})
          </button>
        ))}
      </div>

      {/* OPD Table Card */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <span>OPD Consultation Register</span>
            <span className="badge badge-navy">{filteredPatients.length} Patients Listed</span>
          </div>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-responsive">
            <table className="hms-table">
              <thead>
                <tr>
                  <th>Token #</th>
                  <th>Patient Info</th>
                  <th>Contact</th>
                  <th>Department</th>
                  <th>Assigned Doctor</th>
                  <th>Check-in Time</th>
                  <th>Fee (₹)</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                      No OPD patients found matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredPatients.map((patient) => (
                    <tr key={patient.id}>
                      <td>
                        <span
                          style={{
                            fontWeight: 800,
                            padding: '0.25rem 0.55rem',
                            background: '#0b1e36',
                            color: '#ffffff',
                            borderRadius: '6px',
                            fontSize: '0.85rem',
                          }}
                        >
                          {patient.token}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{patient.patientName}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          {patient.gender}, {patient.age} yrs • Symptoms: {patient.symptoms}
                        </div>
                      </td>
                      <td style={{ fontSize: '0.8rem', color: '#475569' }}>{patient.phone}</td>
                      <td>
                        <span style={{ fontWeight: 600, color: '#1e3a8a' }}>{patient.department}</span>
                      </td>
                      <td style={{ fontWeight: 600 }}>{patient.doctor}</td>
                      <td style={{ fontSize: '0.8rem', color: '#475569' }}>{patient.time}</td>
                      <td style={{ fontWeight: 700, color: '#0f172a' }}>₹{patient.fee}</td>
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
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                          {patient.status === 'Waiting' && (
                            <button
                              className="btn btn-sm btn-white"
                              title="Start Consultation"
                              onClick={() => updateStatus(patient.id, 'In Consultation')}
                            >
                              <PlayCircle size={14} color="#0284c7" /> Call In
                            </button>
                          )}
                          {patient.status === 'In Consultation' && (
                            <button
                              className="btn btn-sm btn-white"
                              title="Complete Consultation"
                              onClick={() => updateStatus(patient.id, 'Completed')}
                            >
                              <CheckCircle2 size={14} color="#10b981" /> Complete
                            </button>
                          )}
                          {patient.status === 'Completed' && (
                            <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>Done</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Register OPD Patient Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register OPD Patient">
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label className="form-label">Patient Full Name *</label>
            <input
              type="text"
              className="form-control"
              required
              placeholder="e.g. Johnathan Doe"
              value={formData.patientName}
              onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Age *</label>
              <input
                type="number"
                className="form-control"
                required
                placeholder="Years"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select
                className="form-control"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                className="form-control"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Consultation Fee (₹)</label>
              <input
                type="number"
                className="form-control"
                value={formData.fee}
                onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Department</label>
              <select
                className="form-control"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              >
                <option value="General Medicine">General Medicine</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Neurology">Neurology</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Assign Doctor</label>
              <select
                className="form-control"
                value={formData.doctor}
                onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
              >
                {doctorsList.map((doc) => (
                  <option key={doc.id} value={doc.name}>
                    {doc.name} ({doc.specialty})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Chief Complaint / Symptoms</label>
            <textarea
              className="form-control"
              rows={2}
              placeholder="e.g. High fever for 2 days, body ache"
              value={formData.symptoms}
              onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
            />
          </div>

          <div className="modal-footer" style={{ margin: '1.5rem -1.5rem -1.5rem', padding: '1rem 1.5rem' }}>
            <button type="button" className="btn btn-white" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Issue Token & Register
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
