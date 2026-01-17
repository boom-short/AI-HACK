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

function getTrendStrength(history) {
  let count = 1;
  const lastType = parseInt(history[0].number) >= 5 ? 'B' : 'S';
  for (let i = 1; i < Math.min(history.length, 10); i++) {
    if ((parseInt(history[i].number) >= 5 ? 'B' : 'S') === lastType) count++;
    else break;
  }
  return {
    isDragon: count >= 3, // ৩ বারের বেশি হলে ড্রাগন মুড
    count: count,
    confidence: count * 0.20,
    trendResult: lastType === 'B' ? 8 : 2
  };
}

function detectFakePattern(history) {
  const results = history.slice(0, 5).map(h => parseInt(h.number) >= 5 ? 'B' : 'S');
  
  // ১. জিক-জ্যাক ফাঁদ (B-S-B-S)
  const isZigZag = results[0] !== results[1] && results[1] !== results[2] && results[2] !== results[3];
  
  // ২. জোড়ায় জোড়ায় ফাঁদ (B-B-S-S)
  const isDoubleDouble = results[0] === results[1] && results[1] !== results[2] && results[2] === results[3];

  return {
    isZigZag: isZigZag,
    isDoubleDouble: isDoubleDouble,
    isTrapDetected: isZigZag || isDoubleDouble
  };
}

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

  const isLoss = state.lossStreak >= 1;
  document.body.classList.toggle('recovery-active', isLoss);
  if(document.getElementById('recoveryTag')) {
      document.getElementById('recoveryTag').style.display = isLoss ? 'block' : 'none';
  }

  if (!history || history.length < 5) {
    state.confidence = 50;
    return Math.floor(Math.random() * 10);
  }

  const exp1 = getVolatilityScore(history); // অস্থিরতা
  const exp2 = getTrendStrength(history);   // ট্রেন্ড
  const exp3 = detectFakePattern(history); // ফাঁদ
  const exp4 = fibonacciAnalysis();         // টাইম

  const results = history.slice(0, 5).map(h => parseInt(h.number) >= 5 ? 'B' : 'S');

  // ১. ড্রাগন ট্রেন্ড (একদিকে টানা) - সবচেয়ে হাই প্রায়োরিটি
  if (exp2.isDragon) {
    state.confidence = 98;
    // মার্কেট যেটা দিচ্ছে সেটাই দিন (স্মল দিলে স্মল, বিগ দিলে বিগ)
    const options = results[0] === 'B' ? [6, 7, 8, 9] : [1, 2, 3, 4];
    return options[Math.floor(Math.random() * options.length)];
  }

  // ২. জিক-জ্যাক ফাঁদ (B-S-B-S) হ্যান্ডলিং
  if (exp3.isZigZag) {
    state.confidence = 95;
    // নাচানাচি করলে লাস্টের ঠিক উল্টোটা দিন
    return results[0] === 'B' ? 2 : 7;
  }

  // ৩. জোড়ায় জোড়ায় ফাঁদ (B-B-S-S) হ্যান্ডলিং
  if (exp3.isDoubleDouble) {
    state.confidence = 92;
    // জোড়া ভাঙার সময় হয়েছে, তাই লাস্টের উল্টোটা ধরুন
    return results[0] === 'B' ? 3 : 8;
  }

  // ৪. ডাইনামিক ডিসিশন (মার্কেট কন্ডিশন অনুযায়ী)
  if (exp1.score > 0.7) {
    state.confidence = 80;
    return exp1.counterLogic;
  } else if (exp4.isFibTime) {
    state.confidence = 75;
    return exp4.recommendation;
  }

  // ডিফল্ট: মার্কেট যা দিচ্ছে তার ছায়া অনুসরণ (Sticky Logic)
  state.confidence = 70;
  return results[0] === 'B' ? 8 : 1;
    }
  
