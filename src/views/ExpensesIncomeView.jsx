import React, { useState } from 'react';
import { TrendingUp, Plus, ArrowUpRight, ArrowDownLeft, DollarSign, Wallet, Calendar } from 'lucide-react';
import Modal from '../components/Modal';
import StatCard from '../components/StatCard';

export default function ExpensesIncomeView({ transactionsList, setTransactionsList, searchQuery }) {
  const [filterType, setFilterType] = useState('All');
  const [isAddTxnOpen, setIsAddTxnOpen] = useState(false);

  const [txnForm, setTxnForm] = useState({
    type: 'income',
    category: 'OPD Consultation',
    description: '',
    amount: '',
    ref: '',
    paymentMode: 'Cash',
  });

  const totalIncome = transactionsList
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactionsList
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

  const filteredTxns = transactionsList.filter((txn) => {
    const matchesType = filterType === 'All' || txn.type === filterType;
    const matchesSearch =
      txn.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (txn.ref && txn.ref.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const handleAddTxn = (e) => {
    e.preventDefault();
    if (!txnForm.description || !txnForm.amount) return;

    const nextId = `TXN-${700 + transactionsList.length + 1}`;
    const newEntry = {
      id: nextId,
      type: txnForm.type,
      category: txnForm.category,
      description: txnForm.description,
      amount: Number(txnForm.amount),
      date: new Date().toISOString().split('T')[0],
      ref: txnForm.ref || `REC-${Math.floor(1000 + Math.random() * 9000)}`,
      paymentMode: txnForm.paymentMode,
    };

    setTransactionsList([newEntry, ...transactionsList]);
    setIsAddTxnOpen(false);
    setTxnForm({
      type: 'income',
      category: 'OPD Consultation',
      description: '',
      amount: '',
      ref: '',
      paymentMode: 'Cash',
    });
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <TrendingUp size={24} color="#0f2746" /> Hospital Expenses & Income
          </h1>
          <p className="page-subtitle">Track hospital cash flow, patient revenues, operational supplies, and ledger entries</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => setIsAddTxnOpen(true)}>
            <Plus size={16} /> Record Transaction
          </button>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="stat-grid">
        <StatCard
          label="Total Income (Revenues)"
          value={`₹${totalIncome.toLocaleString()}`}
          subtext="Patient billing, labs & scans"
          icon={ArrowDownLeft}
          color="#059669"
        />
        <StatCard
          label="Total Operating Expenses"
          value={`₹${totalExpense.toLocaleString()}`}
          subtext="Medical supplies, fuel & utilities"
          icon={ArrowUpRight}
          color="#dc2626"
        />
        <StatCard
          label="Net Operating Balance"
          value={`₹${netBalance.toLocaleString()}`}
          subtext="Hospital net operating balance"
          icon={Wallet}
          color="#15325b"
        />
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        {['All', 'income', 'expense'].map((t) => (
          <button
            key={t}
            className={`filter-tab ${filterType === t ? 'active' : ''}`}
            onClick={() => setFilterType(t)}
          >
            {t === 'All' ? 'All Transactions' : t === 'income' ? 'Income' : 'Expenses'}
          </button>
        ))}
      </div>

      {/* Transactions Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <span>Finance & Audit Ledger</span>
          </div>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-responsive">
            <table className="hms-table">
              <thead>
                <tr>
                  <th>Txn ID</th>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Reference</th>
                  <th>Payment Mode</th>
                  <th>Type</th>
                  <th style={{ textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {filteredTxns.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                      No financial transactions recorded.
                    </td>
                  </tr>
                ) : (
                  filteredTxns.map((txn) => (
                    <tr key={txn.id}>
                      <td style={{ fontWeight: 800, color: '#0b1e36' }}>{txn.id}</td>
                      <td style={{ color: '#64748b', fontSize: '0.8rem' }}>{txn.date}</td>
                      <td>
                        <span
                          style={{
                            fontWeight: 600,
                            padding: '0.2rem 0.5rem',
                            background: '#f1f5f9',
                            borderRadius: '4px',
                            color: '#1e3a8a',
                            fontSize: '0.75rem',
                          }}
                        >
                          {txn.category}
                        </span>
                      </td>
                      <td style={{ fontWeight: 500 }}>{txn.description}</td>
                      <td style={{ color: '#64748b', fontSize: '0.78rem' }}>{txn.ref}</td>
                      <td style={{ fontSize: '0.78rem' }}>{txn.paymentMode}</td>
                      <td>
                        <span
                          className={`badge ${
                            txn.type === 'income' ? 'badge-success' : 'badge-danger'
                          }`}
                        >
                          {txn.type}
                        </span>
                      </td>
                      <td
                        style={{
                          textAlign: 'right',
                          fontWeight: 800,
                          fontSize: '0.95rem',
                          color: txn.type === 'income' ? '#059669' : '#dc2626',
                        }}
                      >
                        {txn.type === 'income' ? `+₹${txn.amount}` : `-₹${txn.amount}`}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Transaction Modal */}
      <Modal isOpen={isAddTxnOpen} onClose={() => setIsAddTxnOpen(false)} title="Record Financial Transaction">
        <form onSubmit={handleAddTxn}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Transaction Type</label>
              <select
                className="form-control"
                value={txnForm.type}
                onChange={(e) => {
                  const type = e.target.value;
                  const defaultCat = type === 'income' ? 'OPD Consultation' : 'Medical Supplies';
                  setTxnForm({ ...txnForm, type, category: defaultCat });
                }}
              >
                <option value="income">Income (Revenue In)</option>
                <option value="expense">Expense (Payout / Cost)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-control"
                value={txnForm.category}
                onChange={(e) => setTxnForm({ ...txnForm, category: e.target.value })}
              >
                {txnForm.type === 'income' ? (
                  <>
                    <option value="OPD Consultation">OPD Consultation</option>
                    <option value="IPD Billing">IPD Billing</option>
                    <option value="Radiology">Radiology</option>
                    <option value="Pathology Lab">Pathology Lab</option>
                    <option value="Ambulance Service Fee">Ambulance Service Fee</option>
                    <option value="Pharmacy Sales">Pharmacy Sales</option>
                  </>
                ) : (
                  <>
                    <option value="Medical Supplies">Medical Supplies</option>
                    <option value="Ambulance & Fuel">Ambulance & Fuel</option>
                    <option value="Oxygen & Biomedical">Oxygen & Biomedical</option>
                    <option value="Staff Salaries & Wages">Staff Salaries & Wages</option>
                    <option value="Electricity & Utilities">Electricity & Utilities</option>
                    <option value="Hospital Maintenance">Hospital Maintenance</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <input
              type="text"
              className="form-control"
              required
              placeholder="e.g. Purchase of PPE kits and sterile gloves"
              value={txnForm.description}
              onChange={(e) => setTxnForm({ ...txnForm, description: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Amount (₹) *</label>
              <input
                type="number"
                className="form-control"
                required
                placeholder="0.00"
                value={txnForm.amount}
                onChange={(e) => setTxnForm({ ...txnForm, amount: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Reference / Voucher #</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. PO-1092"
                value={txnForm.ref}
                onChange={(e) => setTxnForm({ ...txnForm, ref: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Payment Method</label>
            <select
              className="form-control"
              value={txnForm.paymentMode}
              onChange={(e) => setTxnForm({ ...txnForm, paymentMode: e.target.value })}
            >
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Online">Online / Wire</option>
            </select>
          </div>

          <div className="modal-footer" style={{ margin: '1.5rem -1.5rem -1.5rem', padding: '1rem 1.5rem' }}>
            <button type="button" className="btn btn-white" onClick={() => setIsAddTxnOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Entry
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
