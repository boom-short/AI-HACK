//engine.js

function login() {
  const pass = document.getElementById('pass').value;
  if(pass === 'Soikat@#12') {
    document.getElementById('loginSection').style.display='none';
    document.getElementById('mainApp').style.display='block';
    if (typeof init === "function") init(); 
  } else { 
    document.getElementById('errorMsg').style.display = 'block';
    setTimeout(() => { document.getElementById('errorMsg').style.display = 'none'; }, 2000);
  }
}

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

// --- ৪টি বিশেষজ্ঞ এআই এর আলাদা ফাংশন ---

// ১. Volatility Scout (অস্থিরতা পরিমাপ)
function getVolatilityScore(history) {
  let changes = 0;
  const limit = Math.min(history.length, 10);
  for (let i = 0; i < limit - 1; i++) {
    const curr = parseInt(history[i].number) >= 5 ? 'B' : 'S';
    const prev = parseInt(history[i+1].number) >= 5 ? 'B' : 'S';
    if (curr !== prev) changes++;
  }
  return {
    score: changes / (limit - 1),
    counterLogic: parseInt(history[0].number) >= 5 ? 2 : 7 
  };
}

// ২. Trend Watcher (ড্রাগন ট্রেন্ড শনাক্তকরণ)
function getTrendStrength(history) {
  let count = 1;
  const lastType = parseInt(history[0].number) >= 5 ? 'B' : 'S';
  for (let i = 1; i < Math.min(history.length, 10); i++) {
    if ((parseInt(history[i].number) >= 5 ? 'B' : 'S') === lastType) count++;
    else break;
  }
  return {
    isDragon: count >= 4,
    confidence: count * 0.15,
    trendResult: lastType === 'B' ? 8 : 2
  };
}

// ৩. Fake Pattern Detector (ট্র্যাপ শনাক্তকরণ)
function detectFakePattern(history) {
  const lastThree = history.slice(0, 3).map(h => parseInt(h.number) >= 5 ? 'B' : 'S');
  const isTrap = (lastThree[1] === lastThree[2]) && (lastThree[0] !== lastThree[1]);
  return {
    isTrapDetected: isTrap,
    safeExit: lastThree[1] === 'B' ? 7 : 2 
  };
}

// ৪. Fibonacci Time Analyst (টাইম সিরিজ বিশ্লেষণ)
function fibonacciAnalysis() {
  const period = state.period ? state.period.toString() : "0";
  const lastDigit = parseInt(period.slice(-1));
  const fibSeries = [0, 1, 2, 3, 5, 8];
  return {
    isFibTime: fibSeries.includes(lastDigit),
    recommendation: lastDigit % 2 === 0 ? 3 : 6 
  };
}

// --- মাস্টার এআই (কোর ইঞ্জিন) ---

function solve() {
  const history = state.bigHistory; 

  // রিকভারি মোড UI আপডেট (লস হলে ড্যাশবোর্ড এগ্রেসিভ হবে)
  const isLoss = state.lossStreak >= 1;
  document.body.classList.toggle('recovery-active', isLoss);
  if(document.getElementById('recoveryTag')) {
      document.getElementById('recoveryTag').style.display = isLoss ? 'block' : 'none';
  }

  // হিস্ট্রি না থাকলে র‍্যান্ডম প্রেডিকশন
  if (!history || history.length < 5) {
    state.confidence = 50;
    return Math.floor(Math.random() * 10);
  }

  const exp1 = getVolatilityScore(history);
  const exp2 = getTrendStrength(history);
  const exp3 = detectFakePattern(history);
  const exp4 = fibonacciAnalysis();

  // ১. ড্রাগন ট্রেন্ড প্রায়োরিটি (সবচেয়ে কার্যকর)
  if (exp2.isDragon && exp2.confidence > 0.7) {
    state.confidence = 90;
    return exp2.trendResult; 
  }

  // ২. ট্র্যাপ ডিটেক্টর প্রায়োরিটি
  if (exp3.isTrapDetected) {
    state.confidence = 85;
    return exp3.safeExit;
  }

  // ৩. ডাইনামিক ওয়েটেড ডিসিশন (মার্কেট কন্ডিশন অনুযায়ী)
  let pNum;
  if (exp1.score > 0.7) {
    // অস্থির মার্কেটে কাউন্টার লজিক
    pNum = exp1.counterLogic;
    state.confidence = 80;
  } else if (exp4.isFibTime) {
    // ফিবোনাচ্চি পিরিয়ড রিসেট লজিক
    pNum = exp4.recommendation;
    state.confidence = 75;
  } else {
    // সাধারণ ক্যালকুলেশন (রেন্ডমাইজড সেফ জোন)
    const lastNum = parseInt(history[0].number);
    const options = lastNum >= 5 ? [6, 7, 8] : [1, 2, 3];
    pNum = options[Math.floor(Math.random() * options.length)];
    state.confidence = 70;
  }

  return Math.round(pNum);
        }
