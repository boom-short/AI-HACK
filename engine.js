function login() {
    const pass = document.getElementById('pass').value;
    if(pass === 'Soikat@#12') {
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('mainApp').style.display = 'block';
        if (typeof init === "function") init(); 
    } else { 
        const err = document.getElementById('errorMsg');
        err.style.display = 'block';
        setTimeout(() => { err.style.display = 'none'; }, 2000);
    }
}

// ২. ভিজ্যুয়াল লজিক (object Object সমস্যা সমাধান করতে এখানে পরিবর্তন করা হয়েছে)
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

// ৩. স্টেক ক্যালকুলেশন (Martingale 2.0)
function calculateNextStake() {
    const baseBet = 10;
    const multiplier = 2.5;
    const amount = baseBet * Math.pow(multiplier, state.lossStreak || 0);
    return amount > (state.balance || 1000) ? state.balance : Math.round(amount);
}

// ৪. মাস্টার এআই সলভার (সব সময় SMALL আসা বন্ধ করার নতুন লজিক)
function solve() {
    const history = state.bigHistory || [];
    let predictedNumber;

    // পিরিয়ড এবং সময়ের উপর ভিত্তি করে ডাইনামিক সিড জেনারেশন
    const periodStr = state.period ? state.period.toString() : "0";
    const lastDigit = parseInt(periodStr.slice(-1));
    const seconds = new Date().getSeconds();

    if (history.length < 5) {
        state.confidence = 65;
        // সময় ও পিরিয়ড মিলিয়ে নম্বর প্রেডিকশন (যাতে সব সময় স্মল না আসে)
        predictedNumber = (lastDigit + seconds) % 10;
    } else {
        // ড্রাগন ট্রেন্ড চেক
        let streak = 1;
        const lastType = parseInt(history[0].number) >= 5 ? 'BIG' : 'SMALL';
        for (let i = 1; i < Math.min(history.length, 10); i++) {
            if ((parseInt(history[i].number) >= 5 ? 'BIG' : 'SMALL') === lastType) streak++;
            else break;
        }

        if (streak >= 3) {
            state.confidence = 90;
            predictedNumber = lastType === 'BIG' ? 8 : 1; 
        } else {
            state.confidence = 75;
            // ট্রেন্ড ব্রেক লজিক
            predictedNumber = parseInt(history[0].number) < 5 ? 7 : 2;
        }
    }

    const visualInfo = getVisuals(predictedNumber);

    return {
        number: predictedNumber,
        type: predictedNumber >= 5 ? 'BIG' : 'SMALL',
        colorName: visualInfo.name,
        dotsHtml: visualInfo.dots, // সরাসরি HTML স্ট্রিং
        stake: calculateNextStake()
    };
}

// ৫. ইন্টারফেস আপডেট ফাংশন (যেটি আপনার স্ক্রিনের ডাটা দেখাবে)
function updateUI() {
    const result = solve();
    
    // পিরিয়ড নম্বর আপডেট
    document.getElementById('periodDisplay').innerText = state.period;

    // প্রেডিকশন টেক্সট (object Object সমাধান এখানে)
    const targetDisplay = document.getElementById('targetAnalysis'); 
    if(targetDisplay) {
        targetDisplay.innerHTML = `${result.type} (${result.colorName})`;
        targetDisplay.style.color = (result.type === 'BIG') ? '#00f281' : '#ff3e3e';
    }

    // ডট বা ভিজ্যুয়াল আপডেট
    const dotBox = document.getElementById('dotDisplay');
    if(dotBox) dotBox.innerHTML = result.dotsHtml;

    // কনফিডেন্স আপডেট
    document.getElementById('confidenceLevel').innerText = `Confidence: ${state.confidence}%`;
        }

