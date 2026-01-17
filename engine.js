function login() {
    const pass = document.getElementById('pass').value;
    const correctPass = 'Soikat@#12'; 
    
    if(pass === correctPass) {
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('mainApp').style.display = 'block';
        if (typeof init === "function") init(); 
    } else { 
        const err = document.getElementById('errorMsg');
        err.style.display = 'block';
        setTimeout(() => { err.style.display = 'none'; }, 2000);
    }
}

// ২. ভিজ্যুয়াল ঠিক করা (object Object সমস্যা সমাধান)
function getVisuals(n) {
    n = parseInt(n);
    let res = { dots: '', name: '', hex: '', size: n >= 5 ? 'BIG' : 'SMALL' };
    
    // ডাইনামিক ডট জেনারেশন
    if (n === 0) {
        res.dots = '<div class="dot-container"><span class="dot red"></span><span class="dot violet"></span></div>';
        res.name = 'RED+V'; res.hex = '#ff3e3e';
    } else if (n === 5) {
        res.dots = '<div class="dot-container"><span class="dot green"></span><span class="dot violet"></span></div>';
        res.name = 'GREEN+V'; res.hex = '#00f281';
    } else if ([1,3,7,9].includes(n)) {
        res.dots = '<div class="dot-container"><span class="dot green"></span></div>';
        res.name = 'GREEN'; res.hex = '#00f281';
    } else {
        res.dots = '<div class="dot-container"><span class="dot red"></span></div>';
        res.name = 'RED'; res.hex = '#ff3e3e';
    }
    return res;
}

// ৩. স্টেক ক্যালকুলেশন (Martingale 2.0 with Safe Limit)
function calculateNextStake() {
    const baseBet = 10;
    const multiplier = 2.5;
    const maxSafeStep = 6; // ৬ ধাপের বেশি রিস্ক নিবে না
    
    let currentStep = Math.min(state.lossStreak || 0, maxSafeStep);
    let amount = baseBet * Math.pow(multiplier, currentStep);
    
    return amount > state.balance ? state.balance : Math.round(amount);
}

// ৪. মাস্টার এআই সলভার (ফিক্সড 'সব সময় স্মল' আসা বন্ধ করতে)
function solve() {
    const history = state.bigHistory || [];
    let predictedNumber;

    // যদি হিস্ট্রি না থাকে তবে টাইম-বেসড র‍্যান্ডম নম্বর
    if (history.length < 3) {
        state.confidence = 50;
        predictedNumber = new Date().getSeconds() % 10; 
    } else {
        // ড্রাগন চেক
        let streak = 1;
        const lastType = parseInt(history[0].number) >= 5 ? 'BIG' : 'SMALL';
        
        for (let i = 1; i < Math.min(history.length, 5); i++) {
            const currentType = parseInt(history[i].number) >= 5 ? 'BIG' : 'SMALL';
            if (currentType === lastType) streak++; else break;
        }

        if (streak >= 3) { // ড্রাগন ট্রেন্ড অনুসরণ
            state.confidence = 88;
            predictedNumber = lastType === 'BIG' ? 7 : 2;
        } else { // ট্রেন্ড ফ্লিপ লজিক
            state.confidence = 75;
            const seed = parseInt(history[0].number) + (state.period % 10);
            predictedNumber = seed % 2 === 0 ? 8 : 3;
        }
    }

    const visuals = getVisuals(predictedNumber);

    // ইন্টারফেস আপডেট করার সময় .dots ব্যবহার করুন (Object সরাসরি নয়)
    return {
        number: predictedNumber,
        type: predictedNumber >= 5 ? 'BIG' : 'SMALL',
        stake: calculateNextStake(),
        visuals: visuals, // এটি অবজেক্ট
        htmlDots: visuals.dots // এটি সরাসরি এইচটিএমএল স্ট্রিং
    };
}

// ৫. ডিসপ্লে আপডেট ফাংশন (যেখানে এরর আসছিল)
function updateUI() {
    const result = solve();
    
    // ভুল পদ্ধতি: document.getElementById('display').innerHTML = result.visuals; (এর ফলে Object Object আসত)
    // সঠিক পদ্ধতি:
    document.getElementById('predictionText').innerText = result.type;
    document.getElementById('dotDisplay').innerHTML = result.htmlDots; 
    document.getElementById('stakeAmount').innerText = "Stake: " + result.stake;
}
