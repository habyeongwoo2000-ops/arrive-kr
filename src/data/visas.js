/* 체류자격(비자) 8종 — 탑승권의 CLASS 칸
   E-9 는 경로(LEGS)를 자세히, 나머지는 기본 흐름만 보여 주고 "확인 필요"를 붙입니다.
   근거: 하이코리아 체류자격 안내, 출입국관리법 시행령 별표1의2, 강원 2026 시행계획 */

import { LEGS } from './route.js';

const L = (ko, en, vi, id, km, ne) => ({ ko, en, vi: vi || en, id: id || en, km: km || en, ne: ne || en });
const B = (ko, en) => ({ ko, en });

const leg = (key, at, name, items) => ({ key, at, name, items });
const it = (id, lead, t, d, after) => (after !== undefined ? { id, after, t, d } : { id, lead, t, d });

const ARRIVE = (p) => leg('arrive', 0.94, L('한국 도착 후', 'After arrival', 'Sau khi đến', 'Setelah tiba', 'ក្រោយមកដល់', 'आइपुगेपछि'), [
  it(p + '-arc', null, B('외국인등록', 'Alien registration'), B('입국일부터 90일 안에. 원주는 시청 이동출입국 또는 춘천출입국·외국인사무소.', 'Within 90 days. In Wonju: mobile office at City Hall or Chuncheon Immigration Office.'), 90),
  it(p + '-nhis', null, B('건강보험 확인', 'Health insurance'), B('6개월 이상 머물면 가입 대상입니다. 외국어 상담 033-811-2000.', 'Required if staying 6+ months. Foreign-language help 033-811-2000.'), null)
]);

