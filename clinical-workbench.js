(function clinicalWorkbench(){
'use strict';
const kit=window.CLINICAL_TOOLKIT;
if(!kit)return;
const state={mode:'note',department:'PED',note:'SOAP',field:{},report:'minute',reportText:{},patientList:'',phone:{},topic:0,procedure:'HANDOFF',notesPreview:[]};
const style=document.createElement('style');style.textContent=`
.clinic-intro{background:linear-gradient(120deg,#ebf7ff,#effbf6);padding:17px;border:1px solid #d8e8ef;border-radius:14px;margin-bottom:15px}
.clinic-tabs{display:flex;flex-wrap:wrap;gap:7px;margin:14px 0}
.clinic-tabs button{padding:8px 11px;border:1px solid #d7e4eb;background:white;border-radius:10px;color:#3e5670;font-weight:650}
.clinic-tabs button.active{border-color:#268fa6;background:#e7f7f3;color:#15604e}
.clinic-field{margin:12px 0}.clinic-field label{display:block;font-weight:650;margin-bottom:5px}
.clinic-field textarea,.clinic-field input,.clinic-field select,.clinic-select{width:100%;min-width:0;box-sizing:border-box;background:#fff;border:1px solid #ccd9e6;border-radius:9px;padding:10px 11px;color:#24364c;font:inherit}
.clinic-field textarea{min-height:78px;resize:vertical}.clinic-field.small textarea{min-height:55px}
.clinic-layout{display:grid;grid-template-columns:1fr 1.1fr;gap:15px}.clinic-pre{white-space:pre-wrap;word-break:break-word;background:#f7fafc;border:1px solid #e1e8ee;padding:11px;border-radius:10px;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:12.8px;line-height:1.65}
.clinic-copyrow{padding:11px;border:1px solid #e4eaf1;border-radius:12px;margin:8px 0;background:#fff}.clinic-copyrow .clinic-copyhead{display:flex;justify-content:space-between;gap:8px;align-items:center;margin-bottom:6px}
.clinic-copyrow button{border:1px solid #bdd5df;background:#e9f6f2;color:#176355;padding:5px 9px;border-radius:8px;font-weight:650}
.clinic-muted{font-size:12px;color:#5c7085}.clinic-alert{border-left:4px solid #c88028;padding:11px;background:#fff9ef;color:#6d4a16;border-radius:6px;margin:10px 0}
.clinic-tier{border-left:4px solid #31a58b;background:#f7fcfb;padding:12px;margin:11px 0;border-radius:6px}.clinic-tier b{display:block}
.clinic-formcheck{display:flex;gap:8px;align-items:center;margin:6px 0}.clinic-pair{display:grid;grid-template-columns:1fr 1fr;gap:9px}
.clinic-q{border-bottom:1px solid #e1e7ef;padding:9px 0}.clinic-q b{display:block}.clinic-q span{color:#4a6276}
.clinic-require{border:1px solid #e3eaf0;padding:12px;border-radius:11px;margin:9px 0}
.clinic-verify{color:#a05e27;font-weight:750}.clinic-ok{color:#177c65;font-weight:750}
.clinic-summary{font-size:13px;background:#f4f8fb;padding:12px;border-radius:10px}
@media(max-width:830px){.clinic-layout{grid-template-columns:1fr}.clinic-pair{grid-template-columns:1fr}}
`;document.head.append(style);
for(const [selector,label,icon] of [['#desktop-nav','臨床助手','🩺'],['.mobile-nav','臨床','✚']]){
  const nav=document.querySelector(selector);if(!nav || nav.querySelector('[data-page="clinical"]'))continue;
  const btn=document.createElement('button');btn.type='button';btn.dataset.page='clinical';btn.className=selector.startsWith('#')?'nav-item':'';
  btn.innerHTML=selector.startsWith('#')?`<span>${icon}</span> ${label}`:`<b>${icon}</b><span>${label}</span>`;nav.append(btn);
}
pageNames.clinical='Clerk 臨床助手・國考優先';
const origRender=render;
render=function(){
  if(ui.page!=='clinical')return origRender();
  ui.page='home';origRender();ui.page='clinical';
  document.title='Clerk 臨床助手｜Clerk Studio';
  const heading=document.querySelector('#page-heading');if(heading)heading.textContent=pageNames.clinical;
  document.querySelectorAll('[data-page]').forEach(b=>{b.classList.toggle('active',b.dataset.page==='clinical');if(b.dataset.page==='clinical')b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
  document.querySelector('#app').innerHTML=clinicalHTML();
};
function enc(s){return E(s==null?'':String(s))}
function val(obj,key){return String(obj[key]||'').trim()}
function missing(key){return `[TO VERIFY: ${key}]`}
function field(key,label,hint='',rows=2,obj=state.field){return `<div class="clinic-field"><label for="c-${key}">${enc(label)}</label><textarea data-clinical-input="${key}" id="c-${key}" data-area="${obj===state.reportText?'report':obj===state.phone?'phone':obj===state.field?'note':'round'}" rows="${rows}" placeholder="${enc(hint)}">${enc(val(obj,key))}</textarea></div>`;}
function noteSections(){
  const note=kit.noteTypes[state.note],english=!(state.department==='PSY'||note.lang==='中文');
  const p=(k,label)=>val(state.field,k)|| (english?missing(label):`【待核實：${label}】`);
  const zh={S:'主觀症狀 S',O:'客觀資料 O',A:'評估 A',P:'計畫 P','Chief Complaint':'主訴','Informant / Reliability':'資料來源與可靠性','History of Present Illness':'現病史','Past Medical / Surgical History':'過去病史與手術史','Medication / Allergy / Family / Social History':'藥物／過敏／家族及社會史','Review of Systems':'系統回顧','Physical Examination':'身體檢查','Laboratory / Imaging':'檢查與影像','Impression / Problem List':'臨床判斷與問題清單','Management Plan':'處置計畫','Reason for Admission':'入院原因','Clinical Course This Week':'本週病程','Important Investigations':'重要檢查','Current Problems / Assessment':'目前問題與評估','Plan for Coming Week':'下週計畫','Patient Summary':'病人摘要','Current Condition':'目前狀況','Active Problems':'主要問題','Pending Studies / Tasks':'待追蹤項目','Contingency / Escalation':'惡化時通報與處置','Admission Diagnosis':'入院診斷','Discharge Diagnosis':'出院診斷','Hospital Course':'住院經過','Condition at Discharge':'出院狀況','Discharge Medication and Follow-up':'出院用藥與追蹤','Pending Results':'待追蹤結果','Reason for Transfer':'轉入／轉出原因','Course Before Transfer':'轉入前病程','Condition upon Acceptance':'接收時病況','Plan / Pending':'治療與待辦計畫'};
  const out=note.sections.map(([heading,label,key])=>({heading:english?heading:(zh[heading]||label),text:p(key,label)}));
  if(state.note==='SOAP'){
    const obj=out.find(x=>x.heading===(english?'Objective':'客觀資料 O'))||out[1];
    if(obj){obj.text+=`\n${english?'Pain score / site / quality':'疼痛評估'}: ${p('pain','pain score, location, character')}\n${english?'Analgesic response / extra requirement':'藥物反應與是否加用'}: ${p('treatmentResponse','response and rescue analgesics')}`;}
  }else if(['WEEKLY','OFFDUTY'].includes(state.note)&&val(state.field,'pain')){
    out.push({heading:english?'Pain / treatment response':'疼痛與處置反應',text:p('pain','pain')+'\n'+p('treatmentResponse','response')});
  }
  return out;
}
function fullNote(){
  const sections=noteSections();
  return sections.map(x=>`${x.heading}:\n${x.text}`).join('\n\n');
}
function sectionRows(sections,kind){
return sections.map((s,i)=>`<div class="clinic-copyrow"><div class="clinic-copyhead"><strong>${enc(s.heading)}</strong><button type="button" data-clinic-copy="${kind}" data-copy-idx="${i}">複製此欄</button></div><div class="clinic-pre">${enc(s.text)}</div></div>`).join('');
}
function clinicalHTML(){
  const options=Object.entries(kit.rules).map(([k,r])=>`<option value="${k}" ${k===state.department?'selected':''}>${enc(r.label)}</option>`).join('');
  const tabs=[['note','📝 病歷'],['learn','📚 預習複習'],['report','🎙 報告'],['round','🩺 查房 Q/A'],['phone','☎️ 值班電話'],['requirements','✅ 科部繳交']].map(([v,label])=>`<button data-clinic-tab="${v}" class="${state.mode===v?'active':''}">${label}</button>`).join('');
  const header=`<div class="clinic-intro"><div class="eyebrow">EXAM-FIRST CLINICAL WORKSPACE</div><h2>國考骨架 → 臨床判讀 → OSCE/EPA → 直接可用的工作產物</h2>
  <p class="clinic-muted">以 3–5 分鐘抓重點；正式臨床紀錄只用已核對資料。此為本機模板／提示詞助手，非連線 AI；不讀取 HIS、CePO 或患者病歷。</p>
  <div class="clinic-pair"><div><label class="clinic-muted">目前科別</label><select class="clinic-select" id="clinic-department">${options}</select></div>
  <div class="clinic-summary"><b>${enc(kit.rules[state.department].label)}</b><br>${kit.rules[state.department].verified?'<span class="clinic-ok">已取得該科部分交班規則</span>':'<span class="clinic-verify">本科期限尚待正式公告核對</span>'}</div></div></div>
  <div class="clinic-tabs">${tabs}</div>`;
  return header+({note:renderNote,learn:renderLearn,report:renderReport,round:renderRound,phone:renderPhone,requirements:renderRequirements}[state.mode])();
}
function renderNote(){
  const n=kit.noteTypes[state.note],language=(state.department==='PSY'?'中文':n.lang);
  const select=Object.entries(kit.noteTypes).map(([k,v])=>`<option value="${k}" ${k===state.note?'selected':''}>${enc(v.name)}</option>`).join('');
  const keys=[...new Set([...n.sections.map(x=>x[2]),...n.additional])];
  const glossary={subjective:'只記錄有意義的症狀變化、否定症狀需實際問過。',objective:'VS、PE、檢驗／影像，日期與數值必須核對。',assessment:'Problem list、可能性、改善或惡化的依據。',plan:'診斷／治療／監測／衛教；不得自動臆測藥物劑量。',pain:'量表、疼痛部位、性質、嚴重度。',treatmentResponse:'疼痛藥物療效、是否需要額外止痛；無資料保持待確認。'};
  const input=keys.map(k=>field(k,k.toUpperCase().replace('TREATMENTRESPONSE','Analgesic response / extra analgesics'),glossary[k]||'只填可由病歷、直接訪談或實際檢查核對的事實',k==='hpi'||k==='course'?4:2)).join('');
  const noteParts=noteSections();
  const warning=n.required.filter(k=>!val(state.field,k));
  state.notesPreview=noteParts;
  return `<section class="card"><div class="card-head"><div><h2>📝 病歷格式工作台</h2><p>書面病歷：${enc(language)}；全人照護：中文；精神科：中文。只產生可核對的草稿模板。</p></div></div>
    <div class="clinic-pair"><div class="clinic-field"><label>病歷類型</label><select class="clinic-select" id="clinic-note-type">${select}</select></div>
    <div class="clinic-alert"><b>病人資料安全：</b>請勿在公開 Repo 或網站留下姓名、病歷號、生日。本站此頁輸入不自動保存或上傳，離開／重整將清空。</div></div>
    <div class="clinic-layout"><div><h3>已核對資料輸入（空白不推論）</h3>${input}</div>
    <div><h3>逐欄可複製病歷</h3><p id="clinic-missing" class="clinic-muted">${warning.length?`尚缺 ${warning.length} 個必填資訊：${enc(warning.join('、'))}`:'必填欄位已輸入；仍需查核臨床內容及格式'}</p>
      <div id="clinic-note-preview">${sectionRows(noteParts,'note')}</div>
      <div class="btn-row"><button type="button" class="primary" data-clinic-copy="note-all">複製整份草稿</button><button type="button" class="secondary" data-clinic-action="clear-note">清除輸入</button></div>
      <p class="clinic-muted">可貼至 ChatGPT 要求依科別／學長高分格式改寫，但須再次核實未證實數值與醫囑。正式送出前由本人與帶教醫師確認。</p></div></div>
  </section>`;
}
function topics(){return kit.education[state.department]||kit.education.PED;}
function renderLearn(){
  const available=topics(),topic=available[Math.min(state.topic,available.length-1)];
  const proc=kit.procedures[state.procedure];
  return `<section class="card"><div class="card-head"><div><h2>📚 課前預習／課後複習</h2><p>每次優先抓 1 個主題，國考第一階段基礎 → 第二階段 → 現場實作</p></div></div>
  <div class="clinic-pair"><div class="clinic-field"><label>學習主題</label><select id="clinic-topic" class="clinic-select">${available.map((x,i)=>`<option value="${i}" ${i===state.topic?'selected':''}>${enc(x.name)}</option>`).join('')}</select></div>
  <div class="clinic-field"><label>OSCE / EPA 操作重點</label><select id="clinic-procedure" class="clinic-select">${Object.entries(kit.procedures).map(([k,v])=>`<option value="${k}" ${k===state.procedure?'selected':''}>${enc(v.title)}</option>`).join('')}</select></div></div>
  <div class="clinic-tier"><b>Level 1｜國考一階骨架</b>${enc(topic.l1)}</div>
  <div class="clinic-tier"><b>Level 2｜國考二階鑑別</b>${enc(topic.l2)}</div>
  <div class="clinic-tier"><b>Level 3｜臨床判斷</b>${enc(topic.clinical)}</div>
  <div class="clinic-tier"><b>OSCE / EPA 技能與問診</b>${enc(topic.osce)}</div>
  <h3>老師常問（先答再看）</h3>${topic.qa.map(([q,a],i)=>`<div class="clinic-q"><b>Q${i+1}. ${enc(q)}</b><details><summary>看答案</summary><span>${enc(a)}</span></details></div>`).join('')}
  <div class="divider"></div><h3>${enc(proc.title)}｜操作步驟與安全檢查</h3><ol>${proc.steps.map(x=>`<li>${enc(x)}</li>`).join('')}</ol>
  <p class="clinic-muted">需在合格師長監督、依院內 SOP 執行；各科特定流程及給藥仍以正式教學與最新指引為準。</p>
  <button type="button" class="primary" data-clinic-copy="learn">複製本單元國考＋OSCE重點</button></section>`;
}
function reportSpec(){
const k=state.report;
return ({
 minute:{name:'One-minute summary',fields:[['background','背景（年齡性別／入院主因）'],['problem','目前主問題與重要證據'],['course','重要時間軸與治療'],['current','今日重點檢查及病況'],['plan','今日計畫與待追蹤']]},
 case:{name:'Case report',fields:[['background','Introduction/Background'],['problem','Case presentation'],['course','Hospital course'],['current','Diagnostic reasoning'],['plan','Discussion / Learning points']]},
 review:{name:'Review',fields:[['background','Clinical question / scope'],['problem','Background concepts'],['course','Comparison of evidence'],['current','Guideline / controversy'],['plan','Clinical takeaways']]},
 ebm:{name:'EBM',fields:[['background','P (Population/Patient)'],['problem','I (Intervention)'],['course','C (Comparison)'],['current','O (Outcome)'],['plan','Evidence, quality & application']]}
})[k];
}
function reportFullText(){
 if(state.report!=='minute')return reportParts().map(x=>x.heading+':\n'+x.text).join('\n\n');
 const p=k=>val(state.reportText,k)||'【待核實】';
 return p('background')+'。本次主要問題為'+p('problem')+'。重要病程及處置：'+p('course')+'。目前病況與關鍵資料：'+p('current')+'。接下來的計畫：'+p('plan')+'。';
}
function reportParts(){
const spec=reportSpec(),isMinute=state.report==='minute';
const p=k=>val(state.reportText,k)||(isMinute?'【資料待核對】':'[TO VERIFY]');
const hs=spec.fields;
return hs.map(([k,label])=>({heading:label,text:p(k)}));
}
function renderReport(){
const spec=reportSpec();const rows=reportParts();
return `<section class="card"><div class="card-head"><div><h2>🎙 報告產生器</h2><p>預設一分鐘摘要中文為主，專業詞中英並列；case / review / EBM 符合報告結構。</p></div></div>
<div class="clinic-field"><label>報告種類</label><select id="clinic-report-type" class="clinic-select">${Object.entries({minute:'One-minute summary（約 60 秒）',case:'Case report',review:'Review / Topic report',ebm:'Evidence-based medicine（PICO）'}).map(([k,n])=>`<option value="${k}" ${state.report===k?'selected':''}>${n}</option>`).join('')}</select></div>
<div class="clinic-layout"><div>${spec.fields.map(([key,label])=>field(key,label,'請貼經核實的重點，無資料先空白',2,state.reportText)).join('')}</div>
<div><h3>${enc(spec.name)}｜報告架構</h3><div id="clinic-report-preview">${sectionRows(rows,'report')}</div>
<h3>可直接使用的報告草稿</h3><div class="clinic-pre" id="clinic-report-final">${enc(reportFullText())}</div><div class="btn-row"><button class="primary" type="button" data-clinic-copy="report-all">複製完整報告草稿</button><button type="button" class="secondary" data-clinic-copy="report-prompt">複製 ChatGPT 深度改寫指令</button></div>
<p class="clinic-muted">此頁不會自行查文獻或推論缺少的病歷；正式引用須逐一核對原文。60 秒口頭報告應主動刪減非關鍵資訊。</p></div></div></section>`;
}
function renderRound(){
 const topic=topics()[Math.min(state.topic,topics().length-1)];
 const qas=topics().flatMap(x=>x.qa.map(([q,a])=>({topic:x.name,q,a}))).slice(0,10);
 return `<section class="card"><h2>🩺 查房可能 Q/A｜5–10 個高頻重點</h2>
 <div class="clinic-alert">將當天 patient list 先去識別（移除姓名、病歷號、生日、聯絡資料）。本頁只能做通用科別重點與產生提示詞；**無法離線自動讀取或分析真正的病人病歷**。帶教醫師提問以當天情況為主。</div>
 ${field('patientList','匿名 patient list / 病人問題清單（可留空）','例如：7y boy, pneumonia, oxygen nasal cannula; key problems ...',5,{patientList:state.patientList})}
 <div class="btn-row"><button class="primary" type="button" data-clinic-copy="round-prompt">複製要貼給 ChatGPT 的查房指令</button></div>
 <h3 style="margin-top:20px">本科技能與概念速覽</h3>
 <div class="clinic-tier"><b>先熟悉：${enc(topic.name)}</b>${enc(topic.l1)}<br><small>${enc(topic.clinical)}</small></div>
 ${qas.map((x,i)=>`<div class="clinic-q"><b>${i+1}. [${enc(x.topic)}] ${enc(x.q)}</b><details><summary>顯示精簡答覆</summary><span>${enc(x.a)}</span></details></div>`).join('')}
 </section>`;
}
function sbar(){
const p=(k,n)=>val(state.phone,k)||`[確認 ${n}]`;
return [
 {heading:'S — Situation',text:p('situation','病人問題及當下變化／開始時間')},
 {heading:'B — Background',text:p('background','入院診斷、病史、既往處置')},
 {heading:'A — Assessment',text:`Latest vitals: ${p('vitals','BP/HR/RR/SpO₂/T、量測時間')}\nFindings: ${p('assessment','重點理學檢查／最新檢驗及趨勢')}`},
 {heading:'R — Recommendation',text:p('request','想請學長姐評估的問題與是否需要到場')},
 {heading:'Read-back / Follow-up',text:'[確認上級指示、醫囑、執行與複評時間；病情惡化即升級求援]'}
];}
function renderPhone(){
const list=[['situation','現在發生什麼、何時發生'],['background','背景與已知診斷／目前治療'],['vitals','最新時間與完整生命徵象'],['assessment','重點 PE、檢查／趨勢、已完成處理'],['request','希望學長姐決定或到場協助事項']];
const parts=sbar();
return `<section class="card"><h2>☎️ 值班電話與向學長姐報告：SBAR</h2>
<div class="clinic-alert"><b>危急立即求援：</b>意識改變、持續低氧、呼吸窘迫、休克／出血、癲癇、急性胸痛、嚴重疼痛或快速惡化，先遵循院內緊急應變及 call senior／主治。此網站不產生醫囑。</div>
<div class="clinic-layout"><div>${list.map(([k,t])=>field(k,t,'請先實際量測或確認',2,state.phone)).join('')}</div>
<div><div id="clinic-phone-preview">${sectionRows(parts,'phone')}</div>
<button type="button" class="primary" data-clinic-copy="phone-all">複製 SBAR 電話講稿</button></div></div>
<h3 style="margin-top:20px">接電話後的安全流程</h3><ol>${kit.procedures.HANDOFF.steps.map(x=>`<li>${enc(x)}</li>`).join('')}</ol>
<p class="clinic-muted">如果長官問到不確定的檢驗、藥名或劑量：明確說「我現在核對後回報」，避免猜測。處置須完成 read-back 和上級確認。</p></section>`;
}
function renderRequirements(){
const rule=kit.rules[state.department];
return `<section class="card"><div class="card-head"><div><h2>✅ 科部規定／繳交總表</h2><p>${enc(rule.origin||'目前僅為通用清單，請用科部正式教學通知核實')}</p></div></div>
<div class="clinic-alert">${rule.verified?'<b>小兒科：已取得部分正式交班規則，但個別病人與老師指示仍須核實。</b>':'<b>尚未取得此科當梯次正式期限：</b>下列不能當作已確認繳交規定。'}</div>
${rule.period?`<p class="clinic-summary"><b>輪訓期間：</b>${enc(rule.period)}<br>最後工作日通常為 11/06（週五），輪訓名義結束為 11/08。Off-duty 週五交班；CePO 需在 11/08 前起單。實際截止仍以科部公告為準。</p>`:''}
${rule.items.map(([name,detail,due])=>`<div class="clinic-require"><b>${enc(name)}</b><p style="margin:6px 0">${enc(detail)}</p><span class="badge blue">${enc(due)}</span></div>`).join('')}
<div class="btn-row"><button type="button" class="primary" data-clinic-action="add-requirements">加入輪訓待辦（跳過重複）</button><button type="button" class="secondary" data-clinic-copy="requirements">複製科部清單</button></div>
<p class="clinic-muted">這只會新增 Clerk Studio 本機待辦，不會寫入 Google Calendar 或 CePO，也不會自行傳送提醒。</p></section>`;
}
function previewRefresh(){
if(ui.page!=='clinical')return;
const output=(state.mode==='note')?{id:'#clinic-note-preview',rows:noteSections(),kind:'note'}:state.mode==='report'?{id:'#clinic-report-preview',rows:reportParts(),kind:'report'}:state.mode==='phone'?{id:'#clinic-phone-preview',rows:sbar(),kind:'phone'}:null;
if(!output)return;
const node=document.querySelector(output.id);if(!node)return;
node.innerHTML=sectionRows(output.rows,output.kind);
if(state.mode==='report'){const full=document.querySelector('#clinic-report-final');if(full)full.textContent=reportFullText();}
if(state.mode==='note'){
state.notesPreview=output.rows;
const warn=kit.noteTypes[state.note].required.filter(x=>!val(state.field,x)),el=document.querySelector('#clinic-missing');
if(el)el.textContent=warn.length?`尚缺 ${warn.length} 個必填資訊：${warn.join('、')}`:'必填欄位已輸入；仍須人工查證病歷與醫囑';
}
}
function copyText(text){
if(navigator.clipboard?.writeText){navigator.clipboard.writeText(text).then(()=>toast('已複製到剪貼簿。')).catch(()=>fallback(text));}
else fallback(text);
}
function fallback(text){const a=document.createElement('textarea');a.value=text;document.body.append(a);a.select();const ok=document.execCommand('copy');a.remove();toast(ok?'已複製。':'複製失敗，請長按文字自行選取。');}
function reportPrompt(){
 const p=reportParts().map(x=>`${x.heading}: ${x.text}`).join('\n');
 return `請依下列已核實、已去識別化資料，撰寫 ${reportSpec().name}。${state.report==='minute'?'中文為主、專業詞中英並列、控制在 60 秒可唸完。':'請依醫學報告慣例，精簡、邏輯清楚。'}\n請遵守：只使用提供的事實；不自創檢驗數值、用藥或病情；不確定處標示待核實，區分 suspected vs confirmed；另列最重要的 5 個國考／臨床追問。\n\n${p}`;
}
function roundPrompt(){
 return `請將以下【已去識別化】${kit.rules[state.department].label} patient list 整理為查房速讀筆記：\n1. 先辨識每床的主問題與重要風險，不混合不同病人；不可自創醫囑、病史、生命徵象或檢查結果。\n2. 對每床提出 5–10 個老師最可能問的高頻 Q/A，依 Level 1（一階基礎）→ Level 2（二階診斷治療）→ Level 3（床邊、OSCE、EPA）排序。\n3. 先列 5–10 項最重要知識點，再用中文為主、重要英文詞中英並列，精簡但有臨床邏輯。\n4. 標明哪些推論需要查病歷／補檢查；用近期台灣國考考點優先。\n\n匿名資料：\n${state.patientList||'[尚未提供 patient list，請先給科別通用高頻教學題。]'}`;
}
function requirementsText(){const r=kit.rules[state.department];return `${r.label}\n${r.verified?'部分已核實':'正式日期／項目待核實'}\n`+r.items.map(x=>`${x[0]}：${x[1]}｜${x[2]||'待確認'}`).join('\n');}
function addRequirementTasks(){
const r=kit.rules[state.department],already=new Set(db.clerk.tasks.map(x=>x.title));let n=0;
for(const [name,detail,due] of r.items){const title=r.label+'｜'+name;if(already.has(title))continue;makeTask({title,category:'行政',due:'',priority:'medium',repeat:'none',rotation:state.department,note:`${detail}｜${due||'時限待確認'}`.slice(0,300)});already.add(title);n++;}
toast('已加入 '+n+' 個待辦，無確認日期的項目沒有自動指定截止時間。');render();
}
document.addEventListener('change',e=>{
 const t=e.target;if(!t||ui.page!=='clinical')return;
 switch(t.id){
 case 'clinic-department':state.department=t.value;state.topic=0;render();break;
 case 'clinic-note-type':state.note=t.value;state.field={};render();break;
 case 'clinic-topic':state.topic=Number(t.value)||0;render();break;
 case 'clinic-procedure':state.procedure=t.value;render();break;
 case 'clinic-report-type':state.report=t.value;state.reportText={};render();break;
 }
});
document.addEventListener('input',e=>{
 const t=e.target;if(!t?.dataset?.clinicalInput||ui.page!=='clinical')return;
 const key=t.dataset.clinicalInput;
 if(t.dataset.area==='round'){state.patientList=t.value;}
 else if(t.dataset.area==='report')state.reportText[key]=t.value;
 else if(t.dataset.area==='phone')state.phone[key]=t.value;
 else state.field[key]=t.value;
 previewRefresh();
});
document.addEventListener('click',e=>{
const tab=e.target.closest('[data-clinic-tab]');if(tab){state.mode=tab.dataset.clinicTab;ui.page='clinical';render();return;}
const btn=e.target.closest('[data-clinic-copy]');if(btn){
 const kind=btn.dataset.clinicCopy,idx=Number(btn.dataset.copyIdx||0);
 const sections=kind==='note'?noteSections():kind==='report'?reportParts():kind==='phone'?sbar():[];
 const all=xs=>xs.map(x=>x.heading+':\n'+x.text).join('\n\n');
 const output=kind==='note-all'?fullNote():kind==='report-all'?reportFullText():kind==='phone-all'?all(sbar()):kind==='note'||kind==='report'||kind==='phone'?all([sections[idx]]):kind==='requirements'?requirementsText():
 kind==='round-prompt'?roundPrompt():kind==='report-prompt'?reportPrompt():kind==='learn'?`${topics()[Math.min(state.topic,topics().length-1)].name}\n${[topics()[Math.min(state.topic,topics().length-1)].l1,topics()[Math.min(state.topic,topics().length-1)].l2,topics()[Math.min(state.topic,topics().length-1)].clinical,topics()[Math.min(state.topic,topics().length-1)].osce].join('\n')}\n${kit.procedures[state.procedure].steps.join('\n')}`:'';
 if(output)copyText(output);
 return;
}
const action=e.target.closest('[data-clinic-action]')?.dataset.clinicAction;
if(action==='clear-note'){if(confirm('確定清空本次草稿輸入？')){state.field={};render();}}
if(action==='add-requirements')addRequirementTasks();
});
let rotation=currentRotation?.();
if(rotation){const name=(rotation.name||'').toUpperCase();const match=Object.keys(kit.rules).find(k=>k!=='OTHER'&&name.includes(k));if(match)state.department=match;}
})();