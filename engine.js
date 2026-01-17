const state = {
    bigHistory: [],
    lossStreak: 0,
    period: 0,
    confidence: 0
};

// --- ১. লগইন ফাংশন (আপনার অরিজিনাল পাসওয়ার্ড সহ) ---
function login() {
  const pass = document.getElementById('pass').value;
  if(pass === 'Soikat@#12') {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';
    if (typeof init === "function") init(); 
  } else { 
    document.getElementById('errorMsg').style.display = 'block';
    setTimeout(() => { document.getElementById('errorMsg').style.display = 'none'; }, 2000);
  }
}

// --- ২. ভিজ্যুয়াল ফাংশন (কালার এবং ডট দেখানোর জন্য) ---
function getVisuals(n) {
  n = parseInt(n);
  let res = { dots: '', name: '', hex: '', size: n >= 5 ? 'BIG' : 'SMALL' };
  if (n === 0) {
    res.dots = '<div class="dot-container"><span class="dot dot-red"></span><span class="dot dot-violet"></span></div>';
    res.name = 'RED+V'; res.hex = '#ff3e3e';
  } else if (n === 5) {
    res.dots = '<div class="dot-container"><span class="dot dot-green"></span><span class="dot dot-violet"></span></div>';
    res.name = 'GREEN+V'; res.hex = '#00f281';
  } else if ([1,3,7,9].includes(n)) {
    res.dots = '<div class="dot-container"><span class="dot dot-green"></span></div>';
    res.name = 'GREEN'; res.hex = '#00f281';
  } else {
    res.dots = '<div class="dot-container"><span class="dot dot-red"></span></div>';
    res.name = 'RED'; res.hex = '#ff3e3e';
  }
  return res;
}

// --- ৩. উন্নত এআই লজিকসমূহ ---

// প্যাটার্ন শনাক্তকরণ (BSBS বা BBSS)
function detectAdvancedPattern(history) {
  const results = history.slice(0, 4).map(h => parseInt(h.number) >= 5 ? 'B' : 'S').join('');
  const patterns = {
    'BSBS': 'B', // জিকজ্যাক ব্রেক
    'SBSB': 'S',
    'BBSS': 'B', // ডাবল ব্রেক
    'SSBB': 'S'
  };
  return patterns[results] || null;
}

// ট্রেন্ড শক্তি পরিমাপ (ড্রাগন চেক)
function getTrendAnalysis(history) {
  let count = 1;
  const lastType = parseInt(history[0].number) >= 5 ? 'B' : 'S';
  for (let i = 1; i < Math.min(history.length, 6); i++) {
    if ((parseInt(history[i].number) >= 5 ? 'B' : 'S') === lastType) count++;
    else break;
  }
  return { isDragon: count >= 3, type: lastType, strength: count };
}

// কোল্ড নাম্বার (যা অনেকক্ষণ আসেনি)
function getColdNumber(history, type) {
  const range = type === 'B' ? [5, 6, 7, 8, 9] : [0, 1, 2, 3, 4];
  const counts = new Array(10).fill(0);
  history.slice(0, 15).forEach(h => counts[parseInt(h.number)]++);
  
  let cold = range[0];
  let min = counts[range[0]];
  range.forEach(n => {
    if(counts[n] < min) { min = counts[n]; cold = n; }
  });
  return cold;
}

// --- ৪. মাস্টার সলভ ফাংশন (কোর ইঞ্জিন) ---

function solve() {
  const history = state.bigHistory;

  // ডেটা না থাকলে র‍্যান্ডম
  if (!history || history.length < 5) {
    state.confidence = 40;
    return Math.floor(Math.random() * 10);
  }

  const trend = getTrendAnalysis(history);
  const pattern = detectAdvancedPattern(history);
  const lastRes = parseInt(history[0].number) >= 5 ? 'B' : 'S';

  let finalType = '';

  // ক্যাসকেডিং ডিসিশন লজিক
  if (trend.isDragon && trend.strength >= 4) {
    // ড্রাগন মোড: ট্রেন্ডের সাথে চলুন
    state.confidence = 88;
    finalType = trend.type;
  } else if (pattern) {
    // স্পেশাল প্যাটার্ন মোড
    state.confidence = 82;
    finalType = pattern;
  } else {
    // ডিফল্ট: লাস্ট ট্রেন্ডের বিপরীত (Counter Logic)
    state.confidence = 65;
    finalType = lastRes === 'B' ? 'S' : 'B';
  }

  // রিকভারি মোড চেক
  if (state.lossStreak >= 1) {
    document.body.classList.add('recovery-active');
    state.confidence += 5; // সতর্কবার্তা হিসেবে
  } else {
    document.body.classList.remove('recovery-active');
  }

  return getColdNumber(history, finalType);
}

// নোট: init() ফাংশনটি আপনার ডাটা ফেচ করার জন্য ব্যবহৃত হবে।
