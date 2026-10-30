(function rotationReview(){
'use strict';
const atlas=window.ROTATION_ATLAS;
if(!atlas?.modules?.length||!Array.isArray(window.QUESTION_BANK))return;
let selected='PED',show='all',reviewMode='before';
if(!db.study.rotationUnits||typeof db.study.rotationUnits!=='object')db.study.rotationUnits={};
const done=db.study.rotationUnits;
const phaseMap={completed:'已輪訓',current:'目前輪訓',upcoming:'下一科／待輪訓',source_limited:'輪訓日期待核對',material_only:'僅找到專案資料',core:'跨科核心'};
const style=document.createElement('style');
style.textContent=`
.rot-head{background:linear-gradient(122deg,#eef7ff,#e8f9f3);border:1px solid #d6e6ec;padding:18px;border-radius:16px;margin-bottom:17px}
.rot-head p{font-size:13px;color:#526981;margin:6px 0}
.rot-overflow{display:flex;gap:7px;flex-wrap:wrap;margin:12px 0}
.rot-overflow button{border:1px solid #cedbe8;background:#fff;border-radius:10px;padding:7px 11px;font-weight:650;color:#29506c}
.rot-overflow button.active{background:#daf5ec;border-color:#268a73;color:#145842}
.rot-module{padding:14px;border-radius:12px;background:#fff;border:1px solid #d7e5ed;margin:9px 0}
.rot-unit{border:1px solid #dfe8ec;border-radius:11px;margin:10px 0;padding:13px 14px;background:#fff}
.rot-unit>summary{font-weight:700;cursor:pointer;font-size:15px}
.rot-unit[open]{background:#fbfdfd}
.rot-grid{display:grid;grid-template-columns:1fr 1fr;gap:15px}
.rot-tier{border-left:3px solid #30a88d;padding:9px 12px;margin:9px 0;background:#f3faf8;color:#30475a}
.rot-tier b{display:block;margin-bottom:3px}
.rot-links{display:flex;gap:9px;flex-wrap:wrap;margin:12px 0}
.rot-mini{font-size:12px;color:#6b7f94}
.rot-mark{display:flex;gap:9px;align-items:center;margin:12px 0;padding:9px;background:#f4f8fa;border-radius:9px}
.rot-mark input{height:19px;width:19px}
.rot-stat{border:1px solid #dde7ee;padding:12px;border-radius:11px;background:white}
.rot-meter{height:8px;background:#e6eff4;border-radius:10px;margin-top:8px;overflow:hidden}.rot-meter div{background:#23a389;height:100%}
.rot-quiz-preview{background:#f9fbfd;border:1px dashed #d3e2e8;padding:11px;border-radius:10px;font-size:13px}
.rot-warning{background:#fff8e9;border-left:4px solid #dfa44c;padding:10px;color:#765124;border-radius:5px;margin:12px 0;font-size:13px}
.rot-small-list{font-size:13px;line-height:1.8}
@media(max-width:820px){.rot-grid{grid-template-columns:1fr}.rot-overflow{overflow:auto;flex-wrap:nowrap}.rot-overflow button{flex:0 0 auto}}
`;
document.head.append(style);
for(const sel of ['#desktop-nav','.mobile-nav']){
const nav=document.querySelector(sel);if(!nav||nav.querySelector('[data-page="rotations"]'))continue;
const item=document.createElement('button');item.type='button';item.dataset.page='rotations';item.className=sel[0]==='#'?'nav-item':'';
item.innerHTML=sel[0]==='#'?'<span>▦</span> 各科複習':'<b>▦</b><span>各科</span>';nav.append(item);
}
const oldRender=render;
pageNames.rotations='各科輪訓｜學習、複習、測驗';
render=function(){
 if(ui.page!=='rotations'){oldRender();return}
 ui.page='home';oldRender();ui.page='rotations';document.title=pageNames.rotations+'｜Clerk Studio';
 document.querySelector('#page-heading').textContent=pageNames.rotations;
 document.querySelectorAll('[data-page]').forEach(el=>{
 el.classList.toggle('active',el.dataset.page==='rotations');
 if(el.dataset.page==='rotations')el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');
 });
 document.querySelector('#app').innerHTML=renderRotation();
};
const esc=v=>E(String(v??''));
const units=m=>m.units;
const mod=()=>atlas.modules.find(x=>x.code===selected)||atlas.modules[0];
const isDone=(m,index)=>!!done[m.code+'-'+index];
const doneCount=m=>m.units.filter((_,i)=>isDone(m,i)).length;
function stats(m){
 const q=BANK.filter(x=>x.subject===m.label),origin=q.filter(x=>x.kind==='official-derived');
 const answered=new Set(db.study.history.filter(x=>q.some(z=>z.id===x.id)).map(x=>x.id));
 const wrong=q.filter(x=>(db.study.records[x.id]?.wrong||0)>0&&Number(db.study.records[x.id]?.streak||0)===0);
 const pending=q.filter(x=>isDue(db.study.records[x.id]));
 return {count:q.length,official:origin.length,answered:answered.size,wrong:wrong.length,pending:pending.length};
}
function titleBar(){
 const m=mod(),s=stats(m),d=doneCount(m);
 return `<div class="rot-head"><div class="eyebrow">EXAM-FIRST · PERSONAL ROTATION ATLAS</div><h2>你 run 過的科別，一次接成完整複習系統</h2>
 <p>① 國考一階骨架 → ② 二階鑑別 → ③ 臨床實務與 OSCE/EPA → ④ 115-2 正式題目考點改寫 → ⑤ 錯題間隔複習。優先近年真題主題，但本站不是官方題目原文。</p>
 <p>📂 已核對專案庫根目錄、當期課表，以及可讀取的 ENT／TRA 學習文件；部分專案資料夾內文或過去聊天室並未全部提供給此網站，未核實者有明確標記。</p>
 <div class="rot-overflow">${[['all','全部'],['completed','已輪訓'],['current','目前'],['upcoming','即將'],['material_only','資料存檔']].map(([v,t])=>`<button type="button" data-rot-filter="${v}" class="${show===v?'active':''}">${t}</button>`).join('')}</div>
 <div class="rot-overflow">${atlas.modules.filter(m=>show==='all'||m.phase===show||(show==='completed'&&m.phase==='source_limited')||(show==='material_only'&&m.phase==='core')).map(x=>`<button type="button" data-rot-select="${x.code}" class="${x.code===selected?'active':''}">${esc(x.code)}</button>`).join('')}</div>
 <div class="rot-grid"><div class="rot-stat"><b>${esc(m.label)}</b>　<span class="badge blue">${phaseMap[m.phase]||'待核實'}</span>
 <div class="rot-mini">${esc(m.dates)}</div><div class="rot-mini">國考與自編題：${s.official} 題官方考點改寫 + ${s.count-s.official} 題原創；已練 ${s.answered} 題</div></div>
 <div class="rot-stat"><b>本科研讀進度：${d} / ${m.units.length} 單元</b><div class="rot-meter"><div style="width:${Math.round(d/m.units.length*100)}%"></div></div>
 <div class="rot-mini">錯題 ${s.wrong}｜待複習 ${s.pending}｜狀態只根據本機真實紀錄</div></div></div>
 </div>`;
}
function unitMarkup(m,x,i){
 const checked=isDone(m,i);
 const [name,l1,l2,l3,osce,q,opts,ans]=x;
 return `<details class="rot-unit" ${i===0?'open':''}><summary>${i+1}. ${esc(name)} <span class="badge ${checked?'green':''}">${checked?'✓ 已讀':'待學'}</span></summary>
 <div class="rot-tier"><b>Level 1｜一階基礎・先懂一句</b>${esc(l1)}</div>
 <div class="rot-tier"><b>Level 2｜二階國考・鑑別</b>${esc(l2)}</div>
 <div class="rot-tier"><b>Level 3｜臨床床邊判斷</b>${esc(l3)}</div>
 <div class="rot-tier"><b>OSCE / EPA｜操作／問診</b>${esc(osce)}</div>
 <div class="rot-quiz-preview"><b>先閉書作答：</b>${esc(q)}<br><details><summary>顯示 First Choice 答案</summary>
 ${esc(opts[ans])}<br><span class="rot-mini">易錯選項：${esc(opts.filter((_,j)=>j!==ans).join(' / '))}</span></details></div>
 <label class="rot-mark"><input type="checkbox" data-rot-unit="${m.code}-${i}" ${checked?'checked':''}>今天已能用自己的話解釋、完成小測驗</label>
 <div class="rot-links">${button('從這題開始練習 →','rot-single-'+m.code+'-'+i,'primary')}
 ${button('→ 複習本章錯題','rot-wrong-'+m.code,'ghost small')}</div>
 </details>`;
}
function quickReview(m){
 const pending=m.units.map((x,i)=>({name:x[0],i,learned:isDone(m,i)})).filter(x=>!x.learned).slice(0,4);
 return `<section class="card"><div class="card-head"><div><h2>⏳ 4 單元精簡複習</h2><p>依尚未完成的單元選取；同科真題優先。</p></div></div>
 <ol class="rot-small-list">${pending.length?pending.map(x=>`<li>${esc(x.name)}</li>`).join(''):'<li>各單元已標完成；建議轉做最近的錯題。</li>'}</ol>
 <div class="rot-links">${button('🔥 115-2 本科考點','rot-latest','primary')}${button('全部本科練習','rot-all','secondary')}
 ${button('模擬考（本科）','rot-mock','ghost')}</div>
 <p class="rot-mini">限時模擬考從本科研讀題庫選題，先抽最新官方考點改寫，再用原創題補足；若本科尚無官方題，僅作原創測驗，不冒稱歷屆。</p>
 </section>`;
}
function renderRotation(){
 const m=mod(),s=stats(m);
 return titleBar()+`<div class="rot-grid"><div>
 <section class="card"><h2>🩺 ${esc(m.label)}｜從自己的輪訓經驗再學一次</h2>
 <div class="rot-warning">證據層級：${m.phase==='source_limited'?'科別日期與資料有衝突，僅作主題複習，不標示已確認經歷。':m.phase==='material_only'?'找到資料夾，但未能證實已 run 過。':'以已知輪訓摘要及可讀取資料為錨點，未能保證已涵蓋所有原始專案內容。'}</div>
 <p class="rot-mini"><b>來源：</b>${m.source.map(esc).join('、')}</p>
 <p><b>實習案例／技能主軸（已去識別）：</b></p>
 <div class="rot-small-list">${m.caseAnchors.map(x=>'• '+esc(x)).join('<br>')}</div>
 <div class="rot-links"><a href="https://wwwq.moex.gov.tw/exam/wFrmExamQandASearch.aspx?e=115070&y=2026" target="_blank" rel="noopener noreferrer">考選部 115-2 原始試卷 ↗</a></div></section>
 <section class="card" style="margin-top:16px"><div class="card-head"><div><h2>📚 系統教學：${m.units.length} 個必懂單元</h2><p>第一次學先看 Level 1，第二次只抓 Level 2/3，第三次做小測驗。</p></div></div>
 ${units(m).map((x,i)=>unitMarkup(m,x,i)).join('')}</section></div>
 <div>${quickReview(m)}
 <section class="card" style="margin-top:15px"><h2>📊 本科複習統計</h2>
 ${statCard('目前題庫',s.count+' 題','其中官方 115-2 考點改寫 '+s.official)}
 ${statCard('實際答過',s.answered+' 題','跨裝置不自動同步')}
 ${statCard('目前錯題',s.wrong+' 題','只依實際作答')}
 <div class="rot-links">${button('今日待複習 →','rot-due','secondary')}${button('所有題目 →','rot-all','ghost')}</div></section>
 <section class="card" style="margin-top:15px"><h2>🔐 資料完整性</h2>
 <p class="rot-mini">網站不會自動讀取任何 ChatGPT 專案聊天室、Google Drive 全部檔案或院內病歷。這批整理為可查證的匿名主題與教學題。近年國考題均是重寫的「同考點新題」，原題請點考選部試題來源逐題核對。</p></section>
 </div></div>`;
}
function gotoPractice(mode,questionId=null){
 const m=mod();ui.page='study';ui.subject=m.label;ui.studyMode=mode;ui.sessionSeen=[];ui.activeQ=null;ui.answer=null;
 if(questionId){ui.studyMode='all';ui.activeQ=questionId;ui.sessionSeen=[questionId]}else pickQuestion();
 render();window.scrollTo({top:0,behavior:'smooth'});
}
document.addEventListener('click',e=>{
 const filter=e.target.closest('[data-rot-filter]');if(filter){show=filter.dataset.rotFilter;render();return}
 const choose=e.target.closest('[data-rot-select]');if(choose){selected=choose.dataset.rotSelect;render();return}
 const action=e.target.closest('[data-action]')?.dataset.action;
 if(!action?.startsWith('rot-')||ui.page!=='rotations')return;
 if(action.startsWith('rot-single-')){const x=action.slice(11).split('-');const code=x[0],i=Number(x[1]);const m=atlas.modules.find(r=>r.code===code);if(m){selected=code;gotoPractice('all','ROT-'+code+'-'+String(i+1).padStart(2,'0'));}return;}
 if(action.startsWith('rot-wrong-')){selected=action.slice(10);gotoPractice('wrong');return}
 if(action==='rot-latest')gotoPractice('official1152');
 if(action==='rot-all')gotoPractice('all');
 if(action==='rot-due')gotoPractice('due');
 if(action==='rot-mock'){
  const m=mod();ui.subject=m.label;ui.page='study';render();
  if(typeof window.startRotationMock==='function')window.startRotationMock(m.label);else toast('模擬考尚未載入，請重新整理');
 }
});
document.addEventListener('change',e=>{
 const key=e.target.dataset?.rotUnit;if(!key)return;
 done[key]=!!e.target.checked;save();if(ui.page==='rotations')render();
});
})();