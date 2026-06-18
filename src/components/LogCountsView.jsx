import React, { useState } from 'react';

function LogCountsView({ inventory, onUpdateCounts }) {
  const [localCounts, setLocalCounts] = useState(() => {
    const counts = {};
    Object.keys(inventory).forEach(key => {
      counts[key] = {
        currentCount: inventory[key].currentCount || 0,
        wasteCount: inventory[key].wasteCount || 0
      };
    });
    return counts;
  });

  const handleChange = (key, field, value) => {
    const num = parseInt(value, 10);
    setLocalCounts(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: isNaN(num) ? '' : Math.max(0, num)
      }
    }));
  };

  const handleStepper = (key, field, delta) => {
    setLocalCounts(prev => {
      const current = typeof prev[key][field] === 'number' ? prev[key][field] : 0;
      return {
        ...prev,
        [key]: {
          ...prev[key],
          [field]: Math.max(0, current + delta)
        }
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateCounts(localCounts);
    alert('Counts successfully logged!');
  };

  return (
    <div className="view-container">
      <header className="header">
        <h1>Log Counts (Staff)</h1>
        <div className="user-profile">
          <span className="user-name">Staff</span>
          <div className="avatar">S</div>
        </div>
      </header>

      <div className="form-container">
        <p className="form-description">Enter the current number of half pans on hand and any waste.</p>
        <form onSubmit={handleSubmit}>
          {Object.entries(inventory).map(([key, item]) => (
            <div className="form-section" key={key}>
              <h3>{item.name}</h3>
              <div className="input-group-row">
                <div className="input-group">
                  <label>Current Count (Half Pans)</label>
                  <div className="stepper-input">
                    <button type="button" className="btn-icon" onClick={() => handleStepper(key, 'currentCount', -1)}>-</button>
                    <input 
                      type="number" 
                      value={localCounts[key].currentCount}
                      onChange={(e) => handleChange(key, 'currentCount', e.target.value)}
                      min="0"
                    />
                    <button type="button" className="btn-icon" onClick={() => handleStepper(key, 'currentCount', 1)}>+</button>
                  </div>
                </div>
                
                <div className="input-group">
                  <label>Waste (Half Pans)</label>
                  <div className="stepper-input">
                    <button type="button" className="btn-icon danger" onClick={() => handleStepper(key, 'wasteCount', -1)}>-</button>
                    <input 
                      type="number" 
                      value={localCounts[key].wasteCount}
                      onChange={(e) => handleChange(key, 'wasteCount', e.target.value)}
                      min="0"
                    />
                    <button type="button" className="btn-icon danger" onClick={() => handleStepper(key, 'wasteCount', 1)}>+</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="form-actions">
            <button type="submit" className="btn btn-large">Save Counts</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LogCountsView;
