import React, { useState } from 'react';
import { Scan, Plus, FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import Modal from '../components/Modal';

export default function RadiologyView({ radiologyList, setRadiologyList, doctorsList, searchQuery }) {
  const [filterModality, setFilterModality] = useState('All');
  const [isNewScanOpen, setIsNewScanOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const [scanForm, setScanForm] = useState({
    patientName: '',
    age: '',
    gender: 'Male',
    modality: 'X-Ray',
    scanType: 'Chest PA View',
    bodyPart: 'Chest / Thorax',
    doctor: doctorsList[0]?.name || 'Dr. Emily Carter',
    priority: 'Normal',
  });

  const modalities = ['All', 'X-Ray', 'CT Scan', 'MRI', 'Ultrasound'];

  const filteredScans = radiologyList.filter((scan) => {
    const matchesModality = filterModality === 'All' || scan.modality === filterModality;
    const matchesSearch =
      scan.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scan.scanType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scan.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scan.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesModality && matchesSearch;
  });

  const handleOrderScan = (e) => {
    e.preventDefault();
    if (!scanForm.patientName) return;

    const nextId = `RAD-${500 + radiologyList.length + 1}`;
    const newEntry = {
      id: nextId,
      patientName: scanForm.patientName,
      age: parseInt(scanForm.age, 10) || 40,
      gender: scanForm.gender,
      scanType: scanForm.scanType,
      modality: scanForm.modality,
      bodyPart: scanForm.bodyPart,
      doctor: scanForm.doctor,
      requestedDate: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'Scheduled',
      priority: scanForm.priority,
      findings: 'Imaging scheduled in Radiology Suite. Radiologist pending scan review.',
      radiologist: 'Dr. Patrick Stewart',
    };

    setRadiologyList([newEntry, ...radiologyList]);
    setIsNewScanOpen(false);
    setScanForm({
      patientName: '',
      age: '',
      gender: 'Male',
      modality: 'X-Ray',
      scanType: 'Chest PA View',
      bodyPart: 'Chest / Thorax',
      doctor: doctorsList[0]?.name || 'Dr. Emily Carter',
      priority: 'Normal',
    });
  };

  const advanceScanStatus = (id) => {
    setRadiologyList(
      radiologyList.map((item) => {
        if (item.id === id) {
          const nextStatus =
            item.status === 'Scheduled'
              ? 'In Progress'
              : item.status === 'In Progress'
              ? 'Report Ready'
              : 'Completed';
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Scan size={24} color="#0f2746" /> Radiology & Medical Imaging
          </h1>
          <p className="page-subtitle">X-Ray, CT Scan, MRI, Ultrasound imaging requests, and diagnostic reports</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => setIsNewScanOpen(true)}>
            <Plus size={16} /> Request Imaging Scan
          </button>
        </div>
      </div>

      {/* Modality Filter */}
      <div className="filter-tabs">
        {modalities.map((mod) => (
          <button
            key={mod}
            className={`filter-tab ${filterModality === mod ? 'active' : ''}`}
            onClick={() => setFilterModality(mod)}
          >
            {mod} ({mod === 'All' ? radiologyList.length : radiologyList.filter((s) => s.modality === mod).length})
          </button>
        ))}
      </div>

      {/* Scans Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <span>Radiology Worklist & Imaging Queue</span>
          </div>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-responsive">
            <table className="hms-table">
              <thead>
                <tr>
                  <th>Scan ID</th>
                  <th>Patient Details</th>
                  <th>Imaging Modality</th>
                  <th>Scan Procedure</th>
                  <th>Referring Doctor</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredScans.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                      No radiology scans found.
                    </td>
                  </tr>
                ) : (
                  filteredScans.map((scan) => (
                    <tr key={scan.id}>
                      <td style={{ fontWeight: 800, color: '#0b1e36' }}>{scan.id}</td>
                      <td>
                        <div style={{ fontWeight: 700 }}>{scan.patientName}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          {scan.gender}, {scan.age} yrs • {scan.bodyPart}
                        </div>
                      </td>
                      <td>
                        <span
                          style={{
                            fontWeight: 700,
                            padding: '0.2rem 0.5rem',
                            background: '#e2edfb',
                            color: '#15325b',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                          }}
                        >
                          {scan.modality}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600 }}>{scan.scanType}</td>
                      <td style={{ color: '#1e3a8a', fontWeight: 500 }}>{scan.doctor}</td>
                      <td>
                        <span
                          className={`badge ${
                            scan.priority === 'Urgent' ? 'badge-danger' : 'badge-navy'
                          }`}
                        >
                          {scan.priority}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            scan.status === 'Completed' || scan.status === 'Report Ready'
                              ? 'badge-success'
                              : scan.status === 'In Progress'
                              ? 'badge-info'
                              : 'badge-warning'
                          }`}
                        >
                          {scan.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                          <button
                            className="btn btn-sm btn-white"
                            onClick={() => setSelectedReport(scan)}
                            title="View Radiology Report"
                          >
                            <FileText size={14} color="#1d4ed8" /> Report
                          </button>
                          {scan.status !== 'Completed' && (
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => advanceScanStatus(scan.id)}
                            >
                              {scan.status === 'Scheduled'
                                ? 'Start Scan'
                                : scan.status === 'In Progress'
                                ? 'Verify'
                                : 'Complete'}
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
      </div>

      {/* Request Scan Modal */}
      <Modal isOpen={isNewScanOpen} onClose={() => setIsNewScanOpen(false)} title="Request Diagnostic Imaging">
        <form onSubmit={handleOrderScan}>
          <div className="form-group">
            <label className="form-label">Patient Name *</label>
            <input
              type="text"
              className="form-control"
              required
              placeholder="e.g. Benjamin Cole"
              value={scanForm.patientName}
              onChange={(e) => setScanForm({ ...scanForm, patientName: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Age</label>
              <input
                type="number"
                className="form-control"
                placeholder="Age"
                value={scanForm.age}
                onChange={(e) => setScanForm({ ...scanForm, age: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Modality</label>
              <select
                className="form-control"
                value={scanForm.modality}
                onChange={(e) => {
                  const mod = e.target.value;
                  let defaultScan = 'Chest X-Ray';
                  if (mod === 'CT Scan') defaultScan = 'CT Brain Non-Contrast';
                  if (mod === 'MRI') defaultScan = 'Lumbar Spine MRI';
                  if (mod === 'Ultrasound') defaultScan = 'Whole Abdomen USG';
                  setScanForm({ ...scanForm, modality: mod, scanType: defaultScan });
                }}
              >
                <option value="X-Ray">X-Ray</option>
                <option value="CT Scan">CT Scan</option>
                <option value="MRI">MRI</option>
                <option value="Ultrasound">Ultrasound</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Scan Procedure</label>
              <input
                type="text"
                className="form-control"
                value={scanForm.scanType}
                onChange={(e) => setScanForm({ ...scanForm, scanType: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                className="form-control"
                value={scanForm.priority}
                onChange={(e) => setScanForm({ ...scanForm, priority: e.target.value })}
              >
                <option value="Normal">Normal</option>
                <option value="Urgent">Urgent / STAT</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Referring Doctor</label>
            <select
              className="form-control"
              value={scanForm.doctor}
              onChange={(e) => setScanForm({ ...scanForm, doctor: e.target.value })}
            >
              {doctorsList.map((doc) => (
                <option key={doc.id} value={doc.name}>
                  {doc.name} ({doc.specialty})
                </option>
              ))}
            </select>
          </div>

          <div className="modal-footer" style={{ margin: '1.5rem -1.5rem -1.5rem', padding: '1rem 1.5rem' }}>
            <button type="button" className="btn btn-white" onClick={() => setIsNewScanOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Send Imaging Request
            </button>
          </div>
        </form>
      </Modal>

      {/* View Radiology Report Modal */}
      {selectedReport && (
        <Modal
          isOpen={!!selectedReport}
          onClose={() => setSelectedReport(null)}
          title={`Radiology Report #${selectedReport.id}`}
        >
          <div>
            <div
              style={{
                background: '#f8fafc',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                marginBottom: '1rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontWeight: 700, color: '#0b1e36' }}>{selectedReport.patientName}</span>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  {selectedReport.gender}, {selectedReport.age} yrs
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#334155' }}>
                <strong>Procedure:</strong> {selectedReport.scanType} ({selectedReport.modality})
              </div>
              <div style={{ fontSize: '0.8rem', color: '#334155', marginTop: '0.2rem' }}>
                <strong>Referring Doctor:</strong> {selectedReport.doctor}
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <h4 style={{ fontSize: '0.9rem', color: '#0b1e36', marginBottom: '0.5rem' }}>
                Clinical Diagnostic Findings:
              </h4>
              <p
                style={{
                  fontSize: '0.85rem',
                  lineHeight: '1.6',
                  color: '#1e293b',
                  background: '#f0f6fd',
                  padding: '1rem',
                  borderRadius: '8px',
                  borderLeft: '4px solid #1c4277',
                }}
              >
                {selectedReport.findings}
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '0.75rem',
                borderTop: '1px solid #e2e8f0',
                fontSize: '0.78rem',
                color: '#64748b',
              }}
            >
              <span>Verified by: <strong>{selectedReport.radiologist}</strong></span>
              <span>Status: <strong style={{ color: '#059669' }}>{selectedReport.status}</strong></span>
            </div>

            <div className="modal-footer" style={{ margin: '1.5rem -1.5rem -1.5rem', padding: '1rem 1.5rem' }}>
              <button className="btn btn-primary" onClick={() => setSelectedReport(null)}>
                Close Report
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
