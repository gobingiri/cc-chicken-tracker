import React, { useState } from 'react';

function PrepAndDeliveryView({ todayLog, onUpdateLog }) {
  const [localLog, setLocalLog] = useState(() => ({
    delivery: { ...todayLog.delivery },
    prep: { ...todayLog.prep }
  }));

  const handleChange = (section, field, value) => {
    const num = parseFloat(value);
    setLocalLog(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: isNaN(num) ? '' : Math.max(0, num)
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateLog({
      delivery: localLog.delivery,
      prep: localLog.prep
    });
    alert('Prep and Delivery logged successfully!');
  };

  return (
    <div className="view-container">
      <header className="header">
        <h1>Prep & Delivery Logs</h1>
        <div className="user-profile">
          <span className="user-name">Staff</span>
          <div className="avatar">S</div>
        </div>
      </header>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          
          <div className="form-section">
            <h3>Deliveries (Weight from Invoice in lbs)</h3>
            <div className="input-group-row">
              <div className="input-group">
                <label>Dark Meat (lbs)</label>
                <div className="stepper-input">
                  <input 
                    type="number" 
                    step="0.01"
                    value={localLog.delivery.dark}
                    onChange={(e) => handleChange('delivery', 'dark', e.target.value)}
                    min="0"
                  />
                </div>
              </div>
              <div className="input-group">
                <label>Tenders (lbs)</label>
                <div className="stepper-input">
                  <input 
                    type="number" 
                    step="0.01"
                    value={localLog.delivery.tenders}
                    onChange={(e) => handleChange('delivery', 'tenders', e.target.value)}
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Daily Prep (Half Pans)</h3>
            <div className="input-group-row">
              {Object.keys(localLog.prep).map(type => (
                <div className="input-group" key={type}>
                  <label>{type.charAt(0).toUpperCase() + type.slice(1)}</label>
                  <div className="stepper-input">
                    <input 
                      type="number" 
                      step="0.25"
                      value={localLog.prep[type]}
                      onChange={(e) => handleChange('prep', type, e.target.value)}
                      min="0"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-large">Save Prep & Delivery</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PrepAndDeliveryView;
