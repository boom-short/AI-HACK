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

// --- নতুন ২০২৬ রিস্ক ম্যানেজমেন্ট (Martingale 2.0) ---
function calculateNextStake() {
    const baseBet = 10; // আপনার বেজ বেট
    const multiplier = 2.5; // Martingale 2.0
    // state.lossStreak অন্য ফাইল থেকে অটোমেটিক রিড হবে
    const amount = baseBet * Math.pow(multiplier, state.lossStreak || 0);
    return amount > (state.balance || 1000) ? state.balance : amount;
}

// --- মাস্টার এআই সলভার (সব বিশেষজ্ঞ বাদ দিয়ে নতুন লজিক) ---

function solve() {
  // state.bigHistory সরাসরি অন্য ফাইল থেকে এক্সেস হচ্ছে
  const history = state.bigHistory; 

  if (!history || history.length < 5) {
    state.confidence = 50;
    return { pick: 'WAIT', number: Math.floor(Math.random() * 10), stake: calculateNextStake() };
  }

  // ১. ড্রাগন ট্রেন্ড শনাক্তকরণ (Dragon Trend Logic)
  let streak = 1;
  const lastType = parseInt(history[0].number) >= 5 ? 'BIG' : 'SMALL';
  for (let i = 1; i < Math.min(history.length, 10); i++) {
    const currentType = parseInt(history[i].number) >= 5 ? 'BIG' : 'SMALL';
    if (currentType === lastType) streak++;
    else break;
  }

  let predictedNumber;
  
  // লজিক ১: যদি ড্রাগন ট্রেন্ড ৪ এর বেশি হয় (High Confidence 90%+)
  if (streak >= 4) {
    state.confidence = 92;
    predictedNumber = lastType === 'BIG' ? 8 : 2; 
  } 
  // লজিক ২: যদি ট্রেন্ড ব্রেক হওয়ার সম্ভাবনা থাকে (Volatility Logic)
  else if (streak === 1) {
    state.confidence = 80;
    // আগেরটা ছোট হলে এবার বড় হওয়ার সম্ভাবনা
    predictedNumber = parseInt(history[0].number) < 5 ? 7 : 3;
  }
  // লজিক ৩: ডিফল্ট সেফ জোন (Fibonacci Reset)
  else {
    state.confidence = 70;
    const periodStr = state.period ? state.period.toString() : "0";
    const lastDigit = parseInt(periodStr.slice(-1));
    predictedNumber = lastDigit % 2 === 0 ? 6 : 1;
  }

  // রেজাল্ট রিটার্ন
  return {
    number: predictedNumber,
    type: predictedNumber >= 5 ? 'BIG' : 'SMALL',
    stake: calculateNextStake(),
    visuals: getVisuals(predictedNumber)
  };
        }
