/* 체류자격(비자) 8종 — 탑승권의 CLASS 칸
   E-9 는 경로(LEGS), 나머지 7종은 2026.11 공식 자료 조사로 단계별 준비·도착 후 할 일을 담았습니다. 확인 못 한 부분은 "확인 필요".
   근거: 하이코리아 체류자격 안내, 출입국관리법 시행령 별표1의2, 강원 2026 시행계획 */

import { LEGS } from './route.js';
import { TR } from './visaTr.js';

/* 번역: visaTr.js 에 영어 문장 → 베트남어·인도네시아어·크메르어·네팔어 번역이 있으면 그걸 씁니다 (없으면 영어) */
const tr = (en, k) => (TR[en] && TR[en][k]) || null;
const L = (ko, en, vi, id, km, ne) => ({ ko, en, vi: vi || tr(en, 'vi') || en, id: id || tr(en, 'id') || en, km: km || tr(en, 'km') || en, ne: ne || tr(en, 'ne') || en });
const B = (ko, en) => ({ ko, en, ...(TR[en] || {}) });

const leg = (key, at, name, items) => ({ key, at, name, items });
const it = (id, lead, t, d, after) => (after !== undefined ? { id, after, t, d } : { id, lead, t, d });

/* 한국 도착 후 — 모든 장기체류(91일 이상) 비자에 공통으로 해당하는 일
   근거: 출입국관리법 제31·35·36조(찾기 쉬운 생활법령 easylaw.go.kr), 국민건강보험법 외국인 가입 규정(nhis.or.kr),
         출입국관리법 시행규칙 제72조 수수료(2025.1.1 등록증 35,000원), 원주시 이동출입국 안내(2026.10~2027.1) */
const C = {
  arc: (p) => it(p + '-arc', null, L('외국인등록 (90일 안)', 'Alien registration (90 days)', 'Đăng ký người nước ngoài', 'Registrasi orang asing', 'ចុះឈ្មោះជនបរទេស', 'विदेशी दर्ता'),
    B('입국일부터 90일 안에 원주를 맡는 춘천출입국·외국인사무소에서 합니다. 수수료 35,000원, 하이코리아에서 방문 예약. 원주시청 이동출입국에서 되는지는 1345에 먼저 물어보세요. 안 하면 벌금을 낼 수 있어요.', 'Within 90 days of entry at the Chuncheon Immigration Office, which covers Wonju. Fee KRW 35,000; book on HiKorea. Ask 1345 first whether the Wonju City Hall mobile desk can do it. Not registering can mean a fine.'), 90),
  addr: (p) => it(p + '-addr', null, L('이사하면 15일 안에 신고', 'Report a move within 15 days', 'Báo chuyển nhà trong 15 ngày', 'Lapor pindah dalam 15 hari', 'រាយការណ៍ការផ្លាស់ទីលំនៅ', 'सरेको १५ दिनभित्र जानकारी'),
    B('새 주소의 주민센터·출입국 또는 하이코리아에 무료로 신고합니다. 안 하면 100만 원 이하 과태료.', 'Report free at the new community center, immigration, or on HiKorea. Not reporting: an administrative fine up to KRW 1,000,000.'), null),
  extend: (p, d) => it(p + '-extend', null, L('만료 전에 체류기간 연장', 'Extend before your stay ends', 'Gia hạn trước khi hết hạn', 'Perpanjang sebelum habis', 'បន្តមុនផុតកំណត់', 'अवधि सकिनुअघि थप'),
    B((d ? d.ko + ' ' : '') + '하이코리아 전자민원 또는 예약 방문. 원주는 시청 1층 이동출입국(2026.10~2027.1 둘째·넷째 목요일, 2027.2월부터 월 1회 예정 — 시간은 1345에 확인)도 이용할 수 있어요.', (d ? d.en + ' ' : '') + 'Apply on HiKorea or by booked visit. In Wonju, the mobile immigration desk at City Hall 1F (2nd & 4th Thursdays, Oct 2026–Jan 2027; once a month from Feb 2027 — ask 1345 for hours) also helps.'), null),
  reentry: (p) => it(p + '-reentry', null, L('재입국: 1년 안이면 허가 면제', 'Re-entry: no permit within 1 year', 'Tái nhập cảnh trong 1 năm', 'Masuk kembali dalam 1 tahun', 'ចូលវិញក្នុង ១ ឆ្នាំ', '१ वर्षभित्र पुनः प्रवेश'),
    B('등록한 외국인은 출국 후 1년 안(남은 체류기간이 더 짧으면 그 안)에 돌아오면 재입국허가가 필요 없어요. 늦으면 등록이 말소될 수 있어요.', 'Registered foreigners need no re-entry permit if they return within 1 year (or before their stay ends, if sooner). Coming back late can cancel your registration.'), null),
  nhis: (p, d) => it(p + '-nhis', null, L('건강보험 가입 확인', 'Check health insurance', 'Kiểm tra bảo hiểm y tế', 'Cek asuransi kesehatan', 'ពិនិត្យធានារ៉ាប់រងសុខភាព', 'स्वास्थ्य बीमा जाँच'),
    d || B('회사 직원은 입사일부터 직장가입, 아니면 입국 6개월 뒤 지역가입자로 자동 가입돼요. 외국어 상담 033-811-2000.', 'Employees join through work from day one; otherwise you are enrolled automatically after 6 months. Foreign-language help 033-811-2000.'), null),
  jobinfo: (p) => it(p + '-jobinfo', null, L('취업정보 신고 (15일 안)', 'Report your job info (15 days)', 'Khai báo việc làm (15 ngày)', 'Lapor info pekerjaan (15 hari)', 'រាយការណ៍ព័ត៌មានការងារ (១៥ ថ្ងៃ)', 'कामको जानकारी (१५ दिन)'),
    B('등록할 때 직업·업종·연소득을 하이코리아에 신고해요. 바뀌면 15일 안에 다시 신고. 2026년 하반기부터 온라인만 받아요.', 'Report your job, industry and yearly income on HiKorea when you register. If they change, report again within 15 days. Online only since late 2026.'), 15),
  help: (p) => it(p + '-help', null, L('도움 전화 저장 1345·1350', 'Save help lines 1345 · 1350', 'Lưu số 1345 · 1350', 'Simpan 1345 · 1350', 'រក្សាលេខ 1345 · 1350', '1345 · 1350 सुरक्षित गर्नुहोस्'),
    B('체류·비자는 1345(외국인종합안내), 임금·근로는 1350(고용노동부). 긴급은 112·119 (통역 지원).', 'Visa/stay questions: 1345. Wages and work: 1350 (Ministry of Labor). Emergencies: 112 · 119 with interpretation.'), null),
  sim: (p) => it(p + '-sim', null, L('선불폰 개통 (여권으로)', 'Prepaid phone (with passport)', 'Sim trả trước (hộ chiếu)', 'Ponsel prabayar (paspor)', 'ទូរស័ព្ទបង់មុន', 'प्रिपेड फोन (राहदानी)'),
    B('등록증이 나오기 전에는 여권으로 선불폰을 만듭니다. 꼭 내 이름으로 개통하세요.', 'Before your ARC arrives, get a prepaid line with your passport — always in your own name.'), 3),
  bank: (p) => it(p + '-bank', null, L('내 이름 은행 계좌', 'Bank account in your name', 'Tài khoản ngân hàng', 'Rekening bank', 'គណនីធនាគារ', 'बैंक खाता'),
    B('외국인등록증·여권·내 이름 휴대폰으로 엽니다. 처음엔 한도 계좌일 수 있어요. 통장·카드는 절대 남에게 주지 마세요.', 'Open it with your ARC, passport and a phone in your name. It may start as a limited account. Never hand your bankbook or card to anyone.'), null)
};

const stage = (key, at, ko, en, items) => leg(key, at, L(ko, en), items);

