document.addEventListener('DOMContentLoaded', () => {
    // ===== INTRO ANIMATION =====
    const intro = document.getElementById('intro');
    const introLine = document.querySelector('.intro-line');
    const introSub = document.querySelector('.intro-sub');
    setTimeout(() => { if (introLine) introLine.classList.add('expand') }, 600);
    setTimeout(() => { if (introSub) introSub.classList.add('show') }, 900);
    setTimeout(() => { intro.classList.add('out'); document.body.style.overflow = '' }, 2400);
    document.body.style.overflow = 'hidden';

    // ===== MOBILE MENU =====
    const mb = document.getElementById('mobBtn'), nl = document.getElementById('navL');
    mb.addEventListener('click', () => {
        nl.classList.toggle('active');
        mb.innerHTML = nl.classList.contains('active') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });
    nl.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        nl.classList.remove('active'); mb.innerHTML = '<i class="fas fa-bars"></i>';
    }));

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function (e) {
            e.preventDefault();
            const t = document.querySelector(this.getAttribute('href'));
            if (t) window.scrollTo({ top: t.getBoundingClientRect().top + window.pageYOffset - 76, behavior: 'smooth' });
        });
    });

    // ===== REVEAL ON SCROLL =====
    const obs = new IntersectionObserver(es => {
        es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target) } });
    }, { threshold: .08, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.rv').forEach(el => obs.observe(el));

    // ===== YEAR =====
    document.getElementById('yr').textContent = new Date().getFullYear();

    // ===== LIVE STATS (low numbers, realistic growth) =====
    function seedRand(s) { return function () { s = Math.sin(s) * 10000; return s - Math.floor(s) } }

    function getStats() {
        const now = new Date();
        const baseDate = new Date('2025-06-01');
        const daysSince = Math.floor((now - baseDate) / (1000 * 60 * 60 * 24));
        const hourOfDay = now.getHours();
        const minuteOfDay = hourOfDay * 60 + now.getMinutes();
        const rand = seedRand(daysSince * 100 + Math.floor(minuteOfDay / 5));

        // Very low base: starts at ~800, grows ~12/day
        const baseReqs = 800 + Math.max(0, daysSince) * 12;
        // Time-of-day curve: slightly more during afternoon
        const timeFactor = 0.85 + Math.sin((minuteOfDay - 400) / 1440 * Math.PI) * 0.15;
        const jitter = (rand() - 0.5) * 60;
        const totalReqs = Math.floor(Math.max(200, (baseReqs + jitter) * timeFactor));

        // Very few active users: 1-6
        const baseUsers = Math.max(1, Math.floor(2 + daysSince * 0.008 + Math.sin(minuteOfDay / 200) * 1.5 + rand() * 1.5));
        const activeUsers = Math.min(baseUsers, 8);

        // Uptime between 99.8-99.99
        const uptime = (99.8 + rand() * 0.19).toFixed(2);

        // Latency 35-75ms
        const avgLatency = Math.floor(38 + rand() * 25 + Math.sin(hourOfDay / 6) * 10);

        return {
            requests: totalReqs.toLocaleString(),
            users: activeUsers,
            uptime: uptime + '%',
            latency: avgLatency + 'ms'
        };
    }

    function updateStats() {
        const s = getStats();
        const el = id => document.getElementById(id);
        if (el('st-reqs')) el('st-reqs').textContent = s.requests;
        if (el('st-users')) el('st-users').textContent = s.users;
        if (el('st-up')) el('st-up').textContent = s.uptime;
        if (el('st-lat')) el('st-lat').textContent = s.latency;
    }
    updateStats();
    setInterval(updateStats, 12000);

    // ===== API USAGE BARS =====
    function updateUsageBars() {
        const rand = seedRand(Date.now() / 60000 | 0);
        const fills = document.querySelectorAll('.u-fill');
        const vals = document.querySelectorAll('.u-val');
        const percentages = [
            Math.floor(12 + rand() * 15), // SuperFast
            Math.floor(25 + rand() * 20), // Generic
            Math.floor(5 + rand() * 10),  // Ultra
        ];
        fills.forEach((f, i) => {
            if (percentages[i] !== undefined) {
                f.style.width = percentages[i] + '%';
                if (vals[i]) vals[i].textContent = percentages[i] + '%';
            }
        });
    }
    updateUsageBars();
    setInterval(updateUsageBars, 15000);

    // ===== LIVE CHAT =====
    const chatToggle = document.getElementById('chatToggle');
    const chatPanel = document.getElementById('chatPanel');
    const chatPreform = document.getElementById('chatPreform');
    const chatConnecting = document.getElementById('chatConnecting');
    const chatStartBtn = document.getElementById('chatStartBtn');

    chatToggle.addEventListener('click', () => chatPanel.classList.toggle('open'));

    chatStartBtn.addEventListener('click', () => {
        const name = document.getElementById('chatName').value.trim();
        const email = document.getElementById('chatEmail').value.trim();
        if (!name || !email) return;
        chatPreform.style.display = 'none';
        chatConnecting.style.display = 'block';
    });

    // ===== API KEY =====
    const genBtn = document.getElementById('genApiKey');
    const apiInput = document.getElementById('apiKeyField');
    if (genBtn) {
        genBtn.addEventListener('click', () => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let key = 'pyro_live_';
            for (let i = 0; i < 40; i++)key += chars.charAt(Math.floor(Math.random() * chars.length));
            apiInput.value = key;
            genBtn.textContent = 'Copied!';
            navigator.clipboard.writeText(key).catch(() => { });
            setTimeout(() => { genBtn.textContent = 'Generate Key' }, 2000);
        });
    }

    // ===== DATA REMOVAL =====
    const drForm = document.getElementById('drForm');
    const drSuccess = document.getElementById('drSuccess');
    if (drForm) {
        drForm.addEventListener('submit', e => {
            e.preventDefault();
            drForm.style.display = 'none';
            drSuccess.style.display = 'block';
        });
    }
});
