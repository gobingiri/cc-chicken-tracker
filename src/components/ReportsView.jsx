import React, { useState, useMemo } from 'react';

function ReportsView({ logs }) {
  const [selectedMonth, setSelectedMonth] = useState('all');

  // Parse available months
  const availableMonths = useMemo(() => {
    const months = new Set();
    logs.forEach(log => {
      if (log.date) {
        // Assume log.date is YYYY-MM-DD
        const ym = log.date.substring(0, 7);
        months.add(ym);
      }
    });
    // Sort descending
    return Array.from(months).sort().reverse();
  }, [logs]);

  // If selectedMonth is not 'all' and not in availableMonths, default to 'all' or latest
  // But we'll just handle it gracefully.

  // Filter and sort logs
  const filteredLogs = useMemo(() => {
    let result = logs;
    if (selectedMonth !== 'all') {
      result = logs.filter(log => log.date && log.date.startsWith(selectedMonth));
    }
    // Reverse sort so newest is top
    return [...result].sort((a, b) => b.date.localeCompare(a.date));
  }, [logs, selectedMonth]);

  // Calculate Summaries
  const summaries = useMemo(() => {
    let sum = {
      delDark: 0,
      delTenders: 0,
      prepTotal: 0,
      wasteTotal: 0
    };

    filteredLogs.forEach(log => {
      sum.delDark += Number(log.delivery.dark) || 0;
      sum.delTenders += Number(log.delivery.tenders) || 0;
      
      sum.prepTotal += (Number(log.prep.sammy) || 0) + (Number(log.prep.og) || 0) + (Number(log.prep.grilled) || 0) + (Number(log.prep.tenders) || 0);
      
      sum.wasteTotal += (Number(log.waste.sammy) || 0) + (Number(log.waste.og) || 0) + (Number(log.waste.grilled) || 0) + (Number(log.waste.tenders) || 0);
    });

    return sum;
  }, [filteredLogs]);

  const exportToCSV = () => {
    const headers = [
      "Dates",
      "EoD Sammy", "EoD OG", "EoD Grilled", "EoD Tenders", "Thawing Tenders", "Boxed Tenders",
      "Delivery Dark (lbs)", "Delivery Tenders (boxes)",
      "Prepped Sammy", "Prepped OG", "Prepped Grilled", "Prepped Tenders",
      "Thrown Sammy", "Thrown OG", "Thrown Grilled", "Thrown Tenders",
      "Fries (Oil)", "Left Chicken (Oil)", "Right Chicken (Oil)"
    ];

    const rows = filteredLogs.map(log => [
      log.date,
      log.eod.sammy, log.eod.og, log.eod.grilled, log.eod.tenders, log.eod.thawingTenders, log.eod.boxedTenders,
      log.delivery.dark, log.delivery.tenders,
      log.prep.sammy, log.prep.og, log.prep.grilled, log.prep.tenders,
      log.waste.sammy, log.waste.og, log.waste.grilled, log.waste.tenders,
      log.oil.fries ? 'X' : '-', log.oil.leftChicken ? 'X' : '-', log.oil.rightChicken ? 'X' : '-'
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const filename = selectedMonth === 'all' ? 'cc_chicken_tracker_all_time.csv' : `cc_chicken_tracker_${selectedMonth}.csv`;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatMonth = (ymString) => {
    const [y, m] = ymString.split('-');
    const date = new Date(y, m - 1, 1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="view-container">
      <header className="header" style={{flexDirection: 'column', alignItems: 'flex-start', gap: '1rem'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center'}}>
          <h1>Historical Reports</h1>
          <button className="btn" onClick={exportToCSV}>Export to CSV</button>
        </div>
        
        <div className="filter-group">
          <label style={{marginRight: '1rem', color: 'var(--text-muted)'}}>Filter by Month:</label>
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="big-input"
            style={{width: 'auto', padding: '0.5rem 1rem'}}
          >
            <option value="all">All Time</option>
            {availableMonths.map(ym => (
              <option key={ym} value={ym}>{formatMonth(ym)}</option>
            ))}
          </select>
        </div>
      </header>

      <section className="stats-grid" style={{marginBottom: '2rem'}}>
        <div className="stat-card">
          <div className="stat-title">Total Deliveries</div>
          <div className="stat-details" style={{marginTop: '0.5rem'}}>
            <div className="detail-row">
              <span>Dark Meat:</span>
              <span style={{color: '#ffcc00'}}>{summaries.delDark.toFixed(2)} lbs</span>
            </div>
            <div className="detail-row">
              <span>Tenders:</span>
              <span style={{color: '#ffcc00'}}>{summaries.delTenders} boxes</span>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Total Prepped</div>
          <div className="stat-value">{summaries.prepTotal} <span className="unit">pans</span></div>
          <div className="stat-trend trend-up">All chicken types combined</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Total Waste</div>
          <div className="stat-value" style={{color: '#ff3b30'}}>{summaries.wasteTotal} <span className="unit">pans</span></div>
          <div className="stat-trend trend-down">All chicken types combined</div>
        </div>
      </section>

      {filteredLogs.length === 0 ? (
        <div className="empty-state" style={{textAlign: 'center', padding: '3rem', color: 'var(--text-muted)'}}>
          <p>No logs found for this period.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="reports-table">
            <thead>
              <tr>
                <th>Date</th>
                <th colSpan="6" className="th-group group-eod">End of Day (Half Pans)</th>
                <th colSpan="2" className="th-group group-del">Delivery</th>
                <th colSpan="4" className="th-group group-prep">Prep (Half Pans)</th>
                <th colSpan="4" className="th-group group-waste">Waste (Half Pans)</th>
                <th colSpan="3" className="th-group group-oil">Oil Changes</th>
              </tr>
              <tr className="sub-header">
                <th></th>
                {/* EoD */}
                <th>Sammy</th><th>OG</th><th>Grilled</th><th>Tenders</th><th>Thaw</th><th>Boxed</th>
                {/* Delivery */}
                <th>Dark (lbs)</th><th>Tenders (boxes)</th>
                {/* Prep */}
                <th>Sammy</th><th>OG</th><th>Grilled</th><th>Tenders</th>
                {/* Waste */}
                <th>Sammy</th><th>OG</th><th>Grilled</th><th>Tenders</th>
                {/* Oil */}
                <th>Fries</th><th>Left</th><th>Right</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, i) => (
                <tr key={i}>
                  <td><strong>{log.date}</strong></td>
                  {/* EoD */}
                  <td>{log.eod.sammy}</td><td>{log.eod.og}</td><td>{log.eod.grilled}</td><td>{log.eod.tenders}</td><td>{log.eod.thawingTenders}</td><td>{log.eod.boxedTenders}</td>
                  {/* Delivery */}
                  <td>{log.delivery.dark}</td><td>{log.delivery.tenders}</td>
                  {/* Prep */}
                  <td>{log.prep.sammy}</td><td>{log.prep.og}</td><td>{log.prep.grilled}</td><td>{log.prep.tenders}</td>
                  {/* Waste */}
                  <td>{log.waste.sammy}</td><td>{log.waste.og}</td><td>{log.waste.grilled}</td><td>{log.waste.tenders}</td>
                  {/* Oil */}
                  <td className="text-center">{log.oil.fries ? '✓' : '-'}</td>
                  <td className="text-center">{log.oil.leftChicken ? '✓' : '-'}</td>
                  <td className="text-center">{log.oil.rightChicken ? '✓' : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ReportsView;
