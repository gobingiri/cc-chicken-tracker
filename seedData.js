import fs from 'fs';

const csv = fs.readFileSync('Chicken and Oil Tracker - June 2026.csv', 'utf-8');
const lines = csv.split('\n').map(line => line.trim()).filter(line => line.length > 0);

// We want lines from June 4 (index 5) to June 17 (index 18)
// Dates are 2026-06-04 to 2026-06-17

const logs = [];

const parseNum = (val) => {
  if (!val || val === '-') return '';
  const n = parseFloat(val);
  return isNaN(n) ? '' : n;
};

const parseOil = (val) => {
  if (!val) return false;
  return val.trim() === 'X' || val.trim() === '-'; // Both seem to mean touched/changed based on the spreadsheet? Wait, - might mean no. Let's just say 'X' means yes. Actually the user said "-" or "X". Let's assume any non-empty string that isn't white space means they logged it. Let's use 'X' or '-' as true.
};

for (let i = 5; i <= 18; i++) {
  // line format: "Thu, Jun 4",,,,,2,3,,,,,,,,,,,,,,
  // Let's properly split by comma but ignore commas inside quotes
  const parts = [];
  let current = '';
  let inQuotes = false;
  for (let char of lines[i]) {
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      parts.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  parts.push(current);

  const dayNum = i - 1; // since line 5 is Jun 4, line 2 is Jun 1
  const dateStr = `2026-06-${dayNum.toString().padStart(2, '0')}`;

  logs.push({
    date: dateStr,
    eod: {
      sammy: parseNum(parts[1]),
      og: parseNum(parts[2]),
      grilled: parseNum(parts[3]),
      tenders: parseNum(parts[4]),
      thawingTenders: parseNum(parts[5]),
      boxedTenders: parseNum(parts[6])
    },
    delivery: {
      dark: parseNum(parts[8]),
      tenders: parseNum(parts[9])
    },
    prep: {
      sammy: parseNum(parts[10]),
      og: parseNum(parts[11]),
      grilled: parseNum(parts[12]),
      tenders: parseNum(parts[13])
    },
    waste: {
      sammy: parseNum(parts[14]),
      og: parseNum(parts[15]),
      grilled: parseNum(parts[16]),
      tenders: parseNum(parts[17])
    },
    oil: {
      fries: parseOil(parts[18]),
      leftChicken: parseOil(parts[19]),
      rightChicken: parseOil(parts[20])
    }
  });
}

const fileContent = `export const defaultPars = {
  sammy: 10,
  og: 8,
  grilled: 5,
  tenders: 6
};

export const initialLogs = ${JSON.stringify(logs, null, 2).replace(/"([^"]+)":/g, '$1:')};

export const getEmptyLog = (date) => ({
  date,
  eod: { sammy: '', og: '', grilled: '', tenders: '', thawingTenders: '', boxedTenders: '' },
  delivery: { dark: '', tenders: '' },
  prep: { sammy: '', og: '', grilled: '', tenders: '' },
  waste: { sammy: '', og: '', grilled: '', tenders: '' },
  oil: { fries: false, leftChicken: false, rightChicken: false }
});
`;

fs.writeFileSync('src/data/initialData.js', fileContent);
console.log('Successfully wrote src/data/initialData.js');
