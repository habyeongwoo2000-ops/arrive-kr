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

export const byIso = Object.fromEntries(COUNTRIES.map((c) => [c.iso, c]));
