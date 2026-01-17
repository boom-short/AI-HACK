  //ui.js
  async function fetchUpdate() {
  try {
    const r = await fetch(`${API_URL}?ts=${Date.now()}`);
    const d = await r.json();
    if(d.code === 0) {
      const list = d.data.list;
      if(list[0].issueNumber !== state.lastPeriod) {
        state.bigHistory = list;

        if(state.predictions.length > 0 && state.predictions[0].status === 'PENDING') {
          const p = state.predictions[0];
          const actNum = parseInt(list[0].number);
          const actVis = getVisuals(actNum);
          const predVis = getVisuals(p.num);
          
          p.actualNum = actNum;
          if(p.num === actNum || predVis.size === actVis.size) {
            p.status = 'WIN'; state.stats.w++; state.lossStreak = 0;
          } else {
            p.status = 'LOSS'; state.stats.l++; state.lossStreak++;
          }
          refreshStats();
        }

        const nextP = String(BigInt(list[0].issueNumber) + 1n);
        const pNum = solve();
        const pVis = getVisuals(pNum);
        
        state.predictions.unshift({ 
          period: nextP, 
          num: pNum, 
          size: pVis.size, 
          color: pVis.name, 
          status: 'PENDING', 
          actualNum: '?' 
        });
        
        document.getElementById('periodId').textContent = nextP.slice(-5);
        const pVal = document.getElementById('predValue');
        pVal.innerHTML = `${pVis.size} (${pNum}) <br><span style="font-size:12px; color:${pVis.hex}">${pVis.name}</span>`;
        pVal.style.color = pVis.hex;
        document.getElementById('confidenceLevel').textContent = `Confidence: ${state.confidence}%`;
        
        state.lastPeriod = list[0].issueNumber;
      }
      state.market = list;
      render();
    }
  } catch(e){}
}

function updateTimer() {
  const sec = new Date().getSeconds();
  const rem = 30 - (sec % 30);
  document.getElementById('timer').textContent = "00:" + (rem < 10 ? "0"+rem : rem);
  if(rem === 1) fetchUpdate();
}

function refreshStats() {
  document.getElementById('stW').textContent = state.stats.w;
  document.getElementById('stL').textContent = state.stats.l;
  document.getElementById('stS').textContent = state.lossStreak;
  const total = state.stats.w + state.stats.l;
  document.getElementById('stA').textContent = total > 0 ? Math.round((state.stats.w/total)*100)+'%' : '0%';
}

function render() {
  const body = document.getElementById('hBody');
  const head = document.getElementById('hHead');
  body.innerHTML = "";

  if(state.currentTab === 'mine') {
    head.innerHTML = "<tr><th>Period</th><th>Prediction</th><th>Actual</th><th>Result</th></tr>";
    state.predictions.filter(p => p.status !== 'PENDING').slice(0, 15).forEach(i => {
      body.innerHTML += `<tr>
        <td>${i.period.slice(-4)}</td>
        <td style="font-weight:700">${i.size} (${i.num})</td>
        <td style="font-weight:700">${i.actualNum}</td>
        <td><span class="${i.status === 'WIN' ? 'badge-win' : 'badge-loss'}">${i.status}</span></td>
      </tr>`;
    });
  } else {
    head.innerHTML = "<tr><th>Period</th><th>Number</th><th>Visual</th><th>Size</th></tr>";
    state.market.slice(0, 15).forEach(m => {
      const v = getVisuals(m.number);
      body.innerHTML += `<tr>
        <td>${m.issueNumber.slice(-4)}</td>
        <td style="font-weight:700">${m.number}</td>
        <td>${v.dots} ${v.name}</td>
        <td>${v.size}</td>
      </tr>`;
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
  setInterval(fetchUpdate, 2000);
  setInterval(updateTimer, 1000);
}
