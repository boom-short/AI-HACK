//config.js
const API_URL = 'https://draw.ar-lottery01.com/WinGo/WinGo_30S/GetHistoryIssuePage.json';

let state = {
  market: [],
  bigHistory: [], // এখানে সবসময় ৫০০ ডাটা থাকবে
  predictions: [],
  lastPeriod: null,
  lossStreak: 0,
  currentTab: 'mine',
  stats: { w: 0, l: 0 },
  confidence: 0
};
