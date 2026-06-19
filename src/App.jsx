import React, { useState, useEffect } from 'react';
import './index.css';
import DashboardView from './components/DashboardView';
import LogCountsView from './components/LogCountsView';
import PrepAndDeliveryView from './components/PrepAndDeliveryView';
import ReportsView from './components/ReportsView';
import ManagerSettingsView from './components/ManagerSettingsView';
import OrderPlannerView from './components/OrderPlannerView';
import { loadData, saveLog, deleteLog, savePars, getEmptyLog } from './utils/storage';
import logo from './assets/logo.png';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loggedUser, setLoggedUser] = useState(() => localStorage.getItem('cc_chicken_user') || '');
  
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

  // Get today's log or create an empty one for data entry
  let todayLog = logs.findLast ? logs.findLast(l => l.date === todayDate) : logs.slice().reverse().find(l => l.date === todayDate);
  if (!todayLog) {
    todayLog = getEmptyLog(todayDate);
  }

  // Get the most recent chronological log for the dashboard display
  const sortedLogs = [...logs].sort((a, b) => new Date(b.date) - new Date(a.date));
  const latestLog = sortedLogs.length > 0 ? sortedLogs[0] : todayLog;

  const handleUpdateLog = (updatedFields) => {
    let specificLog = {};
    setLogs(prev => {
      const existingIdx = prev.findIndex(l => l.id === todayLog.id);
      let newLogs = [...prev];
      if (existingIdx >= 0) {
        specificLog = { ...newLogs[existingIdx], ...updatedFields, loggedBy: loggedUser };
        newLogs[existingIdx] = specificLog;
      } else {
        specificLog = { ...todayLog, ...updatedFields, loggedBy: loggedUser };
        newLogs.push(specificLog);
      }
      return newLogs;
    });
    
    // Save only the updated log object asynchronously
    if (Object.keys(specificLog).length > 0) {
      saveLog(specificLog);
    }
  };

  const handleDeleteLog = (idToDelete) => {
    setLogs(prev => prev.filter(l => l.id !== idToDelete));
    deleteLog(idToDelete);
  };

  const handleUserChange = (e) => {
    const val = e.target.value;
    setLoggedUser(val);
    localStorage.setItem('cc_chicken_user', val);
  };

  const handleUpdatePars = (newPars) => {
    setPars(newPars);
    savePars(newPars);
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="brand" style={{marginBottom: '1rem'}}>
          <img src={logo} alt="Chen Chen's Logo" className="logo-img" />
          <div className="brand-text">Chen Chen's<br/>Tracker</div>
        </div>
        <div className="user-profile" style={{marginBottom: '2rem'}}>
          <input 
            type="text" 
            placeholder="Who is logging?" 
            value={loggedUser}
            onChange={handleUserChange}
            className="big-input"
            style={{padding: '0.5rem', width: '100%', fontSize: '0.9rem'}}
          />
        </div>
        <ul className="nav-links">
          <li className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            Dashboard
          </li>
          <li className={`nav-item ${activeTab === 'counts' ? 'active' : ''}`} onClick={() => setActiveTab('counts')}>
            End of Day & Waste
          </li>
          <li className={`nav-item ${activeTab === 'prep' ? 'active' : ''}`} onClick={() => setActiveTab('prep')}>
            Prep & Delivery
          </li>
        </ul>
        <div style={{marginTop: '2rem'}}>
          <h3 style={{color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px'}}>Manager Actions</h3>
          <ul className="nav-links">
            <li className={`nav-item ${activeTab === 'order-planner' ? 'active' : ''}`} onClick={() => setActiveTab('order-planner')}>
              📅 Order Planner
            </li>
            <li className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>
              📊 Historical Reports
            </li>
            <li className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
              ⚙️ Settings
            </li>
          </ul>
        </div>
      </aside>

      <main className="main-content">
        {activeTab === 'dashboard' && <DashboardView todayLog={latestLog} pars={pars} />}
        {activeTab === 'prep' && <PrepAndDeliveryView todayLog={todayLog} onUpdateLog={handleUpdateLog} />}
        {activeTab === 'counts' && <LogCountsView todayLog={todayLog} onUpdateLog={handleUpdateLog} />}
        {activeTab === 'order-planner' && <OrderPlannerView latestLog={latestLog} />}
        {activeTab === 'reports' && <ReportsView logs={logs} onDeleteLog={handleDeleteLog} />}
        {activeTab === 'settings' && <ManagerSettingsView pars={pars} onUpdatePars={handleUpdatePars} />}
      </main>
    </div>
  );
}

export default App;
