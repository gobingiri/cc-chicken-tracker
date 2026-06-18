import React from 'react';

function DashboardView({ todayLog, pars }) {
  const items = [
    { key: 'sammy', name: 'Sandwich Pieces' },
    { key: 'og', name: 'OG Pieces' },
    { key: 'grilled', name: 'Grilled' },
    { key: 'tenders', name: 'Tenders' }
  ];

  return (
    <div className="view-container">
      <header className="header" style={{alignItems: 'flex-start', marginBottom: '2rem'}}>
        <div>
          <h1 style={{marginBottom: '0.5rem'}}>Dashboard Overview</h1>
          <p style={{color: 'var(--text-muted)', fontSize: '1rem'}}>As of {todayLog.date}</p>
        </div>
        <div className="user-profile">
          <span className="user-name">Manager</span>
          <div className="avatar">M</div>
        </div>
      </header>

      <section className="stats-grid">
        {items.map(item => {
          const currentCount = Number(todayLog.eod[item.key]) || 0;
          const par = Number(pars[item.key]) || 0;
          const waste = Number(todayLog.waste[item.key]) || 0;
          const prepped = Number(todayLog.prep[item.key]) || 0;
          
          const needed = Math.max(0, par - currentCount);
          const isLow = currentCount < par * 0.5;

          return (
            <div className={`stat-card ${isLow ? 'card-warning' : ''}`} key={item.key}>
              <div className="stat-title">{item.name}</div>
              <div className="stat-value">{currentCount} <span className="unit">pans</span></div>
              
              <div className="stat-details">
                <div className="detail-row">
                  <span>Par Level:</span>
                  <span>{par}</span>
                </div>
                <div className="detail-row">
                  <span>Prepped Today:</span>
                  <span style={{color: '#34c759'}}>{prepped}</span>
                </div>
                <div className="detail-row">
                  <span>Waste Logged:</span>
                  <span className="text-red">{waste}</span>
                </div>
              </div>
              
              <div className={`stat-trend ${needed > 0 ? 'trend-down' : 'trend-up'}`}>
                {needed > 0 
                  ? `Need ${needed} pans to meet par` 
                  : `Fully stocked (above par by ${currentCount - par})`}
              </div>
            </div>
          );
        })}
      </section>

      <section className="quick-actions">
        <h2 className="section-title">Action Items</h2>
        <div className="actions-grid">
          <div className="action-card">
            <h3>Suggested Prep & Orders</h3>
            <p>Based on current par levels, here is what needs to be prepped or ordered today:</p>
            <ul className="action-list">
              {items.map(item => {
                const currentCount = Number(todayLog.eod[item.key]) || 0;
                const par = Number(pars[item.key]) || 0;
                const needed = Math.max(0, par - currentCount);
                if (needed === 0) return null;
                return (
                  <li key={item.key}>
                    <strong>{needed} pans</strong> of {item.name}
                  </li>
                );
              })}
              {items.every(item => {
                const c = Number(todayLog.eod[item.key]) || 0;
                const p = Number(pars[item.key]) || 0;
                return p - c <= 0;
              }) && (
                <li>All items meet or exceed par levels!</li>
              )}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

export default DashboardView;