export const VISAS = [
  { code: 'E-9', color: '#1a73e8', eps: true,
    name: L('비전문취업 (고용허가제)', 'Non-professional employment (EPS)', 'Lao động phổ thông (EPS)', 'Kerja non-profesional (EPS)', 'ការងារមិនមែនជំនាញ (EPS)', 'गैर-पेशेवर रोजगार (EPS)'),
    who: B('제조·농축산·어업·건설·서비스 일자리, 송출국 18개 (2026)', 'Factory, farm, fishery, construction & service jobs; 18 sending countries (2026)'),
    stay: B('최대 4년 10개월 (재입국 가능)', 'Up to 4 years 10 months (re-entry possible)'),
    legs: LEGS },
  { code: 'E-8', color: '#188038',
    name: L('계절근로', 'Seasonal work', 'Lao động thời vụ', 'Pekerja musiman', 'ការងាររដូវកាល', 'मौसमी काम'),
    who: B('지자체가 해외 지자체와 협약(MOU)하거나 결혼이민자 가족을 초청 — 원주 농가 2026년 100명 목표', 'Invited through a local-government MOU or by a marriage migrant’s family — Wonju farms target 100 workers in 2026'),
    stay: B('최대 8개월 (확인 필요)', 'Up to 8 months (check)'), check: true,
    legs: [
      leg('prep', 0.15, L('선발', 'Selection'), [it('e8-pass', 120, B('여권·지자체 선발 명단', 'Passport & local selection list'), B('본국 지자체 또는 초청 가족을 통해 선발됩니다. 브로커에게 돈을 내지 마세요.', 'You are chosen via your home local government or inviting family. Never pay brokers.'))]),
      leg('job', 0.4, L('근로계약', 'Contract'), [it('e8-contract', 60, B('농가와 표준근로계약', 'Standard contract with the farm'), B('임금·숙소·식비를 계약서로 확인합니다.', 'Check wage, housing and meals in writing.'))]),
      leg('visa', 0.7, L('사증', 'Visa'), [it('e8-visa', 25, B('사증발급인정서 → E-8 사증', 'Visa certificate → E-8 visa'), B('한국 지자체가 일괄 신청하는 경우가 많습니다.', 'Often applied for in bulk by the Korean local government.'))]),
      ARRIVE('e8')
    ] },
  { code: 'H-2', color: '#e37400',
    name: L('방문취업', 'Working visit', 'Thăm thân làm việc', 'Kunjungan kerja', 'ទស្សនកិច្ចការងារ', 'भ्रमण रोजगार'),
    who: B('중국·CIS 등 재외동포 (만 25세 이상)', 'Overseas Koreans from China, CIS etc. (25+)'),
    stay: B('3년 (연장 가능, 확인 필요)', '3 years (extendable, check)'), check: true,
    legs: [
      leg('prep', 0.15, L('자격 확인', 'Eligibility'), [it('h2-root', 150, B('동포 증빙 서류', 'Proof of Korean ancestry'), B('호적·출생 서류 등 동포임을 보여 주는 서류.', 'Family or birth records showing Korean ancestry.'))]),
      leg('visa', 0.45, L('사증', 'Visa'), [it('h2-visa', 45, B('재외공관 H-2 사증', 'H-2 visa at an embassy'), B('나이·한국어 요건 등은 해마다 바뀝니다.', 'Age and Korean-language rules change yearly.'))]),
      leg('train', 0.75, L('취업교육', 'Training'), [it('h2-edu', null, B('취업교육 → 구직 등록', 'Employment training → job registration'), B('입국 후 교육을 마쳐야 고용센터 알선으로 일할 수 있습니다.', 'Finish training after entry before job-center placement.'), 30)]),
      ARRIVE('h2')
    ] },
  { code: 'E-7-4', color: '#9334e6',
    name: L('숙련기능인력', 'Skilled worker', 'Lao động lành nghề', 'Pekerja terampil', 'កម្មករជំនាញ', 'दक्ष कामदार'),
    who: B('E-9·E-8·H-2로 오래 일한 숙련자가 전환 — 원주시 추천 033-737-2976', 'Experienced E-9/E-8/H-2 workers switch in Korea — Wonju recommendation 033-737-2976'),
    stay: B('2년씩 연장, 가족 동반 가능 (확인 필요)', '2-year renewals, family allowed (check)'), check: true, inKorea: true,
    legs: [
      leg('score', 0.2, L('점수 요건', 'Points'), [it('e74-pt', 120, B('소득·한국어·경력 점수', 'Income, Korean & career points'), B('하이코리아 점수표로 미리 계산하세요.', 'Calculate with the HiKorea points table.'))]),
      leg('rec', 0.5, L('추천', 'Recommendation'), [it('e74-rec', 60, B('지자체(원주시) 또는 기업 추천', 'Local (Wonju) or employer recommendation'), B('광역·기초 지자체 추천 쿼터가 있습니다.', 'Provinces and cities have quotas.'))]),
      leg('change', 0.8, L('자격 변경', 'Change status'), [it('e74-chg', 20, B('체류자격 변경 신청', 'Apply for status change'), B('춘천출입국 또는 원주 이동출입국.', 'Chuncheon office or Wonju mobile office.'))]),
      ARRIVE('e74')
    ] },
  { code: 'E-7', color: '#5f6368',
    name: L('특정활동 (전문인력)', 'Professional (specific activity)', 'Chuyên gia', 'Profesional', 'អ្នកជំនាញ', 'पेशेवर'),
    who: B('학위·경력을 갖춘 전문 직종 (의료관광, 엔지니어 등)', 'Professional jobs requiring degrees/experience'),
    stay: B('계약 기간 (확인 필요)', 'Contract period (check)'), check: true,
    legs: [
      leg('job', 0.25, L('고용계약', 'Contract'), [it('e7-contract', 120, B('한국 사업주와 고용계약', 'Contract with a Korean employer'), B('직종 코드별 학력·경력·임금 요건이 있습니다.', 'Each job code has degree, career and wage rules.'))]),
      leg('papers', 0.5, L('서류 인증', 'Certify papers'), [it('e7-apo', 90, B('아포스티유·영사확인', 'Apostille / consular legalization'), B('학위·경력 증명을 인증받습니다.', 'Certify degree and career documents.'))]),
      leg('visa', 0.75, L('사증', 'Visa'), [it('e7-visa', 30, B('사증발급인정서 → E-7 사증', 'Certificate → E-7 visa'), B('결핵 고위험국은 결핵진단서가 필요할 수 있습니다.', 'TB high-risk countries may need a TB certificate.'))]),
      ARRIVE('e7')
    ] },
  { code: 'D-2', color: '#d93025',
    name: L('유학 (강원 광역형)', 'Student (Gangwon regional)', 'Du học (Gangwon)', 'Pelajar (Gangwon)', 'និស្សិត (Gangwon)', 'विद्यार्थी (Gangwon)'),
    who: B('상지대·연세대 미래·한라대·강릉원주대 등 강원 12개 대학', '12 Gangwon universities incl. Sangji, Yonsei Mirae, Halla, Gangneung-Wonju'),
    stay: B('재정 요건 800만 원, 시간제 취업 10~30시간', 'Financial proof KRW 8M, 10–30 h/week part-time'),
    legs: [
      leg('admit', 0.25, L('입학 허가', 'Admission'), [it('d2-admit', 120, B('표준입학허가서', 'Certificate of admission'), B('대학 국제처에서 발급합니다.', 'Issued by the university’s international office.'))]),
      leg('money', 0.5, L('재정 증빙', 'Funds'), [it('d2-fund', 90, B('잔고 증명 (광역형 800만 원)', 'Bank balance (KRW 8M under the regional visa)'), B('일반 D-2보다 낮은 기준입니다.', 'Lower than the standard D-2 requirement.'))]),
      leg('visa', 0.75, L('사증', 'Visa'), [it('d2-visa', 30, B('D-2 사증', 'D-2 visa'), B('학교 안내에 따라 신청합니다.', 'Apply following the school’s guide.'))]),
      ARRIVE('d2')
    ] },
  { code: 'D-10', color: '#00897b',
    name: L('구직', 'Job seeking', 'Tìm việc', 'Mencari kerja', 'ស្វែងរកការងារ', 'रोजगार खोजी'),
    who: B('한국 대학 졸업생 등 전문 직종 구직자 — 강원 찾아가는 취업·비자 상담', 'Graduates seeking professional jobs — Gangwon on-campus job & visa counseling'),
    stay: B('6개월 단위 (확인 필요)', '6-month periods (check)'), check: true, inKorea: true,
    legs: [
      leg('points', 0.3, L('점수제', 'Points'), [it('d10-pt', 60, B('구직 점수 요건', 'Points requirement'), B('학력·한국어·나이 점수를 확인합니다.', 'Check degree, Korean and age points.'))]),
      leg('plan', 0.6, L('구직 계획', 'Job plan'), [it('d10-plan', 30, B('구직활동 계획서', 'Job-search plan'), B('강원 유학생 취업 플랫폼 활용.', 'Use the Gangwon student job platform.'))]),
      ARRIVE('d10')
    ] },
  { code: 'F-6', color: '#c2185b',
    name: L('결혼이민', 'Marriage migrant', 'Kết hôn', 'Pernikahan', 'អាពាហ៍ពិពាហ៍', 'वैवाहिक'),
    who: B('한국인과 결혼한 배우자 — 원주시가족센터·다문화 지원 연결', 'Spouses of Korean citizens — linked to the Wonju Family Center'),
    stay: B('1~3년씩 연장 (확인 필요)', '1–3 year renewals (check)'), check: true,
    legs: [
      leg('marry', 0.2, L('혼인', 'Marriage'), [it('f6-reg', 150, B('양국 혼인신고', 'Marriage registered in both countries'), B('한국 배우자는 국제결혼 안내프로그램을 이수합니다.', 'The Korean spouse completes the international-marriage program.'))]),
      leg('lang', 0.45, L('의사소통', 'Communication'), [it('f6-lang', 90, B('기초 한국어 또는 공용 언어 증빙', 'Basic Korean or shared language proof'), B('면제 사유가 있는지 확인하세요.', 'Check if you are exempt.'))]),
      leg('visa', 0.72, L('사증', 'Visa'), [it('f6-visa', 30, B('F-6 사증', 'F-6 visa'), B('소득·주거 요건을 함께 봅니다.', 'Income and housing are also reviewed.'))]),
      ARRIVE('f6')
    ] }
];

