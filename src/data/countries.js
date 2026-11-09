/* 송출국 데이터 (고용허가제 E-9 송출국 18개)
   ------------------------------------------------------------------
   iso      : world-atlas 국가 번호(ISO 3166 숫자)
   a2       : ISO 알파-2 (브라우저가 나라 이름을 각 언어로 바꿔 줍니다)
   city     : 경로 출발점(수도) [위도, 경도]
   agency   : 송출기관 · 누리집
   fee      : EPS-TOPIK 응시료
   extra    : 그 나라에서 접수 때 더 내는 서류 (ko / en)
   turb     : 그 나라에서 자주 걸리는 문제(난기류)
   level    : 'official' 원문 공지 확인 · 'summary' 공지 정리 글로 확인 · 'check' 송출기관 목록만 확인
   source   : 확인한 자료
   확인일: 2026-11-08 — 회차마다 바뀌므로 공지 링크를 꼭 함께 보여 줍니다.
   ------------------------------------------------------------------ */

export const KOREA = { iso: '410', a2: 'KR', city: [37.4602, 126.4407], cityName: 'Incheon (ICN)' };

export const COUNTRIES = [
  { iso: '608', a2: 'PH', city: [14.5995, 120.9842], agency: 'DMW (Department of Migrant Workers)', site: 'https://eps.dmw.gov.ph', fee: 'USD 24', lang: 'en', level: 'official',
    source: 'DMW EPS-TOPIK Advisory No.1 s.2026',
    extra: { ko: ['여권 사본(90KB 이하, 영문 이름 표기)', '사진 2매 3.5×4.5cm, 13KB 이하, 흰 배경, 6개월 이내', '재입국 특별시험은 귀국 때 쓴 여권 사본(자진 귀국 증명)'],
      en: ['Passport copy (90 KB max, English name spelling)', '2 photos 3.5×4.5 cm, 13 KB max, white background, taken within 6 months', 'Special test: copy of the passport used when you returned home (proof of voluntary return)'] },
    turb: [{ ko: '색각이상·손발가락 결손, 결핵·간염·매독·HIV 이력이 있으면 합격하지 못합니다.', en: 'Color blindness, missing fingers/toes, or a history of TB, hepatitis, syphilis or HIV means you cannot pass.' }] },
  { iso: '524', a2: 'NP', city: [27.7172, 85.3240], agency: 'DOFE · EPS Korea Section (Gwarko, Lalitpur)', site: 'https://epsnepal.gov.np', fee: 'USD 28', lang: 'ne', level: 'summary',
    source: 'EPS-TOPIK 2026 notice (collegenp.com summary)',
    extra: { ko: ['여권 사진면 JPG(가로 600px, 89KB 이하)', '사진 3.5×4.5cm, 흰 배경, 흰 옷 금지, 양 귀가 보이게, 8~14KB'],
      en: ['Passport bio page JPG (600 px wide, under 89 KB)', 'Photo 3.5×4.5 cm, white background, no white clothes, both ears visible, 8–14 KB'] },
    turb: [{ ko: '흰 옷을 입은 사진, 귀가 가려진 사진은 반려됩니다. 경찰 조회에서 결격이면 구직 등록을 못 합니다.', en: 'Photos in white clothes or with ears hidden are rejected. An adverse police report blocks job registration.' }] },
  { iso: '144', a2: 'LK', city: [6.9271, 79.8612], agency: 'SLBFE (Sri Lanka Bureau of Foreign Employment)', site: 'https://www.slbfe.lk', fee: 'USD 28 (LKR 9,250)', lang: 'en', level: 'official',
    source: 'SLBFE Registration for the Korean Language Test-2026',
    extra: { ko: ['국가신분증(NIC) 앞·뒷면', '여권 사진면(MRZ가 보이게), 신청일 기준 3개월 이상 유효', '사진(안경 금지, 15KB 이하)', '은행 창구 납부 영수증 스캔'],
      en: ['National ID (NIC) front and back', 'Passport bio page with the full MRZ, valid 3+ months from application', 'Photo (no glasses, 15 KB max)', 'Scan of the bank counter payment receipt'] },
    turb: [{ ko: '응시료를 온라인·ATM으로 내면 인정되지 않습니다. 은행 창구에서만 내세요.', en: 'Online or ATM payments are not accepted. Pay only at a bank counter.' }] },
  { iso: '360', a2: 'ID', city: [-6.2088, 106.8456], agency: 'KP2MI (formerly BP2MI)', site: 'https://kp2mi.go.id', fee: 'USD 28', lang: 'id', level: 'summary',
    source: 'BP3MI Sumatera Barat G to G Korea notice (2025)',
    extra: { ko: ['KTP(주민증) 스캔', '여권 스캔', '카메라 원본 사진(인쇄 후 스캔 불가)', '중학교(SMP) 이상 졸업증명', '본인 명의 통장 사본', '개인정보 서약서(날인 또는 e-meterai)'],
      en: ['KTP (ID card) scan', 'Passport scan', 'Original camera photo (no printed-and-scanned photos)', 'Junior high school (SMP) certificate or higher', 'Bank book copy in your own name', 'Signed data privacy statement (stamp or e-meterai)'] },
    turb: [{ ko: '응시료 가상계좌 번호는 3시간만 유효합니다. 시간이 지나면 다시 만들어야 합니다.', en: 'The fee payment code is valid for only 3 hours. Generate a new one if it expires.' }] },
  { iso: '050', a2: 'BD', city: [23.8103, 90.4125], agency: 'BOESL', site: 'https://eps.boesl.gov.bd', fee: 'USD 28', lang: 'en', level: 'summary',
    source: 'BOESL EPS-TOPIK 2026 notice (KFPlanet summary)',
    extra: { ko: ['e-Passport', '국민 ID 카드', '여권 사본', '부모 정보', 'SSC(중등) 이상 학력'], en: ['e-Passport', 'National ID card', 'Passport copy', "Parents' details", 'SSC (secondary) or higher'] },
    turb: [] },
  { iso: '860', a2: 'UZ', city: [41.2995, 69.2401], agency: 'Agency for External Labour Migration (AELM)', site: 'https://migration.uz', fee: 'USD 28', lang: 'en', level: 'official',
    source: 'gov.uz EPS-TOPIK 2026 notice',
    extra: { ko: ['여권 컬러 스캔(JPG 55~60KB, 600×400)', '사진 3.5×4.5cm, 흰 배경, 옷 색은 배경과 다르게, 13~14KB'], en: ['Color passport scan (JPG 55–60 KB, 600×400)', 'Photo 3.5×4.5 cm, white background, clothes a different color from the background, 13–14 KB'] },
    turb: [{ ko: '이 나라는 만 40세까지 응시할 수 있다고 공지했습니다(다른 나라는 보통 39세).', en: 'This country announced eligibility up to age 40 (usually 39 elsewhere).' }] },
  { iso: '704', a2: 'VN', city: [21.0278, 105.8342], agency: 'COLAB (Center of Overseas Labour)', site: 'https://colab.moha.gov.vn', fee: 'USD 28', lang: 'vi', level: 'check', source: 'seoulstart.com sending agency list (2026)', extra: { ko: [], en: [] }, turb: [] },
  { iso: '116', a2: 'KH', city: [11.5564, 104.9282], agency: 'MTOSB', site: 'https://mtosb.gov.kh', fee: 'USD 28', lang: 'km', level: 'check', source: 'seoulstart.com sending agency list (2026)', extra: { ko: [], en: [] }, turb: [] },
  { iso: '764', a2: 'TH', city: [13.7563, 100.5018], agency: 'Department of Employment (DOE)', site: 'https://www.doe.go.th', fee: 'USD 28', lang: 'en', level: 'check', source: 'seoulstart.com sending agency list (2026)', extra: { ko: [], en: [] }, turb: [] },
  { iso: '104', a2: 'MM', city: [16.8409, 96.1735], agency: 'POEA Myanmar (Facebook page)', site: '', fee: 'USD 28', lang: 'en', level: 'check', source: 'seoulstart.com sending agency list (2026)', extra: { ko: [], en: [] }, turb: [] },
  { iso: '586', a2: 'PK', city: [33.6844, 73.0479], agency: 'OEC (Overseas Employment Corporation)', site: 'https://oec.gov.pk', fee: 'USD 28', lang: 'en', level: 'check', source: 'seoulstart.com sending agency list (2026)', extra: { ko: [], en: [] }, turb: [] },
  { iso: '496', a2: 'MN', city: [47.8864, 106.9057], agency: 'GOLWS', site: 'https://hudulmur-halamj.gov.mn', fee: 'USD 28', lang: 'en', level: 'check', source: 'seoulstart.com sending agency list (2026)', extra: { ko: [], en: [] }, turb: [] },
  { iso: '417', a2: 'KG', city: [42.8746, 74.5698], agency: 'CEC', site: 'https://migrant.kg', fee: 'USD 28', lang: 'en', level: 'check', source: 'seoulstart.com sending agency list (2026)', extra: { ko: [], en: [] }, turb: [] },
  { iso: '156', a2: 'CN', city: [39.9042, 116.4074], agency: 'CIPA', site: 'http://www.cipainvest.org.cn', fee: 'USD 28', lang: 'en', level: 'check', source: 'seoulstart.com sending agency list (2026)', extra: { ko: [], en: [] }, turb: [] },
  { iso: '626', a2: 'TL', city: [-8.5569, 125.5603], agency: 'NDOE (no website)', site: '', fee: 'USD 28', lang: 'en', level: 'check', source: 'seoulstart.com sending agency list (2026)', extra: { ko: [], en: [] }, turb: [] },
  { iso: '418', a2: 'LA', city: [17.9757, 102.6331], agency: 'Department of Employment, MoLSW (Facebook page)', site: '', fee: 'USD 28', lang: 'en', level: 'check', source: 'seoulstart.com sending agency list (2026)', extra: { ko: [], en: [] }, turb: [] },
  { iso: '762', a2: 'TJ', city: [38.5598, 68.7870], agency: 'AOE (no website)', site: '', fee: 'USD 28', lang: 'en', level: 'check', source: 'seoulstart.com sending agency list (2026)', extra: { ko: [], en: [] }, turb: [] },
  { iso: '398', a2: 'KZ', city: [51.1605, 71.4704], agency: '—', site: '', fee: '—', lang: 'en', level: 'check', source: '2026 newly added sending country (Foreign Workforce Policy Committee)', extra: { ko: [], en: [] }, turb: [], newly: true }
];

