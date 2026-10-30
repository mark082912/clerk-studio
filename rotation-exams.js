/* Original rotation practice questions derived from anonymized learning atlas.
   These are authored practice questions, NOT exact MOEX exam questions.
   Every item has L1/L2/L3, bedside/OSCE guide, and correct/incorrect choices.
*/
(()=>{
 'use strict';
 if(!window.ROTATION_ATLAS || !Array.isArray(window.QUESTION_BANK))return;
 const data=window.ROTATION_ATLAS.modules;
 const existing=new Set(window.QUESTION_BANK.map(q=>q.id));
 function shuffle(options,id){
   const n=[...options.keys()],seed=id.split('').reduce((h,c)=>Math.imul(h,31)+c.charCodeAt(0)|0,0);
   let st=seed>>>0;
   for(let i=n.length-1;i>0;i--){st=(Math.imul(st,1664525)+1013904223)>>>0;let j=st%(i+1);[n[i],n[j]]=[n[j],n[i]];}
   return n;
 }
 for(const dep of data){
   if(typeof SUBJECTS!=='undefined'&&!SUBJECTS.includes(dep.label))SUBJECTS.push(dep.label);
   dep.units.forEach((unit,i)=>{
     const [topic,l1,l2,l3,osce,question,oldOptions,correctIndex]=unit;
     const id='ROT-'+dep.code+'-'+String(i+1).padStart(2,'0');
     const order=shuffle(oldOptions,id);
     const options=order.map(j=>oldOptions[j]),answer=order.indexOf(correctIndex);
     if(existing.has(id))return;
     const concept='核心原則：'+l2+' 臨床應用：'+l3;
     window.QUESTION_BANK.push({
       id,subject:dep.label,topic,question,options,answer,
       explain:concept,
       why:options.map((opt,j)=>j===answer?'正解。'+l2:'不符合此情境的最佳診斷／處置。'+(l3.length<120?l3:l3.slice(0,120))),
       learningLevels:['Level 1｜'+l1,'Level 2｜'+l2,'Level 3｜'+l3,'OSCE / EPA｜'+osce],
       kind:'rotation-original',sourceLabel:'輪訓專案學習主題・原創練習（不是國考原題）',
       rotationCode:dep.code
     });
     existing.add(id);
   });
 }
})();