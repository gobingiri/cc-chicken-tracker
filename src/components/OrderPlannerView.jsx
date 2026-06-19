import React, { useState, useMemo } from 'react';

function OrderPlannerView({ latestLog }) {
  const [projections, setProjections] = useState({
    sammy: '',
    og: '',
    tenders: ''
  });

  const [settings, setSettings] = useState({
    lbsPerDarkPan: 16.5,
    tenderPansPerBox: 1
  });

  const handleProjectionChange = (item, value) => {
    setProjections(prev => ({
      ...prev,
      [item]: value
    }));
  };

  const handleSettingChange = (item, value) => {
    setSettings(prev => ({
      ...prev,
      [item]: value
    }));
  };

  const calculations = useMemo(() => {
    // Current Inventory
    const curSammy = Number(latestLog.eod.sammy) || 0;
    const curOG = Number(latestLog.eod.og) || 0;
    const curTenderPans = Number(latestLog.eod.tenders) || 0;
    const curThawTenders = Number(latestLog.eod.thawingTenders) || 0;
    const curBoxedTenders = Number(latestLog.eod.boxedTenders) || 0;

    const projSammy = Number(projections.sammy) || 0;
    const projOG = Number(projections.og) || 0;
    const projTenders = Number(projections.tenders) || 0;

    // Dark Meat Math (Sammy + OG)
    const totalDarkPansNeeded = Math.max(0, (projSammy + projOG) - (curSammy + curOG));
    const darkLbsToOrder = totalDarkPansNeeded * settings.lbsPerDarkPan;

    // Tenders Math
    // Total pans on hand = prepped pans + thawing + (boxed * pansPerBox)
    const totalTendersOnHandPans = curTenderPans + curThawTenders + (curBoxedTenders * settings.tenderPansPerBox);
    const totalTenderPansNeeded = Math.max(0, projTenders - totalTendersOnHandPans);
    // Convert needed pans back to boxes for ordering
    const tenderBoxesToOrder = settings.tenderPansPerBox > 0 ? Math.ceil(totalTenderPansNeeded / settings.tenderPansPerBox) : 0;

    return {
      darkLbs: darkLbsToOrder,
      tenderBoxes: tenderBoxesToOrder,
      darkPansNeeded: totalDarkPansNeeded,
      tenderPansNeeded: totalTenderPansNeeded
    };
  }, [latestLog, projections, settings]);

  const today = new Date().getDay();
  // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  const isOrderDay = today === 2 || today === 4 || today === 6;
  const deliveryDays = { 2: 'Wednesday', 4: 'Friday', 6: 'Monday' };
  const deliveryDay = deliveryDays[today] || 'Next Delivery';

  return (
    <div className="view-container">
      <header className="header" style={{flexDirection: 'column', alignItems: 'flex-start', gap: '1rem'}}>
        <div>
          <h1 style={{marginBottom: '0.5rem'}}>Order Planner</h1>
          {isOrderDay ? (
            <p style={{color: '#34c759', fontSize: '1.1rem', fontWeight: 600}}>
              📅 Today is an Order Day! Planning for {deliveryDay} delivery.
            </p>
          ) : (
            <p style={{color: 'var(--text-muted)', fontSize: '1rem'}}>
              📅 Next Order Day is {today < 2 || today === 6 ? 'Tuesday' : today < 4 ? 'Thursday' : 'Saturday'}.
            </p>
          )}
        </div>
      </header>

      <div className="stats-grid">
        <div className="stat-card" style={{border: '1px solid var(--accent-orange)'}}>
          <div className="stat-title">Recommended Order (Dark Meat)</div>
          <div className="stat-value" style={{color: 'var(--accent-orange)'}}>
            {calculations.darkLbs.toFixed(2)} <span className="unit">lbs</span>
          </div>
          <div className="stat-trend trend-down">For Sandwich & OG</div>
        </div>
        <div className="stat-card" style={{border: '1px solid #5ac8fa'}}>
          <div className="stat-title">Recommended Order (Tenders)</div>
          <div className="stat-value" style={{color: '#5ac8fa'}}>
            {calculations.tenderBoxes} <span className="unit">boxes</span>
          </div>
          <div className="stat-trend trend-down">Whole Boxes</div>
        </div>
      </div>

      <div className="form-container" style={{marginBottom: '2rem'}}>
        <div className="form-section">
          <h3>Projected Needs (Pans)</h3>
          <p className="form-description">Enter how many pans you need through the next delivery period.</p>
          <div className="input-group-row">
            <div className="input-group">
              <label>Sandwich Pieces</label>
              <input 
                type="number" 
                className="big-input" 
                value={projections.sammy} 
                onChange={e => handleProjectionChange('sammy', e.target.value)} 
                placeholder="0"
              />
            </div>
            <div className="input-group">
              <label>OG Pieces</label>
              <input 
                type="number" 
                className="big-input" 
                value={projections.og} 
                onChange={e => handleProjectionChange('og', e.target.value)} 
                placeholder="0"
              />
            </div>
            <div className="input-group">
              <label>Tenders</label>
              <input 
                type="number" 
                className="big-input" 
                value={projections.tenders} 
                onChange={e => handleProjectionChange('tenders', e.target.value)} 
                placeholder="0"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Current Inventory Subtracted</h3>
          <p className="form-description">Based on latest End of Day counts ({latestLog.date}):</p>
          <ul style={{color: 'var(--text-muted)', lineHeight: '1.8', paddingLeft: '1.5rem'}}>
            <li><strong>{Number(latestLog.eod.sammy) || 0}</strong> Sandwich pans on hand</li>
            <li><strong>{Number(latestLog.eod.og) || 0}</strong> OG pans on hand</li>
            <li><strong>{Number(latestLog.eod.tenders) || 0}</strong> prepped Tender pans on hand</li>
            <li><strong>{Number(latestLog.eod.thawingTenders) || 0}</strong> thawing Tender pans on hand</li>
            <li><strong>{Number(latestLog.eod.boxedTenders) || 0}</strong> Boxed Tenders on hand</li>
          </ul>
        </div>
      </div>

      <div className="form-container">
        <h3>Conversion Settings</h3>
        <p className="form-description">Adjust these rates if your yield changes.</p>
        <div className="input-group-row">
          <div className="input-group">
            <label>Lbs of Dark Meat per Pan (Sammy/OG)</label>
            <input 
              type="number" 
              step="0.1"
              className="big-input" 
              value={settings.lbsPerDarkPan} 
              onChange={e => handleSettingChange('lbsPerDarkPan', e.target.value)} 
            />
          </div>
          <div className="input-group">
            <label>Pans Yielded per Box of Tenders</label>
            <input 
              type="number" 
              step="0.5"
              className="big-input" 
              value={settings.tenderPansPerBox} 
              onChange={e => handleSettingChange('tenderPansPerBox', e.target.value)} 
            />
          </div>
        </div>
      </div>

    </div>
  );
}

export default OrderPlannerView;
