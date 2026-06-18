import React from 'react';

function ReportsView({ logs }) {
  const exportToCSV = () => {
    // Basic CSV generation matching Google Sheet headers
    const headers = [
      "Dates",
      "EoD Sammy", "EoD OG", "EoD Grilled", "EoD Tenders", "Thawing Tenders", "Boxed Tenders",
      "Delivery Dark", "Delivery Tenders",
      "Prepped Sammy", "Prepped OG", "Prepped Grilled", "Prepped Tenders",
      "Thrown Sammy", "Thrown OG", "Thrown Grilled", "Thrown Tenders",
      "Fries (Oil)", "Left Chicken (Oil)", "Right Chicken (Oil)"
    ];

    const rows = logs.map(log => [
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
    link.setAttribute("download", `cc_chicken_tracker_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="view-container">
      <header className="header">
        <h1>Historical Reports</h1>
        <button className="btn" onClick={exportToCSV}>Export to CSV</button>
      </header>

      <div className="table-responsive">
        <table className="reports-table">
          <thead>
            <tr>
              <th>Date</th>
              <th colSpan="6" className="th-group group-eod">End of Day (Half Pans)</th>
              <th colSpan="2" className="th-group group-del">Delivery (lbs)</th>
              <th colSpan="4" className="th-group group-prep">Prep (Half Pans)</th>
              <th colSpan="4" className="th-group group-waste">Waste (Half Pans)</th>
              <th colSpan="3" className="th-group group-oil">Oil Changes</th>
            </tr>
            <tr className="sub-header">
              <th></th>
              {/* EoD */}
              <th>Sammy</th><th>OG</th><th>Grilled</th><th>Tenders</th><th>Thaw</th><th>Boxed</th>
              {/* Delivery */}
              <th>Dark</th><th>Tenders</th>
              {/* Prep */}
              <th>Sammy</th><th>OG</th><th>Grilled</th><th>Tenders</th>
              {/* Waste */}
              <th>Sammy</th><th>OG</th><th>Grilled</th><th>Tenders</th>
              {/* Oil */}
              <th>Fries</th><th>Left</th><th>Right</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => (
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
    </div>
  );
}

export default ReportsView;
