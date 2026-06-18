import React, { useState, useEffect } from 'react';
import './index.css';
import DashboardView from './components/DashboardView';
import LogCountsView from './components/LogCountsView';
import ManagerSettingsView from './components/ManagerSettingsView';
import PrepAndDeliveryView from './components/PrepAndDeliveryView';
import ReportsView from './components/ReportsView';
import { loadData, saveLog, savePars, getEmptyLog } from './utils/storage';
import logo from './assets/logo.png';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [logs, setLogs] = useState([]);
  const [pars, setPars] = useState({});
  const [todayDate, setTodayDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data asynchronously from Google Sheets
  useEffect(() => {
    const initData = async () => {
      const data = await loadData();
      setLogs(data.logs);
      setPars(data.pars);
      setIsLoading(false);
    };
    initData();
  }, []);

  if (isLoading) {
    return (
      <div className="loading-screen" style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0f0f11', color: '#fff'}}>
        <img src={logo} alt="Loading" className="logo-img" style={{marginBottom: '2rem', animation: 'pulse 2s infinite'}} />
        <h2>Syncing with Google Sheets...</h2>
      </div>
    );
  }

  // Find or create today's log
  let todayLog = logs.find(l => l.date === todayDate);
  if (!todayLog && logs.length > 0) {
    todayLog = getEmptyLog(todayDate);
  }

  const handleUpdateLog = (updatedFields) => {
    let specificLog = {};
    setLogs(prev => {
      const existingIdx = prev.findIndex(l => l.date === todayDate);
      let newLogs = [...prev];
      if (existingIdx >= 0) {
        specificLog = { ...newLogs[existingIdx], ...updatedFields };
        newLogs[existingIdx] = specificLog;
      } else {
        specificLog = { ...getEmptyLog(todayDate), ...updatedFields };
        newLogs.push(specificLog);
      }
      return newLogs;
    });
    
    // Save only the updated log object asynchronously
    if (Object.keys(specificLog).length > 0) {
      saveLog(specificLog);
    }
  };

  const handleUpdatePars = (newPars) => {
    setPars(newPars);
    savePars(newPars);
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="brand">
          <img src={logo} alt="Chen Chen's Logo" className="logo-img" />
          <div className="brand-text">Chen Chen's<br/>Tracker</div>
        </div>
        <ul className="nav-links">
          <li className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            Dashboard
          </li>
          <li className={`nav-item ${activeTab === 'prep' ? 'active' : ''}`} onClick={() => setActiveTab('prep')}>
            Prep & Delivery
          </li>
          <li className={`nav-item ${activeTab === 'counts' ? 'active' : ''}`} onClick={() => setActiveTab('counts')}>
            End of Day & Waste
          </li>
          <li className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>
            Reports
          </li>
          <li className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
            Manager Settings
          </li>
        </ul>
      </aside>

      <main className="main-content">
        {activeTab === 'dashboard' && <DashboardView todayLog={todayLog} pars={pars} />}
        {activeTab === 'prep' && <PrepAndDeliveryView todayLog={todayLog} onUpdateLog={handleUpdateLog} />}
        {activeTab === 'counts' && <LogCountsView todayLog={todayLog} onUpdateLog={handleUpdateLog} />}
        {activeTab === 'reports' && <ReportsView logs={logs} />}
        {activeTab === 'settings' && <ManagerSettingsView pars={pars} onUpdatePars={handleUpdatePars} />}
      </main>
    </div>
  );
}

export default App;
