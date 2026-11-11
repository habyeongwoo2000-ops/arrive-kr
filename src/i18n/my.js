/* 내 정보 화면 · 첫 화면 "다시 오셨네요" 문구 — 한국어·영어 (다른 언어는 영어로 채움) */
const MY = {
  ko: {
    title: '내 정보', hello: '{name} 님의 정착 노트', helloGuest: '내 정착 노트', traveler: '여행자',
    guest: '이 기기에 저장된 내용이에요. 로그인하면 계정별로 따로 저장돼요.', login: '로그인', logout: '로그아웃',
    searchPh: '무엇을 찾고 있나요? 예: 기한, 집, 비자, 언어, 전화', searchNone: '맞는 메뉴가 없어요.',
    tEntry: '입국까지', tPre: '입국 준비', tSettle: '정착도', noEntry: '날짜 없음',
    tabs: { trip: '내 여정', settle: '정착', home: '내 집', reco: '맞춤 지원', set: '설정', help: '도움받기' },
    from: '출발 나라', visa: '체류자격', entry: '입국 예정일', noCountry: '아직 고르지 않았어요',
    goRoute: '입국 경로 보기', goTicket: '탑승권 다시 보기',
    goTodo: '도착 후 할 일 열기', goPlan: 'AI 30일 일정 만들기',
    homeNone: '아직 정하지 않았어요. 집 주소를 정하면 지도와 일정이 집에서 출발해요.', goHome: '집 주소 정하기', goHomeEdit: '집 주소 바꾸기',
    needs: '필요한 것', town: '사는 곳', family: '가족과 함께', yes: '예', no: '아니요', goFind: '맞춤 지원 열기',
    lang: '화면 언어', account: '계정', clear: '저장한 정보 지우기', clearLead: '이 기기에 저장한 체크 기록·날짜·집 주소·조건을 지웁니다. 되돌릴 수 없어요.',
    clearAsk: '저장한 정보를 모두 지울까요? 되돌릴 수 없어요.',
    h1345: '외국인종합안내 1345', h1345s: '체류·비자 상담 (여러 언어)', h0644: '외국인력상담 1644-0644', h0644s: '일자리·사업장 문제', hTutor: '한국어 도우미', hTutorS: 'EPS-TOPIK 연습 · AI에게 묻기',
    back: '다시 오셨네요, {name} 님', backGuest: '다시 오셨네요', cont: '이어서 하기', more: '내 정보'
  },
  en: {
    title: 'My info', hello: "{name}'s settling notes", helloGuest: 'My settling notes', traveler: 'Traveler',
    guest: 'Saved on this device. Sign in to keep a separate record per account.', login: 'Sign in', logout: 'Sign out',
    searchPh: 'What are you looking for? e.g. deadline, home, visa, language, call', searchNone: 'No matching menu.',
    tEntry: 'To entry', tPre: 'Pre-departure', tSettle: 'Settled', noEntry: 'No date',
    tabs: { trip: 'My trip', settle: 'Settling in', home: 'Home', reco: 'Support', set: 'Settings', help: 'Get help' },
    from: 'From', visa: 'Visa', entry: 'Entry date', noCountry: 'Not chosen yet',
    goRoute: 'Open my route', goTicket: 'Open the boarding pass',
    goTodo: 'Open my to-do', goPlan: 'Build my 30-day plan',
    homeNone: 'Not set yet. Set your home and the map and plan start from there.', goHome: 'Set home address', goHomeEdit: 'Change home address',
    needs: 'Needs', town: 'Area', family: 'With family', yes: 'Yes', no: 'No', goFind: 'Open support finder',
    lang: 'Language', account: 'Account', clear: 'Delete saved information', clearLead: 'Deletes checks, dates, home and choices saved on this device. This cannot be undone.',
    clearAsk: 'Delete all saved information? This cannot be undone.',
    h1345: 'Immigration contact center 1345', h1345s: 'Visa and stay, many languages', h0644: 'Foreign worker help 1644-0644', h0644s: 'Jobs and workplace problems', hTutor: 'Korean helper', hTutorS: 'EPS-TOPIK practice · ask AI',
    back: 'Welcome back, {name}', backGuest: 'Welcome back', cont: 'Continue', more: 'My info'
  }
};
export const my = (lang) => (lang === 'ko' ? MY.ko : { ...MY.en, tabs: { ...MY.en.tabs } });
