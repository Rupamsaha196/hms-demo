import React, { useState } from 'react';
import { Stethoscope, Plus, Phone, Clock, MapPin, CheckCircle, AlertCircle, Award } from 'lucide-react';
import Modal from '../components/Modal';

export default function DoctorAvailableView({ doctorsList, setDoctorsList, searchQuery }) {
  const [filterSpecialty, setFilterSpecialty] = useState('All');
  const [isAddDoctorOpen, setIsAddDoctorOpen] = useState(false);

  const [doctorForm, setDoctorForm] = useState({
    name: '',
    specialty: 'General Medicine',
    qualification: 'MD (Internal Med)',
    room: 'OPD-109',
    shift: '08:00 AM - 04:00 PM',
    phone: '+91 98210 99887',
  });

  const specialties = [
    'All',
    'General Medicine',
    'Cardiology',
    'Orthopedics',
    'Neurology',
    'Pediatrics',
    'Radiology',
    'Pathology',
  ];

  const filteredDoctors = doctorsList.filter((doc) => {
    const matchesSpecialty = filterSpecialty === 'All' || doc.specialty === filterSpecialty;
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.room.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpecialty && matchesSearch;
  });

  const handleAddDoctor = (e) => {
    e.preventDefault();
    if (!doctorForm.name) return;

    const nextId = `DOC-${doctorsList.length + 1 < 10 ? '0' + (doctorsList.length + 1) : doctorsList.length + 1}`;
    const newEntry = {
      id: nextId,
      name: doctorForm.name.startsWith('Dr. ') ? doctorForm.name : `Dr. ${doctorForm.name}`,
      specialty: doctorForm.specialty,
      qualification: doctorForm.qualification,
      room: doctorForm.room,
      shift: doctorForm.shift,
      status: 'Available',
      patientsToday: 0,
      phone: doctorForm.phone,
      avatarBg: '#1b3f71',
    };

    setDoctorsList([...doctorsList, newEntry]);
    setIsAddDoctorOpen(false);
    setDoctorForm({
      name: '',
      specialty: 'General Medicine',
      qualification: 'MD (Internal Med)',
      room: 'OPD-109',
      shift: '08:00 AM - 04:00 PM',
      phone: '+91 98210 99887',
    });
  };

  const updateDoctorStatus = (id, newStatus) => {
    setDoctorsList(
      doctorsList.map((doc) => (doc.id === id ? { ...doc, status: newStatus } : doc))
    );
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Stethoscope size={24} color="#0f2746" /> Doctor Duty & Availability Roster
          </h1>
          <p className="page-subtitle">Real-time duty schedules, OPD chamber allocations, and clinical status</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => setIsAddDoctorOpen(true)}>
            <Plus size={16} /> Add Doctor Roster
          </button>
        </div>
      </div>

      {/* Specialty Filter */}
      <div className="filter-tabs">
        {specialties.map((spec) => (
          <button
            key={spec}
            className={`filter-tab ${filterSpecialty === spec ? 'active' : ''}`}
            onClick={() => setFilterSpecialty(spec)}
          >
            {spec} ({spec === 'All' ? doctorsList.length : doctorsList.filter((d) => d.specialty === spec).length})
          </button>
        ))}
      </div>

      {/* Doctors Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {filteredDoctors.map((doc) => (
          <div key={doc.id} className="doctor-card">
            <div>
              <div className="doctor-card-top">
                <div className="doctor-avatar" style={{ backgroundColor: doc.avatarBg }}>
                  {doc.name.replace('Dr. ', '').charAt(0)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0b1e36', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {doc.name}
                    </h3>
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1d4ed8' }}>
                    {doc.specialty}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    {doc.qualification}
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginTop: '1rem',
                  padding: '0.75rem',
                  background: '#f8fafc',
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem',
                  fontSize: '0.78rem',
                  color: '#334155',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={14} color="#64748b" />
                  <span>Cabin / Room: <strong>{doc.room}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={14} color="#64748b" />
                  <span>Shift: {doc.shift}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Phone size={14} color="#64748b" />
                  <span>Extension: {doc.phone}</span>
                </div>
              </div>
            </div>

            {/* Bottom Status & Change Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '0.75rem',
                borderTop: '1px solid #f1f5f9',
                gap: '0.5rem',
              }}
            >
              <div>
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

              {/* Quick Status Changer Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Set:</span>
                <select
                  value={doc.status}
                  onChange={(e) => updateDoctorStatus(doc.id, e.target.value)}
                  style={{
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.75rem',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    fontWeight: 600,
                    color: '#0f172a',
                    cursor: 'pointer',
                  }}
                >
                  <option value="Available">Available</option>
                  <option value="In Consultation">In Consultation</option>
                  <option value="In Surgery">In Surgery</option>
                  <option value="On Break">On Break</option>
                  <option value="Off Duty">Off Duty</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Doctor Modal */}
      <Modal isOpen={isAddDoctorOpen} onClose={() => setIsAddDoctorOpen(false)} title="Register Doctor on Duty">
        <form onSubmit={handleAddDoctor}>
          <div className="form-group">
            <label className="form-label">Doctor Name *</label>
            <input
              type="text"
              className="form-control"
              required
              placeholder="e.g. Dr. Robert Langdon"
              value={doctorForm.name}
              onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Specialty</label>
              <select
                className="form-control"
                value={doctorForm.specialty}
                onChange={(e) => setDoctorForm({ ...doctorForm, specialty: e.target.value })}
              >
                <option value="General Medicine">General Medicine</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Neurology">Neurology</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Radiology">Radiology</option>
                <option value="Pathology">Pathology</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Room / Cabin #</label>
              <input
                type="text"
                className="form-control"
                value={doctorForm.room}
                onChange={(e) => setDoctorForm({ ...doctorForm, room: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Qualification</label>
            <input
              type="text"
              className="form-control"
              value={doctorForm.qualification}
              onChange={(e) => setDoctorForm({ ...doctorForm, qualification: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Shift Hours</label>
              <input
                type="text"
                className="form-control"
                value={doctorForm.shift}
                onChange={(e) => setDoctorForm({ ...doctorForm, shift: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Ext</label>
              <input
                type="text"
                className="form-control"
                value={doctorForm.phone}
                onChange={(e) => setDoctorForm({ ...doctorForm, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer" style={{ margin: '1.5rem -1.5rem -1.5rem', padding: '1rem 1.5rem' }}>
            <button type="button" className="btn btn-white" onClick={() => setIsAddDoctorOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add to Duty Roster
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
