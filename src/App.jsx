import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AccessDenied from './components/AccessDenied';
import DashboardView from './views/DashboardView';
import OpdView from './views/OpdView';
import IpdView from './views/IpdView';
import RadiologyView from './views/RadiologyView';
import PathologyView from './views/PathologyView';
import DoctorAvailableView from './views/DoctorAvailableView';
import BillingsView from './views/BillingsView';
import ExpensesIncomeView from './views/ExpensesIncomeView';
import AmbulanceView from './views/AmbulanceView';

import {
  INITIAL_OPD,
  INITIAL_BEDS,
  INITIAL_RADIOLOGY,
  INITIAL_PATHOLOGY,
  INITIAL_DOCTORS,
  INITIAL_BILLINGS,
  INITIAL_TRANSACTIONS,
  INITIAL_AMBULANCES,
  ROLE_PERMISSIONS,
} from './data/initialData';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentRole, setCurrentRole] = useState('admin');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  // Hospital state
  const [opdList, setOpdList] = useState(INITIAL_OPD);
  const [bedsList, setBedsList] = useState(INITIAL_BEDS);
  const [radiologyList, setRadiologyList] = useState(INITIAL_RADIOLOGY);
  const [pathologyList, setPathologyList] = useState(INITIAL_PATHOLOGY);
  const [doctorsList, setDoctorsList] = useState(INITIAL_DOCTORS);
  const [billingsList, setBillingsList] = useState(INITIAL_BILLINGS);
  const [transactionsList, setTransactionsList] = useState(INITIAL_TRANSACTIONS);
  const [ambulanceList, setAmbulanceList] = useState(INITIAL_AMBULANCES);

  // RBAC permission check
  const roleConfig = ROLE_PERMISSIONS[currentRole] || ROLE_PERMISSIONS.admin;
  const isTabAllowed = roleConfig.allowedTabs.includes(activeTab);

  const handleRoleChange = (newRole) => {
    setCurrentRole(newRole);
    const targetPerms = ROLE_PERMISSIONS[newRole] || ROLE_PERMISSIONS.admin;
    if (!targetPerms.allowedTabs.includes(activeTab)) {
      setActiveTab('dashboard');
    }
  };
  return (
    <div className="app-container">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentRole={currentRole}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="main-wrapper">
        <Navbar
          currentRole={currentRole}
          setCurrentRole={handleRoleChange}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setMobileOpen={setMobileOpen}
        />

        <main className="content-area">
          {!isTabAllowed ? (
            <AccessDenied
              currentRole={currentRole}
              tabName={activeTab}
              onGoDashboard={() => setActiveTab('dashboard')}
              onSwitchRole={handleRoleChange}
            />
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <DashboardView
                  opdList={opdList}
                  bedsList={bedsList}
                  doctorsList={doctorsList}
                  ambulanceList={ambulanceList}
                  billingsList={billingsList}
                  transactionsList={transactionsList}
                  radiologyList={radiologyList}
                  pathologyList={pathologyList}
                  setActiveTab={setActiveTab}
                  currentRole={currentRole}
                />
              )}

              {activeTab === 'opd' && (
                <OpdView
                  opdList={opdList}
                  setOpdList={setOpdList}
                  doctorsList={doctorsList}
                  searchQuery={searchQuery}
                />
              )}

              {activeTab === 'ipd' && (
                <IpdView
                  bedsList={bedsList}
                  setBedsList={setBedsList}
                  doctorsList={doctorsList}
                  searchQuery={searchQuery}
                />
              )}

              {activeTab === 'radiology' && (
                <RadiologyView
                  radiologyList={radiologyList}
                  setRadiologyList={setRadiologyList}
                  doctorsList={doctorsList}
                  searchQuery={searchQuery}
                />
              )}

              {activeTab === 'pathology' && (
                <PathologyView
                  pathologyList={pathologyList}
                  setPathologyList={setPathologyList}
                  doctorsList={doctorsList}
                  searchQuery={searchQuery}
                />
              )}

              {activeTab === 'doctors' && (
                <DoctorAvailableView
                  doctorsList={doctorsList}
                  setDoctorsList={setDoctorsList}
                  searchQuery={searchQuery}
                />
              )}

              {activeTab === 'billings' && (
                <BillingsView
                  billingsList={billingsList}
                  setBillingsList={setBillingsList}
                  searchQuery={searchQuery}
                  setTransactionsList={setTransactionsList}
                  transactionsList={transactionsList}
                />
              )}

              {activeTab === 'finances' && (
                <ExpensesIncomeView
                  transactionsList={transactionsList}
                  setTransactionsList={setTransactionsList}
                  searchQuery={searchQuery}
                />
              )}

              {activeTab === 'ambulance' && (
                <AmbulanceView
                  ambulanceList={ambulanceList}
                  setAmbulanceList={setAmbulanceList}
                  searchQuery={searchQuery}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