export const byCode = Object.fromEntries(VISAS.map((v) => [v.code, v]));

/* world-atlas 숫자 코드 → 알파-2 (송출국 밖의 주요 나라) */
export const NUM2A2 = { '840': 'US', '826': 'GB', '250': 'FR', '276': 'DE', '392': 'JP', '356': 'IN', '643': 'RU', '036': 'AU', '124': 'CA', '076': 'BR', '458': 'MY', '158': 'TW', '792': 'TR', '818': 'EG', '566': 'NG', '404': 'KE', '484': 'MX', '710': 'ZA', '784': 'AE', '682': 'SA', '364': 'IR', '380': 'IT', '724': 'ES' };

/* 출발 공항 (수도 기준) */
export const IATA = { PH: 'MNL', NP: 'KTM', LK: 'CMB', ID: 'CGK', BD: 'DAC', UZ: 'TAS', VN: 'HAN', KH: 'KTI', TH: 'BKK', MM: 'RGN', PK: 'ISB', MN: 'UBN', KG: 'FRU', CN: 'PEK', TL: 'DIL', LA: 'VTE', TJ: 'DYU', KZ: 'NQZ',
  US: 'JFK', GB: 'LHR', FR: 'CDG', DE: 'FRA', JP: 'NRT', IN: 'DEL', RU: 'SVO', AU: 'SYD', CA: 'YYZ', BR: 'GRU', MY: 'KUL', SG: 'SIN', TW: 'TPE', TR: 'IST', EG: 'CAI', NG: 'LOS', KE: 'NBO', MX: 'MEX', ZA: 'JNB', AE: 'DXB', SA: 'RUH', IR: 'IKA', IT: 'FCO', ES: 'MAD' };
