/* Browser-local foundation plan. Progress is self-reported; quiz history stays separate. */
(function () {
  'use strict';
  const curriculum = window.FOUNDATION_CURRICULUM;
  if (!curriculum?.courses?.length) return;
  const courses = curriculum.courses;
  const units = courses.flatMap(c => c.units.map(u => ({...u, course: c.id, subject: c.name})));
  const byId = new Map(units.map(u => [u.id, u]));
  let selectedCourse = 'pharmacology';
  const isObject = x => !!x && typeof x === 'object' && !Array.isArray(x);
  const validDate = x => typeof x === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(x) && normDate(x) === x;
  const ordered = curriculum.priority.flatMap(id => units.filter(u => u.course === id));

  window.normalizeCurriculumState = function (raw) {
    const r = isObject(raw) ? raw : {};
    const records = {};
    for (const u of units) {
      const x = isObject(r.records?.[u.id]) ? r.records[u.id] : {};
      records[u.id] = {
        read: x.read === true, questions: x.questions === true, corrected: x.corrected === true,
        reviews: Array.isArray(x.reviews) ? [...new Set(x.reviews.filter(validDate))].sort().slice(-60) : [],
        due: validDate(x.due) ? x.due : ''
      };
    }
    return {version: 1, active: byId.has(r.active) ? r.active : '',
      budget: Object.hasOwn(curriculum.budgets, r.budget) ? Number(r.budget) : 45,
      target: validDate(r.target) ? r.target : '', records};
  };
  function state() {
    if (!db.study.curriculum || db.study.curriculum.version !== 1) {
      db.study.curriculum = window.normalizeCurriculumState(db.study.curriculum);
    }
    return db.study.curriculum;
  }
  db.study.curriculum = window.normalizeCurriculumState(db.study.curriculum);
  const rec = u => state().records[u.id];
  const firstPass = u => rec(u).read && rec(u).questions && rec(u).corrected;
  const dueUnits = () => ordered.filter(u => rec(u).corrected && rec(u).due && rec(u).due <= localDay());
  function nextUnit() {
    const active = byId.get(state().active);
    return active && !firstPass(active) ? active : ordered.find(u => !firstPass(u));
  }
  function poolFor(u) { return BANK.filter(q => u.questions.includes(q.id)); }
  function actualCount(u) { return new Set(db.study.history.filter(h => u.questions.includes(h.id)).map(h => h.id)).size; }
  const label = code => window.ROTATION_ATLAS?.modules.find(m => m.code === code)?.label || code;
  const phaseName = () => {
    const t = state().target;
    if (!t) return '先建立骨架 → 章節做題與訂正 → 整卷與總複習';
    const d = dateDiff(localDay(), t);
    if (d < 0) return '自訂目標日已過，請更新目標日期';
    return `距自訂目標 ${d} 天 · ${d > 100 ? '首輪觀念與分章做題' : d > 46 ? '題庫、弱點與二輪整合' : '錯題、整卷與總複習'}`;
  };
  const btn = (t, a, cls = 'ghost small') => button(E(t), 'foundation-' + a, cls);

  const css = document.createElement('style');
  css.textContent = `
    .foundation-entry{margin:0 0 17px;padding:17px 20px;background:#eef8f6;border:1px solid #cce4df;border-radius:15px}
    .foundation-entry p{margin:6px 0 10px;color:#4c6678;font-size:13px}
    .foundation-grid{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);gap:17px;align-items:start}
    .foundation-courses{display:flex;flex-wrap:wrap;gap:7px;margin:15px 0}
    .foundation-courses button{white-space:normal;min-height:40px}
    .foundation-unit{border:1px solid #dce7ed;border-radius:13px;padding:14px;margin:12px 0;background:#fff;overflow-wrap:anywhere}
    .foundation-unit summary{cursor:pointer;font-weight:750;line-height:1.6}
    .foundation-stages{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin:13px 0}
    .foundation-stages label{display:flex;align-items:center;gap:6px;border:1px solid #dce7ed;padding:10px 8px;border-radius:9px;font-size:13px}
    .foundation-stages input{width:18px;height:18px;accent-color:#188d76;flex-shrink:0}
    .foundation-review{padding:11px;border-radius:9px;background:#f3f7fa;margin:11px 0;font-size:13px}
    .foundation-week{padding-left:20px;line-height:1.9;font-size:13px}
    .foundation-entry h2{font-size:18px;margin:0}.foundation-overview{margin:12px 0;font-size:13px}
    .foundation-grid .card{margin-bottom:17px}.foundation-grid p{overflow-wrap:anywhere}
    .foundation-link{display:flex;flex-wrap:wrap;gap:7px;margin:10px 0}
    .foundation-practice>.info-strip,.foundation-practice>.stats-grid,.foundation-practice>section.card:not(.question){display:none}
    @media(max-width:740px){.mobile-nav{grid-template-columns:repeat(6,minmax(0,1fr))}}
    @media(max-width:820px){.foundation-grid{grid-template-columns:1fr}.foundation-stages{grid-template-columns:1fr}.foundation-entry{padding:15px}.foundation-grid .card{padding:17px}.foundation-courses button{flex:1 0 27%}}
  `;
  document.head.append(css);

  function entry(compact = false) {
    const n = nextUnit(), due = dueUnits().length;
    const p = db.study.plan;
    const next = !state().active && p?.nextUnit ? `原有 checkpoint：${p.nextUnit}` : n ? `建議接續：${n.subject}／${n.title}` : '首輪皆已標記完成，接著回顧錯題';
    return `<section class="foundation-entry"><h2>一階國考複習進度</h2>
      <p>${E(next)}<br>${due ? `今日到期回顧 ${due} 個單元。` : '按讀書、做題、訂正與回顧分開追蹤。'}${compact ? '' : '11 科教材範圍，串接各科臨床學習。'}</p>
      ${btn('開啟複習進度 →','open','primary')}
      ${state().active && n ? btn('前往接續單元','resume') : ''}</section>`;
  }

  function todayCard() {
    const s = state(), u = nextUnit(), d = dueUnits(), times = curriculum.budgets[s.budget];
    const p = db.study.plan;
    return `<section class="card"><h2>今天的建議份量</h2>
      <div class="field"><label for="foundation-budget">依當天精神與值班調整</label>
      <select id="foundation-budget">${[[15,'忙碌日 15 分鐘'],[45,'一般日 45 分鐘'],[90,'有空日 90 分鐘']].map(([v,t]) => `<option value="${v}" ${s.budget===v?'selected':''}>${t}</option>`).join('')}</select></div>
      <ol class="foundation-week"><li>回想舊觀念 ${times[0]} 分鐘：${d.length ? E(d.slice(0,2).map(x=>x.title).join('、')) : '回顧上一個單元；尚無到期紀錄'}</li>
      <li>接續內容 ${times[1]} 分鐘：${!s.active && p?.nextUnit ? E(p.nextUnit) : E(u?.title || '補強錯題')}</li>
      <li>閉書作答與訂正 ${times[2]} 分鐘：優先近 3–5 年相同科目、相同考試階段的官方題，再做原創延伸。</li></ol>
      <p class="help">時間分配為可調整的建議。一個單元可分多天完成。</p>
      ${!s.active && p?.nextUnit ? `<div class="small-flag"><b>沿用原有進度</b><br>最近完成：${E(p.lastCompleted || '未核實')}<br>下一單元：${E(p.nextUnit)}<br>${button('核對原有 checkpoint','edit-plan')}</div>` : ''}
      ${u ? btn('前往建議單元','resume','secondary') : ''}
    </section>`;
  }
  function unitMarkup(u) {
    const r = rec(u), q = poolFor(u), next = nextUnit(), self = firstPass(u);
    const stages = [['read','已讀懂'],['questions','已做題'],['corrected','已訂正']];
    return `<details class="foundation-unit" id="foundation-unit-${u.id}" ${next?.id===u.id?'open':''}>
      <summary>${E(u.title)} <span class="badge ${self?'green':''}">${self?'首輪已完成':'待核對'}</span></summary>
      <p class="help">${E(u.focus)}</p>
      <div class="foundation-stages">${stages.map(([key,t])=>`<label><input type="checkbox" data-foundation-stage="${key}" data-foundation-unit="${u.id}" ${r[key]?'checked':''}>${t}</label>`).join('')}</div>
      <p class="help">以上是自行確認的教材與外部做題進度。本站實際答過 ${actualCount(u)} / ${q.length} 題，兩者分開計算。</p>
      <div class="foundation-review">閉書回顧：已記錄 ${r.reviews.length} 次${r.reviews.length?`，最近 ${E(r.reviews.at(-1))}`:''}<br>
      ${r.corrected ? `下次回顧：${E(r.due || '待安排')} ${r.due && r.due<=localDay()?'<span class="badge amber">已到期</span>':''}` : '完成訂正後安排第一次回顧'}<br>
      ${btn('本次閉書回顧完成','review-'+u.id,'secondary small')}</div>
      <div class="foundation-link">${btn('從這裡接續','select-'+u.id)}${btn('複製教學需求','prompt-'+u.id)}
      ${q.length ? btn(`練本站 ${q.length} 題（原創基礎）`,'practice-'+u.id,'primary small') : '<span class="help">本站尚無此單元的一階專用題。</span>'}</div>
      ${u.rotations.length?`<p class="help">臨床延伸（各科二階與實務內容）：</p><div class="foundation-link">${u.rotations.map(code=>btn(label(code),'rotation-'+code)).join('')}</div>`:''}
    </details>`;
  }
  function renderPlan() {
    const s = state(), c = courses.find(c=>c.id===selectedCourse)||courses[0];
    const complete = units.filter(firstPass).length, d = dueUnits();
    const counts = ['read','questions','corrected'].map(k=>units.filter(u=>rec(u)[k]).length);
    return `<section class="rot-head"><div class="eyebrow">FOUNDATION REVIEW</div><h2>把複習排成能接續的進度</h2>
      <p>參考提供的進度表，整理成 11 科、${units.length} 個主題單元。教材編號請對照手上的版本；單元名稱經重新分組，部分銜接主題另行補入。</p>
      <p><b>${E(phaseName())}</b></p><p>舊表的日期、成績與色塊未匯入本機完成狀態。目前數字只代表這張表中已核對的紀錄。</p>
      <div class="btn-row">${btn('返回國考題庫','back')}${btn('匯出各科進度 CSV','export')}${button('備份完整進度','personal-import')}</div></section>
      <div class="stats-grid">${statCard('已讀懂',counts[0]+' / '+units.length,'自行核對教材範圍')}${statCard('已做題',counts[1]+' / '+units.length,'含外部官方題庫，自行標記')}${statCard('已訂正',counts[2]+' / '+units.length,'不由正確率自動推測')}${statCard('首輪完成',complete+' / '+units.length,'讀懂、做題、訂正皆完成')}</div>
      <div class="foundation-grid"><div>${todayCard()}
      <section class="card"><h2>各科教材範圍</h2><p class="help">科目列示依參考表；建議接續順序優先藥理、生化、解剖。已確認的舊 checkpoint 可優先沿用。</p>
      <div class="foundation-courses">${courses.map(x=>btn(`${x.name} ${x.units.filter(u=>firstPass(byId.get(u.id))).length}/${x.units.length}`,'course-'+x.id,selectedCourse===x.id?'primary small':'ghost small')).join('')}</div>
      <h3>${E(c.name)}</h3><p class="help">參考範圍：${E(c.sourceScope)}</p>${c.units.map(x=>unitMarkup(byId.get(x.id))).join('')}</section></div>
      <aside><section class="card"><h2>今天到期的回顧</h2>${d.length?d.map(u=>`<div class="small-flag"><b>${E(u.subject)}／${E(u.title)}</b><br><span class="help">原訂 ${E(rec(u).due)}</span><div class="foundation-link">${btn('前往回顧','jump-'+u.id)}</div></div>`).join(''):'<p class="help">尚無到期紀錄。完成訂正後，隔天安排第一次回顧。</p>'}
      <p class="help">回顧間隔建議為 1、3、7、14、30 天，從實際完成當天計算；漏一天就接著回顧。</p></section>
      <section class="card"><h2>每週節奏</h2><ol class="foundation-week"><li>前五天：回顧舊內容、接續單元、章節題與訂正。</li><li>第六天：混合小測驗，解釋每個錯誤選項。</li><li>第七天：補未完成項目，核對 checkpoint 與下週範圍。</li></ol>
      <p class="help">輪訓前後複習可接相關臨床主題，保留一階基礎的連續順序。內容採基本概念 → 鑑別與治療 → 臨床／OSCE／EPA。</p></section>
      <section class="card"><h2>目標日期（選填）</h2><div class="field"><label for="foundation-target">自訂讀完日期或已核實的考試日</label><input id="foundation-target" type="date" value="${E(s.target)}"></div>
      <p class="help">未填日期時依單元接續；這裡不預設正式國考日期。倒數分期僅供分配讀書重點。</p>
      <p class="help">目前一階專用題主要是藥理、生化、解剖原創基礎題；各科近年考點多屬二階，不能視為一階歷屆題覆蓋。</p></section></aside></div>`;
  }

  // Keep the existing navigation, clinical workbench and rotations page wrappers intact.
  const previousRender = render;
  pageNames.curriculum = '一階國考複習進度';
  render = function () {
    if (ui.page !== 'curriculum') { previousRender(); return; }
    ui.page = 'home'; previousRender(); ui.page = 'curriculum';
    document.title = pageNames.curriculum + '｜Clerk Studio';
    document.querySelector('#page-heading').textContent = pageNames.curriculum;
    document.querySelectorAll('[data-page]').forEach(el=>{
      el.classList.toggle('active',el.dataset.page==='study');
      if(el.dataset.page==='study')el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');
    });
    document.querySelector('#app').innerHTML = renderPlan();
  };
  const prevHome = renderHome;
  renderHome = () => entry(true) + prevHome();
  const prevStudy = renderStudy;
  renderStudy = function () {
    const u = byId.get(ui.foundationUnit);
    if(!u)return entry(true)+prevStudy();
    return `<section class="foundation-entry"><h2>${E(u.subject)}／${E(u.title)}</h2>
      <p>本單元原創基礎題 ${poolFor(u).length} 題，實際答過 ${actualCount(u)} 題。完成後回進度表核對做題與訂正。</p>
      <div class="btn-row">${btn('回到本單元','jump-'+u.id)}${button(ui.activeQ?'換一題':'開始練習','next-question','primary small')}${btn('解除章節篩選','clear')}</div></section>
      <div class="foundation-practice">${prevStudy()}</div>`;
  };
  const prevPool = questionPool;
  questionPool = function () {
    const u = byId.get(ui.foundationUnit);
    const pool = prevPool();
    return u && ui.subject === u.subject ? pool.filter(q=>u.questions.includes(q.id)) : pool;
  };
  function goUnit(id) {
    const u = byId.get(id); if (!u) return;
    selectedCourse = u.course; ui.page = 'curriculum'; render();
    const el = document.getElementById('foundation-unit-'+id);
    if (el) { el.open = true; el.scrollIntoView({block:'center',behavior:'smooth'}); }
  }
  function promptFor(u) {
    return `請依我的國考複習進度，教我「${u.subject}：${u.title}」。\n範圍：${u.focus}\n以繁體中文為主，必要專業詞中英並列。先列 3–5 個重點，再依 Level 1 一階基礎、Level 2 二階鑑別與 first choice、Level 3 臨床／OSCE／EPA 循序講解。\n優先查證近 3–5 年同科、同考試階段的考選部正式題目，列出期別、題號、官方最終答案與來源；若來源尚未驗證請明說。練習題須區分正式原題、考點改寫與原創。每題附正確及錯誤選項解析。\n最後用 3–5 題確認理解，留下本次完成範圍、錯題與下一單元 checkpoint。請保持精簡，勿把未核實的舊進度當成已完成。`;
  }
  document.addEventListener('click', e => {
    if (e.target.closest('[data-subject]') || e.target.closest('[data-page]')) ui.foundationUnit = null;
  }, true);
  document.addEventListener('click', async e => {
    const action = e.target.closest('[data-action]')?.dataset.action;
    if (!action?.startsWith('foundation-')) return;
    const a = action.slice('foundation-'.length);
    if (a === 'open') { ui.page='curriculum'; render(); window.scrollTo({top:0}); }
    else if (a === 'back') { ui.foundationUnit=null; navigate('study'); }
    else if (a === 'resume') { if(nextUnit())goUnit(nextUnit().id); }
    else if (a.startsWith('course-')) { selectedCourse=a.slice(7); render(); }
    else if (a.startsWith('jump-')) goUnit(a.slice(5));
    else if (a.startsWith('select-')) {
      const u=byId.get(a.slice(7));if(!u)return;
      state().active=u.id; save(); goUnit(u.id); toast('已設定接續單元；原有 checkpoint 保留。');
    } else if (a.startsWith('review-')) {
      const u=byId.get(a.slice(7));if(!u)return;const r=rec(u);
      if(!firstPass(u)){toast('先核對已讀懂、已做題與已訂正，再記錄閉書回顧。');return;}
      if(r.reviews.includes(localDay())){toast('今天已記錄過本單元回顧。');return;}
      r.reviews.push(localDay());r.due=addDay(localDay(),curriculum.reviewIntervals[Math.min(r.reviews.length,4)]);
      save();goUnit(u.id);toast('已記錄回顧，下次 '+r.due+'。');
    } else if (a.startsWith('practice-')) {
      const u=byId.get(a.slice(9));if(!u||!poolFor(u).length)return;
      if(window.hasActiveMock?.()){ui.foundationUnit=null;navigate('study');toast('請先完成或結束目前的模擬考，再開始章節練習。');return;}
      ui.foundationUnit=u.id;ui.page='study';ui.subject=u.subject;ui.studyMode='all';ui.sessionSeen=[];pickQuestion();render();window.scrollTo({top:0});
    } else if (a==='clear') {
      ui.foundationUnit=null;ui.activeQ=null;ui.answer=null;ui.sessionSeen=[];render();
    } else if (a.startsWith('rotation-')) {
      ui.foundationUnit=null;window.openRotationModule?.(a.slice(9));
    } else if (a.startsWith('prompt-')) {
      const u=byId.get(a.slice(7));if(!u)return;
      try { await navigator.clipboard.writeText(promptFor(u));toast('已複製，可貼到 ChatGPT 接續教學。'); }
      catch (_) { window.prompt('複製本單元教學需求',promptFor(u)); }
    } else if (a==='export') {
      const rows=[['科目','主題','已讀懂（自行確認）','已做題（自行確認）','已訂正（自行確認）','回顧次數','下次回顧','本站實際答過題數','本站基礎題數']];
      for(const u of units){const r=rec(u);rows.push([u.subject,u.title,r.read?'是':'待核對',r.questions?'是':'待核對',r.corrected?'是':'待核對',r.reviews.length,r.due,actualCount(u),poolFor(u).length]);}
      download('國考複習進度_'+localDay()+'.csv',toCSV(rows),'text/csv;charset=utf-8');
    }
  });
  document.addEventListener('change', e => {
    const t=e.target;
    if(t.id==='foundation-budget') { state().budget=Object.hasOwn(curriculum.budgets,t.value)?Number(t.value):45;save();render(); }
    else if(t.id==='foundation-target') { state().target=validDate(t.value)?t.value:'';save();render(); }
    else if(t.dataset?.foundationStage) {
      const u=byId.get(t.dataset.foundationUnit),key=t.dataset.foundationStage;
      if(!u||!['read','questions','corrected'].includes(key))return;
      const r=rec(u);r[key]=t.checked;
      if(key==='corrected'&&t.checked&&!r.due)r.due=addDay(localDay(),1);
      save();render();
      const el=document.getElementById('foundation-unit-'+u.id);if(el)el.open=true;
    }
  });
  render();
})();
