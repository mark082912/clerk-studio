/* Public study structure only. No original timetable, scores, dates or personal progress. */
(function () {
  'use strict';
  const course = (id, name, sourceScope, units) => ({id, name, sourceScope, units});
  const unit = (id, title, focus, rotations = [], questions = []) => ({id, title, focus, rotations, questions});
  window.FOUNDATION_CURRICULUM = {
    version: 1,
    // Subject order follows the supplied reference's rows. Units are regrouped for learning,
    // not a transcription of lecture numbers or an assertion about completed coursework.
    courses: [
      course('anatomy', '解剖', '解剖、血管、神經、骨骼肌肉與胚胎總複習', [
        unit('an01', '解剖方向、心臟與血管', '先定位，再說明血供、回流與穿刺位置。', ['CS','TRA','NUC'], ['A08','A11','A12']),
        unit('an02', '胸部與呼吸解剖', '肺葉、肋膜、縱膈及橫膈神經的空間關係。', ['CS','CHE','RAD'], ['A12','A13']),
        unit('an03', '消化、泌尿與腹股溝', '消化道、肝膽胰、腎臟和腹股溝的構造關係。', ['GI','PED'], ['A09','A10']),
        unit('an04', '中樞、周邊神經與特殊感覺', '由病灶位置連結功能缺損，再回到神經走行。', ['NS','ENT','ORT'], ['A01','A02','A03','A04','A05']),
        unit('an05', '骨骼、肌肉與關節', '用動作、肌肉、神經、血管四項整理區域解剖。', ['ORT','TRA'], ['A01','A02','A05','A14']),
        unit('an06', '頭頸、內分泌與生殖', '頭頸神經、內分泌器官與生殖器官的定位和血供。', ['ENT','NUC'], ['A06','A07','A11']),
        unit('an07', '胚胎發育與先天異常', '依胚層、器官形成時序與常見先天異常整理。', ['PED'])
      ]),
      course('histology', '組織', '依參考表的組織章節分段，對照器官構造', [
        unit('hi01', '四大基本組織與細胞連結', '辨認上皮、結締、肌肉、神經組織的構造和功能。', ['RAD','PS']),
        unit('hi02', '器官組織與病理對照', '把組織影像連回生理功能及常見病變。', ['GI','CHE','PED'])
      ]),
      course('biochemistry', '生化', '依章節推進，末輪按糖、脂質、蛋白質、核酸與分生整合', [
        unit('bi01', '糖類代謝與肝醣', '畫出糖解、糖質新生、肝醣與磷酸戊糖途徑的連結。', ['PED','GI'], ['B01','B02','B03','B11','B12','B14']),
        unit('bi02', '脂質代謝與能量', '比較脂肪酸合成、氧化、酮體及能量生成。', ['GI'], ['B05']),
        unit('bi03', '胺基酸與尿素循環', '從氮的處理理解高血氨和胺基酸代謝疾病。', ['PED','GI'], ['B06','B07','B08','B09']),
        unit('bi04', '核酸與核苷酸', '整理嘌呤、嘧啶合成與回收路徑。', ['PED'], ['B13']),
        unit('bi05', '分子生物學與遺傳', '依複製、轉錄、轉譯與調控建立順序。', ['PED']),
        unit('bi06', '維生素、輔酶與代謝整合', '以酵素、輔酶、缺乏表現三欄統整。', ['PED','GI'], ['B04','B10'])
      ]),
      course('physiology', '生理', '細胞、內分泌生殖、心血管血液、腎臟、呼吸與消化', [
        unit('py01', '細胞、神經與肌肉生理', '從膜電位到神經傳導、感覺與肌肉收縮。', ['NS','ORT']),
        unit('py02', '內分泌與生殖生理', '畫出刺激、激素、受體與負回饋。', ['PED','NUC']),
        unit('py03', '心血管與血液生理', '用壓力、流量、阻力和攜氧能力理解循環。', ['TRA','ER','NUC']),
        unit('py04', '腎臟、電解質與酸鹼', '連結腎絲球、腎小管、體液與酸鹼調控。', ['INF','CHE']),
        unit('py05', '呼吸生理與血氣', '分清通氣、灌流、擴散與血氣變化。', ['CHE','CS','NUC']),
        unit('py06', '消化與系統整合', '依分泌、消化吸收、運動與調控整理。', ['GI','PED'])
      ]),
      course('parasites', '寄生蟲', '原蟲、線蟲、條蟲、吸蟲、節肢動物', [
        unit('pa01', '原蟲', '用傳染途徑、生活史、診斷與治療建立比較表。', ['INF']),
        unit('pa02', '蠕蟲與節肢動物', '比較線蟲、條蟲、吸蟲與媒介傳播。', ['INF','PED'])
      ]),
      course('publichealth', '公衛', '生物統計、表格整理與歷屆題訂正', [
        unit('pu01', '流行病學與研究設計', '比較研究設計、偏差、相對風險與勝算比。', ['OSCE']),
        unit('pu02', '生物統計與實證判讀', '練習檢定選擇、信賴區間、診斷效能與研究解讀。', ['OSCE'])
      ]),
      course('immunology', '免疫', '分段課程、題庫練習與總複習', [
        unit('im01', '先天與適應性免疫', '以細胞、介質與功能建立免疫反應骨架。', ['INF','PED']),
        unit('im02', '抗原呈現、T 細胞與 B 細胞', '依辨識、活化、效應與記憶整理。', ['INF','PED']),
        unit('im03', '過敏、自體免疫與移植', '比較免疫反應的機轉及臨床表現。', ['PED','ENT']),
        unit('im04', '免疫缺陷與疫苗原理', '連結免疫缺陷位置、易感染病原與疫苗反應。', ['INF','PED'])
      ]),
      course('bacteria', '細菌', '革蘭氏陽性球菌及桿菌、陰性球菌及腸道與呼吸道桿菌', [
        unit('ba01', '細菌總論與陽性球菌', '從染色、形態、致病機轉到抗菌藥比較。', ['INF','PED']),
        unit('ba02', '陽性桿菌', '按芽孢、毒素與感染型態整理。', ['INF']),
        unit('ba03', '陰性球菌與腸道桿菌', '結合感染部位、檢體與致病因子。', ['INF','GI']),
        unit('ba04', '呼吸道與其他病原', '整理培養、特殊染色與鑑別診斷。', ['INF','CHE','PED'])
      ]),
      course('viruses', '病毒', 'DNA 病毒、RNA 病毒與分段題庫', [
        unit('vi01', 'DNA 病毒', '用基因體、複製位置與臨床表現比較。', ['INF','PED']),
        unit('vi02', 'RNA 病毒', '依病毒家族、傳播、複製特性與疾病整理。', ['INF','CHE','PED']),
        unit('vi03', '病毒感染整合', '比較傳染途徑、檢驗、預防與治療標的。', ['INF','PED'])
      ]),
      course('pharmacology', '藥理', '自主神經、中樞、抗感染、腫瘤免疫、心腎呼吸、內分泌及血液', [
        unit('ph01', '藥物動力學與藥效學銜接', '先核對既有 checkpoint，再補吸收分布代謝排泄、受體及劑量反應；此為銜接新增單元。', ['OSCE']),
        unit('ph02', '交感與副交感', '用受體、器官反應、代表藥和禁忌建立對照。', ['ER','ENT'], ['P01','P02']),
        unit('ph03', '抗焦慮、鎮靜與安眠', '比較受體機轉、作用差異及重要不良反應。', ['PSY','ER'], ['P12']),
        unit('ph04', '精神、癲癇、疼痛與神經退化用藥', '依藥物標的、適應症和副作用整理。', ['PSY','NS','TRA'], ['P11']),
        unit('ph05', '抗菌藥', '以作用標的、抗菌範圍、抗藥性和毒性比較。', ['INF','PED','CHE'], ['P07','P08']),
        unit('ph06', '抗病毒、抗黴菌與抗結核', '連結病原、藥物標的與主要毒性。', ['INF','CHE']),
        unit('ph07', '抗癌、免疫抑制與風濕用藥', '用機轉理解療效與不良反應。', ['CS','ORT','PED']),
        unit('ph08', '血壓、心絞痛、心衰與心律', '先看血流動力學與作用位置，再比較藥物。', ['ER','NUC'], ['P03','P06']),
        unit('ph09', '利尿劑', '把腎元位置、轉運蛋白與電解質變化接起來。', ['CHE','ER']),
        unit('ph10', '氣喘、慢性阻塞性肺病與自泌素', '整理受體、氣道反應及控制藥和緩解藥。', ['CHE','ENT']),
        unit('ph11', '內分泌與血糖用藥', '比較腦下垂體相關用藥及降血糖藥物。', ['PED','NUC'], ['P13']),
        unit('ph12', '血液、抗凝血與血脂', '以血小板、凝血及脂質代謝為分類骨架。', ['ER','TRA'], ['P04','P05','P14']),
        unit('ph13', '毒理與解毒', '依毒性機轉、重要表現和解毒標的整理。', ['ER'], ['P09','P10','P11'])
      ]),
      course('pathology', '病理', '病理分段複習與歷屆題訂正', [
        unit('pt01', '細胞傷害、發炎與修復', '先說明致病機轉，再辨認組織變化。', ['INF','PS']),
        unit('pt02', '腫瘤總論', '比較分化、分級、分期及腫瘤致病機轉。', ['CS','ENT','ORT']),
        unit('pt03', '系統病理整合', '以器官連結解剖、生理、生化、微免和藥理。', ['GI','CHE','PED'])
      ])
    ],
    priority: ['pharmacology','biochemistry','anatomy','physiology','histology','immunology','bacteria','viruses','parasites','pathology','publichealth'],
    // Suggested study allocations, not time commitments or official exam information.
    budgets: {15: [5,5,5], 45: [10,20,15], 90: [20,40,30]},
    reviewIntervals: [1,3,7,14,30]
  };
})();
