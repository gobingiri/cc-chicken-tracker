export const defaultPars = {
  sammy: 10,
  og: 8,
  grilled: 5,
  tenders: 6
};

export const initialLogs = [
  {
    date: '2026-06-01',
    eod: { sammy: 5, og: 7.5, grilled: 3, tenders: 5.5, thawingTenders: 0, boxedTenders: 3 },
    delivery: { dark: 0, tenders: 0 },
    prep: { sammy: 0, og: 0, grilled: 0, tenders: 0 },
    waste: { sammy: 0, og: 0, grilled: 0, tenders: 0 },
    oil: { fries: false, leftChicken: false, rightChicken: false }
  },
  {
    date: '2026-06-02',
    eod: { sammy: 3.25, og: 6.25, grilled: 1, tenders: 6, thawingTenders: 2, boxedTenders: 1 },
    delivery: { dark: 0, tenders: 0 },
    prep: { sammy: 0, og: 0, grilled: 0, tenders: 0 },
    waste: { sammy: 0, og: 0, grilled: 0, tenders: 0 },
    oil: { fries: false, leftChicken: false, rightChicken: false }
  },
  {
    date: '2026-06-03',
    eod: { sammy: 5, og: 4.75, grilled: 5, tenders: 6.75, thawingTenders: 0, boxedTenders: 5 },
    delivery: { dark: 0, tenders: 0 },
    prep: { sammy: 0, og: 0, grilled: 0, tenders: 0 },
    waste: { sammy: 0, og: 0, grilled: 0, tenders: 0 },
    oil: { fries: false, leftChicken: false, rightChicken: false }
  }
];

export const getEmptyLog = (date) => ({
  date,
  eod: { sammy: '', og: '', grilled: '', tenders: '', thawingTenders: '', boxedTenders: '' },
  delivery: { dark: '', tenders: '' },
  prep: { sammy: '', og: '', grilled: '', tenders: '' },
  waste: { sammy: '', og: '', grilled: '', tenders: '' },
  oil: { fries: false, leftChicken: false, rightChicken: false }
});
