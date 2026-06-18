import { defaultPars, initialLogs } from '../data/initialData';

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxc68wix3qo-dMiUOPaHSVaSVKF-zu4XjFj8NXVlpBsxam4co0v4ZayA84W60kcLEw5sQ/exec';

// If the sheet is empty, we fall back to initial data.
export const loadData = async () => {
  try {
    const response = await fetch(SCRIPT_URL);
    const data = await response.json();
    
    // Fallbacks if sheet is newly setup and empty
    const logs = data.logs && data.logs.length > 0 ? data.logs : initialLogs;
    const pars = data.pars && Object.keys(data.pars).length > 0 ? data.pars : defaultPars;
    
    return { logs, pars };
  } catch (e) {
    console.error('Failed to load data from Google Sheets', e);
    // Fallback to local storage if offline
    const storedLogs = localStorage.getItem('cc_chicken_logs_v2');
    const storedPars = localStorage.getItem('cc_chicken_pars');
    return {
      logs: storedLogs ? JSON.parse(storedLogs) : initialLogs,
      pars: storedPars ? JSON.parse(storedPars) : defaultPars
    };
  }
};

export const saveLog = async (log) => {
  // Update local storage instantly for offline support
  const storedLogs = JSON.parse(localStorage.getItem('cc_chicken_logs_v2') || '[]');
  const existingIdx = storedLogs.findIndex(l => l.date === log.date);
  if (existingIdx >= 0) storedLogs[existingIdx] = log;
  else storedLogs.push(log);
  localStorage.setItem('cc_chicken_logs_v2', JSON.stringify(storedLogs));

  // Push to Google Sheets
  try {
    await fetch(SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'UPDATE_LOG', log }),
    });
  } catch (e) {
    console.error('Failed to sync log to Google Sheets', e);
  }
};

export const savePars = async (pars) => {
  // Update local storage instantly
  localStorage.setItem('cc_chicken_pars', JSON.stringify(pars));

  // Push to Google Sheets
  try {
    await fetch(SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'UPDATE_PARS', pars }),
    });
  } catch (e) {
    console.error('Failed to sync pars to Google Sheets', e);
  }
};

export const getEmptyLog = (date) => ({
  date,
  eod: { sammy: '', og: '', grilled: '', tenders: '', thawingTenders: '', boxedTenders: '' },
  delivery: { dark: '', tenders: '' },
  prep: { sammy: '', og: '', grilled: '', tenders: '' },
  waste: { sammy: '', og: '', grilled: '', tenders: '' },
  oil: { fries: false, leftChicken: false, rightChicken: false }
});
