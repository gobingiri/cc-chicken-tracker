import React, { useState } from 'react';
import StepperInput from './StepperInput';

function LogCountsView({ todayLog, onUpdateLog }) {
  const [localLog, setLocalLog] = useState(() => ({
    eod: { ...todayLog.eod },
    waste: { ...todayLog.waste },
    oil: { ...todayLog.oil }
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

  const handleToggle = (field) => {
    setLocalLog(prev => ({
      ...prev,
      oil: {
        ...prev.oil,
        [field]: !prev.oil[field]
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateLog({
      eod: localLog.eod,
      waste: localLog.waste,
      oil: localLog.oil
    });
    alert('Counts successfully logged!');
  };

  const eodLabels = {
    sammy: 'Sandwich Pieces',
    og: 'OG Pieces',
    grilled: 'Grilled',
    tenders: 'Tenders',
    thawingTenders: 'Thawing Tenders',
    boxedTenders: 'Boxed Tenders'
  };

  const wasteLabels = {
    sammy: 'Sandwich Pieces',
    og: 'OG Pieces',
    grilled: 'Grilled',
    tenders: 'Tenders'
  };

  return (
    <div className="view-container">
      <header className="header">
        <h1>Log Counts & Waste</h1>
      </header>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          
          <div className="form-section">
            <h3>End of Day Inventory (Pans / Bags)</h3>
            <div className="input-group-row">
              {Object.keys(eodLabels).map(key => (
                <div className="input-group" key={`eod-${key}`}>
                  <label>{eodLabels[key]}</label>
                  <StepperInput 
                    value={localLog.eod[key]}
                    onChange={(val) => handleChange('eod', key, val)}
                    step={0.25}
                    min={0}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="form-section">
            <h3>Waste / Thrown (Pans / Bags)</h3>
            <div className="input-group-row">
              {Object.keys(wasteLabels).map(key => (
                <div className="input-group" key={`waste-${key}`}>
                  <label>{wasteLabels[key]}</label>
                  <StepperInput 
                    value={localLog.waste[key]}
                    onChange={(val) => handleChange('waste', key, val)}
                    step={0.25}
                    min={0}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="form-section">
            <h3>Fryer Oil Changes</h3>
            <p className="form-description" style={{marginBottom: '1rem'}}>Toggle if the oil was changed today.</p>
            <div className="oil-toggles">
              <label className="toggle-label">
                <input type="checkbox" checked={localLog.oil.fries} onChange={() => handleToggle('fries')} />
                <span className="toggle-slider"></span>
                <span className="toggle-text">Fries</span>
              </label>
              <label className="toggle-label">
                <input type="checkbox" checked={localLog.oil.leftChicken} onChange={() => handleToggle('leftChicken')} />
                <span className="toggle-slider"></span>
                <span className="toggle-text">Left Chicken</span>
              </label>
              <label className="toggle-label">
                <input type="checkbox" checked={localLog.oil.rightChicken} onChange={() => handleToggle('rightChicken')} />
                <span className="toggle-slider"></span>
                <span className="toggle-text">Right Chicken</span>
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-large">Save Counts</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LogCountsView;
