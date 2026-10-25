import React, { useState } from 'react';
import { FlaskConical, Plus, FileText, CheckCircle, Clock, AlertTriangle, Activity } from 'lucide-react';
import Modal from '../components/Modal';

export default function PathologyView({ pathologyList, setPathologyList, doctorsList, searchQuery }) {
  const [filterCategory, setFilterCategory] = useState('All');
  const [isNewTestOpen, setIsNewTestOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const [testForm, setTestForm] = useState({
    patientName: '',
    age: '',
    gender: 'Male',
    testName: 'Complete Blood Count (CBC)',
    category: 'Hematology',
    doctor: doctorsList[0]?.name || 'Dr. Emily Carter',
  });

  const categories = ['All', 'Hematology', 'Biochemistry / Cardiac', 'Microbiology', 'Molecular Diagnostics'];

  const filteredTests = pathologyList.filter((test) => {
    const matchesCategory = filterCategory === 'All' || test.category.includes(filterCategory);
    const matchesSearch =
      test.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOrderTest = (e) => {
    e.preventDefault();
    if (!testForm.patientName) return;

    const nextId = `LAB-${800 + pathologyList.length + 1}`;
    const newEntry = {
      id: nextId,
      patientName: testForm.patientName,
      age: parseInt(testForm.age, 10) || 35,
      gender: testForm.gender,
      testName: testForm.testName,
      category: testForm.category,
      doctor: testForm.doctor,
      sampleTime: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'Sample Collected',
      flag: 'Pending',
      resultSummary: 'Sample received in central lab. Automated analyzer run scheduled.',
      pathologist: 'Dr. Fiona Gallagher',
    };

    setPathologyList([newEntry, ...pathologyList]);
    setIsNewTestOpen(false);
    setTestForm({
      patientName: '',
      age: '',
      gender: 'Male',
      testName: 'Complete Blood Count (CBC)',
      category: 'Hematology',
      doctor: doctorsList[0]?.name || 'Dr. Emily Carter',
    });
  };

  const advanceTestStatus = (id) => {
    setPathologyList(
      pathologyList.map((test) => {
        if (test.id === id) {
          if (test.status === 'Sample Collected') {
            return { ...test, status: 'Processing in Lab' };
          }
          if (test.status === 'Processing in Lab') {
            return {
              ...test,
              status: 'Result Verified',
              flag: 'Normal',
              resultSummary: 'All tested parameters are within standard adult biological reference intervals.',
            };
          }
        }
        return test;
      })
    );
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <FlaskConical size={24} color="#0f2746" /> Pathology & Diagnostic Laboratory
          </h1>
          <p className="page-subtitle">Blood tests, biochemistry panels, specimen processing, and verified reports</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => setIsNewTestOpen(true)}>
            <Plus size={16} /> Order Lab Test
          </button>
        </div>
      </div>

      {/* Categories Filter */}
      <div className="filter-tabs">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-tab ${filterCategory === cat ? 'active' : ''}`}
            onClick={() => setFilterCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tests Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <span>Pathology Samples & Reports Log</span>
          </div>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-responsive">
            <table className="hms-table">
              <thead>
                <tr>
                  <th>Lab ID</th>
                  <th>Patient Name</th>
                  <th>Investigation / Test</th>
                  <th>Discipline</th>
                  <th>Requested By</th>
                  <th>Sample Time</th>
                  <th>Flag</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTests.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                      No pathology tests found.
                    </td>
                  </tr>
                ) : (
                  filteredTests.map((test) => (
                    <tr key={test.id}>
                      <td style={{ fontWeight: 800, color: '#0b1e36' }}>{test.id}</td>
                      <td>
                        <div style={{ fontWeight: 700 }}>{test.patientName}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          {test.gender}, {test.age} yrs
                        </div>
                      </td>
                      <td style={{ fontWeight: 600 }}>{test.testName}</td>
                      <td>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            padding: '0.2rem 0.5rem',
                            background: '#f1f5f9',
                            borderRadius: '4px',
                            color: '#1e3a8a',
                          }}
                        >
                          {test.category}
                        </span>
                      </td>
                      <td style={{ color: '#334155', fontWeight: 500 }}>{test.doctor}</td>
                      <td style={{ fontSize: '0.78rem', color: '#64748b' }}>{test.sampleTime}</td>
                      <td>
                        <span
                          className={`badge ${
                            test.flag === 'Abnormal'
                              ? 'badge-danger'
                              : test.flag === 'Normal'
                              ? 'badge-success'
                              : 'badge-warning'
                          }`}
                        >
                          {test.flag}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            test.status === 'Result Verified'
                              ? 'badge-success'
                              : test.status === 'Processing in Lab'
                              ? 'badge-info'
                              : 'badge-warning'
                          }`}
                        >
                          {test.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                          <button
                            className="btn btn-sm btn-white"
                            onClick={() => setSelectedReport(test)}
                            title="View Lab Report"
                          >
                            <FileText size={14} color="#1d4ed8" /> Report
                          </button>
                          {test.status !== 'Result Verified' && (
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => advanceTestStatus(test.id)}
                            >
                              {test.status === 'Sample Collected' ? 'Process' : 'Verify'}
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

      {/* Order Test Modal */}
      <Modal isOpen={isNewTestOpen} onClose={() => setIsNewTestOpen(false)} title="Order Pathology Lab Test">
        <form onSubmit={handleOrderTest}>
          <div className="form-group">
            <label className="form-label">Patient Name *</label>
            <input
              type="text"
              className="form-control"
              required
              placeholder="e.g. Samuel Jackson"
              value={testForm.patientName}
              onChange={(e) => setTestForm({ ...testForm, patientName: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Age</label>
              <input
                type="number"
                className="form-control"
                placeholder="Years"
                value={testForm.age}
                onChange={(e) => setTestForm({ ...testForm, age: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-control"
                value={testForm.category}
                onChange={(e) => {
                  const cat = e.target.value;
                  let defTest = 'Complete Blood Count (CBC)';
                  if (cat.includes('Biochemistry')) defTest = 'Lipid Profile & Glucose';
                  if (cat.includes('Microbiology')) defTest = 'Urine Routine & Culture';
                  if (cat.includes('Molecular')) defTest = 'Viral Load / PCR';
                  setTestForm({ ...testForm, category: cat, testName: defTest });
                }}
              >
                <option value="Hematology">Hematology</option>
                <option value="Biochemistry / Cardiac">Biochemistry / Cardiac</option>
                <option value="Microbiology">Microbiology</option>
                <option value="Molecular Diagnostics">Molecular Diagnostics</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Test Name</label>
            <input
              type="text"
              className="form-control"
              value={testForm.testName}
              onChange={(e) => setTestForm({ ...testForm, testName: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Referring Doctor</label>
            <select
              className="form-control"
              value={testForm.doctor}
              onChange={(e) => setTestForm({ ...testForm, doctor: e.target.value })}
            >
              {doctorsList.map((doc) => (
                <option key={doc.id} value={doc.name}>
                  {doc.name} ({doc.specialty})
                </option>
              ))}
            </select>
          </div>

          <div className="modal-footer" style={{ margin: '1.5rem -1.5rem -1.5rem', padding: '1rem 1.5rem' }}>
            <button type="button" className="btn btn-white" onClick={() => setIsNewTestOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Generate Barcode & Order
            </button>
          </div>
        </form>
      </Modal>

      {/* Lab Report Modal */}
      {selectedReport && (
        <Modal
          isOpen={!!selectedReport}
          onClose={() => setSelectedReport(null)}
          title={`Pathology Test Report #${selectedReport.id}`}
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
                <strong>Investigation:</strong> {selectedReport.testName} ({selectedReport.category})
              </div>
              <div style={{ fontSize: '0.8rem', color: '#334155', marginTop: '0.2rem' }}>
                <strong>Referred by:</strong> {selectedReport.doctor}
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h4 style={{ fontSize: '0.9rem', color: '#0b1e36' }}>Laboratory Diagnostic Summary:</h4>
                <span
                  className={`badge ${
                    selectedReport.flag === 'Abnormal'
                      ? 'badge-danger'
                      : selectedReport.flag === 'Normal'
                      ? 'badge-success'
                      : 'badge-warning'
                  }`}
                >
                  Flag: {selectedReport.flag}
                </span>
              </div>
              <div
                style={{
                  fontSize: '0.85rem',
                  lineHeight: '1.6',
                  color: '#0f172a',
                  background: '#f0fdf4',
                  padding: '1rem',
                  borderRadius: '8px',
                  borderLeft: '4px solid #16a34a',
                }}
              >
                {selectedReport.resultSummary}
              </div>
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
              <span>Pathologist: <strong>{selectedReport.pathologist}</strong></span>
              <span>Sample: <strong>{selectedReport.sampleTime}</strong></span>
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
