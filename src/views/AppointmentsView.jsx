import React, { useState } from 'react';
import {
  CalendarClock,
  Plus,
  CheckCircle2,
  Clock,
  UserCheck,
  AlertCircle,
  Phone,
  Send,
  RotateCcw,
  Stethoscope,
  Grid,
  List,
  Check,
  X,
} from 'lucide-react';
import Modal from '../components/Modal';
import StatCard from '../components/StatCard';

const TIME_SLOTS = [
  '08:30 AM',
  '09:00 AM',
  '09:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '02:00 PM',
  '02:30 PM',
  '03:00 PM',
  '03:30 PM',
  '04:00 PM',
  '04:30 PM',
];

const DEPARTMENTS = [
  'Cardiology',
  'Orthopedics',
  'Pediatrics',
  'Neurology',
  'General Medicine',
  'Radiology',
  'Pathology',
  'General Surgery',
  'Obstetrics & Gyn',
];

export default function AppointmentsView({
  appointmentsList,
  setAppointmentsList,
  doctorsList,
  searchQuery,
  onLogAudit,
  onNotify,
  onShowToast,
}) {
  const [dateFilter, setDateFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

  // Booking Modal State
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [rescheduleItem, setRescheduleItem] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    patientName: '',
    age: '',
    gender: 'Male',
    phone: '',
    email: '',
    department: 'General Medicine',
    doctor: doctorsList[0]?.name || 'Dr. Amit Verma',
    date: '2026-10-25',
    timeSlot: '10:00 AM',
    type: 'First Consultation',
    priority: 'Normal',
    notes: '',
  });

  // Reschedule Form State
  const [rescheduleData, setRescheduleData] = useState({
    date: '2026-10-25',
    timeSlot: '11:00 AM',
  });

  // KPI Metrics
  const todayStr = '2026-10-25';
  const totalCount = appointmentsList.length;
  const todayCount = appointmentsList.filter((a) => a.date === todayStr).length;
  const checkedInCount = appointmentsList.filter(
    (a) => a.status === 'Checked-In' || a.status === 'In Consultation'
  ).length;
  const confirmedCount = appointmentsList.filter((a) => a.status === 'Confirmed').length;

  const handleBookSubmit = (e) => {
    e.preventDefault();
    if (!formData.patientName || !formData.phone) {
      if (onShowToast) onShowToast({ title: 'Validation Error', message: 'Patient name and phone are required.', type: 'warning' });
      return;
    }

    const nextIdNum = 1000 + appointmentsList.length + 1;
    const newAppointment = {
      id: `APT-${nextIdNum}`,
      patientName: formData.patientName,
      age: formData.age ? parseInt(formData.age, 10) : 30,
      gender: formData.gender,
      phone: formData.phone,
      email: formData.email || `${formData.patientName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      department: formData.department,
      doctor: formData.doctor,
      date: formData.date,
      timeSlot: formData.timeSlot,
      type: formData.type,
      priority: formData.priority,
      status: 'Confirmed',
      notes: formData.notes || 'Routine consultation',
    };

    setAppointmentsList([newAppointment, ...appointmentsList]);
    setIsBookModalOpen(false);

    // Trigger Audit Log
    if (onLogAudit) {
      onLogAudit({
        action: 'APPOINTMENT_BOOKED',
        category: 'Appointments',
        severity: 'info',
        details: `Scheduled ${newAppointment.type} for ${newAppointment.patientName} with ${newAppointment.doctor} on ${newAppointment.date} at ${newAppointment.timeSlot}`,
      });
    }

    // Trigger Notification
    if (onNotify) {
      onNotify({
        title: 'New Appointment Scheduled',
        message: `${newAppointment.patientName} booked with ${newAppointment.doctor} for ${newAppointment.timeSlot}.`,
        type: 'info',
        category: 'Appointments',
      });
    }

    if (onShowToast) {
      onShowToast({
        title: 'Appointment Confirmed',
        message: `Token & slot confirmed for ${newAppointment.patientName} with ${newAppointment.doctor}.`,
        type: 'success',
      });
    }

    // Reset
    setFormData({
      patientName: '',
      age: '',
      gender: 'Male',
      phone: '',
      email: '',
      department: 'General Medicine',
      doctor: doctorsList[0]?.name || 'Dr. Amit Verma',
      date: '2026-10-25',
      timeSlot: '10:00 AM',
      type: 'First Consultation',
      priority: 'Normal',
      notes: '',
    });
  };

  const updateStatus = (id, newStatus) => {
    const apt = appointmentsList.find((a) => a.id === id);
    setAppointmentsList(
      appointmentsList.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );

    if (onLogAudit && apt) {
      onLogAudit({
        action: 'APPOINTMENT_STATUS_CHANGE',
        category: 'Appointments',
        severity: newStatus === 'Cancelled' ? 'warning' : 'info',
        details: `Updated appointment ${id} (${apt.patientName}) status to ${newStatus}`,
      });
    }

    if (onShowToast && apt) {
      onShowToast({
        title: `Appointment ${newStatus}`,
        message: `${apt.patientName}'s appointment marked as ${newStatus}.`,
        type: newStatus === 'Cancelled' ? 'warning' : 'success',
      });
    }
  };

  const sendReminder = (apt) => {
    if (onNotify) {
      onNotify({
        title: 'SMS Reminder Dispatched',
        message: `Automated SMS reminder sent to ${apt.phone} for Dr. ${apt.doctor} at ${apt.timeSlot}.`,
        type: 'success',
        category: 'Appointments',
      });
    }

    if (onLogAudit) {
      onLogAudit({
        action: 'REMINDER_SENT',
        category: 'Appointments',
        severity: 'info',
        details: `Dispatched SMS & Email reminder to ${apt.patientName} (${apt.phone})`,
      });
    }

    if (onShowToast) {
      onShowToast({
        title: 'SMS Sent',
        message: `Reminder successfully sent to ${apt.patientName} (${apt.phone})`,
        type: 'success',
      });
    }
  };

  const handleRescheduleSubmit = (e) => {
    e.preventDefault();
    if (!rescheduleItem) return;

    setAppointmentsList(
      appointmentsList.map((a) =>
        a.id === rescheduleItem.id
          ? { ...a, date: rescheduleData.date, timeSlot: rescheduleData.timeSlot, status: 'Confirmed' }
          : a
      )
    );

    if (onLogAudit) {
      onLogAudit({
        action: 'APPOINTMENT_RESCHEDULED',
        category: 'Appointments',
        severity: 'info',
        details: `Rescheduled ${rescheduleItem.patientName} to ${rescheduleData.date} at ${rescheduleData.timeSlot}`,
      });
    }

    if (onShowToast) {
      onShowToast({
        title: 'Appointment Rescheduled',
        message: `${rescheduleItem.patientName} updated to ${rescheduleData.date} at ${rescheduleData.timeSlot}.`,
        type: 'success',
      });
    }

    setRescheduleItem(null);
  };

  // Filtered List
  const filteredAppointments = appointmentsList.filter((item) => {
    // Search
    const term = (searchQuery || '').toLowerCase();
    const matchesSearch =
      item.patientName.toLowerCase().includes(term) ||
      item.doctor.toLowerCase().includes(term) ||
      item.department.toLowerCase().includes(term) ||
      item.phone.toLowerCase().includes(term) ||
      (item.notes && item.notes.toLowerCase().includes(term));

    // Date
    let matchesDate = true;
    if (dateFilter === 'Today') matchesDate = item.date === '2026-10-25';
    else if (dateFilter === 'Tomorrow') matchesDate = item.date === '2026-10-26';
    else if (dateFilter === 'Upcoming') matchesDate = item.date >= '2026-10-25';

    // Status
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;

    // Dept
    const matchesDept = deptFilter === 'All' || item.department === deptFilter;

    return matchesSearch && matchesDate && matchesStatus && matchesDept;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Checked-In':
        return <span className="badge badge-info"><UserCheck size={12} /> Checked-In</span>;
      case 'In Consultation':
        return <span className="badge badge-primary"><Clock size={12} /> In Consultation</span>;
      case 'Completed':
        return <span className="badge badge-success"><CheckCircle2 size={12} /> Completed</span>;
      case 'Cancelled':
        return <span className="badge badge-danger"><AlertCircle size={12} /> Cancelled</span>;
      default:
        return <span className="badge badge-warning"><Clock size={12} /> Confirmed</span>;
    }
  };

  const getPriorityBadge = (priority) => {
    if (priority === 'Urgent') {
      return <span className="badge badge-danger" style={{ fontSize: '0.68rem' }}>Urgent</span>;
    }
    if (priority === 'High') {
      return <span className="badge badge-warning" style={{ fontSize: '0.68rem' }}>Priority</span>;
    }
    return <span className="badge badge-info" style={{ fontSize: '0.68rem' }}>Routine</span>;
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <CalendarClock size={24} color="var(--accent-blue)" /> Appointment Scheduling
          </h1>
          <p className="page-subtitle">
            Manage multi-specialty patient bookings, consultation slots, and patient reminders
          </p>
        </div>
        <div className="page-actions">
          <div className="view-toggle-group">
            <button
              className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              <List size={16} /> Table
            </button>
            <button
              className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Schedule Slots Grid"
            >
              <Grid size={16} /> Time Slots
            </button>
          </div>
          <button className="btn btn-primary" onClick={() => setIsBookModalOpen(true)}>
            <Plus size={16} /> Book New Appointment
          </button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="stat-grid">
        <StatCard
          label="Total Bookings"
          value={totalCount}
          subtext="Active patient bookings"
          icon={CalendarClock}
          color="#15325b"
        />
        <StatCard
          label="Today's Schedule"
          value={todayCount}
          subtext="Appointments on Oct 25"
          icon={Clock}
          color="#0284c7"
        />
        <StatCard
          label="Checked-In / In Consultation"
          value={checkedInCount}
          subtext="Patients present at hospital"
          icon={UserCheck}
          color="#0d9488"
        />
        <StatCard
          label="Confirmed / Upcoming"
          value={confirmedCount}
          subtext="Awaiting arrival"
          icon={CheckCircle2}
          color="#7c3aed"
        />
      </div>

      {/* Controls & Filter Bar */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div className="filter-controls-row">
          {/* Date Filter Pills */}
          <div className="filter-pills-group">
            <span className="filter-label">Date:</span>
            {['All', 'Today', 'Tomorrow', 'Upcoming'].map((d) => (
              <button
                key={d}
                className={`filter-pill ${dateFilter === d ? 'active' : ''}`}
                onClick={() => setDateFilter(d)}
              >
                {d === 'Today' ? "Today (Oct 25)" : d === 'Tomorrow' ? "Tomorrow (Oct 26)" : d}
              </button>
            ))}
          </div>

          {/* Status Filter Pills */}
          <div className="filter-pills-group">
            <span className="filter-label">Status:</span>
            {['All', 'Confirmed', 'Checked-In', 'In Consultation', 'Completed', 'Cancelled'].map((s) => (
              <button
                key={s}
                className={`filter-pill ${statusFilter === s ? 'active' : ''}`}
                onClick={() => setStatusFilter(s)}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Department Select */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginLeft: 'auto' }}>
            <span className="filter-label">Dept:</span>
            <select
              className="form-control"
              style={{ width: '160px', padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
            >
              <option value="All">All Specialties</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main View: Table or Slot Schedule Grid */}
      {viewMode === 'table' ? (
        <div className="card">
          <div className="table-responsive">
            <table className="hms-table">
              <thead>
                <tr>
                  <th>Appointment ID</th>
                  <th>Patient Details</th>
                  <th>Specialty & Doctor</th>
                  <th>Date & Slot</th>
                  <th>Type & Priority</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                      <CalendarClock size={36} color="var(--text-light)" style={{ marginBottom: '0.5rem' }} />
                      <p>No appointments match the current search or filters.</p>
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((apt) => (
                    <tr key={apt.id}>
                      <td>
                        <span className="id-pill">{apt.id}</span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{apt.patientName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {apt.gender}, {apt.age} yrs • <Phone size={11} style={{ verticalAlign: 'middle' }} /> {apt.phone}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--navy-600)' }}>{apt.doctor}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{apt.department}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{apt.date}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Clock size={12} color="var(--accent-cyan)" /> {apt.timeSlot}
                        </div>
                      </td>
                      <td>
                        <div>{apt.type}</div>
                        <div style={{ marginTop: '0.2rem' }}>{getPriorityBadge(apt.priority)}</div>
                      </td>
                      <td>{getStatusBadge(apt.status)}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.35rem' }}>
                          {apt.status === 'Confirmed' && (
                            <button
                              className="btn btn-sm btn-white"
                              onClick={() => updateStatus(apt.id, 'Checked-In')}
                              title="Check-in Patient"
                            >
                              <UserCheck size={13} color="#059669" /> Check In
                            </button>
                          )}
                          {apt.status === 'Checked-In' && (
                            <button
                              className="btn btn-sm btn-white"
                              onClick={() => updateStatus(apt.id, 'In Consultation')}
                              title="Start Consultation"
                            >
                              <Stethoscope size={13} color="#0284c7" /> Consult
                            </button>
                          )}
                          {apt.status === 'In Consultation' && (
                            <button
                              className="btn btn-sm btn-white"
                              onClick={() => updateStatus(apt.id, 'Completed')}
                              title="Complete Consultation"
                            >
                              <CheckCircle2 size={13} color="#059669" /> Complete
                            </button>
                          )}

                          <button
                            className="btn btn-sm btn-white"
                            onClick={() => sendReminder(apt)}
                            title="Send SMS / Email Reminder"
                          >
                            <Send size={13} color="#0284c7" />
                          </button>

                          <button
                            className="btn btn-sm btn-white"
                            onClick={() => {
                              setRescheduleItem(apt);
                              setRescheduleData({ date: apt.date, timeSlot: apt.timeSlot });
                            }}
                            title="Reschedule Appointment"
                          >
                            <RotateCcw size={13} />
                          </button>

                          {apt.status !== 'Cancelled' && apt.status !== 'Completed' && (
                            <button
                              className="btn btn-sm btn-white"
                              onClick={() => updateStatus(apt.id, 'Cancelled')}
                              title="Cancel Appointment"
                              style={{ color: '#dc2626' }}
                            >
                              <X size={13} />
                            </button>
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
      ) : (
        /* Slot Schedule Grid View */
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Clock size={18} color="var(--accent-blue)" />
              <span>Time Slot Schedule Grid ({dateFilter === 'All' ? 'All Dates' : dateFilter})</span>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Showing {filteredAppointments.length} Booked Consultations
            </span>
          </div>
          <div className="card-body">
            <div className="slots-grid-container">
              {TIME_SLOTS.map((slot) => {
                const slotBookings = filteredAppointments.filter((a) => a.timeSlot === slot);
                return (
                  <div key={slot} className="slot-grid-card">
                    <div className="slot-grid-header">
                      <div className="slot-time-pill">
                        <Clock size={13} /> {slot}
                      </div>
                      <span className={`slot-avail-pill ${slotBookings.length > 0 ? 'booked' : 'open'}`}>
                        {slotBookings.length > 0 ? `${slotBookings.length} Booked` : 'Open Slot'}
                      </span>
                    </div>

                    <div className="slot-bookings-list">
                      {slotBookings.length === 0 ? (
                        <div className="slot-empty-notice">No patient booked for this slot</div>
                      ) : (
                        slotBookings.map((b) => (
                          <div key={b.id} className="slot-patient-entry">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-main)' }}>
                                {b.patientName}
                              </span>
                              {getPriorityBadge(b.priority)}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--navy-600)', fontWeight: 600 }}>
                              {b.doctor}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                              <span>{b.department}</span>
                              <span>{b.date}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Book Appointment Modal */}
      <Modal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        title="Schedule New Patient Appointment"
        maxWidth="620px"
      >
        <form onSubmit={handleBookSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Patient Full Name *</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="e.g. Meenakshi Sundaram"
                value={formData.patientName}
                onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                type="tel"
                required
                className="form-control"
                placeholder="+91 98XXX XXXXX"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Age</label>
              <input
                type="number"
                className="form-control"
                placeholder="e.g. 42"
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
            <div className="form-group">
              <label className="form-label">Email (Optional)</label>
              <input
                type="email"
                className="form-control"
                placeholder="patient@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Clinical Department *</label>
              <select
                className="form-control"
                value={formData.department}
                onChange={(e) => {
                  const dept = e.target.value;
                  const matchingDoc = doctorsList.find((d) => d.specialty.includes(dept));
                  setFormData({
                    ...formData,
                    department: dept,
                    doctor: matchingDoc ? matchingDoc.name : doctorsList[0]?.name,
                  });
                }}
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Consulting Physician *</label>
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

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Appointment Date *</label>
              <input
                type="date"
                required
                className="form-control"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Time Slot *</label>
              <select
                className="form-control"
                value={formData.timeSlot}
                onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
              >
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Visit Type</label>
              <select
                className="form-control"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="First Consultation">First Consultation</option>
                <option value="Routine Follow-up">Routine Follow-up</option>
                <option value="Diagnostic Review">Diagnostic Review</option>
                <option value="Post-Op Review">Post-Op Review</option>
                <option value="Pre-op Assessment">Pre-op Assessment</option>
                <option value="Emergency Review">Emergency Review</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Priority Level</label>
              <select
                className="form-control"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="Normal">Normal</option>
                <option value="High">Priority</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">Chief Symptoms / Clinical Notes</label>
            <textarea
              className="form-control"
              rows={2}
              placeholder="e.g. Mild chest discomfort, follow-up after treadmill test"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div className="modal-footer" style={{ padding: '0.75rem 0 0', borderTop: '1px solid var(--border-light)' }}>
            <button type="button" className="btn btn-white" onClick={() => setIsBookModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Check size={16} /> Confirm Appointment
            </button>
          </div>
        </form>
      </Modal>

      {/* Reschedule Modal */}
      {rescheduleItem && (
        <Modal
          isOpen={!!rescheduleItem}
          onClose={() => setRescheduleItem(null)}
          title={`Reschedule ${rescheduleItem.patientName}'s Appointment`}
          maxWidth="460px"
        >
          <form onSubmit={handleRescheduleSubmit}>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Currently scheduled with <strong>{rescheduleItem.doctor}</strong> on{' '}
              <strong>{rescheduleItem.date}</strong> at <strong>{rescheduleItem.timeSlot}</strong>.
            </p>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">New Appointment Date *</label>
              <input
                type="date"
                required
                className="form-control"
                value={rescheduleData.date}
                onChange={(e) => setRescheduleData({ ...rescheduleData, date: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">New Consultation Time Slot *</label>
              <select
                className="form-control"
                value={rescheduleData.timeSlot}
                onChange={(e) => setRescheduleData({ ...rescheduleData, timeSlot: e.target.value })}
              >
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>

            <div className="modal-footer" style={{ padding: '0.75rem 0 0', borderTop: '1px solid var(--border-light)' }}>
              <button type="button" className="btn btn-white" onClick={() => setRescheduleItem(null)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <RotateCcw size={15} /> Save New Slot
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
