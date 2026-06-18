import React, { useState } from 'react';

function ManagerSettingsView({ pars, onUpdatePars }) {
  const [localPars, setLocalPars] = useState({ ...pars });

  const handleChange = (key, value) => {
    const num = parseInt(value, 10);
    setLocalPars(prev => ({
      ...prev,
      [key]: isNaN(num) ? '' : Math.max(0, num)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdatePars(localPars);
    alert('Par levels successfully updated!');
  };

  const labels = {
    sammy: 'Sandwich Pieces',
    og: 'OG Pieces',
    grilled: 'Grilled',
    tenders: 'Tenders'
  };

  return (
    <div className="view-container">
      <header className="header">
        <h1>Manager Settings</h1>
        <div className="user-profile">
          <span className="user-name">Manager</span>
          <div className="avatar">M</div>
        </div>
      </header>

      <div className="form-container">
        <p className="form-description">Set the target par levels (in half pans) for each chicken type.</p>
        <form onSubmit={handleSubmit}>
          <div className="settings-grid">
            {Object.keys(labels).map((key) => (
              <div className="settings-card" key={key}>
                <h3>{labels[key]}</h3>
                <div className="input-group">
                  <label>Target Par Level</label>
                  <input 
                    type="number" 
                    className="big-input"
                    value={localPars[key]}
                    onChange={(e) => handleChange(key, e.target.value)}
                    min="0"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="form-actions mt-2">
            <button type="submit" className="btn btn-large">Save Par Levels</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ManagerSettingsView;
