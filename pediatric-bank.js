/* Clerk Studio supplemental pediatric national-exam practice. 16 original questions; not past exam papers. */
(function(){
  'use strict';
  if(!Array.isArray(window.QUESTION_BANK))return;
  const additional = [
  {
    "id": "PED01",
    "subject": "小兒科",
    "topic": "腸套疊",
    "question": "10 個月嬰兒間歇性劇烈哭鬧、彎曲雙腿，間隔期恢復活力，懷疑腸套疊。最適合的第一線影像檢查？",
    "options": [
      "腹部超音波",
      "常規腹部 CT",
      "大腸鏡",
      "核醫掃描"
    ],
    "answer": 0,
    "explain": "腹部超音波為診斷腸套疊的首選，典型為標靶徵（target sign）；果醬色便屬較晚出現的徵象。",
    "why": [
      "正解：非侵入、無輻射且可看到標靶徵。",
      "非第一線，且有輻射暴露。",
      "不作為此病初始檢查。",
      "無法取代腹部超音波。"
    ],
    "source": "https://www.merckmanuals.com/professional/pediatrics/gastrointestinal-disorders-in-neonates-and-infants/intussusception"
  },
  {
    "id": "PED02",
    "subject": "小兒科",
    "topic": "腸套疊",
    "question": "確診迴結腸型腸套疊的幼兒生命徵象穩定，沒有腹膜炎或穿孔徵象，第一線復位方式？",
    "options": [
      "立即切除整段結腸",
      "空氣灌腸復位",
      "口服瀉劑",
      "直接使用類固醇"
    ],
    "answer": 1,
    "explain": "對穩定且無穿孔或腹膜炎的迴結腸型腸套疊，可在小兒外科支援下採空氣灌腸復位（pneumatic reduction）。",
    "why": [
      "無併發症時通常先嘗試非手術復位。",
      "正解：常用治療性灌腸。",
      "無法解除套疊。",
      "不會讓套疊復位。"
    ],
    "source": "https://www.merckmanuals.com/professional/pediatrics/gastrointestinal-disorders-in-neonates-and-infants/intussusception"
  },
  {
    "id": "PED03",
    "subject": "小兒科",
    "topic": "腸套疊",
    "question": "下列哪一情況最不適合對腸套疊患者嘗試空氣灌腸復位？",
    "options": [
      "尚未出現果醬色便",
      "無腹痛的間隔期",
      "腹膜刺激徵象與疑似腸穿孔",
      "腹部超音波呈標靶徵"
    ],
    "answer": 2,
    "explain": "腹膜炎、休克或腸穿孔是灌腸復位的重要禁忌，須先復甦並緊急評估手術。",
    "why": [
      "果醬色便並非復位的必要條件。",
      "間歇無症狀常見於腸套疊。",
      "正解：疑穿孔或腹膜炎不可加壓灌腸。",
      "為診斷證據，不是復位禁忌。"
    ],
    "source": "https://www.merckmanuals.com/professional/pediatrics/gastrointestinal-disorders-in-neonates-and-infants/intussusception"
  },
  {
    "id": "PED04",
    "subject": "小兒科",
    "topic": "肥厚性幽門狹窄",
    "question": "出生 4 週的男嬰每次餵奶後有噴射性、非膽汁性嘔吐，仍想喝奶。最適合的初始確診檢查？",
    "options": [
      "腹部超音波",
      "腦部 CT",
      "直腸抽吸切片",
      "腹部 MRI"
    ],
    "answer": 0,
    "explain": "肥厚性幽門狹窄典型為 3–6 週開始的非膽汁性噴射嘔吐；首選腹部超音波觀察幽門肌增厚與幽門管延長。",
    "why": [
      "正解：可直接評估幽門厚度及長度。",
      "未提供顱內壓上升線索。",
      "用來確診先天性巨結腸症。",
      "不作為常規首選。"
    ],
    "source": "https://www.merckmanuals.com/professional/pediatrics/gastrointestinal-disorders-in-neonates-and-infants/hypertrophic-pyloric-stenosis"
  },
  {
    "id": "PED05",
    "subject": "小兒科",
    "topic": "肥厚性幽門狹窄",
    "question": "肥厚性幽門狹窄導致反覆嘔吐時，經典電解質與酸鹼變化是哪個組合？",
    "options": [
      "高氯、高鉀、代謝性酸中毒",
      "低氯、低鉀、代謝性鹼中毒",
      "高氯、低鉀、呼吸性鹼中毒",
      "低氯、高鉀、呼吸性酸中毒"
    ],
    "answer": 1,
    "explain": "胃酸（HCl）流失造成低氯性代謝性鹼中毒；體液不足活化醛固酮，進一步增加鉀流失。早期或輕症可能不呈典型變化。",
    "why": [
      "與胃酸流失的典型變化不符。",
      "正解：低氯、低鉀、代謝性鹼中毒。",
      "問題主要不是呼吸性酸鹼障礙。",
      "非經典變化。"
    ],
    "source": "https://www.merckmanuals.com/professional/pediatrics/gastrointestinal-disorders-in-neonates-and-infants/hypertrophic-pyloric-stenosis"
  },
  {
    "id": "PED06",
    "subject": "小兒科",
    "topic": "肥厚性幽門狹窄",
    "question": "肥厚性幽門狹窄患兒已確認要進行幽門肌切開術，術前最優先的處理？",
    "options": [
      "立即麻醉開刀，忽略脫水",
      "先矯正脫水與電解質／酸鹼異常",
      "先連續給予促胃腸蠕動藥",
      "立即安排膽道核醫掃描"
    ],
    "answer": 1,
    "explain": "幽門肌切開術是根本治療，但應先補液並矯正低氯性鹼中毒與電解質紊亂，再安全進行麻醉及手術。",
    "why": [
      "術前代謝異常會增加麻醉風險。",
      "正解：先穩定病情，並非拖延不治療。",
      "無法替代手術。",
      "與診斷不符。"
    ],
    "source": "https://www.merckmanuals.com/professional/pediatrics/gastrointestinal-disorders-in-neonates-and-infants/hypertrophic-pyloric-stenosis"
  },
  {
    "id": "PED07",
    "subject": "小兒科",
    "topic": "膽道閉鎖",
    "question": "出生 7 週嬰兒黃疸持續、尿色深且糞便灰白。最應警覺哪一疾病？",
    "options": [
      "肥厚性幽門狹窄",
      "膽道閉鎖",
      "幽門痙攣",
      "腸套疊"
    ],
    "answer": 1,
    "explain": "灰白便（acholic stool）、深色尿、持續性直接型高膽紅素黃疸需高度懷疑膽道閉鎖，並緊急轉介專科評估。",
    "why": [
      "主要表現為非膽汁性嘔吐。",
      "正解：典型膽汁排泄障礙警訊。",
      "不造成典型灰白便。",
      "非典型主訴。"
    ],
    "source": "https://www.merckmanuals.com/professional/pediatrics/congenital-gastrointestinal-anomalies/biliary-atresia"
  },
  {
    "id": "PED08",
    "subject": "小兒科",
    "topic": "膽道閉鎖",
    "question": "對已確診膽道閉鎖的嬰兒，下列何者最能改善早期膽汁引流機會？",
    "options": [
      "延遲手術至 1 歲",
      "儘早進行 Kasai 肝門空腸吻合術",
      "長期單用抗生素",
      "僅觀察直到黃疸自行消失"
    ],
    "answer": 1,
    "explain": "Kasai 肝門空腸吻合術（portoenterostomy）應及早進行；延後手術通常降低成功率，部分患兒將來仍可能需要肝移植。",
    "why": [
      "延遲會減少成功機會。",
      "正解：早期手術是關鍵。",
      "不能解除阻塞性膽汁引流問題。",
      "膽道閉鎖不宜觀察等待。"
    ],
    "source": "https://www.merckmanuals.com/professional/pediatrics/congenital-gastrointestinal-anomalies/biliary-atresia"
  },
  {
    "id": "PED09",
    "subject": "小兒科",
    "topic": "先天性巨結腸症",
    "question": "新生兒超過 48 小時仍未排胎便，腹脹，懷疑 Hirschsprung disease。最能確立診斷的檢查？",
    "options": [
      "直腸抽吸切片",
      "單次腹部 X 光",
      "糞便潛血測試",
      "上消化道內視鏡"
    ],
    "answer": 0,
    "explain": "直腸組織切片是確診依據，可見腸壁神經節細胞缺乏；對比灌腸及肛門直腸測壓為輔助檢查。",
    "why": [
      "正解：組織病理確診。",
      "只能提示腸阻塞，不能確診。",
      "與病因無直接關係。",
      "非確診方法。"
    ],
    "source": "https://www.niddk.nih.gov/health-information/digestive-diseases/hirschsprung-disease/diagnosis"
  },
  {
    "id": "PED10",
    "subject": "小兒科",
    "topic": "先天性巨結腸症",
    "question": "Hirschsprung disease 最核心的病理生理異常是？",
    "options": [
      "全結腸黏膜潰瘍",
      "遠端腸段肌間與黏膜下神經叢缺乏神經節細胞",
      "胃幽門肌肥厚",
      "結腸反覆自行套疊"
    ],
    "answer": 1,
    "explain": "源於腸神經系統（enteric nervous system）神經節細胞缺乏，常涉及 Meissner 與 Auerbach 神經叢，使遠端腸道無法正常放鬆。",
    "why": [
      "並非主要病理缺陷。",
      "正解：無神經節細胞症（aganglionosis）。",
      "屬幽門狹窄。",
      "屬腸套疊。"
    ],
    "source": "https://www.niddk.nih.gov/health-information/digestive-diseases/hirschsprung-disease/diagnosis"
  },
  {
    "id": "PED11",
    "subject": "小兒科",
    "topic": "腸旋轉不良",
    "question": "新生兒突然出現明顯綠色膽汁性嘔吐、腹痛，最應先排除哪個危急診斷？",
    "options": [
      "普通溢奶",
      "腸旋轉不良合併中腸扭轉",
      "肥厚性幽門狹窄",
      "功能性便祕"
    ],
    "answer": 1,
    "explain": "嬰兒的膽汁性（綠色）嘔吐是腸阻塞警訊，尤其必須緊急排除腸旋轉不良合併中腸扭轉，以免腸缺血壞死。",
    "why": [
      "真正綠色膽汁性嘔吐非一般溢奶。",
      "正解：可能迅速進展至腸缺血。",
      "其典型為非膽汁性嘔吐。",
      "不能合理解釋新生兒急性膽汁嘔吐。"
    ],
    "source": "https://www.merckmanuals.com/professional/pediatrics/congenital-gastrointestinal-anomalies/malrotation-of-the-bowel"
  },
  {
    "id": "PED12",
    "subject": "小兒科",
    "topic": "腸旋轉不良",
    "question": "嬰兒疑似腸旋轉不良、生命徵象穩定且可接受影像檢查時，傳統上最常用來評估十二指腸空腸交界位置的檢查？",
    "options": [
      "上消化道攝影（upper GI series）",
      "頭部超音波",
      "膀胱鏡",
      "腸胃道膠囊內視鏡"
    ],
    "answer": 0,
    "explain": "上消化道攝影可評估十二指腸空腸交界（DJ junction）位置；若有休克／腹膜炎，不能因等待影像而延誤手術評估。",
    "why": [
      "正解：傳統常用診斷影像檢查。",
      "與此解剖問題無關。",
      "無法評估腸道旋轉。",
      "不適用於疑似急性扭轉新生兒。"
    ],
    "source": "https://www.merckmanuals.com/professional/pediatrics/congenital-gastrointestinal-anomalies/malrotation-of-the-bowel"
  },
  {
    "id": "PED13",
    "subject": "小兒科",
    "topic": "食道閉鎖／氣管食道瘻",
    "question": "新生兒口水很多、餵奶即嗆咳，鼻胃管無法進入胃部。胸腹 X 光最有提示性的現象？",
    "options": [
      "鼻胃管在上段食道盲端盤繞",
      "腸壁積氣",
      "腹腔游離氣體",
      "腸套疊標靶徵"
    ],
    "answer": 0,
    "explain": "食道閉鎖常見無法通過鼻胃管；不透 X 光的導管尖端會在近端食道盲袋盤繞。若有遠端瘻管，腹部仍可能有氣體。",
    "why": [
      "正解：NG／OG 管在近端食道盲端彎曲。",
      "為壞死性腸炎線索。",
      "指向可能穿孔。",
      "為腸套疊超音波特徵。"
    ],
    "source": "https://www.merckmanuals.com/professional/pediatrics/congenital-gastrointestinal-anomalies/esophageal-atresia"
  },
  {
    "id": "PED14",
    "subject": "小兒科",
    "topic": "先天性橫膈膜疝氣",
    "question": "已知左側先天性橫膈膜疝氣（CDH）的新生兒出生後呼吸窘迫，初期呼吸道處理最恰當的是？",
    "options": [
      "先以面罩袋持續高壓灌氣",
      "儘速氣管插管並安排胃管減壓，避免一般面罩袋通氣",
      "先餵奶觀察",
      "只給口服支氣管擴張劑"
    ],
    "answer": 1,
    "explain": "CDH 可能有嚴重肺發育不全與肺高壓，應避免面罩正壓灌入腸胃使胸內腸管膨脹；通常需早期插管與胃管減壓。",
    "why": [
      "會增加腸胃氣體，加重肺壓迫。",
      "正解：氣管插管與減壓。",
      "呼吸窘迫不可餵奶觀察。",
      "無法處理主要呼吸障礙。"
    ],
    "source": "https://www.merckmanuals.com/professional/pediatrics/congenital-gastrointestinal-anomalies/diaphragmatic-hernia"
  },
  {
    "id": "PED15",
    "subject": "小兒科",
    "topic": "十二指腸閉鎖",
    "question": "新生兒出現膽汁性嘔吐，腹部 X 光見典型 double-bubble sign 且遠端腸氣缺乏，最符合哪個診斷？",
    "options": [
      "十二指腸閉鎖",
      "腸套疊",
      "肥厚性幽門狹窄",
      "先天性巨結腸症"
    ],
    "answer": 0,
    "explain": "兩個氣泡為胃與近端十二指腸；若伴遠端腸氣缺乏，強烈支持完全性十二指腸阻塞，典型病因包括十二指腸閉鎖。",
    "why": [
      "正解：典型的完全性十二指腸阻塞表現。",
      "非典型 X 光影像。",
      "典型為非膽汁性嘔吐，不是 double-bubble。",
      "通常以遠端大腸功能性阻塞表現。"
    ],
    "source": "https://www.merckmanuals.com/professional/pediatrics/chromosome-and-gene-abnormalities/down-syndrome-trisomy-21"
  },
  {
    "id": "PED16",
    "subject": "小兒科",
    "topic": "新生兒壞死性腸炎",
    "question": "早產兒開始餵食後腹脹、血便，腹部 X 光見腸壁氣體（pneumatosis intestinalis），最可能診斷？",
    "options": [
      "壞死性腸炎（NEC）",
      "幽門狹窄",
      "膽道閉鎖",
      "無症狀腸旋轉不良"
    ],
    "answer": 0,
    "explain": "腸壁積氣（pneumatosis intestinalis）是 NEC 關鍵影像徵象；若出現腹腔游離氣（pneumoperitoneum）表示疑似穿孔，需緊急外科評估。",
    "why": [
      "正解：早產、餵食不耐、腹脹血便及腸壁積氣。",
      "不會典型造成腸壁積氣及血便。",
      "主要為黃疸與灰白便。",
      "難以解釋典型 NEC 影像。"
    ],
    "source": "https://www.merckmanuals.com/professional/pediatrics/gastrointestinal-disorders-in-neonates-and-infants/necrotizing-enterocolitis"
  }
];
  const ids = new Set(window.QUESTION_BANK.map(item => item.id));
  for(const item of additional){if(!ids.has(item.id)){window.QUESTION_BANK.push(item);ids.add(item.id);}}
  if(typeof SUBJECTS !== 'undefined' && Array.isArray(SUBJECTS) && !SUBJECTS.includes('小兒科'))SUBJECTS.push('小兒科');
})();
