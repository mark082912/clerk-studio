/* Clerk Studio exam provenance navigator: local-only study state, no remote tracking. */
(() => {
  'use strict';
  const years=['115年第二次','115年第一次','114年第二次','114年第一次'];
  const display={'115年第二次':'115-2','115年第一次':'115-1','114年第二次':'114-2','114年第一次':'114-1'};
  let currentYear='115年第二次', searchText='';
  const style=document.createElement('style');
  style.textContent=`
  .examindex-wrap{margin-top:18px}
  .examindex-tools{display:flex;gap:9px;align-items:center;flex-wrap:wrap;margin:12px 0}
  .examindex-tools input,.examindex-tools select{border:1px solid #d2dee9;border-radius:9px;padding:9px 12px;background:#fff;max-width:100%}
  .examindex-tools input{min-width:210px;flex:1}
  .examindex-list{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:9px}
  .examindex-item{padding:13px 12px;text-align:left;border:1px solid #dbe6ee;background:#fff;border-radius:12px;color:#1c3550;font:inherit;cursor:pointer}
  .examindex-item:hover,.examindex-item:focus-visible{border-color:#268eb9;background:#f5fcff}
  .examindex-item small{display:block;color:#65798a;font-size:12px;margin-top:4px}
  .examindex-item strong{font-weight:700}
  .examindex-item .badge{float:right}
  .examindex-citation{margin-top:14px;border-left:3px solid #68a2a6;padding-left:12px;color:#576b80;font-size:12px}
  `;
  document.head.append(style);

  function exams(){return BANK.filter(q=>q.kind==='official-derived'&&q.subject==='小兒科');}
  function isDone(q){const r=db.study.records?.[q.id];return Boolean(r&&(Number(r.right)||Number(r.wrong)));}
  function ageLabel(year){return display[year]||year;}
  function stateLabel(q){
    const r=db.study.records?.[q.id];
    if(!r)return '<span class="badge">未練習</span>';
    if((r.wrong||0)>0&&(r.streak||0)===0)return '<span class="badge red">需複習</span>';
    if((r.streak||0)>=2)return '<span class="badge green">已連對</span>';
    return '<span class="badge blue">已練習</span>';
  }
  function item(q){
    return `<button type="button" class="examindex-item" data-examindex-id="${E(q.id)}">
    ${stateLabel(q)}<strong>原題 #${E(q.officialQNo)} · ${E(q.topic)}</strong>
    <small>${E(q.question.slice(0,65))}${q.question.length>65?'…':''}</small>
    </button>`;
  }
  function create(){
    const pool=exams(),filtered=pool.filter(q=>q.sourceExam===currentYear);
    const done=filtered.filter(isDone).length;
    return `<section class="card examindex-wrap">
      <div class="card-head"><div><h2>🗂 近年國考考點索引</h2><p>對照官方「醫學（四）」原題題號，點選即練習對應改寫題</p></div>
      <span class="badge green">${done}/${filtered.length} 已練習</span></div>
      <div class="examindex-tools">
        <label class="mock-small" for="examindex-year">期別</label>
        <select id="examindex-year">${years.map(y=>`<option value="${y}" ${currentYear===y?'selected':''}>${ageLabel(y)}</option>`).join('')}</select>
        <input id="examindex-search" type="search" placeholder="搜尋主題、題號或關鍵字" value="${E(searchText)}" aria-label="搜尋國考考點">
      </div>
      <div id="examindex-list" class="examindex-list">${filtered.map(item).join('')}</div>
      <p class="examindex-citation">
        題目皆為原考點的重新命題，<b>並非官方題幹和選項</b>，網站的選項答案字母可能和原題不同。
        115-2 官方更正：原題第 14 題 C、D 均給分，第 28 題一律給分；請參考
        <a target="_blank" rel="noopener noreferrer" href="https://wwwq.moex.gov.tw/exam/wHandExamQandA_File.ashx?c=302&code=115070&q=1&s=0102&t=M">更正答案 PDF</a>。
        請以當次官方原卷與更正答案為準。
      </p>
    </section>`;
  }
  function filterItems(){
    const list=document.querySelector('#examindex-list');if(!list)return;
    const terms=searchText.trim().toLowerCase();
    const available=exams().filter(q=>q.sourceExam===currentYear && (!terms||[q.topic,q.question,String(q.officialQNo)].join(' ').toLowerCase().includes(terms)));
    list.innerHTML=available.length?available.map(item).join(''):'<div class="help">找不到相符考點，請改用其他關鍵字或年份。</div>';
  }
  const before=renderStudy;
  renderStudy=function(){
    const out=before();
    // Never disrupt a timed mock sitting or its answer review.
    if(out.includes('MOCK EXAM COMPLETE')||out.includes('MOEX CONCEPT EXAM'))return out;
    return out+create();
  };
  document.addEventListener('input',event=>{
    if(event.target.id!=='examindex-search')return;
    searchText=String(event.target.value||'').slice(0,100);filterItems();
  });
  document.addEventListener('change',event=>{
    if(event.target.id!=='examindex-year'||!years.includes(event.target.value))return;
    currentYear=event.target.value;
    searchText='';
    render();
  });
  document.addEventListener('click',event=>{
    const el=event.target.closest('[data-examindex-id]');
    if(!el)return;
    const id=el.dataset.examindexId;
    const q=BANK.find(x=>x.id===id);
    if(!q)return;
    ui.page='study';ui.subject='小兒科';ui.studyMode='all';
    ui.activeQ=q.id;ui.answer=null;
    ui.sessionSeen=[q.id];render();
    window.scrollTo({top:0,behavior:'smooth'});
  });
})();