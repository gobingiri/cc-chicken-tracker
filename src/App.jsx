import React, { useState } from 'react';
import './index.css';
import DashboardView from './components/DashboardView';
import LogCountsView from './components/LogCountsView';
import ManagerSettingsView from './components/ManagerSettingsView';
import logo from './assets/logo.png';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [inventory, setInventory] = useState({
    sandwich: { name: 'Sandwich Pieces', currentCount: 0, wasteCount: 0, parLevel: 10 },
    og: { name: 'OG Pieces', currentCount: 0, wasteCount: 0, parLevel: 8 },
    tenders: { name: 'Tenders', currentCount: 0, wasteCount: 0, parLevel: 5 }
  });

  const handleUpdateCounts = (newCounts) => {
    setInventory(prev => {
      const next = { ...prev };
      Object.keys(newCounts).forEach(key => {
        next[key] = {
          ...next[key],
          currentCount: newCounts[key].currentCount,
          wasteCount: newCounts[key].wasteCount
        };
      });
      return next;
    });
  };

  const handleUpdatePars = (newPars) => {
    setInventory(prev => {
      const next = { ...prev };
      Object.keys(newPars).forEach(key => {
        next[key] = {
          ...next[key],
          parLevel: newPars[key]
        };
      });
      return next;
    });
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="brand">
          <img src={logo} alt="Chen Chen's Logo" className="logo-img" onError={(e) => e.target.style.display='none'} />
          <div className="brand-text">Chen Chen's<br/>Tracker</div>
        </div>
        <ul className="nav-links">
          <li className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            Dashboard
          </li>
          <li className={`nav-item ${activeTab === 'log-counts' ? 'active' : ''}`} onClick={() => setActiveTab('log-counts')}>
            Log Counts (Staff)
          </li>
          <li className={`nav-item ${activeTab === 'manager-settings' ? 'active' : ''}`} onClick={() => setActiveTab('manager-settings')}>
            Manager Settings
          </li>
        </ul>
      </aside>

      <main className="main-content">
        {activeTab === 'dashboard' && <DashboardView inventory={inventory} />}
        {activeTab === 'log-counts' && <LogCountsView inventory={inventory} onUpdateCounts={handleUpdateCounts} />}
        {activeTab === 'manager-settings' && <ManagerSettingsView inventory={inventory} onUpdatePars={handleUpdatePars} />}
      </main>
    </div>
  );
}

export default App;
