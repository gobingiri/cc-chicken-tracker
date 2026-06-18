import { defaultPars, initialLogs } from '../data/initialData';

export const loadLogs = () => {
  const stored = localStorage.getItem('cc_chicken_logs_v2');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse logs', e);
    }
  }
  return initialLogs;
};

export const saveLogs = (logs) => {
  localStorage.setItem('cc_chicken_logs_v2', JSON.stringify(logs));
};

export const loadPars = () => {
  const stored = localStorage.getItem('cc_chicken_pars');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse pars', e);
    }
  }
  return defaultPars;
};

export const savePars = (pars) => {
  localStorage.setItem('cc_chicken_pars', JSON.stringify(pars));
};