/* 나라별 추가 조사 (2026-11-09)
   ------------------------------------------------------------------
   extra : 시험 접수 때 더 내는 것 (위 extra 뒤에 덧붙임)
   check : 명부 등록 전후 — 경찰 확인서·지정 병원 검진
   exit  : 선발 뒤 출국 전 — 그 나라 정부의 출국 허가·등록·교육
   cost  : 정부가 정한 비용(이보다 더 요구하면 의심)
   lv    : 'official' 정부 원문 · 'summary' 언론·정리 글 (공지로 다시 확인)
   여기 없는 단계는 "없다"가 아니라 "아직 확인하지 못했다"는 뜻입니다.
   ------------------------------------------------------------------ */
const MORE = {
  PH: { lv: 'summary',
    check: { ko: ['NBI 경찰 확인서 (발급 6개월 안)', 'DOH 인증 병원 건강검진 (결핵·HIV 음성, 3개월 유효)'],
      en: ['NBI clearance (issued within 6 months)', 'Medical at a DOH-accredited clinic (TB/HIV negative, valid 3 months)'] },
    exit: { ko: ['DMW 처리 수수료 PHP 8,725 · OWWA USD 25', 'PhilHealth · SSS · Pag-IBIG 가입 확인', 'PDOS(출국 전 오리엔테이션) 수료', 'OEC(해외취업 확인서) 발급'],
      en: ['DMW processing fee PHP 8,725 · OWWA USD 25', 'Proof of PhilHealth, SSS and Pag-IBIG', 'PDOS (pre-departure orientation) certificate', 'OEC (Overseas Employment Certificate)'] },
    cost: { ko: '출국까지 약 PHP 49,000~68,000 (정리 글 기준)', en: 'About PHP 49,000–68,000 until departure (summary source)' },
    turb: [{ ko: '알선료를 받는 것은 불법이에요. EPS는 정부끼리 하는 제도예요. 불법 모집 신고 1348.', en: 'Placement fees are illegal — EPS is government-to-government. Report illegal recruiters: 1348.' }] },
  VN: { lv: 'summary',
    extra: { ko: ['지문 등록 (시험·교육·출국 때 다시 확인)'], en: ['Fingerprint registration (checked again at the test, training and departure)'] },
    exit: { ko: ['COLAB 출국 전 교육 (약 10~14일)', '계약 후 35일 안에 보증금 1억 동 예치 (사회정책은행 VBSP, 대출 가능)', '보증금 확인서 · 송출 계약서 · 사진'],
      en: ['COLAB pre-departure course (about 10–14 days)', 'Deposit VND 100 million at VBSP within 35 days of the contract (loans available)', 'Deposit confirmation, sending contract and photos'] },
    cost: { ko: '보증금 1억 동은 계약을 마치면 돌려받아요. 사업장 이탈·불법체류 때는 몰수돼요.', en: 'The VND 100M deposit is returned when the contract ends; it is forfeited for absconding or overstaying.' },
    turb: [{ ko: '"수수료 USD 630" 같은 비용표는 공식이 아니에요. 돈을 먼저 요구하면 사기를 의심하세요.', en: 'Fee lists like "USD 630 admin fee" are not official. Suspect a scam if asked to pay first.' }] },
  ID: { lv: 'summary',
    check: { ko: ['SKCK (경찰 확인서)', '지역 병원 건강검진 (약 Rp 800,000)'], en: ['SKCK (police clearance)', 'Medical check at a regional hospital (about Rp 800,000)'] },
    turb: [{ ko: '서비스업 명부가 밀려 있어요. 시험에 붙어도 선발이 보장되지 않아요.', en: 'The service-sector roster is backlogged — passing does not guarantee selection.' }] },
  TH: { lv: 'summary',
    extra: { ko: ['온라인 접수만 가능 (toea.doe.go.th) · 접수 기간이 2~3일로 짧아요'], en: ['Online registration only (toea.doe.go.th) · windows are only 2–3 days'] },
    turb: [{ ko: 'HRD Korea 누리집의 태국 사무소 주소가 틀려 있어요. 태국 노동부(1506 → 2번)에 확인하세요.', en: "HRD Korea's page lists the wrong Thai office. Confirm with DOE (hotline 1506, press 2)." }] },
  KH: { lv: 'summary',
    turb: [{ ko: '한국 취업을 약속하는 브로커 사기가 2025년에도 보고됐어요. MTOSB 말고는 믿지 마세요.', en: 'Broker scams promising Korea jobs were still reported in 2025. Trust only MTOSB.' }] },
  MM: { lv: 'summary',
    extra: { ko: ['응시료 USD 28을 짯으로 양곤에서 직접 납부 (줄이 매우 김)'], en: ['Pay USD 28 in kyat in person in Yangon (very long queues)'] },
    exit: { ko: ['OWIC 카드 (해외근로자 신분증, 5년)', '노동부 출국 허가 (2026년 1월부터)'], en: ['OWIC card (overseas worker ID, 5 years)', 'Department of Labour departure permission (since Jan 2026)'] },
    turb: [{ ko: '18~35세 남성 해외취업 금지(징병 관련, 2025.1~)가 보도됐어요. EPS에도 적용되는지 노동부에 꼭 확인하세요.', en: 'A ban on men aged 18–35 working abroad (conscription, from Jan 2025) was reported. Check whether it applies to EPS.' },
      { ko: '한국 일자리 신청이 한 달 10명으로 제한된다는 보도가 있어요.', en: 'Reports say new Korea job applications are capped at 10 per month.' }] },
  NP: { lv: 'summary',
    check: { ko: ['건강검진 Rs 7,300', '출국 전 결핵·VDRL 재검사 Rs 1,100'], en: ['Medical check Rs 7,300', 'TB + VDRL re-check before departure Rs 1,100'] },
    exit: { ko: ['출국 전 교육 45시간 (USD 63)', 'DoFE 노동허가 (최종 승인)', '보험 USD 46.66 · 복지기금·SSF Rs 5,096', '비자 USD 71.33 · 정부 고정 항공권 Rs 54,991'],
      en: ['Orientation 45 hours (USD 63)', 'DoFE labour permit (final approval)', 'Insurance USD 46.66 · Welfare Fund + SSF Rs 5,096', 'Visa USD 71.33 · government-fixed airfare Rs 54,991'] },
    cost: { ko: 'EPS 센터 공식 총비용 약 USD 750 — 이보다 더 내라고 하면 의심하세요', en: 'Official total about USD 750 (EPS Center Nepal) — be suspicious of anything more' },
    turb: [{ ko: '2년 안에 선발되지 않으면 다시 시험을 봐야 해요.', en: 'If you are not selected within 2 years, you must retake the test.' }] },
  BD: { lv: 'summary',
    check: { ko: ['경찰 확인서 (비자 신청 전)'], en: ['Police clearance (before the visa application)'] },
    exit: { ko: ['BOESL에서 근로계약 체결', '방글라데시-한국 기술훈련센터 6일 교육 (다카)', 'BMET 출국 스마트카드 (2024년 말부터 무료, oc.bmet.gov.bd)'],
      en: ['Sign the contract through BOESL', '6-day training at the Bangladesh-Korea Technical Training Centre, Dhaka', 'BMET emigration smart card (free since late 2024, oc.bmet.gov.bd)'] },
    turb: [{ ko: 'BOESL 말고 다른 곳은 모두 사기예요. BOESL은 현금 수수료를 받지 않아요.', en: 'Anyone other than BOESL is a scam. BOESL takes no cash fees.' }] },
  PK: { lv: 'summary',
    extra: { ko: ['CNIC(신분증)', '여권 (6개월 이상 유효)', '학력 증명서', '사전 등록비는 은행 챌런으로만 납부 (현금 불가)'], en: ['CNIC', 'Passport (valid 6+ months)', 'Education certificates', 'Pre-registration fee by bank challan only (no cash)'] },
    check: { ko: ['경찰 인성확인서', 'OEC 지정 의료기관 검진 (약 Rs 5,000~7,000)'], en: ['Police character certificate', 'Medical at an OEC-designated centre (about Rs 5,000–7,000)'] },
    exit: { ko: ['BE&OE 등록 · Protector of Emigrants 확인 (여권 스티커)', 'Protector 수수료·보험료 (금액은 OEC 공지 확인)'], en: ['BE&OE registration · Protector of Emigrants clearance (passport sticker)', 'Protector fee and insurance (check the amount with OEC)'] },
    turb: [{ ko: '"시험 없는 한국 비자", 방문비자로 취업 같은 제안은 사기예요. 신고: complaints@oec.gov.pk', en: '"No-test Korea visa" or visit-visa-to-work offers are scams. Report: complaints@oec.gov.pk' }] },
  LK: { lv: 'official',
    check: { ko: ['경찰 확인서 · 인성 조회', '명부 등록 전 건강검진 (색각 재검사, 색각이상이면 합격 무효)'], en: ['Police report and character check', 'Medical before roster registration (colour vision re-tested; colour blindness voids the result)'] },
    exit: { ko: ['SLBFE 등록 필수 (약 Rs 22,027, 보험 포함)', 'SLBFE 출국 전 교육 수료증'], en: ['Mandatory SLBFE registration (about Rs 22,027, includes insurance)', 'SLBFE pre-departure training certificate'] } },
  UZ: { lv: 'official',
    check: { ko: ['K-Medwel(대사관 지정) 병원 검진 (약 100만 숨)'], en: ['Medical at K-Medwel, the embassy-designated clinic (about UZS 1M)'] },
    exit: { ko: ['이주청 알선료 10 BCU = 440만 숨 (2026.10.20 계약부터)', '비자 약 USD 70 · 항공권 300만 숨~ (따로 냄)'], en: ['Migration Agency fee 10 BCU = UZS 4.4M (contracts from 20 Oct 2026)', 'Visa about USD 70 · flight from UZS 3M (paid separately)'] },
    cost: { ko: '2026.10.20부터 알선료 440만 숨 (이전 2,200만 숨). 더 요구하면 1282로 신고', en: 'From 20 Oct 2026 the fee is UZS 4.4M (was 22M). Report extra demands: 1282' },
    turb: [{ ko: '명부는 2년이고 연장되지 않아요. 합격해도 취업은 보장되지 않아요.', en: 'The roster lasts 2 years with no extension. Passing does not guarantee a job.' },
      { ko: '시험장에 휴대폰·스마트워치를 가져가면 안 돼요. 부정행위를 하면 4년간 응시할 수 없어요.', en: 'No phones or smartwatches at the test. Cheating means a 4-year ban.' }] },
  KG: { lv: 'summary',
    extra: { ko: ['Gmail 계정으로 migrant.kg 온라인 접수 (1번만, 중복은 취소)', '여권 스캔 100KB 이하', '사진 3.5×4.5cm, 흰 배경, 6개월 이내', '응시료 USD 28 Eldik Bank 납부 영수증'],
      en: ['Apply online at migrant.kg with a Gmail account (once only; duplicates are cancelled)', 'Passport scan 100 KB max', 'Photo 3.5×4.5 cm, white background, within 6 months', 'USD 28 fee receipt from Eldik Bank'] },
    turb: [{ ko: '한국에 E-9·E-10으로 5년 넘게 있었으면 응시할 수 없어요. 색각이상도 제외돼요.', en: 'You cannot apply if you already spent over 5 years in Korea on E-9/E-10. Colour blindness is excluded.' }] },
  MN: { lv: 'summary',
    extra: { ko: ['구(區) 노동국에서 직접 접수', '신청서 · 사진 2매(6개월 이내) · 신분증 사본'], en: ['Apply in person at the district labour office', 'Form · 2 photos (within 6 months) · ID copy'] },
    turb: [{ ko: '한국 불법체류·비자 거부 이력이나 출국 금지가 있으면 응시할 수 없어요.', en: 'A past illegal stay or visa refusal in Korea, or an exit ban, makes you ineligible.' }] },
  CN: { lv: 'summary',
    turb: [{ ko: '중국은 대부분 E-9이 아니라 H-2(방문취업, 동포)로 와요. 2026년 E-9 시험 일정은 아직 없어요.', en: 'Most Chinese nationals come on H-2 (ethnic Koreans), not E-9. No 2026 E-9 test date yet.' }] },
  LA: { lv: 'summary',
    extra: { ko: ['신청서 · 여권/신분증 컬러 사본 1부 · 사진 2매 3.4×4.5cm 흰 배경', '2026년: 9월 접수(비엔티안·사완나켓), 10월 시험'], en: ['Form · 1 colour copy of passport/ID · 2 photos 3.4×4.5 cm, white background', '2026: registration in Sept (Vientiane, Savannakhet), test in Oct'] },
    check: { ko: ['두 시험(한국어·기능) 뒤 건강검진', '명부 2년 유효'], en: ['Medical after both tests', 'Roster valid for 2 years'] },
    exit: { ko: ['출국 전 교육 → CCVI(사증발급인정서) 번호 → 비자'], en: ['Pre-employment training → CCVI number → visa'] },
    cost: { ko: '약 USD 1,789 (2023년, 항공권 포함 — 지금은 다를 수 있음)', en: 'About USD 1,789 (2023, incl. flight — may have changed)' },
    turb: [{ ko: '2026년 8월 노동부 경고: 돈을 더 내면 빨리 보내 준다는 브로커는 사기예요.', en: 'Aug 2026 ministry warning: brokers offering a faster route for extra money are scams.' }] },
  TL: { lv: 'summary',
    exit: { ko: ['SEFOPE 출국 전 설명회 (딜리)'], en: ['SEFOPE pre-departure briefing (Dili)'] } },
  TJ: { lv: 'summary',
    extra: { ko: ['직접 접수 (두샨베·후잔트·보흐타르·호로그)', '응시료 330 소모니', '여권 스캔 55~60KB, 600×400', '사진 3.5×4.5cm JPG 13~14KB', '전체 집 주소'],
      en: ['Apply in person (Dushanbe, Khujand, Bokhtar, Khorog)', 'Fee 330 somoni', 'Passport scan 55–60 KB, 600×400', 'Photo 3.5×4.5 cm JPG 13–14 KB', 'Full home address'] },
    turb: [{ ko: '나이 상한이 공지마다 38세·39세로 달라요. 접수 전에 확인하세요.', en: 'The upper age limit differs between notices (38 or 39). Check before applying.' }] },
  KZ: { lv: 'summary',
    turb: [{ ko: '아직 접수가 없어요. 알마티 EPS 센터를 열기 전이고 입국은 2028년 예상이에요. 미리 돈을 받는 중개인은 사기예요.', en: 'No registration yet — the Almaty EPS centre is not open and arrivals are expected in 2028. Intermediaries taking money now are scams.' }] }
};
/* 한국에 있는 동안 — 나라마다 다른 것 (2026-11-09 조사)
   ------------------------------------------------------------------
   ret  : 귀국비용보험 금액 — 삼성화재 공지 (1군 40만 · 2군 50만 · 3군 60만)
   nps  : 국민연금 — 국민연금공단 「2026 사업장 실무안내」(2025.7 기준), 국민연금법 제126조
          (E-9는 국적과 관계없이 반환일시금 지급)
   stay : 본국 정부가 한국에 있는 동안 요구하는 일 (언론·정리 글 위주 → 'summary')
   ------------------------------------------------------------------ */