export const VISAS = [
  { code: 'E-9', color: '#1a73e8', eps: true,
    name: L('비전문취업 (고용허가제)', 'Non-professional employment (EPS)', 'Lao động phổ thông (EPS)', 'Kerja non-profesional (EPS)', 'ការងារមិនមែនជំនាញ (EPS)', 'गैर-पेशेवर रोजगार (EPS)'),
    who: B('제조·농축산·어업·건설·서비스 일자리, 송출국 18개 (2026)', 'Factory, farm, fishery, construction & service jobs; 18 sending countries (2026)'),
    stay: B('최대 4년 10개월 (재입국 가능)', 'Up to 4 years 10 months (re-entry possible)'),
    legs: LEGS },

  /* E-8 계절근로 — 근거: 법무부 계절근로 안내(moj.go.kr/moj/194), 농식품부 2026 운영 공지(mafra.go.kr), 브로커 금지(2026.1.23 시행) */
  { code: 'E-8', color: '#188038',
    name: L('계절근로', 'Seasonal work', 'Lao động thời vụ', 'Pekerja musiman', 'ការងាររដូវកាល', 'मौसमी काम'),
    who: B('지자체 해외 협약(MOU) 또는 결혼이민자 가족 초청 — 농가당 9명(최대 14명)', 'Via a local-government MOU or a marriage migrant’s family invitation — 9 workers per farm (up to 14)'),
    stay: B('최대 8개월 (8개월을 넘길 수 없어요)', 'Up to 8 months in total (cannot go beyond 8)'), check: true,
    legs: [
      stage('select', 0.15, '선발', 'Selection', [
        it('e8-route', 90, L('선발 경로 확인', 'Check your route'), B('해외 지자체 협약(MOU) 선발 또는 한국에 사는 결혼이민자 가족의 초청, 둘 중 하나여야 합니다. 정부·지자체·지정기관만 선발할 수 있어요.', 'You must come through a foreign-town MOU or an invitation from a marriage-migrant relative in Korea. Only the government, local government or designated agency may select you.')),
        it('e8-family', 90, L('초청 가족 범위 확인', 'Family-invite limits'), B('결혼이민자는 최대 10명까지 초청합니다. 2026년부터는 형제자매와 그 배우자만 됩니다.', 'A marriage migrant can invite up to 10 people. From 2026 only brothers, sisters and their spouses qualify.')),
        it('e8-fee', 75, L('비용 공개·브로커 금지', 'Fees shown · no brokers'), B('MOU 경로의 송출·행정 비용은 공개돼야 합니다. 2026.1.23부터 민간 브로커 개입은 불법(3년 이하 징역·3천만 원 이하 벌금)이에요. 숨은 돈은 내지 마세요.', 'MOU costs must be shown to you. Since 23 Jan 2026 private brokers are illegal (up to 3 years in prison or KRW 30M fine). Never pay hidden fees.'))
      ]),
      stage('job', 0.4, '근로계약', 'Contract', [
        it('e8-contract', 60, L('근로계약서 확인', 'Read your contract'), B('2026년 최저임금은 시간당 10,320원 이상. 주 근로시간과 숙소·식비 제공을 계약서로 확인하세요.', 'Minimum wage in 2026 is KRW 10,320 an hour. Check weekly hours, housing and meals in writing.')),
        it('e8-pledge', 45, L('보험 가입 서약', 'Insurance pledge'), B('본국에서 보험가입 확약서를 냅니다. 입국 후 15일 안에 상해보험에 꼭 들어야 해요.', 'Sign the insurance pledge at home. You must buy accident insurance within 15 days of arrival.'))
      ]),
      stage('visa', 0.68, '사증', 'Visa', [
        it('e8-ccvi', 30, L('사증발급인정서 (지자체 신청)', 'Visa certificate (city applies)'), B('한국 시·군이 출입국에 사증발급인정서를 신청합니다. 근로자가 직접 하지 않아요.', 'The Korean city or county applies for your visa certificate. You do not apply yourself.')),
        it('e8-visa', 21, L('대사관에서 E-8 비자', 'E-8 visa at the embassy'), B('여권·인정서 번호·사진을 가지고 한국 대사관·영사관에 신청합니다. 여권 유효기간과 수수료는 대사관에 확인하세요.', 'Apply at the Korean embassy with your passport, the certificate number and a photo. Ask the embassy about passport validity and the fee.'))
      ]),
      stage('depart', 0.85, '출국 준비', 'Before departure', [
        it('e8-numbers', 7, L('연락처 저장·여권 본인 보관', 'Save numbers · keep your passport'), B('1345, 농가 주인, 시·군 담당자 번호를 저장하세요. 여권은 내가 갖고 있어야 해요.', 'Save 1345, the farm owner and the city officer. Keep your own passport.'))
      ]),
      leg('arrive', 0.94, L('한국 도착 후', 'After arrival', 'Sau khi đến', 'Setelah tiba', 'ក្រោយមកដល់', 'आइपुगेपछि'), [
        it('e8-acc', null, L('상해보험 가입 (본인)', 'Accident insurance (you)'), B('입국 후 15일 안에 가입합니다(월 약 2만 원, 보험료는 한 번에 냄). 사망 3천만 원·장해 1,500만 원·치료비 최대 1천만 원 보장. 안 하면 과태료 최대 500만 원.', 'Within 15 days of arrival (about KRW 20,000 a month, paid in one go). Covers death up to KRW 30M, disability 15M and treatment up to 10M. Not joining: fine up to KRW 5M.'), 15),
        it('e8-farmins', null, L('농업인안전보험 확인', 'Farm safety insurance'), B('농가 주인이 일 시작(처음 입국은 외국인등록) 후 15일 안에 농어업인안전보험에 들어야 해요(법인·5인 이상은 산재보험). 했는지 물어보세요.', 'The farm owner must buy farm-safety insurance within 15 days of your start (or your registration, if newly arrived). Larger farms use work-injury insurance instead. Ask if it is done.'), 15),
        it('e8-wageins', null, L('임금체불보증보험 확인', 'Wage-guarantee insurance'), B('농가 주인이 계약 시작 30일 안에 가입합니다. 월급을 못 받으면 최대 400만 원까지 받을 수 있어요.', 'The farm owner joins within 30 days of the contract start. If unpaid, it covers up to KRW 4M.'), 30),
        C.arc('e8'),
        it('e8-pay', null, L('월급은 내 계좌로 전액', 'Full pay to you'), B('임금은 전액을 본인에게 직접 줘야 합니다. 못 받으면 1350이나 1345에 알리세요.', 'Your full pay must go to you directly. If not paid, call 1350 or 1345.'), null),
        C.jobinfo('e8'),
        it('e8-house', null, L('숙소 기준 확인', 'Check your housing'), B('전기·화장실을 갖춘 숙소여야 해요. 비닐하우스 안 숙소는 문제입니다. 1345에 알리세요.', 'Housing needs electricity and a toilet. Housing inside a greenhouse is a problem — tell 1345.'), null),
        it('e8-onlyfarm', null, L('정해진 농가에서만 일하기', 'Work only at your farm'), B('허가받은 농가(공공형은 농협)에서만 일할 수 있어요. 다른 곳에서 일하면 불법이고 다시 못 올 수 있어요.', 'Work only at the approved farm (or the cooperative in public seasonal work). Working elsewhere is illegal and can bar you from returning.'), null),
        it('e8-ltc', null, L('장기요양보험 제외 신청', 'Opt out of care insurance'), B('2026.5.13부터 E-8은 신청하면 장기요양보험료를 내지 않을 수 있어요. 건강보험공단 지사에 신청서를 내세요.', 'Since 13 May 2026 E-8 workers can opt out of long-term-care premiums by applying at an NHIS office.'), null),
        C.sim('e8'), C.addr('e8'),
        it('e8-leave', null, L('기한 안에 출국', 'Leave on time'), B('허가받은 체류기간(최대 8개월)이 끝나기 전에 임금을 모두 받고 출국하세요. 늦으면 강제퇴거·입국 금지가 될 수 있어요.', 'Get all your pay and leave before your permitted stay ends (8 months at most). Overstaying can mean deportation and a re-entry ban.'), null),
        C.help('e8')
      ])
    ] },

  /* H-2 방문취업 — 2026.2.12부터 신규 발급 중단, 재외동포(F-4)로 통합. 근거: 법무부 보도자료(2026.2.11), 찾기 쉬운 생활법령 */
  { code: 'H-2', color: '#e37400',
    name: L('방문취업 → 재외동포(F-4) 통합', 'Working visit → merged into F-4', 'Thăm thân làm việc → F-4', 'Kunjungan kerja → F-4', 'ទស្សនកិច្ចការងារ → F-4', 'भ्रमण रोजगार → F-4'),
    who: B('2026.2.12부터 새 H-2는 발급되지 않아요. 중국·CIS 동포는 재외동포(F-4)로 옵니다', 'No new H-2 since 12 Feb 2026 — ethnic Koreans from China/CIS now come on F-4'),
    stay: B('기존 H-2: 최대 4년 10개월 · F-4 변경 수수료 면제(2027.12.31까지)', 'Current H-2: up to 4 yrs 10 mos · F-4 switch fee waived until 31 Dec 2027'), check: true,
    note: B('2026.2.12부터 새 H-2는 나오지 않아요. 새로 오는 동포는 재외동포(F-4)로 준비하세요 — 아래 순서는 F-4 기준이에요.', 'New H-2 visas stopped on 12 Feb 2026. New arrivals should prepare for F-4 (overseas Korean) — the steps below follow F-4.'),
    legs: [
      stage('check', 0.15, '자격 확인', 'Eligibility', [
        it('h2-closed', 90, L('H-2 신규 중단 → F-4 신청', 'H-2 closed → apply for F-4'), B('2026.2.12부터 새 H-2 비자는 나오지 않아요. "H-2 비자를 판다"는 사람은 사기입니다.', 'Since 12 Feb 2026 new H-2 visas are not issued. Anyone selling an "H-2 visa" is a scam.')),
        it('h2-roots', 75, L('동포 증명 서류', 'Prove Korean roots'), B('국적과 관계없이 동포임을 증명하면 F-4가 나옵니다. 필요한 서류는 공관(대사관·영사관)에 확인하세요.', 'If you prove Korean ancestry, F-4 is issued whatever your nationality. Ask the consulate for the document list.'))
      ]),
      stage('papers', 0.4, '서류', 'Documents', [
        it('h2-crime', 60, L('범죄경력증명서', 'Criminal record certificate'), B('만 14세 이상은 본국 범죄경력증명서(아포스티유 또는 영사확인)가 필요해요. 보통 3~6개월 안에 발급된 것.', 'If you are 14 or older, bring a home criminal record certificate with an apostille or consular check, usually issued within 3–6 months.')),
        it('h2-korean', 60, L('한국어 증명 (선택)', 'Korean-level proof (optional)'), B('한국어 증명이 있으면 체류기간이 길어져요(비자는 2년, 국내 연장은 3년). 2026년 말까지는 사회통합프로그램 1단계, 2027년부터는 2단계 수준이 필요해요. 없으면 KIIP 등록 시 2년, 미등록 1년.', 'Korean proof gives a longer stay (2 years on the visa, 3 years when extended in Korea). Level 1 is enough until end of 2026; level 2 from 2027. Without it: 2 years if enrolled in KIIP, otherwise 1 year.'))
      ]),
      stage('visa', 0.7, '사증', 'Visa', [
        it('h2-f4visa', 30, L('F-4 비자 신청', 'Apply for F-4'), B('한국 대사관·영사관(중국은 비자신청센터)에 신청합니다.', 'Apply at the Korean embassy or consulate (visa application center in China).')),
        it('h2-jobs', 14, L('할 수 있는 일 확인', 'Check allowed jobs'), B('F-4는 일부 단순노무가 제한돼요. 건설 단순·수동 포장·하역 등 10개는 2026년부터 허용, 나머지 37개는 아직 제한입니다.', 'F-4 cannot do some simple-labor jobs. Ten (construction labor, hand packing, loading…) are allowed from 2026; 37 others are still restricted.'))
      ]),
      leg('arrive', 0.94, L('한국 도착 후', 'After arrival', 'Sau khi đến', 'Setelah tiba', 'ក្រោយមកដល់', 'आइपुगेपछि'), [
        it('h2-residence', null, L('국내거소신고 (F-4)', 'Residence report (F-4)'), B('91일 넘게 머물면 입국 후 90일 안에 출입국에 거소신고를 하고 거소증을 받아요.', 'If staying over 90 days, report your residence at immigration within 90 days and get a residence card.'), 90),
        it('h2-intro', null, L('조기적응프로그램 5시간', '5-hour intro course'), B('기초법·범죄예방·산업안전 교육이에요. 법 위반이 없으면 다음 연장 전까지 들으면 되고, 위반이 있으면 바로 들어야 해요. 사회통합프로그램 1단계 이상이면 면제.', 'Basic law, crime prevention and work safety. With no law violations, take it before your next extension; if you broke a law, take it now. KIIP level 1+ is exempt.'), null),
        it('h2-jobreport', null, L('취업정보 신고 (하이코리아)', 'Report your job online'), B('일·업종·소득을 거소신고 때 신고하고, 바뀌면 15일 안에 하이코리아로 신고해요. 온라인만 받아요.', 'Report your job, industry and income when you file your residence report, and within 15 days of any change, on HiKorea (online only).'), 15),
        it('h2-holder', null, L('기존 H-2라면: 허가된 곳에서만', 'Current H-2: permitted employer only'), B('기존 H-2는 허가된 사업장에서만 일해요. F-4로 바꿔도 같은 사업장(제한 업종)에서 계속 일하려면 체류자격외활동허가(다른 활동 허가)를 받으세요.', 'Current H-2: work only for a permitted employer. If you switch to F-4 but stay in a restricted job at the same workplace, get a permit for activities outside your status.'), null),
        it('h2-switch', null, L('H-2 → F-4 변경', 'Switch H-2 to F-4'), B('기존 H-2는 언제든 하이코리아에서 F-4로 바꿀 수 있어요. 2027.12.31까지 변경 수수료 없음(거소증 수수료는 냄).', 'Current H-2 holders can switch to F-4 on HiKorea at any time — no switch fee until 31 Dec 2027 (card fee still applies).'), null),
        C.nhis('h2'), C.sim('h2'), C.bank('h2'),
        C.extend('h2', B('F-4는 한 번에 최대 3년.', 'F-4 is granted up to 3 years at a time.')),
        it('h2-addr', null, L('이사하면 14일 안에 신고', 'Report a move within 14 days'), B('이사하면 14일 안에 새 주소지 주민센터나 출입국에 신고해요(F-4). 안 하면 200만 원 이하 과태료.', 'If you move, report it within 14 days at the community center or immigration (F-4). Not reporting: fine up to KRW 2M.'), null),
        C.help('h2')
      ])
    ] },

  /* E-7-4 숙련기능인력 — 근거: 농식품부 고시 제2026-163호 점수표(2026.3.5), 고용노동부 2026 추천 공고, 법무부 고시 제2025-406호 임금 기준 */
  { code: 'E-7-4', color: '#9334e6',
    name: L('숙련기능인력', 'Skilled worker', 'Lao động lành nghề', 'Pekerja terampil', 'កម្មករជំនាញ', 'दक्ष कामदार'),
    who: B('E-9·E-10·H-2로 4년 이상 일한 사람이 국내에서 전환 — 강원(비수도권) 3년 + 도 추천도 가능', 'E-9/E-10/H-2 workers with 4+ years switch inside Korea — 3 years in Gangwon + provincial recommendation also qualifies'),
    stay: B('2년씩 연장, 가족(F-3) 초청 가능 · 연봉 2,600만 원 이상', '2-year renewals, family (F-3) allowed · salary KRW 26M+'), check: true, inKorea: true,
    legs: [
      stage('elig', 0.15, '자격 확인', 'Eligibility', [
        it('e74-years', 180, L('4년 체류·1년 근무 확인', 'Check 4 years + 1 year'), B('최근 10년 동안 E-9·E-10·H-2로 4년 이상, 지금 회사에서 1년 이상 일했어야 해요. 강원 등 비수도권 3년 이상이면 도 추천으로도 됩니다.', 'You need 4+ years on E-9/E-10/H-2 in the last 10 years and 1+ year at your current company. 3+ years outside Seoul (e.g. Gangwon) with a provincial recommendation also works.')),
        it('e74-korean', 180, L('한국어 점수 준비', 'Get your Korean level'), B('TOPIK 2급 또는 KIIP 2단계 이상(50점), 3급 80점, 4급 120점. 2026.12.31까지는 다른 점수 150점 이상이면 첫 연장 때까지 유예돼요.', 'TOPIK 2 or KIIP 2+ (50 points), level 3 = 80, level 4 = 120. Until 31 Dec 2026 it can be deferred to the first extension if other points reach 150.')),
        it('e74-excl', 150, L('벌금·체납 확인', 'Check fines and taxes'), B('100만 원 이상 벌금, 세금 체납, 3개월 이상 불법체류가 있으면 신청할 수 없어요. 체납은 먼저 다 내세요.', 'You cannot apply with a fine of KRW 1M+, unpaid tax, or 3+ months of illegal stay. Pay unpaid tax first.'))
      ]),
      stage('points', 0.38, '점수 요건', 'Points', [
        it('e74-points', 150, L('내 점수 계산 (200/300)', 'Calculate points (200/300)'), B('소득(최대 120)·한국어(120)·나이(60)에 가점을 더해 200점 이상. 소득과 한국어는 각각 50점 이상이어야 해요.', 'Income (up to 120), Korean (120) and age (60) plus bonuses must total 200+, with at least 50 each for income and Korean.')),
        it('e74-income', 60, L('소득금액증명원 발급', 'Get income proof'), B('세무서·홈택스에서 최근 2년 소득금액증명원을 받아요. 평균 연 2,500만 원 이상이면 50점, 5,000만 원 이상 120점.', 'Get 2 years of income certificates from the tax office or Hometax. Average KRW 25M+ = 50 points; 50M+ = 120.'))
      ]),
      stage('rec', 0.62, '추천·계약', 'Recommendation', [
        it('e74-contract', 45, L('회사 추천 + 2년 계약', 'Employer + 2-year contract'), B('지금 회사의 추천(가점 50점)을 받고 연봉 2,600만 원 이상(농축어업 2,500만 원)으로 2년 이상 계약해요. 회사는 세금 체납·최근 2개월 감원이 없어야 해요.', 'Get your company’s recommendation (+50) and a 2-year contract paying KRW 26M+ a year (25M in farming/fishing). The company must have no unpaid tax and no layoffs in the last 2 months.')),
        it('e74-ministry', 45, L('부처·강원도 추천 (가점 30)', 'Ministry or Gangwon recommendation (+30)'), B('제조업은 관할 고용노동부 지청에 방문·팩스(2026.3.9~12.25), 중소 제조업은 중소벤처기업진흥공단(K-Work)에서도 연중 신청, 농축산업은 agriwork.kr. 강원도 추천도 30점이며 둘 중 하나만 인정돼요 — 도청 공고를 확인하세요.', 'Manufacturing: in person or by fax at the labor office (9 Mar–25 Dec 2026); SME factories also all year via KOSME on K-Work; farming: agriwork.kr. A Gangwon recommendation is also +30 and only one counts — check the provincial notice.')),
        it('e74-quota', 150, L('연간 정원 확인', 'Check the yearly quota'), B('2026년 E-7-4 정원은 33,000명(고용부 제조업 추천 2,000명)이라 빨리 마감될 수 있어요. 추천은 1년 동안 유효합니다.', 'The 2026 quota is 33,000 (2,000 for the labor-ministry factory track) and can fill early. A recommendation is valid for 1 year.'))
      ]),
      stage('change', 0.85, '자격 변경', 'Change status', [
        it('e74-apply', 3, L('하이코리아 변경 신청', 'Apply on HiKorea'), B('하이코리아에서 E-7-4 변경을 신청합니다(수수료 10만 원). 제조업 추천은 2026.12.25, 신청은 12.31까지라 지금 바로 준비하세요.', 'Apply for the change on HiKorea (fee KRW 100,000). The factory-track recommendation closes 25 Dec and applications 31 Dec 2026 — start now.'))
      ]),
      leg('arrive', 0.94, L('변경 후', 'After the change', 'Sau khi đổi', 'Setelah berubah', 'ក្រោយប្តូរ', 'परिवर्तनपछि'), [
        it('e74-card', null, L('새 등록증 받기', 'Collect your new ARC'), B('허가가 나면 E-7-4로 바뀐 외국인등록증을 받아요.', 'After approval, collect your ARC showing E-7-4.'), null),
        it('e74-korean2', null, L('한국어 보완 (유예했다면)', 'Meet Korean level (if deferred)'), B('한국어를 유예받았다면 첫 연장(2년) 때까지 TOPIK 2급이나 KIIP 2단계를 꼭 받으세요.', 'If your Korean was deferred, reach TOPIK 2 or KIIP 2 by your first extension (2 years).'), 730),
        it('e74-keep', null, L('계약·연봉 유지', 'Keep contract and pay'), B('2년 계약 동안 연봉 2,600만 원 이상을 받아야 해요. 돈을 되돌려 달라는 회사는 불법입니다.', 'Keep earning KRW 26M+ a year during the contract. An employer asking for money back is illegal.'), null),
        C.jobinfo('e74'),
        it('e74-move', null, L('회사 변경은 허가 먼저', 'Permit before changing job'), B('회사를 바꾸려면 먼저 출입국 허가가 필요해요. 그만두면 회사가 15일 안에 신고합니다.', 'Get immigration permission before changing employer. If you leave, the company must report within 15 days.'), null),
        C.extend('e74', B('한 번에 최대 2년(수수료 6만 원).', 'Up to 2 years each time (fee KRW 60,000).')),
        it('e74-family', null, L('가족 초청 (F-3)', 'Invite family (F-3)'), B('배우자와 19세 미만 자녀를 초청할 수 있어요. 가족 수에 맞는 소득과 따로 사는 집이 필요해요. 소득 기준은 1345에 확인하세요.', 'You can invite your spouse and children under 19. You need enough income for your family and your own home. Ask 1345 for the income table.'), null),
        it('e74-f2', null, L('장기체류(F-2) 길', 'Path to F-2 residence'), B('E-7-4로 오래 일하면 거주(F-2)로 바꿀 수 있어요. 법무부가 2026.10 요건 완화를 발표했지만 아직 시행 전이에요.', 'Long service on E-7-4 can lead to F-2. The Ministry of Justice announced easier rules in Oct 2026, but they have not started yet.'), null),
        C.addr('e74'), C.reentry('e74'), C.help('e74')
      ])
    ] },

  /* E-7 특정활동 — 근거: 법무부 고시 제2025-406호(2026 임금 기준), 결핵 고위험국 안내(2020), 출입국관리법·시행규칙 */
  { code: 'E-7', color: '#5f6368',
    name: L('특정활동 (전문인력)', 'Professional (specific activity)', 'Chuyên gia', 'Profesional', 'អ្នកជំនាញ', 'पेशेवर'),
    who: B('87개 직종(E-7-1~3)의 전문·준전문·숙련 일자리 — 회사가 초청', 'Professional, semi-professional and skilled jobs in 87 job codes (E-7-1 to 3) — the employer invites you'),
    stay: B('2026 연봉 기준: E-7-1 3,112만 원 · E-7-2/3 2,589만 원 이상', '2026 salary minimum: E-7-1 KRW 31.12M · E-7-2/3 KRW 25.89M'), check: true,
    legs: [
      stage('job', 0.2, '고용계약', 'Contract', [
        it('e7-code', 120, L('직종코드 확인', 'Check the job code'), B('실제 맡을 업무가 E-7 직종에 맞는지 확인하세요. 직함이 아니라 실제 업무로 판단해요.', 'Check that your real duties match an E-7 job code. Actual work counts, not the title.')),
        it('e7-degree', 120, L('학력·경력 요건', 'Degree and experience'), B('학력·경력 기준은 직종마다 달라요(보통 관련 석사, 학사+경력 1년, 또는 경력 5년). 회사와 하이코리아 안내로 확인하세요.', 'Degree and experience rules differ by job (often a related master’s, a bachelor’s plus 1 year, or 5 years of experience). Check with your employer and HiKorea.')),
        it('e7-wage', 100, L('연봉 기준 확인', 'Check the salary minimum'), B('2026.2.1~12.31 신청분은 E-7-1 연 3,112만 원, E-7-2·3 연 2,589만 원 이상이어야 해요. 2027.2월부터는 새 기준을 확인하세요.', 'For applications 1 Feb–31 Dec 2026: E-7-1 KRW 31.12M a year, E-7-2/3 KRW 25.89M or more. Check the new figures from Feb 2027.')),
        it('e7-contract', 90, L('근로계약서 서명·보관', 'Sign and keep the contract'), B('직종·업무·연봉·기간이 적힌 계약서에 서명하고 사본을 꼭 보관하세요.', 'Sign a contract showing job, duties, salary and period, and keep a copy.')),
        it('e7-employer', 90, L('회사 요건 확인', 'Employer eligibility'), B('회사는 세금 체납이 없어야 하고, 일부 직종은 한국인 직원 수에 따라 외국인 채용 수가 제한돼요. 회사에 먼저 물어보세요.', 'The employer must have no unpaid tax; some jobs limit foreign hires by the number of Korean staff. Ask your employer first.'))
      ]),
      stage('papers', 0.45, '서류 인증', 'Certify papers', [
        it('e7-apo', 75, L('학위·경력 아포스티유', 'Apostille degree and career'), B('외국 학위증·경력증명서는 아포스티유 또는 한국 영사확인을 받고 한국어 번역을 준비하세요.', 'Get an apostille (or Korean consular confirmation) on your diploma and work certificates, plus a Korean translation.')),
        it('e7-crime', 75, L('범죄경력증명서', 'Criminal record check'), B('직종·국적에 따라 범죄경력증명서(아포스티유)가 필요할 수 있어요. 회사와 대사관에 먼저 물어보세요.', 'Depending on job and nationality you may need a criminal record certificate with an apostille. Ask your employer and the embassy first.'))
      ]),
      stage('visa', 0.72, '사증', 'Visa', [
        it('e7-ccvi', 60, L('사증발급인정서 (회사 신청)', 'Visa certificate (employer applies)'), B('회사가 출입국(원주는 춘천) 또는 온라인으로 신청해요. 발급 후 3개월 안에 비자를 신청해야 합니다.', 'Your employer applies at immigration (Chuncheon for Wonju) or online. Apply for the visa within 3 months of issue.')),
        it('e7-tb', 45, L('결핵진단서 (고위험국)', 'TB certificate (high-risk)'), B('결핵 고위험국(35개국) 국민은 지정병원 결핵진단서를 내야 해요. 목록은 대사관에서 확인.', 'Nationals of the 35 TB high-risk countries need a TB certificate from a designated hospital. Check the list with the embassy.')),
        it('e7-visa', 30, L('대사관 비자 신청', 'Apply at the embassy'), B('인정번호·여권·사진·결핵진단서(해당자)를 가지고 한국 대사관·영사관에 신청해요.', 'Apply at the Korean embassy with the certificate number, passport, photo and TB certificate if needed.'))
      ]),
      leg('arrive', 0.94, L('한국 도착 후', 'After arrival', 'Sau khi đến', 'Setelah tiba', 'ក្រោយមកដល់', 'आइपुगेपछि'), [
        C.arc('e7'), C.sim('e7'), C.bank('e7'),
        C.nhis('e7', B('입사일부터 직장 건강보험에 가입돼요. 급여명세서에서 공제를 확인하세요.', 'You join workplace health insurance from your start date — check the deduction on your pay slip.')),
        it('e7-only', null, L('허가된 일만 하기', 'Only approved work'), B('허가받은 직종·회사에서만 일하세요. 다른 일은 불법취업이라 벌금이나 출국 조치를 받을 수 있어요.', 'Work only in the approved job and company. Other work is illegal and can mean fines or removal.'), null),
        it('e7-move', null, L('회사 변경은 허가 먼저', 'Permit before changing job'), B('회사를 바꾸거나 더하려면 먼저 출입국 허가가 필요해요. 그만두면 회사가 15일 안에 신고합니다.', 'Get immigration permission before changing or adding an employer. If you leave, the company reports within 15 days.'), null),
        it('e7-info', null, L('등록사항 바뀌면 15일 안에', 'Report changes in 15 days'), B('여권 번호·이름 등이 바뀌면 15일 안에 신고해요.', 'If your passport number, name or similar details change, report within 15 days.'), 15),
        C.jobinfo('e7'),
        C.extend('e7', B('수수료 6만 원. 연봉 기준을 계속 지켜야 해요.', 'Fee KRW 60,000; your salary must still meet the minimum.')),
        it('e7-family', null, L('가족 초청 (F-3)', 'Invite family (F-3)'), B('배우자와 19세 미만 자녀만 초청할 수 있고, 가족 수에 맞는 소득과 집이 필요해요. 가족은 본국 대사관에서 신청.', 'Only your spouse and children under 19; you need enough income and a home. They apply at the embassy at home.'), null),
        C.addr('e7'), C.reentry('e7'), C.help('e7')
      ])
    ] },

  /* D-2 유학 (강원 광역형) — 근거: 강원특별자치도 2026 외국인정책 시행계획(immigration.go.kr), 결핵 안내, 대학 유학생 안내(건강보험·시간제취업) */
  { code: 'D-2', color: '#d93025',
    name: L('유학 (강원 광역형)', 'Student (Gangwon regional)', 'Du học (Gangwon)', 'Pelajar (Gangwon)', 'និស្សិត (Gangwon)', 'विद्यार्थी (Gangwon)'),
    who: B('상지대·연세대 미래캠퍼스·한라대·강릉원주대 등 강원 12개 참여대학 (2025~26 시범, 정원 770명)', '12 Gangwon universities incl. Sangji, Yonsei Mirae, Halla, Gangneung-Wonju (2025–26 pilot, 770 places)'),
    stay: B('재정 800만 원(일반 1,600만 원) · 시간제 취업 평일 주 최대 30시간(요건 충족 시)', 'Funds KRW 8M (standard 16M) · part-time up to 30 h/week on weekdays (if eligible)'),
    legs: [
      stage('admit', 0.15, '입학 허가', 'Admission', [
        it('d2-univ', 180, L('광역형 참여대학 확인', 'Check participating university'), B('강원 광역형 D-2는 도내 12개 참여대학(상지대·연세대 미래캠퍼스·한라대·강릉원주대 등) 입학생만 해당돼요. 시범사업은 2026년에 끝나고, 2027~28년 새 사업은 인원이 줄어요(지역당 50~200명). 강원이 다시 뽑혔는지 대학에 꼭 물어보세요.', 'Only students admitted to the 12 participating Gangwon universities (incl. Sangji, Yonsei Mirae, Halla, Gangneung-Wonju) qualify. The pilot ends in 2026; the new 2027–28 program is smaller (50–200 per region). Ask your university whether Gangwon is in it.')),
        it('d2-apply', 150, L('입학 지원·서류 제출', 'Apply and submit documents'), B('대학 외국인 전형에 지원하고 학력·가족관계·여권 서류를 냅니다. 마감일은 대학마다 달라요.', 'Apply through the university’s international admission with education, family and passport documents. Deadlines differ by school.')),
        it('d2-korean', 120, L('한국어 요건 확인', 'Check Korean requirement'), B('어학 기준은 대학마다 달라요(예: 한국어 트랙 TOPIK 2급 이상).', 'Language rules differ by university (e.g. TOPIK 2+ for a Korean-taught track).'))
      ]),
      stage('papers', 0.38, '서류·재정', 'Documents & funds', [
        it('d2-apo', 150, L('학력서류 아포스티유', 'Apostille your diploma'), B('최종학력 증명서·성적증명서는 아포스티유 또는 영사확인 원본이 필요해요. 원본이 없으면 입학허가서가 안 나와요.', 'Your final diploma and transcripts need an apostille or consular confirmation. No originals, no admission letter.')),
        it('d2-fund', 120, L('잔고증명 800만 원', 'Bank balance KRW 8M'), B('광역형은 800만 원(일반 지방대 1,600만 원) 이상 잔고증명이 필요해요. 제출일 기준 30일 안에 발급된 것.', 'The regional track needs KRW 8M (standard 16M), on a certificate issued within 30 days of submission.')),
        it('d2-letter', 75, L('등록금·표준입학허가서', 'Tuition and admission letter'), B('등록금을 내면 대학이 표준입학허가서를 줍니다. 광역형은 대학 → 강원도 추천 → 법무부 순서로 진행돼요.', 'After tuition, the university issues the admission letter. The regional track goes university → Gangwon recommendation → Ministry of Justice.'))
      ]),
      stage('visa', 0.68, '사증', 'Visa', [
        it('d2-tb', 60, L('결핵진단서 (고위험국)', 'TB certificate (high-risk)'), B('결핵 고위험국(35개국) 국민은 장기체류 비자 신청 때 결핵진단서를 내야 해요.', 'Nationals of the 35 TB high-risk countries must submit a TB certificate with the visa application.')),
        it('d2-visa', 45, L('D-2 사증 신청', 'Apply for the D-2 visa'), B('광역형은 강원도 추천을 받은 뒤 대학을 통해 사증발급인정서를 받고, 그 번호로 한국 대사관·영사관에서 비자를 받아요.', 'On the regional track, after Gangwon’s recommendation the university gets you a visa certificate; use its number to get the visa at the Korean embassy.'))
      ]),
      stage('depart', 0.85, '출국 준비', 'Before departure', [
        it('d2-pre', 14, L('입국·오리엔테이션 준비', 'Arrival and orientation'), B('오리엔테이션 전날까지 입국하고, 외국인등록용 서류 여분(학위증·잔고증명)을 챙기세요.', 'Arrive by the day before orientation and bring spare copies of documents for alien registration.'))
      ]),
      leg('arrive', 0.94, L('한국 도착 후', 'After arrival', 'Sau khi đến', 'Setelah tiba', 'ក្រោយមកដល់', 'आइपुगेपछि'), [
        C.nhis('d2', B('유학생은 입국일(처음 오면 외국인등록일)부터 가입돼요. 2026년 월 79,320원, 매달 25일까지 다음 달 보험료를 미리 내요. 밀리면 병원 혜택이 멈추고 연장에 불이익.', 'Students are covered from entry (on first arrival, from registration). 2026 premium KRW 79,320 a month, paid by the 25th for the next month. Missed payments stop your benefits and hurt your extension.')),
        C.arc('d2'), C.sim('d2'), C.bank('d2'),
        it('d2-pt', null, L('아르바이트는 허가 먼저', 'Part-time permit first'), B('학교 확인서를 받고 출입국 허가가 나야 일할 수 있어요. 광역형은 한국어·학점(C 이상) 기준을 넘으면 평일 주 30시간, 못 넘으면 10시간. 주말·방학은 제한 없어요.', 'Get the school form, then immigration approval, before any job. Regional track: up to 30 h a week on weekdays if you meet the Korean and grade (C+) rules, otherwise 10 h. No limit on weekends and vacations.'), null),
        it('d2-ban', null, L('금지 업종·처벌', 'Banned jobs and penalties'), B('유흥업소·배달·학원 회화강사·건설은 금지, 제조업·개인과외도 금지예요. 허가 없이 일하면 최대 3,000만 원 벌금이나 강제퇴거, 나중에 D-10도 못 받을 수 있어요.', 'Bars, delivery, conversation teaching and construction are banned — factory work and private tutoring too. Unpermitted work: fine up to KRW 30M or deportation, and later D-10 can be refused.'), null),
        it('d2-intern', null, L('졸업학기 인턴 (광역형)', 'Final-semester internship'), B('광역형은 한국어(사회통합프로그램 4단계 등) 기준을 넘으면 졸업학기 인턴을 할 수 있어요(전문학사 6개월, 학사 이상 1년). 먼저 학교에 물어보세요.', 'If you meet the Korean rule (e.g. KIIP level 4), the regional track allows a final-semester internship (6 months associate, 1 year bachelor’s+). Ask your school first.'), null),
        it('d2-balance', null, L('입국 후 잔고 유지 (광역형)', 'Keep money in your account'), B('광역형은 입국 뒤에도 1년 동안 월평균 약 62만 원 이상 잔고를 유지해야 할 수 있어요. 학교에 확인하세요.', 'The regional track may require an average balance of about KRW 620,000 a month during your first year. Check with your school.'), null),
        it('d2-status', null, L('출석·학적 유지', 'Keep your enrollment'), B('휴학·제적·졸업은 체류에 바로 영향을 줘요. 출석과 성적도 연장 때 봅니다.', 'Leave of absence, expulsion or graduation affect your status directly; attendance and grades are checked at extension.'), null),
        C.extend('d2', B('재학증명·성적·출석과 건강보험 납부를 봅니다.', 'Enrollment, grades, attendance and insurance payments are checked.')),
        C.addr('d2'), C.reentry('d2'), C.help('d2')
      ])
    ] },

  /* D-10 구직 — 근거: 법무부 보도자료(2025.10.27, 10.29 시행), Study in Korea 취업 규정, 출입국관리법 */
  { code: 'D-10', color: '#00897b',
    name: L('구직', 'Job seeking', 'Tìm việc', 'Mencari kerja', 'ស្វែងរកការងារ', 'रोजगार खोजी'),
    who: B('한국 대학 졸업생 등 전문 직종 구직자 — 강원 찾아가는 취업·비자 상담', 'Graduates seeking professional jobs — Gangwon on-campus job & visa counseling'),
    stay: B('국내 졸업생 최대 3년, 1년씩 연장 (2025 개정)', 'Korean-university graduates up to 3 years, 1 year at a time (2025 reform)'), check: true, inKorea: true,
    legs: [
      stage('elig', 0.2, '자격 확인', 'Eligibility', [
        it('d10-elig', 90, L('신청 자격 확인', 'Check eligibility'), B('한국 대학(전문학사 이상) 졸업생은 처음 바꿀 때 점수제가 없어요. 졸업 3년 안에 TOPIK 4급·KIIP 4단계면 연장 때도 면제. 해외 졸업생은 학사 이상 + 점수제.', 'Korean-college graduates (associate+) skip the points test on the first change; with TOPIK 4 / KIIP 4 within 3 years of graduating, also at extension. Overseas graduates need a bachelor’s+ and the points test.')),
        it('d10-excl', 60, L('결격사유 확인', 'Check disqualifiers'), B('최근 5년 안 불법취업·시간제취업 위반, 200만 원 넘는 범칙금, 최근 3년 출국명령이 있으면 거절될 수 있어요.', 'A job-related violation in 5 years, fines over KRW 2M, or a departure order in 3 years can mean refusal.')),
        it('d10-overseas', 90, L('해외 졸업자 경로', 'Overseas graduates'), B('해외 대학 졸업자는 학사 이상 + 점수제를 충족해야 하고, 대사관에서 받는 D-10은 6개월 이하 단수사증이에요. 세계 200위 안 대학 졸업자(29세 이하)는 점수제·잔고가 면제돼요.', 'Overseas graduates need a bachelor’s+ and the points test; an embassy D-10 is single-entry, up to 6 months. Graduates of top-200 universities (29 or under) skip points and funds.'))
      ]),
      stage('points', 0.45, '점수제', 'Points', [
        it('d10-points', 60, L('점수 계산 (60점 이상)', 'Points test (60+)'), B('190점 중 60점 이상(기본항목 20점 이상)이 필요해요. 한국 대학 졸업 후 처음 바꿀 때와, 졸업 3년 안에 TOPIK 4급·KIIP 4단계가 있으면 면제예요.', 'You need 60 of 190 points, 20+ from basic items. Exempt: your first change after a Korean degree, or within 3 years of graduating with TOPIK 4 / KIIP 4.'))
      ]),
      stage('plan', 0.7, '구직 계획·신청', 'Plan & apply', [
        it('d10-docs', 30, L('신청서류 준비', 'Prepare documents'), B('신청서·여권·등록증·사진·졸업(예정)증명서·성적·TOPIK/KIIP 성적·구직활동계획서. 국내 졸업 후 첫 변경은 잔고증명 면제.', 'Form, passport, ARC, photo, (expected) graduation certificate, transcript, TOPIK/KIIP result and a job-search plan. Funds proof waived on the first change after a Korean degree.')),
        it('d10-plan', 30, L('구직활동계획서 작성', 'Write a job-search plan'), B('E-1~E-7 직종을 목표로 구체적으로 써요. 연장 때 실제 구직 실적을 봅니다.', 'Aim at E-1 to E-7 jobs and be concrete — your real search record is reviewed at extension.')),
        it('d10-apply', 3, L('졸업 직후 변경 신청', 'Apply right after graduation'), B('졸업 후 D-2 체류기간이 끝나기 전에 D-10 변경을 신청해요. 늦으면 불법체류가 돼요. 가능하면 졸업 직후 하세요(학교에 기한 확인). 수수료 10만 원.', 'Apply to change to D-10 before your D-2 stay ends — late means illegal stay. Best right after graduation (check the deadline with your school). Fee KRW 100,000.'))
      ]),
      leg('arrive', 0.94, L('변경 후', 'After the change', 'Sau khi đổi', 'Setelah berubah', 'ក្រោយប្តូរ', 'परिवर्तनपछि'), [
        it('d10-noreg', null, L('정규직 근무 금지', 'No regular employment'), B('D-10으로 정규직 일은 못 해요. 채용되면 일 시작 전에 E-7 등으로 먼저 바꿔야 합니다.', 'You cannot work full-time on D-10. Once hired, change to the work visa before you start.'), null),
        it('d10-intern', null, L('인턴 규칙', 'Internship rules'), B('같은 회사 인턴은 최대 1년, E-1~E-7 분야만 가능해요. 공장·건설 단순노무는 안 됩니다.', 'An internship at one company can last up to 1 year, in E-1 to E-7 fields only — no simple factory or construction work.'), null),
        it('d10-pt', null, L('아르바이트 허가', 'Part-time permit'), B('D-10-1은 졸업 3년 이내 + TOPIK 4급(KIIP 4단계)이면 허가를 받아 평일 주 25시간까지 일할 수 있어요. D-10-2·3은 안 됩니다.', 'D-10-1 holders within 3 years of graduation with TOPIK 4 / KIIP 4 may work up to 25 h a week on weekdays with a permit; D-10-2/3 cannot.'), null),
        it('d10-e7', null, L('취업하면 E-7 변경', 'Change to E-7 when hired'), B('고용계약 후 회사 서류와 함께 출입국에서 E-7 변경허가를 받아요. 이후 회사 변경은 허가나 15일 안 신고가 필요해요.', 'After signing a contract, change to E-7 at immigration with employer documents. Later job changes need a permit or a report within 15 days.'), null),
        C.extend('d10', B('1년씩 최대 3년. 연장 때 점수(80점 이상이면 1년)와 구직활동 기록을 봐요. 2027년부터 한국어 수준에 따라 기간이 달라질 수 있어요.', 'One year at a time, up to 3 years. Points (80+ for a full year) and your job-search record are checked. From 2027 the length may depend on your Korean level.')),
        C.nhis('d10', B('유학생 보험료 혜택은 끝나고 일반 외국인 지역가입 기준이 적용돼요.', 'The student premium ends; regular foreign-resident (regional) rules apply.')),
        C.addr('d10'), C.reentry('d10'), C.help('d10')
      ])
    ] },

  /* F-6 결혼이민 — 근거: 찾기 쉬운 생활법령(결혼이민), 법무부 고시 제2025-534호(2026 소득요건), 국제결혼 안내프로그램(immigration.go.kr), 국민건강보험 */
  { code: 'F-6', color: '#c2185b',
    name: L('결혼이민', 'Marriage migrant', 'Kết hôn', 'Pernikahan', 'អាពាហ៍ពិពាហ៍', 'वैवाहिक'),
    who: B('한국인과 결혼한 배우자 — 원주시가족센터·다누리 1577-1366 연결', 'Spouses of Korean citizens — Wonju Family Center & Danuri 1577-1366'),
    stay: B('1~3년씩 연장 · 2년 뒤 영주(F-5) 신청 가능', '1–3 year renewals · permanent residence (F-5) after 2 years'),
    legs: [
      stage('marry', 0.15, '혼인', 'Marriage', [
        it('f6-kr', 150, L('한국 혼인신고', 'Register marriage in Korea'), B('외국에서 먼저 혼인했다면 3개월 안에 한국에 신고해야 해요(어기면 과태료 5만 원 이하).', 'If you married abroad first, report it in Korea within 3 months (fine up to KRW 50,000).')),
        it('f6-home', 150, L('본국 혼인등록', 'Register at home too'), B('배우자 나라에서도 혼인이 등록돼야 비자 심사에서 인정돼요. 절차는 대사관에 확인하세요.', 'The marriage must also be registered in the spouse’s country. Check the procedure with the embassy.'))
      ]),
      stage('invite', 0.38, '초청 요건', 'Sponsor rules', [
        it('f6-program', 120, L('국제결혼 안내프로그램', 'Marriage guidance program'), B('중국·베트남·필리핀·캄보디아·몽골·우즈베키스탄·태국 배우자를 초청하는 한국인은 꼭 이수해야 해요. 신청 socinet.go.kr.', 'Required for a Korean inviting a spouse from China, Vietnam, the Philippines, Cambodia, Mongolia, Uzbekistan or Thailand. Apply at socinet.go.kr.')),
        it('f6-income', 120, L('초청인 소득 확인 (2026)', 'Sponsor income (2026)'), B('2인 가구 연 25,195,752원(세전, 최근 1년) 이상. 부족하면 6개월 넘게 가진 순재산의 5%를 소득으로 봐요. 부부 사이 자녀가 있으면 면제.', '2-person household: KRW 25,195,752 a year (pre-tax, last 12 months). If short, 5% of net assets held 6+ months counts. Exempt if you have a child together.')),
        it('f6-house', 90, L('부부 거주지 마련', 'A home for the couple'), B('부부가 함께 살 정상 주거가 있어야 해요. 고시원·모텔·비닐하우스는 안 됩니다.', 'You need a normal home to live in together — goshiwon, motels or greenhouses do not count.')),
        it('f6-sponsorban', 120, L('초청 제한 확인', 'Check sponsor limits'), B('한국인 배우자가 5년 안에 다른 외국인 배우자를 초청했거나, 성범죄·가정폭력 등 전과가 있으면 초청이 제한될 수 있어요. 대사관이나 1345에 확인하세요.', 'A Korean spouse who invited another foreign spouse in the last 5 years, or has sex-crime or domestic-violence convictions, may be barred from inviting. Ask the embassy or 1345.'))
      ]),
      stage('papers', 0.6, '서류', 'Documents', [
        it('f6-korean', 120, L('한국어 요건', 'Korean-language rule'), B('TOPIK 1급 이상, 세종학당 등 120시간 이상 이수, KIIP 2단계 이상 중 하나. 부부 사이 자녀가 있으면 면제.', 'One of: TOPIK 1+, a 120-hour course (e.g. Sejong Institute), or KIIP level 2+. Exempt if you have a child together.')),
        it('f6-health', 90, L('건강·범죄경력 교환', 'Exchange health and records'), B('부부가 서로 건강진단서와 범죄경력증명서를 주고, 상대가 읽을 수 있게 번역해요. 한국인 배우자도 경찰서 범죄경력회보서와 병원 건강진단서를 냅니다.', 'Spouses exchange health certificates and criminal-record checks, translated so the other can read them. The Korean spouse also gets one from the police and a hospital.')),
        it('f6-docs', 75, L('초청장·신원보증서', 'Invitation documents'), B('한국인 배우자가 초청장·신원보증서·가족관계증명서·소득·주거 증빙을 준비해요. 안내프로그램 이수번호도 적습니다.', 'The Korean spouse prepares the invitation, guarantee letter, family certificate and income/housing proof, with the program completion number.'))
      ]),
      stage('visa', 0.8, '사증', 'Visa', [
        it('f6-visa', 60, L('대사관 F-6 비자 신청', 'Apply for F-6 at the embassy'), B('외국인 배우자가 본국 한국 대사관에 서류를 내고 면접을 볼 수 있어요. 기간은 공관마다 달라요.', 'The foreign spouse applies at the Korean embassy and may be interviewed. Processing time varies.'))
      ]),
      leg('arrive', 0.94, L('한국 도착 후', 'After arrival', 'Sau khi đến', 'Setelah tiba', 'ក្រោយមកដល់', 'आइपुगेपछि'), [
        C.arc('f6'),
        C.nhis('f6', B('결혼이민은 6개월을 기다리지 않고 등록일부터 가입돼요. 직장 다니는 한국인 배우자의 피부양자가 되는지 1577-1000에 물어보세요.', 'F-6 joins from the registration date, no 6-month wait. Ask 1577-1000 whether you can be a dependent of your employed Korean spouse.')),
        it('f6-danuri', null, L('다누리콜센터 1577-1366', 'Danuri helpline 1577-1366'), B('365일 24시간, 여러 언어로 생활·체류·폭력 피해를 상담해요.', 'Advice on daily life, visas and abuse, 24/7, in many languages.'), 1),
        it('f6-center', null, L('원주시가족센터 등록', 'Join the Wonju Family Center'), B('한국어 교육·초기정착·통번역을 도와줘요(033-765-8135, 판부면 매봉길 16-18). 오기 어려우면 방문교육도 있어요.', 'Korean classes, settling-in help and interpreting (033-765-8135, 16-18 Maebong-gil, Panbu-myeon). Home visits available.'), 14),
        it('f6-kiip', null, L('사회통합프로그램 신청', 'Join KIIP'), B('이수하면 연장·영주·귀화에 도움이 돼요. socinet.go.kr에서 신청, 온라인 수업도 있어요.', 'It helps with extensions, permanent residence and citizenship. Apply at socinet.go.kr; online classes too.'), 30),
        C.sim('f6'), C.bank('f6'),
        C.extend('f6', B('한 번에 1~3년(처음엔 보통 1년). 혼인관계 증빙이 필요하고 만료 4개월 전부터 신청할 수 있어요.', '1–3 years each time (often 1 year at first). Bring proof of marriage; you can apply from 4 months before expiry.')),
        it('f6-f5', null, L('영주(F-5) 검토', 'Consider F-5 residency'), B('F-6로 2년 이상 살면 영주(F-5) 변경을 신청할 수 있어요. 품행·생계 요건과 기본소양(보통 사회통합프로그램 5단계 이수)이 필요해요.', 'After 2+ years on F-6 you can apply for F-5 permanent residence, meeting conduct and income rules and basic knowledge (usually KIIP level 5).'), 730),
        it('f6-dv', null, L('폭력·혼인단절 때도 체류', 'Stay if abused or separated'), B('가정폭력 절차 중에는 체류를 연장할 수 있어요. 배우자의 사망·실종이나 배우자 잘못으로 혼인이 끝나면 F-6-3, 자녀를 키우면 F-6-2로 계속 머물 수 있어요.', 'You can extend your stay during domestic-violence proceedings. If your spouse dies, goes missing or causes the breakup: F-6-3; if you raise a child: F-6-2.'), null),
        C.addr('f6'), C.reentry('f6'), C.help('f6')
      ])
    ] }
];

