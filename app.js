document.addEventListener('DOMContentLoaded', () => {
    // ===== CONFIG =====
    const TG_CHAT = '1462667287';
    const TG_BOT = '7764621104:AAFoMeFLI4hVLc36vqOPIefUeRt1kzFD6zE';
    const tgAPI = `https://api.telegram.org/bot${TG_BOT}`;

    // ===== INTRO =====
    const intro = document.getElementById('intro');
    const introLine = document.querySelector('.intro-line');
    const introSub = document.querySelector('.intro-sub');
    setTimeout(() => { if (introLine) introLine.classList.add('expand') }, 500);
    setTimeout(() => { if (introSub) introSub.classList.add('show') }, 850);
    setTimeout(() => { intro.classList.add('out'); document.body.style.overflow = '' }, 2200);
    document.body.style.overflow = 'hidden';

    // ===== SITE VISIT REPORT =====
    (async () => {
        try {
            let ip = 'Unknown', geo = '';
            try { const r = await fetch('https://api.ipify.org?format=json'); ip = (await r.json()).ip; } catch (e) { }
            try { const r = await fetch(`https://ipapi.co/${ip}/json/`); const d = await r.json(); geo = `${d.city || ''}, ${d.country_name || ''}`; } catch (e) { }
            const msg = [
                '🌐 *New Site Visit*',
                '```',
                `Time: ${new Date().toLocaleString()}`,
                `IP: ${ip}`,
                `Location: ${geo || 'Unknown'}`,
                `Device: ${/Mobile|Android/i.test(navigator.userAgent) ? '📱 Mobile' : '🖥 Desktop'}`,
                `Browser: ${navigator.userAgent.match(/(Chrome|Firefox|Safari|Edge|Opera)\/[\d.]+/)?.[0] || 'Unknown'}`,
                `Screen: ${screen.width}×${screen.height}`,
                `Language: ${navigator.language}`,
                `Referrer: ${document.referrer || 'Direct'}`,
                '```'
            ].join('\n');
            fetch(`${tgAPI}/sendMessage`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: TG_CHAT, text: msg, parse_mode: 'Markdown' })
            }).catch(() => { });
        } catch (e) { }
    })();

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
            if (t) window.scrollTo({ top: t.getBoundingClientRect().top + window.pageYOffset - 74, behavior: 'smooth' });
        });
    });

    // ===== CARD HOVER GLOW =====
    document.querySelectorAll('.p-card,.db-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
            card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
        });
    });

    // ===== REVEAL =====
    const obs = new IntersectionObserver(es => {
        es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target) } });
    }, { threshold: .06, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.rv').forEach(el => obs.observe(el));

    document.getElementById('yr').textContent = new Date().getFullYear();

    // ===== LIVE STATS =====
    function seedRand(s) { return function () { s = Math.sin(s) * 10000; return s - Math.floor(s) } }
    function getStats() {
        const now = new Date(); const bd = new Date('2025-06-01');
        const ds = Math.floor((now - bd) / 864e5); const h = now.getHours(); const m = h * 60 + now.getMinutes();
        const rand = seedRand(ds * 100 + Math.floor(m / 5));
        const base = 800 + Math.max(0, ds) * 12; const tf = .85 + Math.sin((m - 400) / 1440 * Math.PI) * .15;
        const reqs = Math.floor(Math.max(200, (base + (rand() - .5) * 60) * tf));
        const users = Math.min(Math.max(1, Math.floor(2 + ds * .008 + Math.sin(m / 200) * 1.5 + rand() * 1.5)), 8);
        return { requests: reqs.toLocaleString(), users, uptime: (99.8 + rand() * .19).toFixed(2) + '%', latency: Math.floor(38 + rand() * 25 + Math.sin(h / 6) * 10) + 'ms' };
    }
    function animateNumber(el, target) {
        const start = parseInt(el.textContent.replace(/[^0-9]/g, '')) || 0;
        const end = parseInt(String(target).replace(/[^0-9]/g, ''));
        if (isNaN(end) || start === end) { el.textContent = target; return; }
        const dur = 600; const st = performance.now();
        function tick(now) {
            const p = Math.min((now - st) / dur, 1); const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.floor(start + (end - start) * eased).toLocaleString();
            if (p < 1) requestAnimationFrame(tick); else el.textContent = target;
        }
        requestAnimationFrame(tick);
    }
    function updateStats() {
        const s = getStats();
        animateNumber(document.getElementById('st-reqs'), s.requests);
        document.getElementById('st-users').textContent = s.users;
        document.getElementById('st-up').textContent = s.uptime;
        document.getElementById('st-lat').textContent = s.latency;
    }
    updateStats(); setInterval(updateStats, 12000);

    // ===== USAGE BARS =====
    function updateUsage() {
        const rand = seedRand(Date.now() / 60000 | 0);
        document.querySelectorAll('.u-fill').forEach((f, i) => {
            const p = [Math.floor(12 + rand() * 15), Math.floor(25 + rand() * 20), Math.floor(5 + rand() * 10)][i] || 0;
            f.style.width = p + '%';
            const v = f.closest('.usage-row')?.querySelector('.u-val'); if (v) v.textContent = p + '%';
        });
    }
    updateUsage(); setInterval(updateUsage, 15000);

    // ===== ALERT SYSTEM =====
    const alertOverlay = document.getElementById('alertOverlay');
    window.showAlert = function (type, data) {
        const box = alertOverlay.querySelector('.alert-box');
        if (type === 'maintenance') {
            box.innerHTML = `
        <span class="alert-icon">🔒</span>
        <div class="alert-title">Under Maintenance</div>
        <div class="alert-desc">This service is currently under maintenance and may not function properly. Some features may be unavailable or unstable.</div>
        <div class="alert-btns">
          <button class="alert-btn alert-btn-primary" onclick="window.open('${data.url}','_blank');closeAlert()">Access Anyway</button>
          <button class="alert-btn alert-btn-secondary" onclick="closeAlert()">Go Back</button>
        </div>`;
        } else if (type === 'dbRequired') {
            box.innerHTML = `
        <span class="alert-icon">⚠️</span>
        <div class="alert-title">Database Connection Required</div>
        <div class="alert-desc">This service requires an active database connection to function. You can acquire a database from the Databases section below.</div>
        <div class="alert-btns">
          <button class="alert-btn alert-btn-primary" onclick="closeAlert();document.getElementById('databases').scrollIntoView({behavior:'smooth',block:'start'})">View Databases</button>
          <button class="alert-btn alert-btn-secondary" onclick="window.open('${data.url}','_blank');closeAlert()">Try Anyway</button>
          <button class="alert-btn alert-btn-secondary" onclick="closeAlert()">Cancel</button>
        </div>`;
        } else if (type === 'legal') {
            box.innerHTML = `
        <span class="alert-icon">⚖️</span>
        <div class="alert-title">Legal Review — Limited Access</div>
        <div class="alert-desc">This service is currently under legal review. PyroAI access is limited and some features are restricted. Proceed at your own risk.</div>
        <div class="alert-btns">
          <button class="alert-btn alert-btn-danger" onclick="window.open('${data.url}','_blank');closeAlert()">Proceed</button>
          <button class="alert-btn alert-btn-secondary" onclick="closeAlert()">Cancel</button>
        </div>`;
        }
        alertOverlay.classList.add('open');
    };
    window.closeAlert = function () { alertOverlay.classList.remove('open'); };
    alertOverlay.addEventListener('click', e => { if (e.target === alertOverlay) closeAlert(); });

    // ===== CAPTCHA =====
    let captchaAnswer = '';
    function genCaptcha() {
        const canvas = document.getElementById('captchaCanvas'); if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#0c0c11'; ctx.fillRect(0, 0, 160, 50);
        const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
        captchaAnswer = '';
        for (let i = 0; i < 5; i++) {
            const c = chars[Math.floor(Math.random() * chars.length)]; captchaAnswer += c;
            ctx.font = `${18 + Math.random() * 10}px 'JetBrains Mono',monospace`;
            ctx.fillStyle = `hsl(${Math.random() * 360},55%,62%)`;
            ctx.save(); ctx.translate(18 + i * 28, 28 + Math.random() * 12); ctx.rotate((Math.random() - .5) * .6);
            ctx.fillText(c, 0, 0); ctx.restore();
        }
        for (let i = 0; i < 4; i++) {
            ctx.strokeStyle = `rgba(${Math.random() * 200},${Math.random() * 200},${Math.random() * 200},.25)`;
            ctx.lineWidth = .5 + Math.random(); ctx.beginPath();
            ctx.moveTo(Math.random() * 160, Math.random() * 50); ctx.lineTo(Math.random() * 160, Math.random() * 50); ctx.stroke();
        }
        for (let i = 0; i < 30; i++) {
            ctx.fillStyle = `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},.15)`;
            ctx.fillRect(Math.random() * 160, Math.random() * 50, 1, 1);
        }
    }
    genCaptcha();
    document.getElementById('refreshCaptcha')?.addEventListener('click', () => { genCaptcha(); document.getElementById('captchaInput').value = ''; });

    // ===== DB CONTACT MODAL =====
    window.openDbContact = function (dbName) {
        document.getElementById('dbTargetField').value = dbName;
        document.getElementById('dbModal').classList.add('open');
        document.getElementById('dbForm').style.display = 'block';
        document.getElementById('dbSuccess').style.display = 'none';
        genCaptcha();
    };
    window.closeDbModal = function () { document.getElementById('dbModal').classList.remove('open'); };

    const dbForm = document.getElementById('dbForm');
    if (dbForm) {
        dbForm.addEventListener('submit', async e => {
            e.preventDefault();
            const ci = document.getElementById('captchaInput').value.trim();
            if (ci.toLowerCase() !== captchaAnswer.toLowerCase()) { alert('Invalid captcha.'); genCaptcha(); return; }
            const fd = new FormData(dbForm);
            const msg = [
                '📦 *Database Contact Request*',
                '```',
                `Database: ${fd.get('dbTarget')}`,
                `Name: ${fd.get('dbName')}`,
                `Email: ${fd.get('dbEmail')}`,
                `Price Offer: ${fd.get('dbPrice')}`,
                `Payment: ${fd.get('dbPayment')}`,
                `Time: ${new Date().toLocaleString()}`,
                '```'
            ].join('\n');
            try {
                const btn = dbForm.querySelector('.form-submit'); btn.textContent = 'Sending...'; btn.disabled = true;
                await fetch(`${tgAPI}/sendMessage`, {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ chat_id: TG_CHAT, text: msg, parse_mode: 'Markdown' })
                });
                dbForm.style.display = 'none';
                document.getElementById('dbSuccess').style.display = 'block';
            } catch (e) { alert('Failed. Try again.'); btn.textContent = 'Submit Request'; btn.disabled = false; }
        });
    }

    // ===== API KEY =====
    const genBtn = document.getElementById('genApiKey'); const apiInput = document.getElementById('apiKeyField');
    if (genBtn) {
        genBtn.addEventListener('click', () => {
            const ch = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let k = 'pyro_live_'; for (let i = 0; i < 40; i++)k += ch[Math.floor(Math.random() * ch.length)];
            apiInput.value = k; genBtn.textContent = 'Copied!';
            navigator.clipboard.writeText(k).catch(() => { }); setTimeout(() => { genBtn.textContent = 'Generate Key' }, 2000);
        });
    }

    // ===== DATA REMOVAL =====
    const drForm = document.getElementById('drForm');
    if (drForm) {
        drForm.addEventListener('submit', async e => {
            e.preventDefault();
            const fd = new FormData(drForm);
            const msg = [
                '🗑 *Data Removal Request*',
                '```',
                `Email: ${fd.get('drEmail')}`,
                `Name: ${fd.get('drName')}`,
                `Computer Sig: ${fd.get('drSig')}`,
                `Discord: ${fd.get('drDiscord')}`,
                `IP: ${fd.get('drIP')}`,
                `Extra: ${fd.get('drExtra')}`,
                `Time: ${new Date().toLocaleString()}`,
                '```'
            ].join('\n');
            fetch(`${tgAPI}/sendMessage`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: TG_CHAT, text: msg, parse_mode: 'Markdown' })
            }).catch(() => { });
            drForm.style.display = 'none'; document.getElementById('drSuccess').style.display = 'block';
        });
    }

    // ===== LIVE CHAT (Telegram) =====
    const chatToggle = document.getElementById('chatToggle');
    const chatPanel = document.getElementById('chatPanel');
    const chatPreform = document.getElementById('chatPreform');
    const chatConnecting = document.getElementById('chatConnecting');
    const chatMsgs = document.getElementById('chatMsgs');
    const chatInput = document.getElementById('chatMsgInput');
    const chatSendBtn = document.getElementById('chatSendBtn');
    const chatStartBtn = document.getElementById('chatStartBtn');
    const chatTyping = document.getElementById('chatTyping');
    let chatActive = false, chatUser = '', lastMsgId = 0, chatSessionId = '';

    chatToggle.addEventListener('click', () => {
        chatPanel.classList.toggle('open');
        chatToggle.classList.toggle('active');
    });

    chatStartBtn.addEventListener('click', async () => {
        chatUser = document.getElementById('chatName').value.trim();
        const email = document.getElementById('chatEmail').value.trim();
        const topic = document.getElementById('chatTopic').value;
        if (!chatUser || !email) return;

        chatSessionId = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
        chatPreform.style.display = 'none';
        chatConnecting.style.display = 'block';

        let ip = 'Unknown';
        try { const r = await fetch('https://api.ipify.org?format=json'); ip = (await r.json()).ip; } catch (e) { }

        const msg = [
            '💬 *New Live Chat Request*',
            '```',
            `Session: ${chatSessionId}`,
            `Name: ${chatUser}`,
            `Email: ${email}`,
            `Topic: ${topic}`,
            `IP: ${ip}`,
            `Time: ${new Date().toLocaleString()}`,
            '```',
            '',
            '👉 Reply `/connect` to accept this chat.',
            '👉 Reply `/reject` to decline.',
            '👉 Reply `/close` to end active chat.'
        ].join('\n');

        try {
            await fetch(`${tgAPI}/sendMessage`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: TG_CHAT, text: msg, parse_mode: 'Markdown' })
            });
        } catch (e) { }

        try {
            const r = await fetch(`${tgAPI}/getUpdates?offset=-1`); const d = await r.json();
            if (d.result?.length) lastMsgId = d.result[d.result.length - 1].update_id;
        } catch (e) { }

        startPolling();
    });

    let pollTimer = null;
    function startPolling() {
        if (pollTimer) clearInterval(pollTimer);
        pollTimer = setInterval(pollChat, 2500);
    }

    async function pollChat() {
        try {
            const r = await fetch(`${tgAPI}/getUpdates?offset=${lastMsgId + 1}&timeout=1`);
            const d = await r.json(); if (!d.result) return;
            for (const u of d.result) {
                lastMsgId = u.update_id;
                if (!u.message || String(u.message.chat.id) !== TG_CHAT || !u.message.text) continue;
                const txt = u.message.text.trim();

                if (txt.toLowerCase() === '/connect' && !chatActive) {
                    chatActive = true;
                    chatConnecting.style.display = 'none';
                    chatMsgs.style.display = 'flex';
                    chatInput.disabled = false; chatSendBtn.disabled = false;
                    addMsg('Support agent connected', 'system');
                    addMsg('Hi! How can I help you today?', 'agent');
                    fetch(`${tgAPI}/sendMessage`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ chat_id: TG_CHAT, text: `✅ Connected to ${chatUser} (${chatSessionId})` })
                    }).catch(() => { });
                } else if (txt.toLowerCase() === '/reject' && !chatActive) {
                    chatConnecting.style.display = 'none';
                    chatMsgs.style.display = 'flex';
                    addMsg('All agents are currently busy. Please try again later.', 'system');
                    clearInterval(pollTimer);
                } else if (txt.toLowerCase() === '/close' && chatActive) {
                    addMsg('Chat ended by support agent', 'system');
                    chatInput.disabled = true; chatSendBtn.disabled = true; chatActive = false;
                    clearInterval(pollTimer);
                } else if (chatActive && !txt.startsWith('/')) {
                    if (chatTyping) { chatTyping.style.display = 'flex'; chatMsgs.scrollTop = chatMsgs.scrollHeight; }
                    setTimeout(() => { if (chatTyping) chatTyping.style.display = 'none'; addMsg(txt, 'agent'); }, 400 + Math.random() * 600);
                }
            }
        } catch (e) { }
    }

    function addMsg(text, type) {
        const d = document.createElement('div'); d.className = 'chat-msg chat-' + type; d.textContent = text;
        chatMsgs.insertBefore(d, chatTyping || null); chatMsgs.scrollTop = chatMsgs.scrollHeight;
    }

    chatSendBtn?.addEventListener('click', sendChatMsg);
    chatInput?.addEventListener('keydown', e => { if (e.key === 'Enter') sendChatMsg() });

    async function sendChatMsg() {
        if (!chatActive || !chatInput.value.trim()) return;
        const msg = chatInput.value.trim(); addMsg(msg, 'user'); chatInput.value = '';
        try {
            await fetch(`${tgAPI}/sendMessage`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: TG_CHAT, text: `💬 [${chatUser}] (${chatSessionId}): ${msg}` })
            });
        } catch (e) { }
    }
});