const RET = {
  1: { ko: '40만 원 · 근로계약 효력일부터 3개월 안 (3번까지 나눠 낼 수 있어요)', en: 'KRW 400,000 · within 3 months of the contract start (up to 3 installments)' },
  2: { ko: '50만 원 · 근로계약 효력일부터 3개월 안 (3번까지 나눠 낼 수 있어요)', en: 'KRW 500,000 · within 3 months of the contract start (up to 3 installments)' },
  3: { ko: '60만 원 · 근로계약 효력일부터 3개월 안 (3번까지 나눠 낼 수 있어요)', en: 'KRW 600,000 · within 3 months of the contract start (up to 3 installments)' }
};
const NPS = {
  pay: { ko: '월급에서 냅니다 → 출국할 때 반환일시금으로 돌려받아요 (5년 안 청구 · 문의 1355)', en: 'Deducted from pay → refunded as a lump sum when you leave (claim within 5 years · call 1355)' },
  ph: { ko: '월급에서 냅니다 · 한-필리핀 협정(2024~)으로 필리핀 가입기간과 합산 가능 · 출국 때 반환일시금 (문의 1355)', en: 'Deducted from pay · the Korea-Philippines agreement (2024) lets you combine periods · lump-sum refund when you leave (1355)' },
  uz: { ko: '내지 않습니다 — 한-우즈베키스탄 협정으로 E-9는 면제 (문의 1355)', en: 'Not paid — E-9 workers are exempt under the Korea-Uzbekistan agreement (1355)' },
  ex: { ko: '내지 않습니다 — 국민연금 적용제외 국가 (문의 1355)', en: 'Not paid — your country is exempt from Korean National Pension (1355)' },
  tj: { ko: '내는 것으로 보여요 → 출국 때 반환일시금 (공단 목록에 없어 1355로 꼭 확인)', en: 'Probably deducted → lump-sum refund when you leave (not on the NPS list — confirm at 1355)' }
};
const STAY = {
  PH: { ret: 1, nps: 'ph',
    ko: ['휴가로 집에 갔다가 돌아올 때 Balik-Manggagawa OEC 또는 DMW 앱의 OFW Pass를 받아요', 'OWWA 회원 자격은 2년마다 갱신해요 (서울 MWO-OWWA 또는 OWWA 앱)', '서울 MWO-OWWA (용산, 일~목 9:30~16:30) · MWO 02-3785-3634 · OWWA 02-3785-3635'],
    en: ['When returning from home leave, get a Balik-Manggagawa OEC or the OFW Pass in the DMW app', 'Renew OWWA membership every 2 years (MWO-OWWA Seoul or the OWWA app)', 'MWO-OWWA Seoul (Yongsan, Sun–Thu 9:30–16:30) · MWO 02-3785-3634 · OWWA 02-3785-3635'] },
  VN: { ret: 1, nps: 'pay',
    ko: ['계약이 끝나면 제때 귀국해야 보증금 1억 동과 이자를 돌려받아요', '귀국 뒤 성(省) 노동국에 여권·계약서·외국인등록증 사본과 귀국 증빙을 내요', '사업장 이탈·불법체류는 보증금 몰수, 형사처벌 가능 (형법 제274조)'],
    en: ['Return home on time when the contract ends to get the VND 100M deposit back with interest', 'After returning, give the provincial labour department copies of your passport, contract, ARC and proof of return', 'Absconding or overstaying forfeits the deposit and can bring criminal charges (Penal Code Art. 274)'] },
  ID: { ret: 1, nps: 'pay',
    ko: ['BPJS Ketenagakerjaan(사고·사망·노후 보험)을 계약 기간 내내 유지해요', '계약을 연장하거나 다시 입국할 때 BPJS를 갱신해요'],
    en: ['Keep BPJS Ketenagakerjaan (accident, death, old-age cover) active for the whole contract', 'Renew BPJS when you extend the contract or re-enter Korea'] },
  TH: { ret: 1, nps: 'pay',
    ko: ['해외취업자 기금에 한 번 가입해요 (500~1,000바트) · 사망·곤경 때 보상', '불법체류하면 다음에 해외취업을 못 할 수 있어요', '태국 노동부 1694 · 1506 → 2번'],
    en: ['Join the Fund for Job Seekers Working Abroad once (500–1,000 baht) · pays out for death or hardship', 'Overstaying can stop you from working abroad again', 'Thai labour hotlines 1694 · 1506 then 2'] },
  KH: { ret: 2, nps: 'pay',
    ko: ['귀국 뒤 Happy Return Center에서 훈련·취업 연결을 받을 수 있어요', '서울에 캄보디아 노동 주재관이 있어요 (대사관에 문의)'],
    en: ['After returning, the Happy Return Center offers training and job matching', 'A Cambodian labour attaché works in Seoul (ask the embassy)'] },
  MM: { ret: 2, nps: 'ex',
    ko: ['매달 월급의 25% 이상(또는 3개월마다 누적 25%)을 공식 은행·송금업체로 가족이나 본인 계좌에 보내야 해요 (노동부 고시 108/2024)', '해외 소득세 2%를 내고 영수증을 보관해요 — OWIC·여권 갱신 때 필요', '휴가로 갔다가 다시 나올 때 양곤 Pinlon Hall에서 재출국 허가 (세금 영수증, 최근 3개월 송금 증빙, 회사 편지) · OWIC가 1년 미만 남았으면 갱신', '안 지키면 출국 금지, OWIC 거부, 3년 해외취업 금지가 될 수 있어요'],
    en: ['Send at least 25% of monthly pay (or 25% every 3 months) home through a licensed bank or remitter (MOL Notification 108/2024)', 'Pay 2% income tax on overseas pay and keep the receipt — needed to renew OWIC or passport', 'On home leave, get re-departure permission at Pinlon Hall, Yangon (tax receipt, last 3 months of remittance proof, employer letter) · renew OWIC if under 1 year left', 'Not complying can mean a departure block, OWIC refusal or a 3-year overseas-work ban'] },
  NP: { ret: 2, nps: 'ex',
    ko: ['휴가 뒤 다시 나올 때 re-entry 노동허가를 받아요 (DoFE FEIMS 온라인, 한국에서도 신청 가능)', '노동허가를 받을 때마다 해외취업 복지기금과 SSF를 내요', '유효한 노동허가가 없으면 사고·사망 때 가족이 복지기금 보상을 못 받을 수 있어요'],
    en: ['Before going back after home leave, get a re-entry labour permit (DoFE FEIMS online, also from Korea)', 'Pay the Foreign Employment Welfare Fund and SSF each time you get a labour permit', 'Without a valid labour permit your family may lose Welfare Fund compensation for injury or death'] },
  BD: { ret: 2, nps: 'ex',
    ko: ['WEWB(해외근로자 복지위원회) 회원에 가입해요 (온라인) · 사망 때 가족에게 30만 타카', '새로 나갈 때마다 BMET 출국 카드가 필요해요 (휴가 복귀는 BMET에 확인)'],
    en: ["Join the Wage Earners' Welfare Board (online) · Tk 300,000 to the family on death", 'A BMET emigration card is needed for each new departure (ask BMET about returning from leave)'] },
  PK: { ret: 2, nps: 'ex',
    ko: ['OPF 회원카드(약 5년)가 끝나면 갱신해요', '같은 회사·같은 비자로 휴가 복귀하면 Protector를 다시 받지 않아도 된다고 해요 — 회사나 비자가 바뀌면 필요', '귀국 뒤 못 받은 보험금은 Pakistan EPS Center 누리집에서 확인해요'],
    en: ['Renew your OPF membership card (about 5 years) when it expires', 'Reportedly no new Protector stamp for home leave with the same employer and visa — needed if either changes', 'After returning, check the Pakistan EPS Center site for unclaimed insurance'] },
  LK: { ret: 3, nps: 'pay',
    ko: ['SLBFE 등록을 2년마다 갱신해요 (Rs 4,599) · 서울 대사관에서 하거나 가족이 대신 할 수 있어요', '회사가 바뀌면 SLBFE에 새로 등록해요 (전액)', '4년 10개월을 마치고 귀국하면 한국 재취업 특별시험이 있어요'],
    en: ['Renew SLBFE registration every 2 years (Rs 4,599) · at the embassy in Seoul or by a family member', 'A new employer means a new SLBFE registration (full fee)', 'After 4 years 10 months, returnees can take a special re-employment exam for Korea'] },
  MN: { ret: 2, nps: 'pay',
    ko: ['서울에 몽골 노동·사회보장 서비스센터가 있어요', '한-몽골 협정의 연금 면제는 파견자용이라 E-9는 보통 냅니다'],
    en: ["Mongolia's Labor and Social Security Service Center operates in Seoul", 'The Korea-Mongolia pension exemption is for posted workers; E-9 workers usually pay'] },
  CN: { ret: 1, nps: 'pay',
    ko: ['중국 세법상 거주자라면 다음 해 3~6월에 한국 소득도 신고해요 · 한국 세금 영수증을 보관하면 공제돼요'],
    en: ['If you are a Chinese tax resident, declare Korean income between March and June of the next year · keep Korean tax receipts for the credit'] },
  UZ: { ret: 2, nps: 'uz',
    ko: ['일터를 옮기려면 먼저 회사와 이주청 한국 사무소의 서면 동의를 받아요 — 아니면 보증인(가족)이 귀국 때까지 매달 2,000달러 벌금', '이주청 서울 사무소 02-2285-1341 · 도움 요청 xorijdaish.uz · 1282', 'Xorijda Ish로 간 근로자는 비자·시험·항공료 일부를 돌려받을 수 있어요 (2024 기준)'],
    en: ['Before changing jobs, get written consent from the employer and the Migration Agency Korea office — otherwise your guarantor is fined USD 2,000 a month until you return', 'Migration Agency Seoul office 02-2285-1341 · help at xorijdaish.uz · 1282', 'Workers sent via Xorijda Ish can claim back part of visa, exam and air costs (2024 rules)'] },
  KG: { ret: 2, nps: 'pay',
    ko: ['서울 대사관에 영사 등록을 해요 (긴급 010-9798-0951)', '키르기스 연금을 이어 가려면 Tunduk 앱에서 자발적으로 낼 수 있어요 (선택)', '귀국 뒤 migrant.kg에서 못 받은 EPS 보험금이 있는지 확인해요'],
    en: ['Register with the embassy in Seoul (emergency 010-9798-0951)', 'Optionally keep up your Kyrgyz pension via voluntary payments in the Tunduk app', 'After returning, check migrant.kg for unclaimed EPS insurance'] },
  TJ: { ret: 2, nps: 'tj',
    ko: ['문제가 생기면 노동·이주·고용부 해외고용청(무료)에 연락해요'], en: ['For problems, contact the Agency for Overseas Employment (free)'] },
  KZ: { ret: 2, nps: 'ex', ko: ['아직 EPS로 온 근로자가 없어요 (2028년 예상)'], en: ['No EPS workers yet (expected from 2028)'] },
  LA: { ret: 2, nps: 'pay',
    ko: ['정부 간 송출만 공식이에요 — 브로커는 불법', '송금은 라오스 해외고용기관을 통하라는 보도가 있어요 (2022, 확인 필요)'],
    en: ['Only government-to-government placement is official — brokers are illegal', 'A 2022 report says remittances go through the Lao foreign employment agency (check)'] },
  TL: { ret: 2, nps: 'ex',
    ko: ['일터를 이탈하면 추방되고 다음 한국 취업이 막힐 수 있어요 (7년 금지 사례)', '서울에 동티모르 노동 주재관이 있어요 (대사관에 문의)'],
    en: ['Leaving the scheme can mean deportation and a ban on future Korea jobs (a 7-year case)', 'A Timor-Leste labour attaché works in Seoul (ask the embassy)'] }
};

COUNTRIES.forEach((c) => {
  const s = STAY[c.a2];
  if (s) Object.assign(c, { ret: RET[s.ret], nps: NPS[s.nps], stay: { ko: s.ko, en: s.en }, stayLv: 'summary' });
  const m = MORE[c.a2]; if (!m) return;
  if (m.extra) c.extra = { ko: [...c.extra.ko, ...m.extra.ko], en: [...c.extra.en, ...m.extra.en] };
  if (m.turb) c.turb = [...c.turb, ...m.turb];
  Object.assign(c, { check: m.check, exit: m.exit, cost: m.cost, lv: m.lv });
  if (c.level === 'check' && (m.extra || m.check || m.exit)) c.level = 'summary';
});

export const byIso = Object.fromEntries(COUNTRIES.map((c) => [c.iso, c]));
