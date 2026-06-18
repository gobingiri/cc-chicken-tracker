import React, { useState } from 'react';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="brand">
          Chen Chen's<br/>Tracker
        </div>
        <ul className="nav-links">
          <li className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            Dashboard
          </li>
          <li className={`nav-item ${activeTab === 'inventory' ? 'active' : ''}`} onClick={() => setActiveTab('inventory')}>
            Inventory
          </li>
          <li className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
            Orders
          </li>
          <li className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>
            Reports
          </li>
        </ul>
      </aside>

      <main className="main-content">
        <header className="header">
          <h1>Overview</h1>
          <div className="user-profile">
            <span className="user-name">Manager</span>
            <div className="avatar">M</div>
          </div>
        </header>

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-title">Current Chicken Stock</div>
            <div className="stat-value">420 lbs</div>
            <div className="stat-trend trend-down">
              ↓ 12% from yesterday
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Daily Usage (Est)</div>
            <div className="stat-value">185 lbs</div>
            <div className="stat-trend trend-up">
              ↑ 5% above average
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Pending Orders</div>
            <div className="stat-value">2</div>
            <div className="stat-trend">
              Arriving Tomorrow
            </div>
          </div>
        </section>

        <section className="quick-actions">
          <h2 className="section-title">Quick Actions</h2>
          <div className="actions-grid">
            <div className="action-card">
              <h3>Log Daily Usage</h3>
              <p>Record the end-of-day chicken weight to keep track of inventory and predict future needs accurately.</p>
              <button className="btn">Log Usage</button>
            </div>
            <div className="action-card">
              <h3>Place New Order</h3>
              <p>Running low? Create a new purchase order with our supplier to ensure you never run out of hot chicken.</p>
              <button className="btn">Create Order</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
