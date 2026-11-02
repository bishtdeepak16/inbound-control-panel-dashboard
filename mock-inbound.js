/* Inbound Control Panel - DEMO data layer.
 * ALL DATA IS SYNTHETIC. It replaces the private Google Sheet, Users sheet, LLM proxy and
 * email web app so the original dashboard runs unchanged as a static page.
 */
(function () {
  const pad = n => String(n).padStart(2, '0');
  const NOW = new Date();
  const TODAY0 = new Date(NOW.getFullYear(), NOW.getMonth(), NOW.getDate());
  const YEAR = NOW.getFullYear();
  const seedBase = YEAR * 10000 + (NOW.getMonth() + 1) * 100 + NOW.getDate();
  function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const rnd = mulberry32(seedBase);
  const pick = (arr, w) => { const s = w.reduce((a, b) => a + b, 0); let r = rnd() * s; for (let i = 0; i < arr.length; i++) { r -= w[i]; if (r <= 0) return arr[i]; } return arr[arr.length - 1]; };
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const gauss = () => { let u = 0, v = 0; while (!u) u = rnd(); while (!v) v = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };

  const FCS = ['MUM', 'HYD', 'GGN', 'KOL', 'BNG', 'CHE'];
  const FCW = [1.6, 1.2, 1.5, 0.9, 1.1, 0.8];
  const CLIENTS = [
    { n: 'Client A', cat: 'Large Appliances', big: 1, w: 1.5, brands: ['Aero', 'Nimbus'] },
    { n: 'Client B', cat: 'Furniture', big: 1, w: 1.1, brands: ['Oakline', 'Casa Nova'] },
    { n: 'Client C', cat: 'Consumer Electronics', big: 0, w: 1.4, brands: ['Voltix', 'Pixora', 'Sonic Edge'] },
    { n: 'Client D', cat: 'FMCG', big: 0, w: 1.3, brands: ['Freshly', 'GoodDay'] },
    { n: 'Client E', cat: 'Apparel', big: 0, w: 1.0, brands: ['Urban Thread', 'Loom & Co'] },
    { n: 'Client F', cat: 'Home & Kitchen', big: 0, w: 0.9, brands: ['Hearth', 'Kitchenly'] },
    { n: 'Client G', cat: 'Personal Care', big: 0, w: 0.7, brands: ['Glowva'] },
    { n: 'Client H', cat: 'Toys & Games', big: 0, w: 0.5, brands: ['Playmo', 'BrightKid'] },
    { n: 'Client I', cat: 'Footwear', big: 0, w: 0.5, brands: ['Stride'] },
    { n: 'Client J', cat: 'Lighting', big: 0, w: 0.4, brands: ['Lumen', 'Glowline'] }
  ];
  const VEH = [['SCV 8ft', 0.10], ['LCV 14ft', 0.24], ['ICV 17ft', 0.26], ['MCV 22ft', 0.24], ['HCV 32ft', 0.16]];

  // month effects (index 0 = Jan). Oct = festive peak (more load, more no-shows, more detention).
  const MVOL = [0.8, 0.85, 0.95, 1.0, 0.95, 0.95, 1.0, 1.05, 1.2, 1.75, 1.2, 1.1];
  const ADV_SHOW = [0.86, 0.88, 0.85, 0.84, 0.86, 0.88, 0.89, 0.88, 0.83, 0.64, 0.82, 0.84];
  const DETAIN = [0.18, 0.22, 0.28, 0.24, 0.28, 0.20, 0.22, 0.27, 0.40, 0.45, 0.30, 0.28];

  const fmtD = d => pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + '-' + d.getFullYear();
  const fmtDT = d => fmtD(d) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  const addH = (d, h) => new Date(d.getTime() + h * 3600000);
  const comma = n => n >= 1000 ? n.toLocaleString('en-US') : String(n);

  const HEAD = ['FC', 'Brand', 'Client', 'Appt Type', 'Appt ID (External)', 'Scheduled Date', 'Requisite Date', 'Notification Date',
    'Gate In Time', 'On Dock Time', 'Unloading Start Time', 'Unloading End Time', 'Gate Out Time', 'Vehicle Size',
    'Units as Per Documents', 'Units', 'Good Units', 'Damaged Units', 'Short Units', 'Total Units', 'Manpower Deployed',
    'Validated', 'Absconding', 'Status', 'Item Classification'];

  function buildCSV() {
    const rows = [];
    let seq = 100000;
    const start = new Date(YEAR, 0, 7);
    const end = new Date(TODAY0.getFullYear(), TODAY0.getMonth(), TODAY0.getDate() + 14);
    const csvW = rnd;
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const day = new Date(d), m = day.getMonth(), dow = day.getDay();
      const isFuture = day > TODAY0, isToday = +day === +TODAY0;
      const dayFactor = dow === 0 ? 0.35 : dow === 6 ? 0.85 : 1;
      const perDay = 24 * MVOL[m] * dayFactor * (isFuture ? 0.9 : 1);
      FCS.forEach((fc, fi) => {
        const nFc = Math.max(0, Math.round(perDay * FCW[fi] / 7.1 * (0.8 + rnd() * 0.4)));
        for (let k = 0; k < nFc; k++) {
          const cl = pick(CLIENTS, CLIENTS.map(c => c.w));
          const big = cl.big ? 1 : 0;
          // large-product share grows through the year -> longer unloads and more detention
          const bigDrift = big ? Math.min(0.18, (m / 11) * 0.18) : 0;
          const isImm = rnd() < 0.46;
          const type = isImm ? 'Immediate' : 'Advance';
          const lead = isImm ? 0 : 1 + Math.floor(rnd() * 8);
          const notif = new Date(day); notif.setDate(notif.getDate() - lead);
          const veh = pick(VEH.map(v => v[0]), big ? [0.03, 0.12, 0.2, 0.3, 0.35] : VEH.map(v => v[1]));
          const vIdx = VEH.findIndex(v => v[0] === veh);
          const units = Math.max(80, Math.round(Math.exp(5.9 + vIdx * 0.5 + gauss() * 0.45)));
          const brand = cl.brands[Math.floor(rnd() * cl.brands.length)];
          const showProb = isImm ? 0.985 : clamp(ADV_SHOW[m] - (isFuture ? 0 : 0) + (rnd() - 0.5) * 0.03, 0.5, 0.99);
          const row = {
            FC: fc, Brand: brand, Client: cl.n, 'Appt Type': type, 'Appt ID (External)': 'APT' + (seq++),
            'Scheduled Date': fmtD(day), 'Requisite Date': fmtD(day), 'Notification Date': fmtD(notif),
            'Vehicle Size': veh, 'Item Classification': cl.cat,
            'Gate In Time': '', 'On Dock Time': '', 'Unloading Start Time': '', 'Unloading End Time': '', 'Gate Out Time': '',
            'Units as Per Documents': '', Units: '', 'Good Units': '', 'Damaged Units': '', 'Short Units': '', 'Total Units': '',
            'Manpower Deployed': '', Validated: 'FALSE', Absconding: 'FALSE', Status: ''
          };
          // projected load is known for every appointment (planner view)
          row['Units as Per Documents'] = comma(units);
          if (isFuture) { row.Units = String(units); rows.push(row); continue; }
          if (rnd() > showProb) { rows.push(row); continue; }   // no show -> Null once the day has passed

          // gate-in (mostly same day; some advance trucks arrive a day late)
          const lateDay = !isImm && rnd() < 0.10 ? 1 : 0;
          const gi = new Date(day); gi.setDate(gi.getDate() + lateDay);
          const hr = clamp(Math.round(11 + gauss() * 3.2), 6, 20);
          gi.setHours(hr, Math.floor(rnd() * 60));
          if (gi > NOW) { rows.push(row); continue; }
          row['Gate In Time'] = fmtDT(gi);
          // queue before docking (detention for busy / large-product days)
          const detained = rnd() < clamp(DETAIN[m] + bigDrift, 0, 0.7);
          const queueH = detained ? 6 + rnd() * 60 : 0.2 + rnd() * 1.4;
          const onDock = addH(gi, queueH);
          const unloadH = clamp((units / (260 + big * -90 + rnd() * 80)) * (0.7 + rnd() * 0.6) / 1 / 4, 0.7, 7) * (1 + bigDrift * 1.5);
          const us = addH(onDock, 0.2 + rnd() * 0.5), ue = addH(us, unloadH), go = addH(ue, 0.2 + rnd() * 0.7);
          if (onDock > NOW) { rows.push(row); continue; }
          row['On Dock Time'] = fmtDT(onDock);
          if (us > NOW) { rows.push(row); continue; }
          row['Unloading Start Time'] = fmtDT(us);
          if (ue > NOW) { rows.push(row); continue; }
          row['Unloading End Time'] = fmtDT(ue);
          // a small number of old, still-uncleared vehicles keep the pending-aging chart honest
          const stuck = (+TODAY0 - +day) / 86400000 >= 2 && rnd() < 0.012;
          if (go > NOW || stuck) { rows.push(row); continue; }
          row['Gate Out Time'] = fmtDT(go);
          // receipt quality
          const dmgRate = clamp(0.0035 + (cl.big ? 0.0025 : 0) + (rnd() - 0.5) * 0.004, 0, 0.03);
          const shortRate = clamp(0.0030 + (rnd() - 0.5) * 0.004, 0, 0.03);
          const dmg = Math.round(units * dmgRate * (rnd() < 0.4 ? 2.2 : 0.7)), sht = Math.round(units * shortRate * (rnd() < 0.35 ? 2 : 0.8));
          row.Units = String(units); row['Damaged Units'] = String(dmg); row['Short Units'] = String(sht);
          row['Good Units'] = String(Math.max(0, units - dmg - sht)); row['Total Units'] = comma(units);
          row['Manpower Deployed'] = String(clamp(Math.round(units / 260 + 3 + gauss()), 3, 26));
          const ageDays = (+NOW - +go) / 86400000;
          row.Validated = ageDays > 1.5 && rnd() < 0.9 ? 'TRUE' : 'FALSE';
          if (rnd() < 0.004) row.Absconding = 'TRUE';
          rows.push(row);
        }
      });
    }
    const q = v => { v = String(v == null ? '' : v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
    return [HEAD.join(',')].concat(rows.map(r => HEAD.map(h => q(r[h])).join(','))).join('\n');
  }
  let CSV = null;
  const getCSV = () => CSV || (CSV = buildCSV());

  const USERS_CSV = 'Email,Role,FC,Views,Added By,Added On\n' +
    'admin@example.com,Planning,All,All,system,01/01/2026\n' +
    'planner@example.com,Planning,All,All,admin@example.com,01/02/2026\n' +
    'mum.ops@example.com,FC,MUM,Ops,admin@example.com,01/03/2026\n' +
    'ggn.ops@example.com,FC,GGN,"Planner,Ops",admin@example.com,01/03/2026\n';

  // ----- rule-based stand-in for the LLM proxy -----
  function mockLLM(prompt) {
    const i = prompt.indexOf('{"wowSummary"');
    let tpl;
    try { tpl = JSON.parse(prompt.slice(i)); } catch (e) { tpl = { wowMetrics: [], mtdMetrics: [] }; }
    const num = s => parseFloat(String(s).replace(/[^0-9.\-]/g, ''));
    const sentence = (metrics, scope) => {
      const get = n => (metrics || []).find(m => m.name === n);
      const f = get('Fulfilment %'), sd = get('Same-Day %'), ap = get('Total Appointments');
      const parts = [];
      if (ap) parts.push(`${scope} appointments went from ${ap.prev} to ${ap.curr}.`);
      if (f) parts.push(`Fulfilment moved from ${f.prev} to ${f.curr}` + (sd ? `, and same-day clearance from ${sd.prev} to ${sd.curr}.` : '.'));
      return parts.join(' ');
    };
    const ranked = metrics => (metrics || []).filter(m => ['Fulfilment %', 'Same-Day %', 'Damage+Short Rate', 'Null Rate', 'Median TAT'].includes(m.name))
      .map(m => ({ m, d: Math.abs(num(m.delta) || 0) })).filter(x => x.d >= 0.5).sort((a, b) => b.d - a.d);
    const line = x => `${x.m.name} went from ${x.m.prev} to ${x.m.curr} (${x.m.delta}).`;
    const split = metrics => {
      const r = ranked(metrics);
      return { good: r.filter(x => x.m.dir === 'up').slice(0, 2).map(line), bad: r.filter(x => x.m.dir === 'down').slice(0, 2).map(line) };
    };
    const w = split(tpl.wowMetrics), m = split(tpl.mtdMetrics);
    const actions = [];
    const watch = (tpl.wowMetrics || []).concat(tpl.mtdMetrics || []);
    const sd = watch.find(x => x.name === 'Same-Day %'), nl = watch.find(x => x.name === 'Null Rate'), ft = watch.find(x => x.name === 'Fulfilment %');
    if (sd) actions.push(`Same-day clearance is at ${sd.curr}: prioritise dock allocation for vehicles that gate in before 3 PM so they exit the same day.`);
    if (nl) actions.push(`Null rate is at ${nl.curr}: confirm advance slots with brands 24 hours before the appointment and re-slot likely no-shows early.`);
    if (ft && actions.length < 3) actions.push(`Fulfilment is at ${ft.curr}: review brands with repeated no-shows and tighten appointment lead times.`);
    return {
      wowSummary: sentence(tpl.wowMetrics, 'Weekly'), wowHighlights: w.good.length ? w.good : ['Operations stayed broadly stable week on week.'], wowConcerns: w.bad.length ? w.bad : ['No rate metric moved materially against the plan.'], wowMetrics: tpl.wowMetrics,
      mtdSummary: sentence(tpl.mtdMetrics, 'Month-to-date'), mtdHighlights: m.good.length ? m.good : ['Month-to-date performance is in line with the previous month.'], mtdConcerns: m.bad.length ? m.bad : ['No rate metric moved materially against the previous month.'], mtdMetrics: tpl.mtdMetrics,
      actions
    };
  }

  const json = (obj, status) => ({ ok: (status || 200) < 400, status: status || 200, type: 'basic', headers: { get: () => null }, json: async () => obj, text: async () => JSON.stringify(obj) });
  const text = t => ({ ok: true, status: 200, type: 'basic', headers: { get: () => null }, text: async () => t, json: async () => ({}) });

  const real = window.fetch.bind(window);
  window.fetch = function (u, o) {
    const url = typeof u === 'string' ? u : (u && u.url) || '';
    if (url.indexOf('demo://llm') === 0) {
      let body = {}; try { body = JSON.parse(o.body); } catch (e) {}
      const content = JSON.stringify(mockLLM((body.messages && body.messages[0] && body.messages[0].content) || ''));
      return new Promise(r => setTimeout(() => r(json({ choices: [{ message: { content } }] })), 700));
    }
    if (url.indexOf('demo://email') === 0) return Promise.resolve(json({ ok: true }));
    if (url.indexOf('demo://sheet-data') === 0 || (url.indexOf('docs.google.com/spreadsheets') >= 0 && url.indexOf('demo-appointments') >= 0)) return Promise.resolve(text(getCSV()));
    if (url.indexOf('sheets.googleapis.com') >= 0) {
      if (o && o.method && o.method !== 'GET') return Promise.resolve(json({}));
      const rows = USERS_CSV.trim().split('\n').map(l => l.split(',').map(x => x.replace(/"/g, '')));
      return Promise.resolve(json({ values: rows, sheets: [{ properties: { title: 'Users', sheetId: 0 } }] }));
    }
    if (url.indexOf('demo-users') >= 0) return Promise.resolve(text(USERS_CSV));
    return real(u, o);
  };
  window.__DEMO_CSV = getCSV;
  try { sessionStorage.setItem('ibms_user', JSON.stringify({ email: 'planner@example.com', name: 'Demo Planner', picture: '', role: 'Planning', fc: ['All'], views: ['CXO', 'Planner', 'Ops'] })); } catch (e) {}
})();