export const byCode = Object.fromEntries(VISAS.map((v) => [v.code, v]));

/* world-atlas 숫자 코드 → 알파-2 (송출국 밖의 주요 나라) */
/* world-atlas 국가 번호(ISO 3166 숫자) → 2글자 코드 — 지구본 모든 나라 이름을 사용자 언어로 보여 주는 데 씁니다 */
export const NUM2A2 = { '004': 'AF', '008': 'AL', '010': 'AQ', '012': 'DZ', '024': 'AO', '031': 'AZ', '032': 'AR', '036': 'AU', '040': 'AT', '044': 'BS', '050': 'BD', '051': 'AM', '056': 'BE', '064': 'BT', '068': 'BO', '070': 'BA', '072': 'BW', '076': 'BR', '084': 'BZ', '090': 'SB', '096': 'BN', '100': 'BG', '104': 'MM', '108': 'BI', '112': 'BY', '116': 'KH', '120': 'CM', '124': 'CA', '140': 'CF', '144': 'LK', '148': 'TD', '152': 'CL', '156': 'CN', '158': 'TW', '170': 'CO', '178': 'CG', '180': 'CD', '188': 'CR', '191': 'HR', '192': 'CU', '196': 'CY', '203': 'CZ', '204': 'BJ', '208': 'DK', '214': 'DO', '218': 'EC', '222': 'SV', '226': 'GQ', '231': 'ET', '232': 'ER', '233': 'EE', '238': 'FK', '242': 'FJ', '246': 'FI', '250': 'FR', '260': 'TF', '262': 'DJ', '266': 'GA', '268': 'GE', '270': 'GM', '275': 'PS', '276': 'DE', '288': 'GH', '300': 'GR', '304': 'GL', '320': 'GT', '324': 'GN', '328': 'GY', '332': 'HT', '340': 'HN', '348': 'HU', '352': 'IS', '356': 'IN', '360': 'ID', '364': 'IR', '368': 'IQ', '372': 'IE', '376': 'IL', '380': 'IT', '384': 'CI', '388': 'JM', '392': 'JP', '398': 'KZ', '400': 'JO', '404': 'KE', '408': 'KP', '410': 'KR', '414': 'KW', '417': 'KG', '418': 'LA', '422': 'LB', '426': 'LS', '428': 'LV', '430': 'LR', '434': 'LY', '440': 'LT', '442': 'LU', '450': 'MG', '454': 'MW', '458': 'MY', '466': 'ML', '478': 'MR', '484': 'MX', '496': 'MN', '498': 'MD', '499': 'ME', '504': 'MA', '508': 'MZ', '512': 'OM', '516': 'NA', '524': 'NP', '528': 'NL', '540': 'NC', '548': 'VU', '554': 'NZ', '558': 'NI', '562': 'NE', '566': 'NG', '578': 'NO', '586': 'PK', '591': 'PA', '598': 'PG', '600': 'PY', '604': 'PE', '608': 'PH', '616': 'PL', '620': 'PT', '624': 'GW', '626': 'TL', '630': 'PR', '634': 'QA', '642': 'RO', '643': 'RU', '646': 'RW', '682': 'SA', '686': 'SN', '688': 'RS', '694': 'SL', '703': 'SK', '704': 'VN', '705': 'SI', '706': 'SO', '710': 'ZA', '716': 'ZW', '724': 'ES', '728': 'SS', '729': 'SD', '732': 'EH', '740': 'SR', '748': 'SZ', '752': 'SE', '756': 'CH', '760': 'SY', '762': 'TJ', '764': 'TH', '768': 'TG', '780': 'TT', '784': 'AE', '788': 'TN', '792': 'TR', '795': 'TM', '800': 'UG', '804': 'UA', '807': 'MK', '818': 'EG', '826': 'GB', '834': 'TZ', '840': 'US', '854': 'BF', '858': 'UY', '860': 'UZ', '862': 'VE', '887': 'YE', '894': 'ZM', 'Kosovo': 'XK' };

/* 출발 공항 (수도 기준) */
export const IATA = { PH: 'MNL', NP: 'KTM', LK: 'CMB', ID: 'CGK', BD: 'DAC', UZ: 'TAS', VN: 'HAN', KH: 'KTI', TH: 'BKK', MM: 'RGN', PK: 'ISB', MN: 'UBN', KG: 'FRU', CN: 'PEK', TL: 'DIL', LA: 'VTE', TJ: 'DYU', KZ: 'NQZ',
  US: 'JFK', GB: 'LHR', FR: 'CDG', DE: 'FRA', JP: 'NRT', IN: 'DEL', RU: 'SVO', AU: 'SYD', CA: 'YYZ', BR: 'GRU', MY: 'KUL', SG: 'SIN', TW: 'TPE', TR: 'IST', EG: 'CAI', NG: 'LOS', KE: 'NBO', MX: 'MEX', ZA: 'JNB', AE: 'DXB', SA: 'RUH', IR: 'IKA', IT: 'FCO', ES: 'MAD' };
