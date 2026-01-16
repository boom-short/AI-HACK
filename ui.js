async function fetchUpdate() {
  try {
    const r = await fetch(`${API_URL}?ts=${Date.now()}`);
    const d = await r.json();
    if(d.code === 0 && d.data.list) {
      const newList = d.data.list;
      const latestIssue = newList[0].issueNumber;

      if(latestIssue !== state.lastPeriod) {
        // --- ৫০০ ডাটা সিঙ্কিং ---
        if(state.bigHistory.length === 0) {
          state.bigHistory = newList.slice(0, 500);
        } else {
          // নতুন ডাটা ঢুকবে, পুরনো ডিলিট হবে (১ সেকেন্ডের মধ্যে)
          newList.reverse().forEach(item => {
            if(BigInt(item.issueNumber) > BigInt(state.lastPeriod || 0)) {
              state.bigHistory.unshift(item);
              if(state.bigHistory.length > 500) state.bigHistory.pop();
            }
          });
        }

        // --- উইন/লস চেক ---
        if(state.predictions.length > 0 && state.predictions[0].status === 'PENDING') {
          const p = state.predictions[0];
          const actNum = parseInt(newList.find(x => x.issueNumber === p.period)?.number || newList[0].number);
          const isWin = (actNum >= 5 && p.size === 'BIG') || (actNum < 5 && p.size === 'SMALL');
          p.status = isWin ? 'WIN' : 'LOSS';
          p.actualNum = actNum;
          if(isWin) { state.stats.w++; state.lossStreak = 0; }
          else { state.stats.l++; state.lossStreak++; }
          refreshStats();
        }

        // --- নতুন প্রেডিকশন ---
        const nextP = String(BigInt(latestIssue) + 1n);
        const pNum = solve();
        const pVis = getVisuals(pNum);
        state.predictions.unshift({ period: nextP, num: pNum, size: pVis.size, status: 'PENDING', actualNum: '?' });
        if(state.predictions.length > 100) state.predictions.pop();

        // UI Update
        document.getElementById('periodId').textContent = nextP.slice(-5);
        document.getElementById('predValue').innerHTML = `${pVis.size} (${pNum})`;
        document.getElementById('predValue').style.color = pVis.hex;
        document.getElementById('confidenceLevel').textContent = `Confidence: ${state.confidence}%`;
        
        state.lastPeriod = latestIssue;
      }
      render();
    }
  } catch(e) { console.log("Re-syncing..."); }
}

function refreshStats() {
  document.getElementById('stW').textContent = state.stats.w;
  document.getElementById('stL').textContent = state.stats.l;
  document.getElementById('stS').textContent = state.lossStreak;
  const total = state.stats.w + state.stats.l;
  document.getElementById('stA').textContent = total > 0 ? Math.round((state.stats.w/total)*100)+'%' : '0%';
  document.body.classList.toggle('recovery-active', state.lossStreak >= 1);
}

function render() {
  const body = document.getElementById('hBody');
  const head = document.getElementById('hHead');
  body.innerHTML = "";
  if(state.currentTab === 'mine') {
    head.innerHTML = "<tr><th>Period</th><th>Pred</th><th>Real</th><th>Res</th></tr>";
    state.predictions.filter(p => p.status !== 'PENDING').slice(0, 10).forEach(i => {
      body.innerHTML += `<tr><td>${i.period.slice(-4)}</td><td>${i.size}</td><td>${i.actualNum}</td><td><span class="badge-${i.status.toLowerCase()}">${i.status}</span></td></tr>`;
    });
  } else {
    head.innerHTML = "<tr><th>Period</th><th>Num</th><th>Size</th></tr>";
    state.bigHistory.slice(0, 15).forEach(m => {
      body.innerHTML += `<tr><td>${m.issueNumber.slice(-4)}</td><td>${m.number}</td><td>${parseInt(m.number)>=5?'BIG':'SMALL'}</td></tr>`;
    });
  }
}

function switchTab(t) {
  state.currentTab = t;
  document.getElementById('tMine').classList.toggle('active', t==='mine');
  document.getElementById('tMarket').classList.toggle('active', t==='market');
  render();
}

function init() {
  fetchUpdate();
  setInterval(fetchUpdate, 1000); // ১ সেকেন্ড স্পিড
  setInterval(() => {
    const rem = 30 - (new Date().getSeconds() % 30);
    document.getElementById('timer').textContent = "00:" + (rem < 10 ? "0"+rem : rem);
  }, 1000);
    }
