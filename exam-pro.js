/* Clerk Studio Exam+ 2.0: local-only timed MOEX concept exams and topic analytics.
   Verbatim official exam text is not copied; all adapted questions link to original documents. */
(() => {
  'use strict';
  const tag = document.createElement('style');
  tag.textContent = `
   .examplus-banner{background:linear-gradient(120deg,#f0f8ff,#edfbf5);padding:17px;border:1px solid #cde3ed;border-radius:15px;margin:16px 0}
   .examplus-banner h3{margin:0 0 7px;color:#1a395c}
   .examplus-banner p{margin:0 0 12px;color:#557082}
   .examplus-flex{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
   .examplus-flex select{border:1px solid #c9d8e4;background:#fff;border-radius:9px;padding:8px 12px;max-width:100%}
   .mock-bubble{display:inline-flex;min-width:34px;height:34px;padding:2px 8px;align-items:center;justify-content:center;background:#f4f7fb;border:1px solid #d6e0e8;border-radius:9px;font-size:13px}
   .mock-bubble.current{background:#dcf5ed;border:2px solid #269b78}
   .mock-bubble.answered{background:#dcecff;border-color:#8bb7ea}
   .mock-answer{display:flex;align-items:center;text-align:left;gap:12px;margin:9px 0;min-height:53px;width:100%;background:#fff;border:1px solid #dde5ed;border-radius:12px;padding:13px;cursor:pointer;color:#172c42;font:inherit}
   .mock-answer.selected{border:2px solid #249e7f;background:#e9f8f1}
   .mock-top{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px}
   .mock-meta{font-size:13px;color:#64758b}
   .mock-clock{font-variant-numeric:tabular-nums;font-weight:700;color:#855123;background:#fff2d9;padding:7px 12px;border-radius:8px}
   .mock-review-item{padding:14px;margin-top:11px;border:1px solid #dee7ee;border-radius:12px}
   .mock-review-item.correct{border-color:#b5e4cf}.mock-review-item.wrong{border-color:#f1c7ba;background:#fffaf8}
   .mock-small{font-size:13px;color:#576c80}
   .mock-track{height:9px;border-radius:99px;overflow:hidden;background:#e6edf5;margin:7px 0 12px}
   .mock-track span{height:100%;display:block;background:#329d85}
   .topic-row{margin:10px 0}.topic-row .mock-meta{display:flex;justify-content:space-between;gap:6px}
   @media(max-width:620px){.mock-answer{font-size:15px}.mock-bubble{min-width:29px}}
  `;
  document.head.append(tag);
  const examRank = {'115年第二次':1,'115年第一次':2,'114年第二次':3,'114年第一次':4};
  const latestExam = '115年第二次';
  const SOURCE = '考選部・醫師（二）・醫學（四）';
  const STORE = 'clerkstudio-mock-v2';
  function ensureHistory() {if(!Array.isArray(db.study.mockHistory))db.study.mockHistory=[];}
  let current = null;
  try{let saved=JSON.parse(sessionStorage.getItem(STORE)||'null');if(saved&&Array.isArray(saved.ids)&&Array.isArray(saved.answers)&&saved.ids.length===saved.answers.length&&saved.ids.length<=40&&saved.ids.length>0)current=saved;}catch(_){}
  function stash(){try{if(current)sessionStorage.setItem(STORE,JSON.stringify(current));else sessionStorage.removeItem(STORE)}catch(_){}}
  function candidates(){const subj=ui.subject==='全部'?'小兒科':ui.subject;return BANK.filter(q=>q.subject===subj&&(q.kind==='official-derived'||q.kind==='rotation-original')).slice().sort((a,b)=>(examRank[a.sourceExam]||99)-(examRank[b.sourceExam]||99)||(a.officialQNo||0)-(b.officialQNo||0));}
  function panel(){
    ensureHistory();
    const candidatesCount=candidates().length;
    const h=db.study.mockHistory;
    const prev=h[h.length-1];
    return `<section class="examplus-banner" aria-label="正式國考考點與模擬考">
      <h3>🔥 近年醫師國考・${E(ui.subject==='全部'?'小兒科':ui.subject)}優先</h3>
      <p>優先近年考選部實際考點，原文與改寫題分開；輪訓原創題沒有官方原題。${ui.subject==='小兒科'?'目前涵蓋115／114年醫學(四)。':'其他科別目前先涵蓋 115 年第二次之選定題號與原創臨床重點，尚非各年度完整歷屆題庫。'}</p><p class="mock-small">官方原卷：<a target="_blank" rel="noopener noreferrer" href="https://wwwq.moex.gov.tw/exam/wFrmExamQandASearch.aspx?e=115070&y=2026">115-2 考選部</a> · <a target="_blank" rel="noopener noreferrer" href="https://wwwq.moex.gov.tw/exam/wFrmExamQandASearch.aspx?e=115020&y=2026">115-1 考選部</a> · <a target="_blank" rel="noopener noreferrer" href="https://wwwq.moex.gov.tw/exam/wFrmExamQandASearch.aspx?e=114070&y=2025">114-2 考選部</a> · <a target="_blank" rel="noopener noreferrer" href="https://wwwq.moex.gov.tw/exam/wFrmExamQandASearch.aspx?e=114020&y=2025">114-1 考選部</a></p>
      <div class="examplus-flex">
         <span class="badge green">目前可測驗 ${candidatesCount} 題（含原創）</span>
         <span class="badge blue">優先最新考選部考點；更正／送分原題需核對</span>
         <label class="mock-small" for="mock-count">模擬考題數</label>
         <select id="mock-count"><option value="10">10 題／15 分鐘</option><option value="20" selected>20 題／30 分鐘</option><option value="30">30 題／45 分鐘</option></select>
         ${button('開始限時模擬考 →','mock-start','primary')}
         ${button('🔥 最新 115-2 考點全卷（30 題）','mock-full1152','secondary')}
      </div>
      ${prev?`<p class="mock-meta" style="margin-top:12px">最近一次：${E(prev.date)}｜${E(prev.score)}/${E(prev.total)} 題（${pct(prev.score,prev.total)}%）　·　已完成 ${h.length} 回模擬考</p>`:''}
    ${ui.subject==='小兒科'||ui.subject==='全部'?studyPreview():''}
    </section>`;
  }
  function studyPreview(){
    const latest=candidates().filter(q=>q.sourceExam===latestExam&&Array.isArray(q.learningLevels));
    const picks=latest.filter(q=>[4,6,9,10,15,19,20,25,26,27].includes(q.officialQNo));
    return `<details style="margin-top:16px;border-top:1px solid #cddfdc;padding-top:11px"><summary style="cursor:pointer;font-weight:700">📌 最新 115-2：10 個必背 First Choice / 老師追問</summary>
      <div class="list" style="margin-top:12px">${picks.map(q=>`<div class="list-row"><div><b>#${q.officialQNo} ${E(q.topic)}</b><p class="small" style="margin:4px 0;color:#435669">${E(q.learningLevels[1])}</p><p class="small" style="margin:4px 0;color:#435669">${E(q.learningLevels[2])}</p></div></div>`).join('')}</div>
    </details>`;
  }
  function focusQuestion(index){return BANK.find(x=>x.id===current?.ids[index]);}
  function validCurrent(){return !!current&&current.ids.every(id=>BANK.some(q=>q.id===id));}
  function renderMock(){
    if(!validCurrent()){current=null;stash();return panel();}
    const n=current.ids.length,count=current.answers.filter(x=>Number.isInteger(x)).length;
    const expired=Date.now()>=current.expires;
    if(expired&&current.phase==='taking'){current.phase='result';commitMock();stash();}
    if(current.phase==='result')return showResult();
    const q=focusQuestion(current.index),pick=current.answers[current.index];
    const ms=Math.max(0,current.expires-Date.now());
    const remaining=Math.ceil(ms/1000);
    return `<section class="card" style="margin-top:16px">
    <div class="mock-top"><div><div class="eyebrow">MOEX CONCEPT EXAM · ${SOURCE}</div><h2>${E(q.subject)}限時模擬考</h2>
    <span class="mock-meta">第 ${current.index+1} / ${n} 題　·　已答 ${count} / ${n}　·　考點改寫非原文</span></div>
    <div class="mock-clock" data-mock-timer>${Math.floor(remaining/60)}:${String(remaining%60).padStart(2,'0')}</div></div>
    <div class="mock-track"><span style="width:${pct(count,n)}%"></span></div>
    <div class="examplus-flex" style="margin:12px 0 18px">${current.ids.map((id,i)=>`<button type="button" class="mock-bubble ${i===current.index?'current':''} ${Number.isInteger(current.answers[i])?'answered':''}" data-mock-jump="${i}" aria-label="第 ${i+1} 題">${i+1}</button>`).join('')}</div>
    <div class="mock-meta">${E(q.kind==='official-derived'?(q.sourceExam+'・'+(q.paper||'醫學(四)')+' 原題第 '+q.officialQNo+' 題考點'):'原創輪訓重點')}｜${E(q.topic)}</div>
    <h3 style="font-size:19px;line-height:1.55;margin:12px 0 18px">${E(q.question)}</h3>
    ${q.options.map((v,i)=>`<button class="mock-answer ${pick===i?'selected':''}" type="button" data-mock-answer="${i}"><span class="letter">${'ABCD'[i]}</span><span>${E(v)}</span></button>`).join('')}
    <div class="examplus-flex" style="margin-top:18px">
     ${button('← 上一題','mock-prev','ghost')}${button('下一題 →','mock-next','secondary')}
     ${button('交卷並看解析','mock-submit','primary')}
     ${button('暫時離開模擬考','mock-leave','ghost')}
    </div>
    <p class="help" style="margin-top:14px">作答不立即顯示答案；交卷後才公布成績。進度保留在本瀏覽器目前分頁；倒數期間請勿清除網站資料。</p>
    </section>`;
  }
  function summaryRows(){
    if(!current)return[];
    return current.ids.map((id,i)=>{let q=BANK.find(x=>x.id===id);return {q,selected:current.answers[i],correct:current.answers[i]===q?.answer};});
  }
  function commitMock(){
    if(!current||current.committed)return;
    ensureHistory();
    const rows=summaryRows();
    const score=rows.filter(x=>x.correct).length;
    db.study.mockHistory.push({
      date:localDay(),time:new Date().toISOString(),total:rows.length,score,
      questions:rows.map(x=>({id:x.q.id,selected:x.selected,correct:x.correct}))
    });
    db.study.mockHistory=db.study.mockHistory.slice(-100);
    current.committed=true;save();stash();
  }
  function showResult(){
    const rows=summaryRows(),score=rows.filter(x=>x.correct).length;
    return `<section class="card" style="margin-top:16px"><div class="eyebrow">MOCK EXAM COMPLETE</div><h2>模擬考結果</h2>
      <div class="stats-grid">${statCard('答對題數',score+' / '+rows.length,'作答後統計')}${statCard('得分',pct(score,rows.length)+'%','錯題需再練習')}${statCard('待補強',rows.length-score+' 題','查看解析並複習')}</div>
      <div class="examplus-flex" style="margin:18px 0">${button('結束並回題庫','mock-finish','primary')}${current.markedWrong?'<span class="badge green">✅ 錯題已加入複習</span>':button('將錯題加入下次複習','mock-mark-wrong','secondary')}</div>
      <p class="help">本頁是國考考點改寫題模擬考，與官方測驗題不同。已獨立儲存本回模擬考分數，不會重複計入一般題庫作答率。</p>
      <div class="divider"></div><h3>逐題檢討</h3>
      ${rows.map(({q,selected,correct},i)=>`<div class="mock-review-item ${correct?'correct':'wrong'}"><div class="mock-meta">${i+1}. ${E(q.kind==='official-derived'?(q.sourceExam+'／原題 #'+q.officialQNo):'原創輪訓重點')} · ${E(q.topic)}　${correct?'✅ 正確':'❌ 錯誤'}</div>
        <b>${E(q.question)}</b><p class="mock-small">你的選項：${Number.isInteger(selected)?'ABCD'[selected]+'・'+E(q.options[selected]):'未作答'}<br>正解：${'ABCD'[q.answer]}・${E(q.options[q.answer])}</p>
        <p>${E(q.explain)}</p>${q.learningLevels?`<div class="small-flag"><b>🌟 重要考點</b>${q.learningLevels.map(t=>`<p style="margin:7px 0">${E(t)}</p>`).join('')}</div>`:''}${q.source?`<a target="_blank" rel="noopener noreferrer" href="${E(q.source)}">考選部原卷（#${E(q.officialQNo)}）↗</a> · <a target="_blank" rel="noopener noreferrer" href="${E(q.answerSource)}">官方答案 ↗</a>`:'<span class="mock-small">原創教學題（不對應官方題號）</span>'}</div>`).join('')}
    </section>`;
  }
  const originalStudy=renderStudy;
  renderStudy=function(){return current?renderMock():panel()+originalStudy();};
  const originalAnalytics=renderAnalytics;
  renderAnalytics=function(){
    ensureHistory();
    const all= db.study.history||[], byTopic=new Map();
    for(const h of all){const q=BANK.find(x=>x.id===h.id);if(!q)continue;const key=q.subject+' / '+q.topic;const o=byTopic.get(key)||{n:0,ok:0};o.n++;if(h.correct)o.ok++;byTopic.set(key,o);}
    const topics=[...byTopic].map(([topic,x])=>({topic,...x})).sort((a,b)=>pct(a.ok,a.n)-pct(b.ok,b.n)||b.n-a.n).slice(0,10);
    const mocks=db.study.mockHistory;
    const recent=mocks.slice(-8).reverse();
    return originalAnalytics()+`<section class="card" style="margin:18px 0"><h2>📊 國考弱點熱圖（依真實作答）</h2>
    <p class="help">只使用你實際作答的題目，不憑空推測你的弱點；先依正確率由低到高排列。</p>
    ${topics.length?topics.map(x=>`<div class="topic-row"><div class="mock-meta"><span>${E(x.topic)}</span><span>${x.ok}/${x.n}・${pct(x.ok,x.n)}%</span></div><div class="mock-track"><span style="width:${pct(x.ok,x.n)}%"></span></div></div>`).join(''):'<p class="help">還沒有作答紀錄，先完成題目就會產生統計。</p>'}
    <div class="divider"></div><h3>近 8 次模擬考</h3>
    ${recent.length?recent.map((x,i)=>`<div class="panel-title"><span>${E(x.date)} · 第 ${mocks.length-i} 回</span><b>${x.score}/${x.total}（${pct(x.score,x.total)}%）</b></div>`).join(''):'<p class="help">尚未進行模擬考。</p>'}</section>`;
  };
  const prevClerk=renderClerk;
  renderClerk=function(){return `<section class="examplus-banner"><h3>🩺 Clerk 2 CePO 任務快速模板</h3>
    <p>只在此瀏覽器建立匿名待辦；不寫入病歷，也不會上傳公開 GitHub。日期先保持空白，避免把提醒誤認為正式課程時段。</p>
    <div class="examplus-flex">${button('建立小兒科 CePO 核心待辦','template-ped','primary')}${button('建立每日臨床任務','template-daily','ghost')}</div>
    </section>`+prevClerk();};
  function addTemplate(kind){
    const specs=kind==='template-ped'?[
      ['Mini-CEX（一次）','行政'],['Primary Care 照護紀錄','病歷'],['教學門診紀錄','課程'],
      ['教學住診第一週','課程'],['教學住診第二週','課程'],['專科核心課程紀錄（四次）','課程'],
      ['夜間學習紀錄','課程'],['兒科急診 EPA（至少一次，教師帳號起單）','行政'],
      ['Core EPA 評量表','行政'],['訓練考核表','行政'],['小兒科國考題筆試：11/06 晨會後（時間、地點待確認）','課程'],
      ['最後工作日檢查 CePO 是否全部起單','行政']
    ]:[['今日 SOAP／Progress Note','病歷'],['查房一分鐘摘要','病歷'],['病人問題清單與待追蹤檢驗','病歷'],['檢查必備課程與教學項目','行政']];
    const existing=new Set(db.clerk.tasks.map(x=>x.title));
    let count=0;
    for(const [title,category] of specs){if(existing.has(title))continue;makeTask({title,category,due:'',priority:'medium',repeat:'none',rotation:'PED',note:'待核對正式日期；CePO 下次流程依實際指導醫師'});existing.add(title);count++;}
    toast('新增 '+count+' 項匿名任務；已存在的項目不重複。');render();
  }
  function mockStart(forceLatest=false){
    const qs=candidates();if(!qs.length){toast('尚未載入官方考點題庫，請重新整理網站。');return;}
    const latestCount=qs.filter(q=>q.sourceExam===latestExam).length;
    const count=forceLatest?Math.max(1,latestCount):Math.min(qs.length,Number(document.querySelector('#mock-count')?.value)||20);
    // Weight recent MOEX 115-2 first, then fill from 115-1 and 114-2.
    const recent=qs.filter(q=>q.sourceExam==='115年第二次'),older=qs.filter(q=>q.sourceExam!=='115年第二次');
    const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
    const selected=forceLatest?(recent.length?recent.slice().sort((a,b)=>(a.officialQNo||0)-(b.officialQNo||0)):qs.slice(0,count)):shuffle(recent).slice(0,count);if(!forceLatest&&selected.length<count)selected.push(...shuffle(older).slice(0,count-selected.length));
    if(!forceLatest)shuffle(selected);
    current={ids:selected.map(q=>q.id),answers:selected.map(()=>null),index:0,expires:Date.now()+count*90*1000,phase:'taking',committed:false};stash();ui.page='study';render();window.scrollTo({top:0});
  }
  window.startRotationMock=function(subject){ui.subject=subject;ui.page='study';mockStart(false);};
  document.addEventListener('click',event=>{
    const answerButton=event.target.closest('[data-mock-answer]');
    if(answerButton&&current?.phase==='taking'){
      current.answers[current.index]=Number(answerButton.dataset.mockAnswer);stash();render();return;
    }
    const jump=event.target.closest('[data-mock-jump]');
    if(jump&&current?.phase==='taking'){
      current.index=Number(jump.dataset.mockJump);stash();render();return;
    }
    const action=event.target.closest('[data-action]')?.dataset.action;
    if(!action||!action.startsWith('mock-')&&!action.startsWith('template-'))return;
    switch(action){
      case 'mock-start':mockStart(false);break;
      case 'mock-full1152':mockStart(true);break;
      case 'mock-next':if(current){current.index=Math.min(current.index+1,current.ids.length-1);stash();render();}break;
      case 'mock-prev':if(current){current.index=Math.max(0,current.index-1);stash();render();}break;
      case 'mock-submit':
        if(current){const unanswered=current.answers.filter(x=>!Number.isInteger(x)).length;
          if(unanswered&&!confirm('仍有 '+unanswered+' 題未作答，確定交卷嗎？'))return;
          current.phase='result';commitMock();stash();render();window.scrollTo({top:0});}break;
      case 'mock-leave':toast('模擬考已暫存，可返回「國考智慧複習」繼續。');navigate('home');break;
      case 'mock-finish':current=null;stash();render();window.scrollTo({top:0});break;
      case 'mock-mark-wrong':
        if(current&&!current.markedWrong){let count=0;for(const x of summaryRows()){
          if(x.correct)continue;const r=db.study.records[x.q.id]||{right:0,wrong:0,streak:0};
          db.study.records[x.q.id]={...r,wrong:(r.wrong||0)+1,streak:0,due:localDay(),last:localDay()};count++;
        }current.markedWrong=true;stash();save();render();toast('已將 '+count+' 題加入待複習，不額外計入一般答題次數。');}break;
      case 'template-ped':case 'template-daily':addTemplate(action);break;
    }
  });
  setInterval(()=>{const el=document.querySelector('[data-mock-timer]');if(!el||!current||current.phase!=='taking')return;
    let seconds=Math.max(0,Math.ceil((current.expires-Date.now())/1000));el.textContent=Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0');
    if(seconds===0){current.phase='result';commitMock();stash();render();}
  },1000);
  render();
})();