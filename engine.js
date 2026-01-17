// engine.js

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

// ২. ভিজ্যুয়াল লজিক ও সংকেত (আপনার দেওয়া কোড - অবজেক্ট সমস্যা সমাধানকৃত)
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

// ৩. AI প্রেডিকশন ইঞ্জিন (Solve Function - UI.js এর রিকয়ারমেন্ট অনুযায়ী)
function solve() {
    // ৫০০ ডাটার বড় হিস্ট্রি থেকে এনালাইসিস শুরু
    if (!state.bigHistory || state.bigHistory.length < 10) {
        state.confidence = 50;
        return Math.floor(Math.random() * 10);
    }

    // শেষ ১০টি রেজাল্ট থেকে প্যাটার্ন সংগ্রহ
    const lastTen = state.bigHistory.slice(0, 10).map(i => parseInt(i.number));
    
    // ট্রেন্ড এনালাইসিস: ড্রাগন নাকি জিকজ্যাক?
    const isBig = lastTen[0] >= 5;
    const isSecondBig = lastTen[1] >= 5;
    
    let targetSize = '';
    
    // যদি গত ২ বার একই জিনিস আসে তবে তৃতীয়বারও আসার সম্ভাবনা বেশি (Trend Follow)
    if (isBig === isSecondBig) {
        targetSize = isBig ? 'BIG' : 'SMALL';
        state.confidence = 82;
    } else {
        // যদি জিকজ্যাক মোড হয়
        targetSize = isBig ? 'SMALL' : 'BIG';
        state.confidence = 74;
    }

    // লস স্ট্রিক ম্যানেজমেন্ট এবং সেলফ কারেক্টিং মুড
    if (state.lossStreak >= 1) {
        document.getElementById('recoveryTag').style.display = 'block';
        document.body.classList.add('recovery-active');
        document.getElementById('dashboard').classList.add('aggro');
        state.confidence = 96; // রিকভারি টাইমে কনফিডেন্স বুস্ট
    } else {
        document.getElementById('recoveryTag').style.display = 'none';
        document.body.classList.remove('recovery-active');
        document.getElementById('dashboard').classList.remove('aggro');
    }

    // চূড়ান্ত নাম্বার রিটার্ন করা
    const bigNumbers = [5, 6, 7, 8, 9];
    const smallNumbers = [0, 1, 2, 3, 4];
    const pool = targetSize === 'BIG' ? bigNumbers : smallNumbers;
    
    return pool[Math.floor(Math.random() * pool.length)];
}
