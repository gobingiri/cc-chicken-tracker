import React, { useState } from 'react';
import StepperInput from './StepperInput';

function PrepAndDeliveryView({ todayLog, onUpdateLog }) {
  const [localLog, setLocalLog] = useState(() => ({
    delivery: { ...todayLog.delivery },
    prep: { ...todayLog.prep }
  }));

  const handleChange = (section, field, value) => {
    setLocalLog(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
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
      </header>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          
          <div className="form-section">
            <h3>Deliveries</h3>
            <div className="input-group-row">
              <div className="input-group">
                <label>Dark Meat (lbs)</label>
                <StepperInput 
                  value={localLog.delivery.dark}
                  onChange={(val) => handleChange('delivery', 'dark', val)}
                  step={0.01}
                  min={0}
                />
              </div>
              <div className="input-group">
                <label>Tenders (Boxes)</label>
                <StepperInput 
                  value={localLog.delivery.tenders}
                  onChange={(val) => handleChange('delivery', 'tenders', val)}
                  step={0.01}
                  min={0}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Daily Prep (Half Pans)</h3>
            <div className="input-group-row">
              {Object.keys(localLog.prep).map(type => (
                <div className="input-group" key={type}>
                  <label>{type.charAt(0).toUpperCase() + type.slice(1)}</label>
                  <StepperInput 
                    value={localLog.prep[type]}
                    onChange={(val) => handleChange('prep', type, val)}
                    step={0.25}
                    min={0}
                  />
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
