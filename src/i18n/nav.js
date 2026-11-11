/* 네이버지도식 화면 틀(왼쪽 메뉴·지도 도구·첫 화면)에 쓰는 문구 — 없는 언어는 영어 */
const NAV = {
  ko: { route: '입국 경로', todo: '할 일', settle: '정착 지원', plan: '30일 일정', korean: '한국어', ticket: '탑승권', login: '로그인', me: '내 정보',
    fold: '패널 접기', unfold: '패널 펼치기', layer: '지도 유형', sat: '위성', map: '지도', more: '더보기', lang: '언어',
    homeT: '어디에서 출발하나요?', homeSub: '나라를 고르면 인천까지 준비 경로와 기한을 보여 드려요.', epsT: '고용허가제(E-9) 송출국', epsN: '{n}곳',
    otherT: '다른 나라', otherSub: '지구본에서 누르거나 위에서 검색하세요', feeL: '응시료', newL: '신규', homeNote: '송출국별 서류·응시료는 2026 공지 기준이며, 회차마다 바뀔 수 있습니다.',
    pinsL: '공공지원 위치', terminalL: '버스터미널', gwL: '강원 전체', wonjuL: '원주', noFood: '지구본에서 나라를 고르면 고향 음식점을 보여 드려요',
    dday: '입국까지', ready: '준비', change: '변경', summaryL: '준비 현황', stepsL: '준비 단계', aiBadge: 'AI', flyOn: '내 비행기 보기 · {p}% 왔어요', flyHint: '체크 항목을 하나 끝낼 때마다 비행기가 앞으로 나아가요. 모두 끝내면 인천에 도착해요.', myInfo: '내 정보' },
  en: { route: 'Route', todo: 'To-do', settle: 'Settle', plan: '30 days', korean: 'Korean', ticket: 'Pass', login: 'Sign in', me: 'Me',
    fold: 'Hide panel', unfold: 'Show panel', layer: 'Map type', sat: 'Satellite', map: 'Map', more: 'More', lang: 'Language',
    homeT: 'Where are you leaving from?', homeSub: 'Pick a country to see your route to Incheon with deadlines.', epsT: 'EPS (E-9) sending countries', epsN: '{n}',
    otherT: 'Other countries', otherSub: 'Tap the globe or search above', feeL: 'Test fee', newL: 'New', homeNote: 'Documents and fees follow 2026 notices and may change each round.',
    pinsL: 'Support places', terminalL: 'Bus terminal', gwL: 'All Gangwon', wonjuL: 'Wonju', noFood: 'Pick your country on the globe to see home-food places',
    dday: 'To entry', ready: 'Ready', change: 'Change', summaryL: 'Readiness', stepsL: 'Steps', aiBadge: 'AI', flyOn: 'Show my plane · {p}% of the way', flyHint: 'Each item you check moves the plane forward. Finish them all to land in Incheon.', myInfo: 'My info' },
  vi: { route: 'Lộ trình', todo: 'Việc cần làm', settle: 'Định cư', plan: '30 ngày', korean: 'Tiếng Hàn', ticket: 'Vé', login: 'Đăng nhập', more: 'Thêm', homeT: 'Bạn xuất phát từ đâu?', epsT: 'Nước phái cử EPS (E-9)' },
  id: { route: 'Rute', todo: 'Tugas', settle: 'Menetap', plan: '30 hari', korean: 'Korea', ticket: 'Tiket', login: 'Masuk', more: 'Lainnya', homeT: 'Dari mana Anda berangkat?', epsT: 'Negara pengirim EPS (E-9)' },
  km: { route: 'ផ្លូវ', todo: 'កិច្ចការ', settle: 'តាំងលំនៅ', plan: '៣០ ថ្ងៃ', korean: 'កូរ៉េ', ticket: 'សំបុត្រ', login: 'ចូល', more: 'ច្រើនទៀត', homeT: 'អ្នកចេញដំណើរពីណា?', epsT: 'ប្រទេសបញ្ជូន EPS (E-9)' },
  ne: { route: 'रुट', todo: 'काम', settle: 'बसोबास', plan: '३० दिन', korean: 'कोरियाली', ticket: 'टिकट', login: 'लगइन', more: 'थप', homeT: 'कहाँबाट प्रस्थान गर्दै हुनुहुन्छ?', epsT: 'EPS (E-9) पठाउने देश' }
};
export const nav = (lang) => ({ ...NAV.en, ...(lang === 'ko' ? NAV.ko : NAV[lang] || {}) });
