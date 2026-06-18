import React from 'react';

function DashboardView({ inventory }) {
  const items = Object.values(inventory);

  return (
    <div className="view-container">
      <header className="header">
        <h1>Dashboard Overview</h1>
        <div className="user-profile">
          <span className="user-name">Manager</span>
          <div className="avatar">M</div>
        </div>
      </header>

      <section className="stats-grid">
        {items.map(item => {
          const needed = Math.max(0, item.parLevel - item.currentCount);
          const isLow = item.currentCount < item.parLevel * 0.5;

          return (
            <div className={`stat-card ${isLow ? 'card-warning' : ''}`} key={item.name}>
              <div className="stat-title">{item.name}</div>
              <div className="stat-value">{item.currentCount} <span className="unit">pans</span></div>
              
              <div className="stat-details">
                <div className="detail-row">
                  <span>Par Level:</span>
                  <span>{item.parLevel}</span>
                </div>
                <div className="detail-row">
                  <span>Waste Logged:</span>
                  <span className="text-red">{item.wasteCount}</span>
                </div>
              </div>
              
              <div className={`stat-trend ${needed > 0 ? 'trend-down' : 'trend-up'}`}>
                {needed > 0 
                  ? `Need ${needed} pans to meet par` 
                  : `Fully stocked (above par by ${item.currentCount - item.parLevel})`}
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
                const needed = Math.max(0, item.parLevel - item.currentCount);
                if (needed === 0) return null;
                return (
                  <li key={item.name}>
                    <strong>{needed} pans</strong> of {item.name}
                  </li>
                );
              })}
              {items.every(item => item.parLevel - item.currentCount <= 0) && (
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
