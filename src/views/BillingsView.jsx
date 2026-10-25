import React, { useState } from 'react';
import { Receipt, Plus, Printer, CheckCircle, Clock, CreditCard, DollarSign } from 'lucide-react';
import Modal from '../components/Modal';

export default function BillingsView({ billingsList, setBillingsList, searchQuery, setTransactionsList, transactionsList }) {
  const [filterStatus, setFilterStatus] = useState('All');
  const [isNewBillOpen, setIsNewBillOpen] = useState(false);
  const [activeInvoice, setActiveInvoice] = useState(null);

  const [billForm, setBillForm] = useState({
    patientName: '',
    patientType: 'OPD',
    department: 'General Medicine',
    consultationFee: 800,
    roomCharges: 0,
    investigationFee: 1200,
    medicineFee: 400,
    discount: 0,
    paymentMethod: 'UPI / GPay',
  });

  const totalCalculated =
    Number(billForm.consultationFee || 0) +
    Number(billForm.roomCharges || 0) +
    Number(billForm.investigationFee || 0) +
    Number(billForm.medicineFee || 0);

  const netCalculated = Math.max(0, totalCalculated - Number(billForm.discount || 0));

  const filteredBills = billingsList.filter((b) => {
    const matchesStatus = filterStatus === 'All' || b.status === filterStatus;
    const matchesSearch =
      b.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleCreateBill = (e) => {
    e.preventDefault();
    if (!billForm.patientName) return;

    const nextId = `INV-${3000 + billingsList.length + 1}`;
    const newBill = {
      id: nextId,
      patientName: billForm.patientName,
      patientType: billForm.patientType,
      department: billForm.department,
      date: new Date().toISOString().split('T')[0],
      consultationFee: Number(billForm.consultationFee || 0),
      roomCharges: Number(billForm.roomCharges || 0),
      investigationFee: Number(billForm.investigationFee || 0),
      medicineFee: Number(billForm.medicineFee || 0),
      totalAmount: totalCalculated,
      discount: Number(billForm.discount || 0),
      netPayable: netCalculated,
      paymentMethod: billForm.paymentMethod,
      status: 'Paid',
    };

    setBillingsList([newBill, ...billingsList]);

    // Also auto-record into Income & Expenses transactions
    const newTxn = {
      id: `TXN-${700 + transactionsList.length + 1}`,
      type: 'income',
      category: `${billForm.patientType} Billing`,
      description: `Hospital bill payment - ${billForm.patientName}`,
      amount: netCalculated,
      date: new Date().toISOString().split('T')[0],
      ref: nextId,
      paymentMode: billForm.paymentMethod,
    };
    setTransactionsList([newTxn, ...transactionsList]);

    setIsNewBillOpen(false);
    setActiveInvoice(newBill);
    setBillForm({
      patientName: '',
      patientType: 'OPD',
      department: 'General Medicine',
      consultationFee: 50,
      roomCharges: 0,
      investigationFee: 60,
      medicineFee: 30,
      discount: 0,
      paymentMethod: 'Cash',
    });
  };

  const markBillPaid = (id) => {
    setBillingsList(
      billingsList.map((bill) => {
        if (bill.id === id) {
          // Add transaction
          const newTxn = {
            id: `TXN-${700 + transactionsList.length + 1}`,
            type: 'income',
            category: `${bill.patientType} Billing`,
            description: `Payment received for ${bill.id} (${bill.patientName})`,
            amount: bill.netPayable,
            date: new Date().toISOString().split('T')[0],
            ref: bill.id,
            paymentMode: bill.paymentMethod,
          };
          setTransactionsList([newTxn, ...transactionsList]);
          return { ...bill, status: 'Paid' };
        }
        return bill;
      })
    );
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Receipt size={24} color="#0f2746" /> Patient Billings & Invoices
          </h1>
          <p className="page-subtitle">Itemized invoices, consultation, pharmacy, and diagnostic billing records</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => setIsNewBillOpen(true)}>
            <Plus size={16} /> Generate Invoice
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        {['All', 'Paid', 'Pending'].map((status) => (
          <button
            key={status}
            className={`filter-tab ${filterStatus === status ? 'active' : ''}`}
            onClick={() => setFilterStatus(status)}
          >
            {status} ({status === 'All' ? billingsList.length : billingsList.filter((b) => b.status === status).length})
          </button>
        ))}
      </div>

      {/* Billings Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <span>Invoices Ledger</span>
          </div>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-responsive">
            <table className="hms-table">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Patient Name</th>
                  <th>Type</th>
                  <th>Department</th>
                  <th>Date</th>
                  <th>Total Gross</th>
                  <th>Discount</th>
                  <th>Net Payable</th>
                  <th>Payment Mode</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBills.length === 0 ? (
                  <tr>
                    <td colSpan={11} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                      No invoices found.
                    </td>
                  </tr>
                ) : (
                  filteredBills.map((bill) => (
                    <tr key={bill.id}>
                      <td style={{ fontWeight: 800, color: '#0b1e36' }}>{bill.id}</td>
                      <td>
                        <div style={{ fontWeight: 700 }}>{bill.patientName}</div>
                      </td>
                      <td>
                        <span
                          style={{
                            fontWeight: 700,
                            padding: '0.2rem 0.45rem',
                            borderRadius: '4px',
                            background: bill.patientType === 'IPD' ? '#eff6ff' : '#f8fafc',
                            color: bill.patientType === 'IPD' ? '#1e40af' : '#475569',
                            fontSize: '0.75rem',
                          }}
                        >
                          {bill.patientType}
                        </span>
                      </td>
                      <td style={{ color: '#334155' }}>{bill.department}</td>
                      <td style={{ color: '#64748b', fontSize: '0.8rem' }}>{bill.date}</td>
                      <td>₹{bill.totalAmount}</td>
                      <td style={{ color: '#dc2626' }}>{bill.discount > 0 ? `-₹${bill.discount}` : '₹0'}</td>
                      <td style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>
                        ₹{bill.netPayable}
                      </td>
                      <td style={{ fontSize: '0.78rem' }}>{bill.paymentMethod}</td>
                      <td>
                        <span
                          className={`badge ${
                            bill.status === 'Paid' ? 'badge-success' : 'badge-warning'
                          }`}
                        >
                          {bill.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                          <button
                            className="btn btn-sm btn-white"
                            onClick={() => setActiveInvoice(bill)}
                            title="Print / View Receipt"
                          >
                            <Printer size={14} color="#1d4ed8" /> Receipt
                          </button>
                          {bill.status === 'Pending' && (
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => markBillPaid(bill.id)}
                            >
                              Collect
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

      {/* Generate Invoice Modal */}
      <Modal isOpen={isNewBillOpen} onClose={() => setIsNewBillOpen(false)} title="Generate Patient Invoice">
        <form onSubmit={handleCreateBill}>
          <div className="form-group">
            <label className="form-label">Patient Full Name *</label>
            <input
              type="text"
              className="form-control"
              required
              placeholder="e.g. Harold Green"
              value={billForm.patientName}
              onChange={(e) => setBillForm({ ...billForm, patientName: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Patient Type</label>
              <select
                className="form-control"
                value={billForm.patientType}
                onChange={(e) => setBillForm({ ...billForm, patientType: e.target.value })}
              >
                <option value="OPD">OPD (Outpatient)</option>
                <option value="IPD">IPD (Inpatient)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Department</label>
              <input
                type="text"
                className="form-control"
                value={billForm.department}
                onChange={(e) => setBillForm({ ...billForm, department: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Consultation Fee ($)</label>
              <input
                type="number"
                className="form-control"
                value={billForm.consultationFee}
                onChange={(e) => setBillForm({ ...billForm, consultationFee: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Room / Bed Charges ($)</label>
              <input
                type="number"
                className="form-control"
                value={billForm.roomCharges}
                onChange={(e) => setBillForm({ ...billForm, roomCharges: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Investigations / Scans ($)</label>
              <input
                type="number"
                className="form-control"
                value={billForm.investigationFee}
                onChange={(e) => setBillForm({ ...billForm, investigationFee: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Pharmacy & Medicines ($)</label>
              <input
                type="number"
                className="form-control"
                value={billForm.medicineFee}
                onChange={(e) => setBillForm({ ...billForm, medicineFee: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Discount ($)</label>
              <input
                type="number"
                className="form-control"
                value={billForm.discount}
                onChange={(e) => setBillForm({ ...billForm, discount: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Payment Method</label>
              <select
                className="form-control"
                value={billForm.paymentMethod}
                onChange={(e) => setBillForm({ ...billForm, paymentMethod: e.target.value })}
              >
                <option value="Cash">Cash</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Insurance TPA">Insurance TPA</option>
                <option value="UPI / Online">UPI / Online</option>
              </select>
            </div>
          </div>

          {/* Quick Total Bar */}
          <div
            style={{
              background: '#f0f6fd',
              padding: '0.85rem 1rem',
              borderRadius: '8px',
              border: '1px solid #bfdbfe',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '0.5rem',
            }}
          >
            <span style={{ fontSize: '0.85rem', color: '#1e3a8a', fontWeight: 600 }}>Net Total Due:</span>
            <span style={{ fontSize: '1.25rem', color: '#0b1e36', fontWeight: 800 }}>₹{netCalculated}</span>
          </div>

          <div className="modal-footer" style={{ margin: '1.5rem -1.5rem -1.5rem', padding: '1rem 1.5rem' }}>
            <button type="button" className="btn btn-white" onClick={() => setIsNewBillOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Generate & Collect
            </button>
          </div>
        </form>
      </Modal>

      {/* Invoice Receipt Print Preview */}
      {activeInvoice && (
        <Modal
          isOpen={!!activeInvoice}
          onClose={() => setActiveInvoice(null)}
          title={`Hospital Receipt - ${activeInvoice.id}`}
        >
          <div>
            {/* Header Brand */}
            <div
              style={{
                borderBottom: '2px solid #0b1e36',
                paddingBottom: '0.75rem',
                marginBottom: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}
            >
              <div>
                <h2 style={{ fontSize: '1.2rem', color: '#0b1e36', fontWeight: 800 }}>CarePulse Multispeciality Hospital</h2>
                <p style={{ fontSize: '0.72rem', color: '#64748b' }}>
                  24/7 Trauma & Emergency Center • GSTIN: #07AAAAA0000A1Z5
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 800, color: '#1d4ed8', fontSize: '0.95rem' }}>{activeInvoice.id}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Date: {activeInvoice.date}</div>
              </div>
            </div>

            {/* Patient Info Card */}
            <div
              style={{
                background: '#f8fafc',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                marginBottom: '1rem',
                fontSize: '0.8rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Patient: <strong>{activeInvoice.patientName}</strong></span>
                <span>Type: <strong>{activeInvoice.patientType}</strong></span>
              </div>
              <div style={{ marginTop: '0.3rem', color: '#64748b' }}>
                Department: {activeInvoice.department} • Payment: {activeInvoice.paymentMethod}
              </div>
            </div>

            {/* Line Items Table */}
            <table className="hms-table" style={{ marginBottom: '1rem' }}>
              <thead>
                <tr>
                  <th>Description</th>
                  <th style={{ textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {activeInvoice.consultationFee > 0 && (
                  <tr>
                    <td>Doctor Consultation Fee</td>
                    <td style={{ textAlign: 'right' }}>₹{activeInvoice.consultationFee}</td>
                  </tr>
                )}
                {activeInvoice.roomCharges > 0 && (
                  <tr>
                    <td>Inpatient Room & Bed Charges</td>
                    <td style={{ textAlign: 'right' }}>₹{activeInvoice.roomCharges}</td>
                  </tr>
                )}
                {activeInvoice.investigationFee > 0 && (
                  <tr>
                    <td>Diagnostic Tests & Imaging</td>
                    <td style={{ textAlign: 'right' }}>₹{activeInvoice.investigationFee}</td>
                  </tr>
                )}
                {activeInvoice.medicineFee > 0 && (
                  <tr>
                    <td>Pharmacy & Consumables</td>
                    <td style={{ textAlign: 'right' }}>₹{activeInvoice.medicineFee}</td>
                  </tr>
                )}
                {activeInvoice.discount > 0 && (
                  <tr style={{ color: '#dc2626' }}>
                    <td>Special Medical Concession / Discount</td>
                    <td style={{ textAlign: 'right' }}>-₹{activeInvoice.discount}</td>
                  </tr>
                )}
                <tr style={{ fontWeight: 800, background: '#f0f6fd', fontSize: '0.95rem' }}>
                  <td style={{ color: '#0b1e36' }}>Total Amount Paid</td>
                  <td style={{ textAlign: 'right', color: '#0b1e36' }}>₹{activeInvoice.netPayable}</td>
                </tr>
              </tbody>
            </table>

            <div style={{ textAlign: 'center', fontSize: '0.72rem', color: '#64748b', margin: '1rem 0' }}>
              Thank you for trusting CarePulse Hospital. Get well soon!
            </div>

            <div className="modal-footer" style={{ margin: '1.5rem -1.5rem -1.5rem', padding: '1rem 1.5rem' }}>
              <button
                className="btn btn-white"
                onClick={() => {
                  window.print();
                }}
              >
                <Printer size={14} /> Print Receipt
              </button>
              <button className="btn btn-primary" onClick={() => setActiveInvoice(null)}>
                Done
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
