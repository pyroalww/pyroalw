document.addEventListener('DOMContentLoaded', () => {
    const TG_CHAT = '1462667287';
    const TG_BOT = '7764621104:AAFoMeFLI4hVLc36vqOPIefUeRt1kzFD6zE';
    const tgAPI = `https://api.telegram.org/bot${TG_BOT}`;

    const prices = {
        os: { windows: 5, linux: 20, macos: 50 },
        target: { chrome: 5, discord: 2, crypto: 7 },
        chrome_mod: { passwords: 2, history_browse: 0, autofill: 1, creditcards: 4, addresses: 0, downloads: .5, cookies: 3 },
        extra: { backdoor: 5, autostart: 3, avbypass: 5 },
        output: { discordbot: 7, telegrambot: 5, webpanel: 12 },
        monitor: { keylog: 2, screenview: 7 },
        disguise: { steam: 0, fps_booster: 0, optimizer: 0, chrome_updater: 0, custom: 5 }
    };

    let totalPrice = 5, discounted = false, finalPrice = 0;
    const liveEl = document.getElementById('livePrice');

    // --- Chrome sub-section toggle ---
    const chromeSub = document.getElementById('chromeSub');
    document.querySelectorAll('input[name="target"][value="chrome"]').forEach(cb => {
        cb.addEventListener('change', () => {
            chromeSub.style.display = cb.checked ? 'block' : 'none';
            if (!cb.checked) chromeSub.querySelectorAll('input').forEach(i => i.checked = false);
            calc();
        });
    });

    // --- Live price calc ---
    function calc() {
        let p = 0;
        const os = document.querySelector('input[name="os"]:checked')?.value;
        if (os) p += prices.os[os];
        document.querySelectorAll('input[name="target"]:checked').forEach(c => p += prices.target[c.value] || 0);
        document.querySelectorAll('input[name="chrome_mod"]:checked').forEach(c => p += prices.chrome_mod[c.value] || 0);
        document.querySelectorAll('input[name="extra"]:checked').forEach(c => p += prices.extra[c.value] || 0);
        document.querySelectorAll('input[name="output"]:checked').forEach(c => p += prices.output[c.value] || 0);
        document.querySelectorAll('input[name="monitor"]:checked').forEach(c => p += prices.monitor[c.value] || 0);
        const dis = document.querySelector('input[name="disguise"]:checked')?.value;
        if (dis) p += prices.disguise[dis] || 0;
        totalPrice = p;
        animatePrice(liveEl, '$' + p.toFixed(2));
    }

    function animatePrice(el, target) {
        el.style.transform = 'scale(1.15)'; el.style.color = '#60a5fa';
        el.textContent = target;
        setTimeout(() => { el.style.transform = 'scale(1)'; el.style.color = '' }, 300);
    }

    document.querySelectorAll('input[type="radio"],input[type="checkbox"]').forEach(i => i.addEventListener('change', calc));
    calc();

    // --- Phase navigation ---
    function goPhase(n) {
        document.querySelectorAll('.phase').forEach(p => p.classList.remove('active'));
        document.getElementById('phase' + n).classList.add('active');
        document.querySelectorAll('.pb-step').forEach(s => {
            const sn = +s.dataset.step;
            s.classList.remove('active', 'done');
            if (sn < n) s.classList.add('done');
            if (sn === n) s.classList.add('active');
        });
        document.getElementById('pbFill').style.width = ((n - 1) / 2 * 100) + '%';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // --- Phase 2: price animation ---
    document.getElementById('toPhase2').addEventListener('click', () => {
        discounted = false;
        goPhase(2);
        const spinner = document.getElementById('calcSpinner');
        const result = document.getElementById('calcResult');
        spinner.style.display = 'block'; result.style.display = 'none';
        setTimeout(() => { spinner.style.display = 'none'; result.style.display = 'block'; buildReceipt() }, 1800);
    });

    function buildReceipt() {
        const receipt = document.getElementById('receipt');
        receipt.innerHTML = '';
        const items = [];
        const os = document.querySelector('input[name="os"]:checked')?.value;
        if (os) items.push({ name: `<i class="fab fa-${os === 'macos' ? 'apple' : os}"></i> ${os.charAt(0).toUpperCase() + os.slice(1)}`, price: prices.os[os] });
        document.querySelectorAll('input[name="target"]:checked').forEach(c => {
            const n = { chrome: 'Chrome Browser', discord: 'Discord', crypto: 'Crypto Wallets' }[c.value] || c.value;
            items.push({ name: `<i class="fas fa-crosshairs"></i> ${n}`, price: prices.target[c.value] });
        });
        document.querySelectorAll('input[name="chrome_mod"]:checked').forEach(c => {
            const n = { passwords: 'Passwords', history_browse: 'History', autofill: 'Autofill', creditcards: 'Credit Cards', addresses: 'Addresses', downloads: 'Downloads', cookies: 'Cookies' }[c.value] || c.value;
            const p = prices.chrome_mod[c.value];
            items.push({ name: `<i class="fab fa-chrome"></i> ${n}`, price: p, free: p === 0 });
        });
        document.querySelectorAll('input[name="extra"]:checked').forEach(c => {
            const n = { backdoor: 'Backdoor (CMD/PS)', autostart: 'Autostart', avbypass: 'AV Protection' }[c.value] || c.value;
            items.push({ name: `<i class="fas fa-puzzle-piece"></i> ${n}`, price: prices.extra[c.value] });
        });
        document.querySelectorAll('input[name="output"]:checked').forEach(c => {
            const n = { discordbot: 'Discord Bot', telegrambot: 'Telegram Bot', webpanel: 'Web Panel' }[c.value] || c.value;
            items.push({ name: `<i class="fas fa-satellite-dish"></i> ${n}`, price: prices.output[c.value] });
        });
        document.querySelectorAll('input[name="monitor"]:checked').forEach(c => {
            const n = { keylog: 'Keylogger', screenview: 'Live Screen View' }[c.value] || c.value;
            items.push({ name: `<i class="fas fa-eye"></i> ${n}`, price: prices.monitor[c.value] });
        });
        const dis = document.querySelector('input[name="disguise"]:checked')?.value;
        if (dis) {
            const dn = { steam: 'Steam', fps_booster: 'FPS Booster', optimizer: 'Optimizer', chrome_updater: 'Chrome Updater', custom: 'Custom Disguise' }[dis];
            const dp = prices.disguise[dis];
            items.push({ name: `<i class="fas fa-mask"></i> ${dn}`, price: dp, free: dp === 0 });
        }
        items.forEach((it, i) => {
            const d = document.createElement('div'); d.className = 'receipt-item';
            d.style.animationDelay = (i * 0.08) + 's';
            d.innerHTML = `<span class="ri-name">${it.name}</span><span class="ri-price ${it.free ? 'free' : ''}">${it.free ? 'Free' : '+$' + it.price.toFixed(2)}</span>`;
            receipt.appendChild(d);
        });
        document.getElementById('totalVal').textContent = '$' + totalPrice.toFixed(2);
        document.getElementById('discountRow').style.display = 'none';
        document.getElementById('finalRow').style.display = 'none';
        document.getElementById('calcBtns').style.display = 'flex';
        document.getElementById('calcBtns2').style.display = 'none';
    }

    // Accept
    document.getElementById('btnAccept').addEventListener('click', () => {
        finalPrice = totalPrice; goPhase(3); showCheckout();
    });
    document.getElementById('btnAccept2').addEventListener('click', () => {
        finalPrice = Math.round(totalPrice * .8 * 100) / 100; goPhase(3); showCheckout();
    });

    // Reject → discount
    document.getElementById('btnReject').addEventListener('click', () => {
        discounted = true;
        const disc = Math.round(totalPrice * .2 * 100) / 100;
        const newP = Math.round(totalPrice * .8 * 100) / 100;
        document.getElementById('discountRow').style.display = 'flex';
        document.getElementById('discountVal').textContent = '-$' + disc.toFixed(2);
        document.getElementById('finalRow').style.display = 'flex';
        document.getElementById('finalVal').textContent = '$' + newP.toFixed(2);
        document.getElementById('calcBtns').style.display = 'none';
        document.getElementById('calcBtns2').style.display = 'flex';
        document.getElementById('totalVal').style.textDecoration = 'line-through';
        document.getElementById('totalVal').style.color = 'var(--t3)';
    });

    document.getElementById('btnBack').addEventListener('click', () => { goPhase(1) });

    function showCheckout() {
        const sum = document.getElementById('coSummary');
        sum.innerHTML = `<span>Custom Tool Build</span><span class="co-total">$${finalPrice.toFixed(2)}</span>`;
    }

    // --- Checkout form ---
    function getConfig() {
        const os = document.querySelector('input[name="os"]:checked')?.value || '—';
        const targets = [...document.querySelectorAll('input[name="target"]:checked')].map(c => c.value);
        const chrMods = [...document.querySelectorAll('input[name="chrome_mod"]:checked')].map(c => c.value);
        const extras = [...document.querySelectorAll('input[name="extra"]:checked')].map(c => c.value);
        const outputs = [...document.querySelectorAll('input[name="output"]:checked')].map(c => c.value);
        const monitors = [...document.querySelectorAll('input[name="monitor"]:checked')].map(c => c.value);
        const dis = document.querySelector('input[name="disguise"]:checked')?.value || '—';
        return { os, targets, chrMods, extras, outputs, monitors, dis };
    }

    document.getElementById('checkoutForm').addEventListener('submit', async e => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const cfg = getConfig();
        const msg = [
            '🛒 *New Tool Order*',
            '```',
            `Price: $${finalPrice.toFixed(2)}${discounted ? ' (20% discount)' : ''}`,
            `OS: ${cfg.os}`,
            `Targets: ${cfg.targets.join(', ') || 'None'}`,
            `Chrome Mods: ${cfg.chrMods.join(', ') || 'None'}`,
            `Extras: ${cfg.extras.join(', ') || 'None'}`,
            `Output: ${cfg.outputs.join(', ') || 'None'}`,
            `Monitor: ${cfg.monitors.join(', ') || 'None'}`,
            `Disguise: ${cfg.dis}`,
            `---`,
            `Name: ${fd.get('coName')}`,
            `Email: ${fd.get('coEmail')}`,
            `Contact: ${fd.get('coContact') || '—'}`,
            `Payment: ${fd.get('coPayment')}`,
            `Notes: ${fd.get('coNotes') || '—'}`,
            `Time: ${new Date().toLocaleString()}`,
            '```'
        ].join('\n');
        const btn = e.target.querySelector('.btn-submit');
        btn.textContent = 'Submitting...'; btn.disabled = true;
        try {
            await fetch(`${tgAPI}/sendMessage`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: TG_CHAT, text: msg, parse_mode: 'Markdown' })
            });
        } catch (ex) { }
        e.target.style.display = 'none';
        document.getElementById('coSuccess').style.display = 'block';
    });
});
