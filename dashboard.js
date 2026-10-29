/* Clerk Studio v1.4 - local-only daily dashboard and curriculum checkpoints.
   Personal calendar and learning progress are NOT bundled with this public source. */
(() => {
  'use strict';
  const css = document.createElement('style');
  css.textContent = `
    .today-grid{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:17px;margin:17px 0}
    .today-intro{background:#eef8f6;border:1px solid #cce8df;border-radius:14px;padding:13px 15px;margin-bottom:16px;color:#245a51}
    .mini-progress{height:9px;border-radius:99px;background:#e9eef4;overflow:hidden;margin:11px 0}
    .mini-progress>span{display:block;height:100%;background:#36b79e;border-radius:99px}
    .today-card .list-row{padding:11px 0}.today-card .list-row:first-child{padding-top:0}
    .today-card .task-check{align-items:flex-start}.today-card .task-check input{margin-top:4px}
    .plan-check{display:flex;align-items:flex-start;gap:9px;padding:8px 0;border-top:1px solid #eef1f5}
    .plan-check input{width:17px;height:17px;accent-color:#239e86;margin-top:2px;flex-shrink:0}
    .plan-check:has(input:checked) span{text-decoration:line-through;color:#718397}
    .small-flag{background:#f8fafc;border:1px solid #e5edf4;border-radius:12px;padding:10px 12px;margin:10px 0}
    .dashboard-list .list-row{padding:10px 0}
    @media(max-width:920px){.today-grid{grid-template-columns:1fr}}
  `;
  document.head.append(css);

  function plan(){return db?.study?.plan && typeof db.study.plan === 'object' ? db.study.plan : null;}
  function activeTasks(){
    const today=localDay(), all=db.clerk.tasks;
    const sort=(a,b)=>priorityN(b.priority)-priorityN(a.priority)||(a.due||'9999').localeCompare(b.due||'9999');
    return {
      today:all.filter(x=>!x.done&&x.due===today).sort(sort),
      past:all.filter(x=>!x.done&&x.due&&x.due<today).sort((a,b)=>a.due.localeCompare(b.due)),
      completed:all.filter(x=>x.done&&x.due===today).length,
      upcoming:all.filter(x=>!x.done&&x.due>today).sort((a,b)=>a.due.localeCompare(b.due)||priorityN(b.priority)-priorityN(a.priority))
    };
  }
  function planCard(){
    const p=plan(), s=studyStats();
    if(!p)return `<div class="today-intro"><b>尚未設定先前的國考課程進度</b><br><small>可從「備份 → 合併個人學習／輪訓資料」匯入，不會把未作答的舊題當作已答對。</small></div>
      <div class="btn-row">${button('匯入個人進度','personal-import','primary')}${button('手動設定單元','edit-plan')}</div>`;
    const checks=Array.isArray(p.checkpoints)?p.checkpoints:[];
    const done=checks.filter(x=>x.done).length;
    return `<div class="small-flag"><div class="muted small">已完成的最近單元（依匯入或手動設定）</div><b>${E(p.lastCompleted||'尚未設定')}</b>
      <div class="muted small" style="margin-top:5px">下一個單元</div><strong>${E(p.nextUnit||'尚未設定')}</strong>
      ${p.lastUpdated?`<div class="muted small" style="margin-top:4px">最近核對：${E(p.lastUpdated)}</div>`:''}</div>
      ${checks.length?`<div class="panel-title"><b>本週 checkpoint</b><span class="badge green">${done} / ${checks.length}</span></div>
      <div class="mini-progress"><span style="width:${pct(done,checks.length)}%"></span></div>
      ${checks.map((x,i)=>`<label class="plan-check"><input type="checkbox" data-plan-check="${i}" ${x.done?'checked':''}><span>${E(x.text)}</span></label>`).join('')}`:''}
      <div class="btn-row" style="margin-top:13px">${button('修改學習進度','edit-plan')}${button('開始題庫練習 →','go-study','primary')}</div>
      <p class="help" style="margin:12px 0 0">獨立課程進度與網站題庫成績分開記錄。本站已作答 ${s.total} 次；未匯入的過去題目不會計入正確率。</p>`;
  }
  renderHome = function(){
    const s=studyStats(),t=taskStats(),r=currentRotation(),a=activeTasks();
    const due=a.today.length, completed=a.completed, total=due+completed;
    return `<section class="hero"><div><span class="eyebrow">TODAY • CLERK STUDIO</span>
      <h2>今天先做什麼？</h2><p>${E(localDay())} · ${r?`目前輪訓：${E(r.name)}`:'尚未匯入目前輪訓資料'}<br>先處理今天到期項目，再複習國考。</p>
      <div class="btn-row">${button('開始國考練習 →','go-study','primary mint')}${button('115-2 小兒科國考速測 →','ped-quick','secondary')}${button('新增今日任務','new-task','outline')}${button('匯入我的資料','personal-import','outline')}<button type="button" class="secondary small" data-page="clinical">🩺 病歷・查房・值班 →</button></div>
      </div><div class="hero-visual"><b>${due}</b><span>今天尚未完成任務</span></div></section>
      <div class="stats-grid">${statCard('今日任務',total?`${completed}/${total} 項`:'0 項',total?'已完成 / 今日應辦':'尚無今日任務')}
      ${statCard('逾期未完成',`${a.past.length} 項`,a.past.length?'請先檢查是否仍需辦理':'目前無逾期',a.past.length?'warn':'')}
      ${statCard('今日國考練習',`${s.today} 題`,s.total?`累積 ${s.total} 次，正確率 ${s.accuracy}%`:'尚無作答紀錄')}
      ${statCard('目前輪訓',r?r.name:'待匯入',r?`${fmtDay(r.start)}–${fmtDay(r.end)}`:'從個人資料包匯入')}</div>
      <div class="today-grid">
        <section class="card today-card"><div class="card-head"><div><h2>📅 今天的 Clerk 2 任務</h2><p>可以直接勾選完成；資料僅存在本機</p></div>${button('全部待辦 ↗','go-clerk')}</div>
          ${total?`<div class="today-intro"><b>今天已完成 ${completed}/${total} 項</b>
            <div class="mini-progress"><span style="width:${pct(completed,total)}%"></span></div></div>`:''}
          ${a.past.length?`<div class="panel-title"><b>⚠️ 逾期待確認</b><span class="badge red">${a.past.length} 項</span></div><div class="list">${a.past.slice(0,3).map(renderTaskRow).join('')}</div>`:''}
          <div class="panel-title" style="margin-top:13px"><b>今日截止</b><span class="badge blue">${due} 項待辦</span></div>
          ${due?`<div class="list dashboard-list">${a.today.slice(0,7).map(renderTaskRow).join('')}</div>`:db.clerk.tasks.length?empty('沒有今日未完成任務','可新增新任務，或查看未來待辦。'):empty('尚未匯入個人課表','點選「匯入我的資料」，合併先前整理的輪訓與待辦。')}
          ${a.upcoming.length?`<div class="panel-title" style="margin-top:14px"><b>接下來的重要任務</b><span class="muted small">按日期排列</span></div><div class="list dashboard-list">${a.upcoming.slice(0,4).map(x=>`<div class="list-row"><div><div class="title">${E(x.title)}</div><div class="meta">${E(x.due)} · ${E(x.category)}</div></div></div>`).join('')}</div>`:''}
        </section>
        <section class="card"><div class="card-head"><div><h2>🧠 國考進度與今日複習</h2><p>課程 checkpoint 與網站練習成績分開</p></div><span class="badge green">LOCAL</span></div>
          ${planCard()}
          <div class="small-flag"><b>網站題庫進度</b><div class="panel-title" style="margin-top:8px"><span>已作答／今日題數</span><b>${s.total} / ${s.today}</b></div>
          <div class="panel-title"><span>待練習或複習</span><b>${s.due} 題</b></div>
          <div class="panel-title"><span>答錯過的題目</span><b>${s.wrong} 題</b></div></div>
        </section>
      </div>
      <div class="grid g2"><section class="card"><div class="card-head"><div><h2>近七天練習量</h2><p>以網站實際作答紀錄為準</p></div>${button('統計 ↗','go-analytics')}</div>${bars(lastSeven())}</section>
      <section class="card"><div class="card-head"><div><h2>快速前往</h2><p>開始今天的工作</p></div></div><div class="btn-row">${button('國考練習','go-study','primary')}${button('全部任務','go-clerk')}${button('統計報表','go-analytics')}${button('匯出備份','personal-import')}</div><p class="help" style="margin-top:18px">本站不會自行同步 Google Calendar、院內課表或 ChatGPT 對話；資料需手動匯入、更新及備份。</p></section></div>
      <div class="wide-note" style="margin-top:18px">🔐 <b>隱私提醒：</b>請勿記錄可識別病人的姓名、病歷號或其他個資。公開程式碼內不包含你的個人課表或學習進度。</div>`;
  };
  const oldRenderStudy=renderStudy;
  renderStudy=function(){const p=plan();return `${p?`<section class="card" style="margin-bottom:17px"><div class="card-head"><div><h2>本週國考課程進度</h2><p>此處與題庫作答率分開計算</p></div>${button('修改單元','edit-plan')}</div><p><b>最近完成：</b>${E(p.lastCompleted||'未設定')}<br><b>下一單元：</b>${E(p.nextUnit||'未設定')}</p>${p.checkpoints?.length?`<p class="help">待確認知識點：${p.checkpoints.filter(x=>!x.done).map(x=>E(x.text)).join('、')||'目前皆已勾選'}</p>`:''}</section>`:''}${oldRenderStudy()}`;};

  importClerkPack = async function(file){
    if(!file)return;if(file.size>1000000){toast('個人資料包最大 1 MB。');return;}
    try{
      const obj=JSON.parse(await file.text());
      if(obj.version!==1||!obj.clerk||!Array.isArray(obj.clerk.tasks)||!Array.isArray(obj.clerk.rotations))throw Error('輪訓資料格式不正確');
      if(obj.clerk.tasks.length>200||obj.clerk.rotations.length>100)throw Error('輪訓資料筆數過多');
      const prevRot=new Set(db.clerk.rotations.map(r=>[r.name,r.start,r.end].join('|')));
      const prevTask=new Set(db.clerk.tasks.map(t=>[t.title,t.due,t.rotation].join('|')));
      const rotations=[],tasks=[];
      for(const r of obj.clerk.rotations){
        if(!r||typeof r.name!=='string'||!/\d{4}-\d{2}-\d{2}/.test(r.start)||!/\d{4}-\d{2}-\d{2}/.test(r.end)||r.start>r.end)continue;
        const x={id:uid(),name:r.name.slice(0,60),start:r.start,end:r.end,place:String(r.place||'').slice(0,80)};
        const key=[x.name,x.start,x.end].join('|');if(!prevRot.has(key)){rotations.push(x);prevRot.add(key);}
      }
      for(const t of obj.clerk.tasks){
        if(!t||typeof t.title!=='string'||!t.title.trim())continue;
        const due=String(t.due||'');if(due&&!/^\d{4}-\d{2}-\d{2}$/.test(due))continue;
        const x={id:uid(),title:t.title.slice(0,100),category:CATEGORIES.includes(t.category)?t.category:'其他',due,priority:['low','medium','high'].includes(t.priority)?t.priority:'medium',repeat:['none','daily','weekly'].includes(t.repeat)?t.repeat:'none',rotation:String(t.rotation||'').slice(0,60),note:String(t.note||'').slice(0,300),done:!!t.done,created:localDay()};
        const key=[x.title,x.due,x.rotation].join('|');if(!prevTask.has(key)){tasks.push(x);prevTask.add(key);}
      }
      let newPlan=null;
      if(!plan()&&obj.study&&obj.study.plan){const p=obj.study.plan;
        if(typeof p.lastCompleted==='string'&&typeof p.nextUnit==='string'&&Array.isArray(p.checkpoints)&&p.checkpoints.length<=15){
          newPlan={lastCompleted:p.lastCompleted.slice(0,120),nextUnit:p.nextUnit.slice(0,120),lastUpdated:String(p.lastUpdated||'').slice(0,20),checkpoints:p.checkpoints.filter(x=>x&&typeof x.text==='string').map(x=>({text:x.text.slice(0,180),done:!!x.done}))};
        }
      }
      if(!rotations.length&&!tasks.length&&!newPlan){toast('沒有新的資料可合併，現有資料保持不變。');return;}
      if(!confirm(`將新增 ${rotations.length} 個輪訓、${tasks.length} 個任務${newPlan?'，並載入國考課程進度':''}。既有答題紀錄與完成狀態不會被覆蓋。確定嗎？`))return;
      db.clerk.rotations.push(...rotations);db.clerk.tasks.push(...tasks);if(newPlan)db.study.plan=newPlan;
      save();render();document.querySelector('#backup-dialog')?.close();toast('已成功合併個人資料。');
    }catch(e){toast('合併失敗：'+e.message);}
  };
  importBackup = async function(file){
    if(!file)return;if(file.size>6000000){toast('備份檔案過大。');return;}
    try{
      const v=JSON.parse(await file.text());
      if(v.version!==1||!v.study||!v.clerk||!Array.isArray(v.study.history)||!Array.isArray(v.study.bookmarks)||!v.study.records||!Array.isArray(v.clerk.tasks)||!Array.isArray(v.clerk.rotations))throw Error('格式不正確');
      if(!confirm('此操作將覆蓋目前所有國考與輪訓紀錄，確定還原嗎？'))return;
      db={version:1,study:{records:v.study.records,history:v.study.history,bookmarks:v.study.bookmarks,plan:v.study.plan||null,mockHistory:Array.isArray(v.study.mockHistory)?v.study.mockHistory.slice(-100):[]},clerk:{tasks:v.clerk.tasks,rotations:v.clerk.rotations}};
      save();ui.activeQ=null;render();document.querySelector('#backup-dialog')?.close();toast('備份已完整還原。');
    }catch(e){toast('匯入備份失敗：'+e.message);}
  };
  document.addEventListener('change',e=>{const x=e.target;if(!x.matches('[data-plan-check]'))return;const p=plan(),i=Number(x.dataset.planCheck);if(!p||!Number.isInteger(i)||!p.checkpoints?.[i])return;p.checkpoints[i].done=x.checked;save();render();});
  document.addEventListener('click',e=>{
    const action=e.target.closest('[data-action]')?.dataset.action;
    if(action==='personal-import'){document.querySelector('#backup-dialog')?.showModal();}
    if(action==='ped-quick'){ui.page='study';ui.subject='小兒科';ui.studyMode='official1152';ui.sessionSeen=[];pickQuestion();render();window.scrollTo({top:0,behavior:'smooth'});}
    if(action==='edit-plan'){
      const p=plan()||{lastCompleted:'',nextUnit:'',lastUpdated:'',checkpoints:[]};
      const next=prompt('下一個要學的國考單元：',p.nextUnit||'');if(next===null)return;
      const last=prompt('最近完成的國考單元：',p.lastCompleted||'');if(last===null)return;
      db.study.plan={...p,nextUnit:next.trim().slice(0,120),lastCompleted:last.trim().slice(0,120),lastUpdated:localDay()};save();render();toast('已儲存國考課程進度。');
    }
  });
  const label=document.querySelector('label:has(#import-clerk)');
  if(label?.firstChild)label.firstChild.textContent='＋ 合併個人學習／輪訓資料';
  const note=document.querySelector('#backup-dialog .warning');
  if(note)note.textContent='「匯入備份」會覆蓋所有資料；「合併個人學習／輪訓資料」只加入缺少的輪訓、任務與初始國考課程進度，保留已作答題目與現有任務完成狀態。請勿上傳可識別病人的資料。';
  const footer=document.querySelector('.site-footer');if(footer)footer.textContent=footer.textContent.replace(/v1\.[12]/,'v1.4');
  render();

  // Private one-tap import: the compressed JSON lives only in the link fragment,
  // which browsers do not send to GitHub Pages or the GitHub repository.
  async function importPackFromShareLink(){
    const prefix='#clerkpack=gz1.';
    const hash=window.location.hash;
    if(!hash.startsWith(prefix))return;
    const token=hash.slice(prefix.length);
    // Clear personal data from the address bar/history before any asynchronous work.
    try{history.replaceState(null,'',window.location.pathname+window.location.search);}catch(_){}
    try{
      if(!/^[A-Za-z0-9_-]{1,18000}$/.test(token))throw new Error('匯入連結內容無效或過長');
      if(typeof DecompressionStream!=='function')throw new Error('此瀏覽器不支援解壓縮，請改用最新 Safari 開啟');
      const b64=token.replace(/-/g,'+').replace(/_/g,'/');
      const binary=atob(b64+'='.repeat((4-b64.length%4)%4));
      const compressed=Uint8Array.from(binary,c=>c.charCodeAt(0));
      const stream=new Blob([compressed]).stream().pipeThrough(new DecompressionStream('gzip'));
      const raw=await new Response(stream).text();
      if(raw.length>150000)throw new Error('匯入內容超過限制');
      const data=JSON.parse(raw);
      if(data.version!==1||!data.clerk||!Array.isArray(data.clerk.rotations)||!Array.isArray(data.clerk.tasks)){
        throw new Error('匯入檔案不是 Clerk Studio 個人資料包');
      }
      await importClerkPack(new File([raw],'clerk-studio-personal.json',{type:'application/json'}));
    }catch(error){
      alert('個人資料匯入失敗：'+error.message+'。網站原有資料未被覆蓋。');
    }
  }
  void importPackFromShareLink();
})();