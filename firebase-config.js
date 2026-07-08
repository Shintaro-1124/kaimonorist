<style>
  :root{
    --ink:#0A0E12;
    --panel:#121820;
    --panel2:#161D26;
    --line:#1E2730;
    --paper:#E8ECEE;
    --muted:#7C8A94;
    --bull:#3FBF7F;
    --bear:#E1584B;
    --amber:#E0A840;
  }
  *{box-sizing:border-box;}
  .fx-root{
    background:var(--ink);
    color:var(--paper);
    font-family:'Inter',system-ui,sans-serif;
    border-radius:10px;
    overflow:hidden;
    min-height:640px;
    display:flex;
    flex-direction:column;
  }
  .fx-root .mono{font-family:'IBM Plex Mono',monospace;}
  .fx-root .disp{font-family:'Space Grotesk',sans-serif;}

  /* Ticker tape */
  .ticker-wrap{
    border-bottom:1px solid var(--line);
    background:var(--panel);
    overflow:hidden;
    white-space:nowrap;
    position:relative;
    height:38px;
  }
  .ticker-track{
    display:inline-flex;
    align-items:center;
    height:38px;
    animation:scrollTicker 28s linear infinite;
  }
  .fx-root.paused .ticker-track{animation-play-state:paused;}
  @keyframes scrollTicker{
    0%{transform:translateX(0);}
    100%{transform:translateX(-50%);}
  }
  .tick-item{
    padding:0 18px;
    font-size:12.5px;
    display:inline-flex;
    gap:7px;
    align-items:baseline;
    border-right:1px solid var(--line);
  }
  .tick-item .sym{color:var(--muted); letter-spacing:.04em;}
  .tick-item .px{color:var(--paper); font-weight:500;}
  .tick-item .chg.up{color:var(--bull);}
  .tick-item .chg.down{color:var(--bear);}

  /* Header controls */
  .fx-controls{
    display:flex;
    flex-wrap:wrap;
    gap:10px;
    align-items:center;
    padding:12px 16px;
    border-bottom:1px solid var(--line);
    background:var(--ink);
  }
  .fx-controls select, .fx-controls input{
    background:var(--panel2);
    border:1px solid var(--line);
    color:var(--paper);
    border-radius:6px;
    padding:7px 10px;
    font-size:12.5px;
    font-family:'IBM Plex Mono',monospace;
  }
  .fx-controls select:focus, .fx-controls input:focus{outline:2px solid var(--amber); outline-offset:1px;}
  .fx-btn{
    background:var(--panel2);
    border:1px solid var(--line);
    color:var(--paper);
    border-radius:6px;
    padding:7px 14px;
    font-size:12.5px;
    font-family:'Space Grotesk',sans-serif;
    cursor:pointer;
    transition:border-color .15s;
  }
  .fx-btn:hover{border-color:var(--amber);}
  .fx-btn:focus-visible{outline:2px solid var(--amber); outline-offset:1px;}
  .fx-btn.primary{background:var(--amber); color:#1a1206; border-color:var(--amber); font-weight:600;}
  .fx-status{font-size:11px; color:var(--muted); margin-left:auto; font-family:'IBM Plex Mono',monospace;}
  .fx-status.err{color:var(--bear);}
  .fx-hint{font-size:11px; color:var(--muted);}
  .fx-hint a{color:var(--amber); text-decoration:none; border-bottom:1px dotted var(--amber);}

  /* Body layout */
  .fx-body{
    display:grid;
    grid-template-columns: 1.5fr 1fr;
    gap:0;
    flex:1;
    min-height:0;
  }
  @media (max-width:760px){ .fx-body{grid-template-columns:1fr;} }

  .fx-panel{padding:16px; border-right:1px solid var(--line);}
  .fx-panel:last-child{border-right:none;}
  .panel-title{
    font-size:11px;
    letter-spacing:.12em;
    text-transform:uppercase;
    color:var(--muted);
    margin:0 0 10px;
  }

  /* Chart */
  .chart-head{display:flex; align-items:baseline; gap:10px; margin-bottom:8px;}
  .chart-head .price{font-size:26px; font-weight:600;}
  .chart-head .chg{font-size:13px; padding:2px 7px; border-radius:4px;}
  .chart-head .chg.up{color:var(--bull); background:rgba(63,191,127,.12);}
  .chart-head .chg.down{color:var(--bear); background:rgba(225,88,75,.12);}
  canvas{width:100%; display:block;}

  /* Confluence meter (signature element) */
  .meter-wrap{display:flex; flex-direction:column; align-items:center; padding:6px 0 4px;}
  .meter-label{
    margin-top:4px;
    font-family:'Space Grotesk',sans-serif;
    font-size:20px;
    font-weight:600;
    letter-spacing:.03em;
  }
  .meter-sub{font-size:11px; color:var(--muted); margin-top:2px; font-family:'IBM Plex Mono',monospace;}

  /* Indicator cards */
  .ind-grid{display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:14px;}
  .ind-card{
    background:var(--panel);
    border:1px solid var(--line);
    border-radius:8px;
    padding:10px 12px;
  }
  .ind-card .k{font-size:10.5px; color:var(--muted); text-transform:uppercase; letter-spacing:.08em;}
  .ind-card .v{font-family:'IBM Plex Mono',monospace; font-size:16px; margin-top:3px;}
  .ind-card .v.up{color:var(--bull);} .ind-card .v.down{color:var(--bear);} .ind-card .v.flat{color:var(--amber);}
  .ind-card .note{font-size:10.5px; color:var(--muted); margin-top:3px;}

  .empty{
    display:flex; flex-direction:column; gap:10px; align-items:flex-start;
    padding:30px 6px; color:var(--muted); font-size:13px; line-height:1.6; max-width:440px;
  }
  .empty b{color:var(--paper);}
  .empty code{background:var(--panel2); padding:1px 5px; border-radius:4px; color:var(--amber); font-family:'IBM Plex Mono',monospace;}

  .fx-footer{
    padding:8px 16px; border-top:1px solid var(--line); font-size:10.5px; color:var(--muted);
    display:flex; justify-content:space-between; font-family:'IBM Plex Mono',monospace;
  }
  ::selection{background:var(--amber); color:#1a1206;}
</style>

<div class="fx-root" id="fxRoot">
  <div class="ticker-wrap"><div class="ticker-track" id="tickerTrack"></div></div>

  <div class="fx-controls">
    <input id="apiKey" type="password" placeholder="Twelve Data APIキー" style="width:190px;" />
    <select id="pairSelect"></select>
    <select id="intervalSelect">
      <option value="5min">5分足</option>
      <option value="15min" selected>15分足</option>
      <option value="1h">1時間足</option>
      <option value="4h">4時間足</option>
      <option value="1day">日足</option>
    </select>
    <button class="fx-btn primary" id="loadBtn">取得</button>
    <button class="fx-btn" id="autoBtn">自動更新: OFF</button>
    <span class="fx-status" id="statusLine">APIキーを入力してください</span>
  </div>

  <div class="fx-body">
    <div class="fx-panel">
      <p class="panel-title">Price / Chart</p>
      <div id="chartArea">
        <div class="empty">
          <div><b>使い方</b></div>
          <div>1. <a href="https://twelvedata.com/pricing" target="_blank" style="color:var(--amber);">Twelve Data</a> で無料APIキーを取得(カード登録不要)</div>
          <div>2. 上の欄に貼り付けて、ペアを選び「取得」</div>
          <div>3. RSI・MACD・移動平均・ボリンジャーバンドの合議でBUY/SELL/NEUTRALを判定します</div>
          <div style="margin-top:6px;">無料枠は <code>8 req/分・800 req/日</code> 程度です。自動更新は60秒間隔にしてあります。</div>
        </div>
      </div>
    </div>

    <div class="fx-panel">
      <p class="panel-title">Confluence Signal</p>
      <div class="meter-wrap">
        <svg id="gaugeSvg" width="220" height="130" viewBox="0 0 220 130"></svg>
        <div class="meter-label" id="meterLabel" style="color:var(--muted);">— NO DATA —</div>
        <div class="meter-sub" id="meterSub">indicators awaiting data</div>
      </div>
      <div class="ind-grid" id="indGrid"></div>
    </div>
  </div>

  <div class="fx-footer">
    <span>Data: Twelve Data API</span>
    <span id="lastUpdated">last updated: —</span>
  </div>
</div>

<script>
(function(){
  const PAIRS = ["EUR/USD","USD/JPY","GBP/USD","AUD/USD","USD/CHF","USD/CAD","NZD/USD","EUR/JPY"];
  const root = document.getElementById('fxRoot');
  const apiKeyInput = document.getElementById('apiKey');
  const pairSelect = document.getElementById('pairSelect');
  const intervalSelect = document.getElementById('intervalSelect');
  const loadBtn = document.getElementById('loadBtn');
  const autoBtn = document.getElementById('autoBtn');
  const statusLine = document.getElementById('statusLine');
  const chartArea = document.getElementById('chartArea');
  const indGrid = document.getElementById('indGrid');
  const meterLabel = document.getElementById('meterLabel');
  const meterSub = document.getElementById('meterSub');
  const lastUpdated = document.getElementById('lastUpdated');
  const tickerTrack = document.getElementById('tickerTrack');

  PAIRS.forEach(p=>{
    const o=document.createElement('option'); o.value=p; o.textContent=p; pairSelect.appendChild(o);
  });

  let autoTimer=null;
  let lastQuoteCache={};

  // ---- persisted API key ----
  (async function restoreKey(){
    try{
      const r = await window.storage.get('fx-dashboard:apikey');
      if(r && r.value){ apiKeyInput.value = r.value; statusLine.textContent='保存済みキーを読み込みました'; }
    }catch(e){ /* no saved key yet */ }
  })();
  apiKeyInput.addEventListener('change', async ()=>{
    try{ await window.storage.set('fx-dashboard:apikey', apiKeyInput.value, false); }catch(e){}
  });

  function setStatus(msg, isErr){
    statusLine.textContent = msg;
    statusLine.className = 'fx-status' + (isErr?' err':'');
  }

  // ---------- indicator math ----------
  function sma(arr,len){
    const out=new Array(arr.length).fill(null);
    for(let i=len-1;i<arr.length;i++){
      let s=0; for(let j=i-len+1;j<=i;j++) s+=arr[j];
      out[i]=s/len;
    }
    return out;
  }
  function ema(arr,len){
    const out=new Array(arr.length).fill(null);
    const k=2/(len+1);
    let prev=null;
    for(let i=0;i<arr.length;i++){
      if(arr[i]==null){continue;}
      if(prev==null){
        if(i>=len-1){
          let s=0; for(let j=i-len+1;j<=i;j++) s+=arr[j];
          prev = s/len; out[i]=prev;
        }
      } else {
        prev = arr[i]*k + prev*(1-k);
        out[i]=prev;
      }
    }
    return out;
  }
  function rsi(closes,len){
    const out=new Array(closes.length).fill(null);
    let gains=0, losses=0;
    for(let i=1;i<closes.length;i++){
      const diff = closes[i]-closes[i-1];
      if(i<=len){
        if(diff>=0) gains+=diff; else losses-=diff;
        if(i===len){
          let avgG=gains/len, avgL=losses/len;
          out[i] = avgL===0?100:100-(100/(1+avgG/avgL));
          out._avgG=avgG; out._avgL=avgL;
        }
      } else {
        let avgG=out._avgG, avgL=out._avgL;
        const g = diff>0?diff:0, l = diff<0?-diff:0;
        avgG = (avgG*(len-1)+g)/len;
        avgL = (avgL*(len-1)+l)/len;
        out._avgG=avgG; out._avgL=avgL;
        out[i] = avgL===0?100:100-(100/(1+avgG/avgL));
      }
    }
    return out;
  }
  function macd(closes){
    const e12=ema(closes,12), e26=ema(closes,26);
    const line = closes.map((_,i)=> (e12[i]!=null && e26[i]!=null) ? e12[i]-e26[i] : null);
    const signal = ema(line.map(v=>v==null?0:v),9).map((v,i)=> line[i]==null?null:v);
    const hist = line.map((v,i)=> (v!=null && signal[i]!=null) ? v-signal[i] : null);
    return {line, signal, hist};
  }
  function bollinger(closes,len,mult){
    const mid = sma(closes,len);
    const upper=new Array(closes.length).fill(null), lower=new Array(closes.length).fill(null);
    for(let i=len-1;i<closes.length;i++){
      let sum=0; for(let j=i-len+1;j<=i;j++) sum+=(closes[j]-mid[i])**2;
      const sd=Math.sqrt(sum/len);
      upper[i]=mid[i]+mult*sd; lower[i]=mid[i]-mult*sd;
    }
    return {mid,upper,lower};
  }
  function lastValid(arr){ for(let i=arr.length-1;i>=0;i--){ if(arr[i]!=null) return {v:arr[i], i}; } return {v:null,i:-1}; }

  // ---------- fetch ----------
  async function fetchQuotes(key){
    const url = `https://api.twelvedata.com/quote?symbol=${encodeURIComponent(PAIRS.join(','))}&apikey=${key}`;
    const res = await fetch(url);
    const data = await res.json();
    return data;
  }
  async function fetchSeries(key, symbol, interval){
    const url = `https://api.twelvedata.com/time_series?symbol=${encodeURIComponent(symbol)}&interval=${interval}&outputsize=120&apikey=${key}`;
    const res = await fetch(url);
    const data = await res.json();
    if(data.status==='error') throw new Error(data.message||'API error');
    if(!data.values) throw new Error('データが取得できませんでした');
    return data.values.slice().reverse().map(v=>({
      t:v.datetime, o:+v.open, h:+v.high, l:+v.low, c:+v.close
    }));
  }

  function renderTicker(){
    const items = PAIRS.map(p=>{
      const q = lastQuoteCache[p];
      if(!q) return `<span class="tick-item"><span class="sym">${p}</span><span class="px mono">—</span></span>`;
      const up = q.pct>=0;
      return `<span class="tick-item"><span class="sym">${p}</span><span class="px mono">${q.price}</span><span class="chg mono ${up?'up':'down'}">${up?'+':''}${q.pct}%</span></span>`;
    }).join('');
    tickerTrack.innerHTML = items+items; // duplicate for seamless scroll
  }

  async function refreshTicker(){
    const key = apiKeyInput.value.trim();
    if(!key) return;
    try{
      const data = await fetchQuotes(key);
      PAIRS.forEach(p=>{
        const entry = data[p] || (data.symbol===p ? data : null);
        if(entry && entry.close){
          lastQuoteCache[p] = {
            price: (+entry.close).toFixed(p.includes('JPY')?3:5),
            pct: entry.percent_change ? (+entry.percent_change).toFixed(2) : '0.00'
          };
        }
      });
      renderTicker();
    }catch(e){ /* ticker best-effort, ignore errors silently */ }
  }

  // ---------- chart drawing ----------
  function drawChart(series, pair){
    chartArea.innerHTML = '<div class="chart-head"><span class="price mono" id="curPrice">—</span><span class="chg" id="curChg"></span></div><canvas id="fxCanvas" height="260"></canvas>';
    const canvas = document.getElementById('fxCanvas');
    const dpr = window.devicePixelRatio||1;
    const w = canvas.clientWidth || 480, h = 260;
    canvas.width = w*dpr; canvas.height = h*dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr,dpr);

    const closes = series.map(d=>d.c);
    const min = Math.min(...series.map(d=>d.l));
    const max = Math.max(...series.map(d=>d.h));
    const pad = (max-min)*0.08 || 0.0001;
    const yMin=min-pad, yMax=max+pad;
    const xStep = w/(series.length-1);
    const yPix = v => h - ((v-yMin)/(yMax-yMin))*h;

    // grid
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth=1;
    for(let i=0;i<=3;i++){
      const y = (h/3)*i;
      ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke();
    }

    // area fill
    const last = closes[closes.length-1], first = closes[0];
    const bull = last>=first;
    ctx.beginPath();
    series.forEach((d,i)=>{ const x=i*xStep, y=yPix(d.c); if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y); });
    ctx.lineTo(w,h); ctx.lineTo(0,h); ctx.closePath();
    const grad = ctx.createLinearGradient(0,0,0,h);
    grad.addColorStop(0, bull? 'rgba(63,191,127,0.20)':'rgba(225,88,75,0.20)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad; ctx.fill();

    // line
    ctx.beginPath();
    series.forEach((d,i)=>{ const x=i*xStep, y=yPix(d.c); if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y); });
    ctx.strokeStyle = bull? '#3FBF7F':'#E1584B';
    ctx.lineWidth=1.8;
    ctx.stroke();

    const digits = pair.includes('JPY')?3:5;
    document.getElementById('curPrice').textContent = last.toFixed(digits);
    const chgPct = ((last-first)/first*100).toFixed(2);
    const chgEl = document.getElementById('curChg');
    chgEl.textContent = (chgPct>=0?'+':'')+chgPct+'%';
    chgEl.className = 'chg mono ' + (chgPct>=0?'up':'down');
  }

  // ---------- gauge (signature analog meter) ----------
  function drawGauge(score){ // score: -3..+3
    const svg = document.getElementById('gaugeSvg');
    const cx=110, cy=115, r=95;
    const clamped = Math.max(-3, Math.min(3, score));
    const angle = Math.PI + (clamped+3)/6 * Math.PI; // 180deg..360deg mapped across -3..3
    const nx = cx + r*0.72*Math.cos(angle);
    const ny = cy + r*0.72*Math.sin(angle);

    let color = 'var(--amber)';
    if(clamped>=1.2) color='var(--bull)';
    else if(clamped<=-1.2) color='var(--bear)';

    const ticks = [];
    for(let i=-3;i<=3;i++){
      const a = Math.PI + (i+3)/6*Math.PI;
      const x1 = cx + r*0.85*Math.cos(a), y1 = cy + r*0.85*Math.sin(a);
      const x2 = cx + r*Math.cos(a), y2 = cy + r*Math.sin(a);
      ticks.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#2A343E" stroke-width="2"/>`);
    }

    svg.innerHTML = `
      <path d="M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}" fill="none" stroke="#1E2730" stroke-width="10" />
      ${ticks.join('')}
      <text x="${cx-r+6}" y="${cy+18}" fill="#7C8A94" font-size="10" font-family="IBM Plex Mono, monospace">SELL</text>
      <text x="${cx-14}" y="${cy-r+2}" fill="#7C8A94" font-size="10" font-family="IBM Plex Mono, monospace">NEUTRAL</text>
      <text x="${cx+r-30}" y="${cy+18}" fill="#7C8A94" font-size="10" font-family="IBM Plex Mono, monospace">BUY</text>
      <line x1="${cx}" y1="${cy}" x2="${nx}" y2="${ny}" stroke="${color}" stroke-width="3" stroke-linecap="round"/>
      <circle cx="${cx}" cy="${cy}" r="5" fill="${color}"/>
    `;
  }

  function computeSignal(series){
    const closes = series.map(d=>d.c);
    const r = lastValid(rsi(closes,14)).v;
    const m = macd(closes);
    const macdHist = lastValid(m.hist).v;
    const macdHistPrev = (()=>{ const idx=lastValid(m.hist).i; return idx>0? m.hist[idx-1]:null; })();
    const bb = bollinger(closes,20,2);
    const bbIdx = closes.length-1;
    const sma20 = lastValid(sma(closes,20)).v;
    const sma50 = lastValid(sma(closes,50)).v;
    const price = closes[closes.length-1];

    let score=0; const votes=[];

    // RSI vote
    if(r!=null){
      if(r<30){ score+=1; votes.push(['RSI(14)', r.toFixed(1), 'up', '売られすぎ→反発期待']); }
      else if(r>70){ score-=1; votes.push(['RSI(14)', r.toFixed(1), 'down', '買われすぎ→反落警戒']); }
      else votes.push(['RSI(14)', r.toFixed(1), 'flat', '中立ゾーン']);
    }
    // MACD vote
    if(macdHist!=null && macdHistPrev!=null){
      if(macdHist>0 && macdHist>macdHistPrev){ score+=1; votes.push(['MACD hist', macdHist.toFixed(5), 'up', '上昇モメンタム拡大']); }
      else if(macdHist<0 && macdHist<macdHistPrev){ score-=1; votes.push(['MACD hist', macdHist.toFixed(5), 'down', '下降モメンタム拡大']); }
      else votes.push(['MACD hist', macdHist.toFixed(5), 'flat', 'モメンタム鈍化']);
    }
    // MA cross vote
    if(sma20!=null && sma50!=null){
      if(sma20>sma50){ score+=1; votes.push(['SMA20/50', 'GOLDEN', 'up', '短期>長期(上昇トレンド)']); }
      else { score-=1; votes.push(['SMA20/50', 'DEAD', 'down', '短期<長期(下降トレンド)']); }
    }
    // Bollinger vote
    if(bb.upper[bbIdx]!=null){
      if(price<=bb.lower[bbIdx]){ score+=1; votes.push(['Bollinger', 'LOWER', 'up', '下限バンド接触']); }
      else if(price>=bb.upper[bbIdx]){ score-=1; votes.push(['Bollinger', 'UPPER', 'down', '上限バンド接触']); }
      else votes.push(['Bollinger', 'MID', 'flat', 'バンド内で推移']);
    }

    return {score, votes};
  }

  function renderSignal(score, votes){
    drawGauge(score);
    let label, color;
    if(score>=2){ label='BUY'; color='var(--bull)'; }
    else if(score<=-2){ label='SELL'; color='var(--bear)'; }
    else { label='NEUTRAL'; color='var(--amber)'; }
    meterLabel.textContent = label;
    meterLabel.style.color = color;
    meterSub.textContent = `confluence score ${score>0?'+':''}${score} / ±4指標の合議`;

    indGrid.innerHTML = votes.map(([k,v,dir,note])=>`
      <div class="ind-card">
        <div class="k">${k}</div>
        <div class="v ${dir}">${v}</div>
        <div class="note">${note}</div>
      </div>
    `).join('');
  }

  async function loadAll(){
    const key = apiKeyInput.value.trim();
    const pair = pairSelect.value;
    const interval = intervalSelect.value;
    if(!key){ setStatus('APIキーを入力してください', true); return; }
    setStatus('取得中…');
    loadBtn.disabled = true;
    try{
      const series = await fetchSeries(key, pair, interval);
      if(series.length<55){ setStatus('データ量が少なく一部指標が計算できません', true); }
      else setStatus('OK');
      drawChart(series, pair);
      const {score, votes} = computeSignal(series);
      renderSignal(score, votes);
      lastUpdated.textContent = 'last updated: ' + new Date().toLocaleTimeString('ja-JP');
      await refreshTicker();
    }catch(e){
      setStatus(e.message || '取得エラー', true);
    }finally{
      loadBtn.disabled = false;
    }
  }

  loadBtn.addEventListener('click', loadAll);
  autoBtn.addEventListener('click', ()=>{
    if(autoTimer){
      clearInterval(autoTimer); autoTimer=null;
      autoBtn.textContent = '自動更新: OFF';
    } else {
      autoTimer = setInterval(loadAll, 60000);
      autoBtn.textContent = '自動更新: ON (60秒)';
      loadAll();
    }
  });

  renderTicker();
})();
</script>
