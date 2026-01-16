function login() {
  if(document.getElementById('pass').value === 'Soikat@#12') {
    document.getElementById('loginSection').style.display='none';
    document.getElementById('mainApp').style.display='block';
    init();
  } else {
    document.getElementById('errorMsg').style.display = 'block';
  }
}

function getVisuals(n) {
  n = parseInt(n);
  let res = { name: n % 2 === 0 ? 'RED' : 'GREEN', hex: n % 2 === 0 ? '#ff3e3e' : '#00f281', size: n >= 5 ? 'BIG' : 'SMALL' };
  if (n === 0 || n === 5) res.name += '+V';
  return res;
}

// ৫০০ ডাটার ওপর এনালাইসিস
function solve() {
  const history = state.bigHistory;
  if (history.length < 10) return Math.floor(Math.random() * 10);

  // ১. ৫০০ ডাটার ট্রেন্ড এনালাইসিস
  let bigs = history.filter(h => parseInt(h.number) >= 5).length;
  let smalls = history.length - bigs;
  
  // ২. ড্রাগন ট্রেন্ড শনাক্তকরণ
  let dragonCount = 1;
  const lastType = parseInt(history[0].number) >= 5 ? 'B' : 'S';
  for(let i=1; i<10; i++){
    if((parseInt(history[i].number) >= 5 ? 'B' : 'S') === lastType) dragonCount++;
    else break;
  }

  // ৩. সিদ্ধান্ত গ্রহণ
  if(dragonCount >= 5) {
    state.confidence = 95;
    return lastType === 'B' ? 7 : 2; // ট্রেন্ড ব্রেকিং লজিক
  }

  if(bigs > smalls + 50) { state.confidence = 88; return 3; } // Small preference
  if(smalls > bigs + 50) { state.confidence = 88; return 8; } // Big preference

  state.confidence = 75;
  return parseInt(history[0].number) >= 5 ? 1 : 6;
}
