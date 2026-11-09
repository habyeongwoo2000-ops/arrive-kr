/* 원주 → 강원 → 인근 시군 → 전국 순서의 공공지원 사업
   ------------------------------------------------------------------
   주요 근거
   [P26] 법무부 「제4차 외국인정책 기본계획」 2026년도 시행계획 — 강원특별자치도 편
   [HK]  헤럴드경제(2026.1.22) 원주 체류 외국인 6,750명(2025년 말, 도내 최다)
   [WJ]  원주시 보도·공지(이동출입국, 문막 상생 통근버스 등)
   [NHIS] 국민건강보험공단 외국인 건강보험 안내
   · 확인일 2026-11-09. 기간·대상은 해마다 바뀌므로 카드마다 연락처를 함께 보여 줍니다.
   · pin: 지도 위치. exact=false 는 "대략 위치"(방문 전 전화 확인)입니다.
   ------------------------------------------------------------------ */

export const WONJU = { lat: 37.3422, lng: 127.9202 };

export const STATS = [
  { n: '6,750', ko: '원주 체류 외국인 (2025년 말 · 강원 1위)', en: 'Foreign residents in Wonju (end of 2025 · #1 in Gangwon)', src: 'HK' },
  { n: '20%', ko: '강원 체류 외국인 중 원주 비중', en: "Wonju's share of Gangwon's foreign residents", src: 'HK' },
  { n: '+1,587', ko: '1년 새 늘어난 원주 체류 외국인', en: 'Increase in one year', src: 'HK' }
];

/* 지도에 찍는 장소 (exact=false 는 대략 위치) */
export const PLACES = {
  cityhall: { lat: 37.3422, lng: 127.9202, exact: true, ko: '원주시청', en: 'Wonju City Hall' },
  terminal: { lat: 37.3466, lng: 127.9332, exact: false, ko: '원주종합버스터미널 (공항버스 도착)', en: 'Wonju Bus Terminal (airport bus)' },
  munmak: { lat: 37.3120, lng: 127.8160, exact: false, ko: '문막읍 일대', en: 'Munmak-eup area' },
  nhis: { lat: 37.3245, lng: 127.9838, exact: false, ko: '국민건강보험공단 본사 (혁신도시)', en: 'NHIS headquarters (Innovation City)' },
  sangji: { lat: 37.3696, lng: 127.9300, exact: false, ko: '상지대학교', en: 'Sangji University' },
  yonsei: { lat: 37.2810, lng: 127.9020, exact: false, ko: '연세대 미래캠퍼스', en: 'Yonsei Univ. Mirae Campus' },
  chuncheon: { lat: 37.8813, lng: 127.7298, exact: false, ko: '춘천 (강원특별자치도청)', en: 'Chuncheon (Provincial Office)' },
  hoengseong: { lat: 37.4918, lng: 127.9850, exact: false, ko: '횡성군청 일대', en: 'Hoengseong County Office' },
  hongcheon: { lat: 37.6970, lng: 127.8888, exact: false, ko: '홍천군청 일대', en: 'Hongcheon County Office' },
  gangneung: { lat: 37.7519, lng: 128.8761, exact: false, ko: '강릉시 일대', en: 'Gangneung' },
  jeongseon: { lat: 37.3807, lng: 128.6608, exact: false, ko: '정선군 일대', en: 'Jeongseon' }
};

/* 살 곳(거주지) — 원주를 먼저 */
export const TOWNS = [
  { id: 'wonju', ko: '원주시', en: 'Wonju' },
  { id: 'hoengseong', ko: '횡성군', en: 'Hoengseong' },
  { id: 'chuncheon', ko: '춘천시', en: 'Chuncheon' },
  { id: 'hongcheon', ko: '홍천군', en: 'Hongcheon' },
  { id: 'gangneung', ko: '강릉시', en: 'Gangneung' },
  { id: 'jeongseon', ko: '정선군', en: 'Jeongseon' },
  { id: 'gangwon', ko: '그 밖의 강원 시군', en: 'Elsewhere in Gangwon' }
];

/* 필요한 것 */
export const NEEDS = [
  { id: 'stay', ic: '🛂', ko: '체류·비자', en: 'Visa & stay' },
  { id: 'work', ic: '🧰', ko: '일자리·노동 상담', en: 'Work & labor help' },
  { id: 'health', ic: '🏥', ko: '병원·건강보험', en: 'Health & insurance' },
  { id: 'korean', ic: '가', ko: '한국어 배우기', en: 'Learn Korean' },
  { id: 'family', ic: '👪', ko: '가족·결혼이민', en: 'Family & marriage' },
  { id: 'child', ic: '🧒', ko: '아이 보육', en: 'Childcare' },
  { id: 'life', ic: '🏠', ko: '생활·교통', en: 'Daily life & transport' },
  { id: 'safety', ic: '🦺', ko: '안전·위기', en: 'Safety & crisis' },
  { id: 'culture', ic: '🎉', ko: '문화·이웃', en: 'Culture & community' },
  { id: 'study', ic: '🎓', ko: '유학·취업 준비', en: 'Study & job hunting' }
];

export const SCOPE = {
  wonju: { ko: '원주시', en: 'Wonju', w: 40 },
  gangwon: { ko: '강원특별자치도', en: 'Gangwon', w: 26 },
  near: { ko: '인근 시군', en: 'Nearby county', w: 18 },
  national: { ko: '전국', en: 'Nationwide', w: 8 }
};

/* visas: 대상 체류자격 ('*' = 모든 외국인주민) */
export const PROGRAMS = [
  /* ───────── 원주시 ───────── */
  { id: 'w-center', scope: 'wonju', town: 'wonju', place: 'cityhall', visas: ['*'], needs: ['life', 'work', 'stay', 'korean', 'health', 'culture'], hot: true,
    ko: { t: '원주시 외국인주민지원센터', what: '노동·체류·인권·생활·의료·법률 상담과 통역, 생활 한국어(주중 야간·주말), 사회통합프로그램, 문화체험을 한곳에서 지원합니다.', when: '상시 (2026 목표: 상담 2,400건 · 교육 2,500명)', who: '원주에 사는 외국인주민 누구나' },
    en: { t: 'Wonju Foreign Residents Support Center', what: 'One-stop help: labor, visa, human-rights, daily-life, medical and legal counseling with interpreters; evening & weekend Korean classes; KIIP; cultural programs.', when: 'Year-round (2026 target: 2,400 consultations, 2,500 learners)', who: 'Any foreign resident of Wonju' },
    tel: '033-737-2294', org: '원주시 자치행정과 · (사)함께하는 공동체 운영', src: 'P26' },
  { id: 'w-immig', scope: 'wonju', town: 'wonju', place: 'cityhall', visas: ['*'], needs: ['stay'], hot: true,
    ko: { t: '원주 이동출입국 (시청 1층)', what: '춘천까지 가지 않고 원주시청에서 외국인등록·체류기간 연장 등 출입국 민원을 봅니다. 그 밖의 날은 춘천출입국·외국인사무소를 이용합니다.', when: '운영일은 원주시·출입국 공지 확인 (2026.10~2027.1 둘째·넷째 목요일 안내)', who: '원주 거주 등록외국인' },
    en: { t: 'Mobile Immigration Office at Wonju City Hall', what: 'Register as a foreigner or extend your stay at Wonju City Hall instead of travelling to Chuncheon. Other days: Chuncheon Immigration Office.', when: 'Check the city notice (2nd & 4th Thursdays announced for Oct 2026 – Jan 2027)', who: 'Registered foreigners living in Wonju' },
    tel: '1345', org: '법무부 춘천출입국·외국인사무소 · 원주시', src: 'WJ' },
  { id: 'w-nhis', scope: 'wonju', town: 'wonju', place: 'nhis', visas: ['*'], needs: ['health'],
    ko: { t: '외국인 건강보험 (국민건강보험공단 본사 · 원주)', what: '6개월 이상 머무는 외국인은 건강보험에 가입합니다(직장가입 또는 지역가입). E-9 근로자는 보통 회사에서 직장가입합니다. 외국어 상담 전화가 따로 있습니다.', when: '입국 후 · 상시', who: '6개월 이상 체류 외국인' },
    en: { t: 'National Health Insurance (NHIS HQ is in Wonju)', what: 'Foreigners staying 6+ months join National Health Insurance (through the employer or as a local subscriber). E-9 workers are usually enrolled by the employer. Foreign-language helpline available.', when: 'After entry · year-round', who: 'Foreigners staying 6+ months' },
    tel: '033-811-2000', org: '국민건강보험공단 외국인 민원상담', src: 'NHIS' },
  { id: 'w-bus', scope: 'wonju', town: 'wonju', place: 'munmak', visas: ['E-9', 'H-2', 'E-7', 'E-7-4', 'F-6', '*'], needs: ['life', 'work'],
    ko: { t: '문막 상생 통근버스', what: '문막 산업단지로 출퇴근하는 근로자를 위한 통근버스입니다. 차가 없는 외국인 근로자도 출퇴근할 수 있습니다.', when: '2026.1.2부터 운행', who: '문막 지역 기업 근로자' },
    en: { t: 'Munmak shared commuter bus', what: 'Commuter buses to the Munmak industrial complex, so workers without a car can get to work.', when: 'Running since 2 Jan 2026', who: 'Workers at Munmak companies' },
    tel: '033-743-2991', org: '원주상공회의소', src: 'WJ' },
  { id: 'w-shelter', scope: 'wonju', town: 'wonju', place: 'munmak', visas: ['E-9', 'H-2', 'E-8', '*'], needs: ['life', 'safety', 'work'],
    ko: { t: '문막 외국인근로자 쉼터', what: '갑자기 머물 곳이 없어지거나 일터 문제로 쉴 곳이 필요한 외국인 근로자를 돕습니다.', when: '상시 (전화 먼저)', who: '원주·문막 외국인 근로자' },
    en: { t: 'Munmak shelter for foreign workers', what: 'A place to stay and get help when you suddenly lose housing or have a workplace crisis.', when: 'Year-round (call first)', who: 'Foreign workers in Wonju/Munmak' },
    tel: '070-7521-8097', org: '문막 쉼터', src: 'WJ' },
  { id: 'w-season', scope: 'wonju', town: 'wonju', place: 'cityhall', visas: ['E-8'], needs: ['work', 'life', 'health'],
    ko: { t: '원주시 계절근로자 지원', what: '원주 농가에서 일하는 계절근로자의 교통비·보험료를 지원합니다. 2025년 77명 → 2026년 100명 목표.', when: '농번기 (모집은 시 공지)', who: 'E-8 계절근로자 · 고용 농가' },
    en: { t: 'Wonju seasonal worker support', what: 'Travel and insurance costs for seasonal workers on Wonju farms. 77 workers in 2025 → 100 targeted in 2026.', when: 'Farming season (see city notice)', who: 'E-8 seasonal workers and host farms' },
    tel: '033-737-4123', org: '원주시 농업정책과', src: 'P26' },
  { id: 'w-e74', scope: 'wonju', town: 'wonju', place: 'cityhall', visas: ['E-9', 'E-8', 'H-2', 'E-7-4'], needs: ['stay', 'work'], hot: true,
    ko: { t: '숙련기능인력(E-7-4) 원주시 추천', what: '원주 기업에서 오래 일한 숙련 근로자가 E-7-4로 바꿀 때 시의 추천을 받을 수 있습니다. 요건(체류 기간·소득·한국어 등)은 하이코리아에서 꼭 확인하세요.', when: '도·시 추천 공고 때', who: '원주 기업의 숙련 외국인 근로자' },
    en: { t: 'Wonju recommendation for skilled worker (E-7-4)', what: 'Long-serving skilled workers at Wonju companies can get a local recommendation when switching to E-7-4. Check the exact requirements (stay, income, Korean) on HiKorea.', when: 'When the province/city announces', who: 'Skilled foreign workers at Wonju companies' },
    tel: '033-737-2976', org: '원주시 기업지원일자리과 (도 033-249-2498)', src: 'P26' },
  { id: 'w-family', scope: 'wonju', town: 'wonju', place: null, visas: ['F-6', '*'], needs: ['family', 'korean', 'child'],
    ko: { t: '원주시가족센터 (다문화가족)', what: '통번역, 집으로 찾아가는 방문교육, 한국어 교육, 가족 상담을 합니다.', when: '상시', who: '결혼이민자·다문화가족', url: 'https://wonju.familynet.or.kr' },
    en: { t: 'Wonju Family Center (multicultural families)', what: 'Interpretation, home-visit education, Korean classes and family counseling.', when: 'Year-round', who: 'Marriage migrants & multicultural families', url: 'https://wonju.familynet.or.kr' },
    tel: '', org: '원주시가족센터', src: 'P26' },
  { id: 'w-band', scope: 'wonju', town: 'wonju', place: 'cityhall', visas: ['F-6'], needs: ['family', 'culture'],
    ko: { t: '다문화가족 합주단', what: '결혼이민자와 가족이 함께 악기를 배우고 공연합니다.', when: '2026.7~12', who: '결혼이민자·다문화가족' },
    en: { t: 'Multicultural family ensemble', what: 'Marriage migrants and their families learn instruments and perform together.', when: 'Jul – Dec 2026', who: 'Marriage migrants & families' },
    tel: '033-737-2743', org: '원주시 여성가족과', src: 'P26' },
  { id: 'w-fest', scope: 'wonju', town: 'wonju', place: 'cityhall', visas: ['*'], needs: ['culture'],
    ko: { t: '원주 세계문화축제', what: '나라별 음식·공연·체험 부스로 이웃과 만나는 축제입니다.', when: '매년 가을 (2026년 9월 제4회)', who: '누구나' },
    en: { t: 'Wonju World Culture Festival', what: 'Food, stages and booths from many countries — meet your neighbors.', when: 'Every autumn (4th edition, Sep 2026)', who: 'Everyone' },
    tel: '033-737-2743', org: '원주시 여성가족과', src: 'P26' },

  /* ───────── 강원특별자치도 ───────── */
  { id: 'g-medical', scope: 'gangwon', town: '*', place: 'chuncheon', visas: ['*'], needs: ['health'], hot: true,
    ko: { t: '외국인근로자 등 의료비 지원', what: '건강보험이 없는 외국인근로자(배우자·자녀 포함)와 난민의 진료비 90%를 지원합니다(1회 최대 300만 원). 도내 지정 의료기관 7곳에서 받습니다.', when: '연중', who: '건강보험 가입이 안 되는 외국인근로자·가족·난민' },
    en: { t: 'Medical cost support for uninsured foreign workers', what: 'Covers 90% of hospital costs (up to KRW 3 million per case) for uninsured foreign workers, their families and refugees at 7 designated hospitals.', when: 'Year-round', who: 'Foreign workers/families/refugees without health insurance' },
    tel: '033-249-3931', org: '강원특별자치도 공공의료과', src: 'P26' },
  { id: 'g-student', scope: 'gangwon', town: '*', place: 'sangji', visas: ['D-2', 'D-10'], needs: ['study', 'work', 'stay'], hot: true,
    ko: { t: '외국인 유학생 취업 지원', what: '취업박람회, 상시 취업 플랫폼, 학교로 찾아가는 취업·비자 상담을 운영합니다.', when: '2026 연중', who: '강원 대학 외국인 유학생·졸업생' },
    en: { t: 'Job support for international students', what: 'Job fairs, a year-round job platform and on-campus career & visa counseling.', when: 'Throughout 2026', who: 'International students/graduates in Gangwon' },
    tel: '033-249-3717', org: '강원특별자치도 지역소멸대응정책관', src: 'P26' },
  { id: 'g-d2', scope: 'gangwon', town: '*', place: 'yonsei', visas: ['D-2'], needs: ['study', 'stay'],
    ko: { t: '강원 광역형 유학비자(D-2)', what: '상지대·연세대 미래캠퍼스·한라대·강릉원주대 등 12개 대학. 재정 요건 1,600만→800만 원, 시간제 취업 10~30시간, 졸업 학기 인턴 허용.', when: '대학 모집 일정', who: '강원 참여 대학 유학생' },
    en: { t: 'Gangwon regional student visa (D-2)', what: '12 universities incl. Sangji, Yonsei Mirae, Halla and Gangneung-Wonju. Financial proof cut from KRW 16M to 8M, 10–30 h/week part-time work, internships in the final semester.', when: 'University admission schedule', who: 'Students at participating universities' },
    tel: '033-249-3717', org: '강원특별자치도', src: 'P26' },
  { id: 'g-multi', scope: 'gangwon', town: '*', place: null, visas: ['F-6'], needs: ['family', 'korean'],
    ko: { t: '다문화가족 특성화 지원', what: '통번역사 30명, 방문교육 지도사 58명, 한국어 교육 18곳을 시군 가족센터에 둡니다.', when: '연중', who: '결혼이민자·다문화가족' },
    en: { t: 'Multicultural family services', what: '30 interpreters, 58 home-visit educators and Korean classes at 18 sites via family centers.', when: 'Year-round', who: 'Marriage migrants & multicultural families' },
    tel: '033-249-2513', org: '강원특별자치도 여성청소년가족과', src: 'P26' },
  { id: 'g-mentor', scope: 'gangwon', town: '*', place: null, visas: ['F-6', '*'], needs: ['family', 'korean', 'culture'],
    ko: { t: '결혼이민자 상호 멘토링', what: '먼저 정착한 선배 이주여성이 이중언어로 새로 온 이민자를 돕습니다(15개 가족센터 61그룹).', when: '모집 1~2월 · 활동 5~12월', who: '도내 결혼이민자·외국인주민' },
    en: { t: 'Peer mentoring for marriage migrants', what: 'Settled migrant women mentor newcomers in both languages (61 groups at 15 family centers).', when: 'Apply Jan–Feb · active May–Dec', who: 'Marriage migrants & foreign residents' },
    tel: '033-249-2513', org: '강원특별자치도 → 시군 가족센터', src: 'P26' },
  { id: 'g-safety', scope: 'gangwon', town: '*', place: null, visas: ['*'], needs: ['safety', 'culture'], fresh: true,
    ko: { t: '외국인 커뮤니티 활동 지원 · 안전 교육', what: '나라별 모임·봉사 활동비를 지원하고, 교통법규·산불·폭우·응급 대처 교육과 생활안전 가이드북을 제공합니다.', when: '2026 신규 · 교육 연 2~4회', who: '도내 외국인과 외국인 모임' },
    en: { t: 'Community grants & safety training', what: 'Funding for national communities and volunteer groups, plus training on traffic rules, wildfires, heavy rain and emergencies with a safety guidebook.', when: 'New in 2026 · 2–4 sessions a year', who: 'Foreign residents & their communities' },
    tel: '033-249-3717', org: '강원특별자치도 · 강원경제진흥원', src: 'P26' },
  { id: 'g-award', scope: 'gangwon', town: '*', place: null, visas: ['*'], needs: ['culture', 'work'], fresh: true,
    ko: { t: '외국인 우수인재 공모 · 이민친화기관 인증', what: '도내 정착 우수 외국인·기업을 시상하고, 외국인 친화 부동산·행정사·기업을 인증합니다(믿을 만한 곳 찾기).', when: '2026 신규', who: '도내 외국인·기업' },
    en: { t: 'Talent awards & migrant-friendly certification', what: 'Awards for outstanding residents and firms, and certification of migrant-friendly realtors, agents and companies.', when: 'New in 2026', who: 'Foreign residents & businesses' },
    tel: '033-249-3717', org: '강원특별자치도 지역소멸대응정책관', src: 'P26' },
  { id: 'g-seasonben', scope: 'gangwon', town: '*', place: null, visas: ['E-8'], needs: ['health', 'work', 'life'],
    ko: { t: '계절근로자 근로 여건 개선', what: '농가당 최대 100만 원으로 산재보험·의료공제·통역·숙소 수선 등을 지원합니다. 숙소 신축·개보수도 따로 지원합니다.', when: '2026 농번기', who: 'E-8 계절근로자 고용 농가' },
    en: { t: 'Seasonal worker welfare package', what: 'Up to KRW 1M per farm for accident insurance, medical aid, interpreters and housing repairs; separate grants for new or renovated housing.', when: '2026 season', who: 'Farms hiring E-8 workers' },
    tel: '033-249-3561', org: '강원특별자치도 농정 부서', src: 'P26' },
  { id: 'g-f2r', scope: 'gangwon', town: '*', place: 'hoengseong', visas: ['E-9', 'D-2', 'D-10', 'E-7', 'E-7-4', 'H-2'], needs: ['stay', 'work'],
    ko: { t: '지역특화형 비자(F-2-R) — 원주 인근', what: '횡성·홍천·삼척·영월·철원·고성·양양에서 살며 일하면 거주(F-2-R) 자격을 받을 수 있습니다. 원주는 대상이 아니니 인근 군을 함께 비교하세요.', when: '시군 추천 일정', who: '요건을 갖춘 외국인 (확인 필요)' },
    en: { t: 'Regional residence visa (F-2-R) near Wonju', what: 'Live and work in Hoengseong, Hongcheon, Samcheok, Yeongwol, Cheorwon, Goseong or Yangyang to qualify for F-2-R. Wonju is not included — compare nearby counties.', when: 'County recommendation schedule', who: 'Eligible foreigners (check requirements)' },
    tel: '1345', org: '법무부 · 참여 시군', src: 'P26' },

  /* ───────── 인근 시군 ───────── */
  { id: 'n-hs-child', scope: 'near', town: 'hoengseong', place: 'hoengseong', visas: ['*'], needs: ['child', 'family'],
    ko: { t: '횡성 외국인 아동 보육료', what: '횡성에 사는 외국인 가정 아이의 어린이집 보육료를 지원합니다.', when: '연중', who: '횡성 거주 외국인 가정 영유아' },
    en: { t: 'Hoengseong childcare subsidy for foreign children', what: 'Daycare fees for children of foreign families living in Hoengseong.', when: 'Year-round', who: 'Foreign families in Hoengseong' },
    tel: '', org: '횡성군', src: 'P26' },
  { id: 'n-hs-drive', scope: 'near', town: 'hoengseong', place: 'hoengseong', visas: ['F-6'], needs: ['family', 'life'],
    ko: { t: '횡성 결혼이민자 운전면허 취득 지원', what: '결혼이민자의 운전면허 학원비를 지원합니다.', when: '연중(인원 한정)', who: '횡성 결혼이민자' },
    en: { t: "Hoengseong driver's license support", what: 'Driving school fees for marriage migrants.', when: 'Year-round (limited)', who: 'Marriage migrants in Hoengseong' },
    tel: '', org: '횡성군', src: 'P26' },
  { id: 'n-cc-child', scope: 'near', town: 'chuncheon', place: 'chuncheon', visas: ['*'], needs: ['child', 'family'],
    ko: { t: '춘천 외국인 아동 보육료', what: '0~5세 외국인 아동 보육료를 월 최대 20만 원 지원합니다.', when: '연중', who: '춘천 거주 외국인 영유아' },
    en: { t: 'Chuncheon childcare subsidy', what: 'Up to KRW 200,000 a month for daycare of foreign children aged 0–5.', when: 'Year-round', who: 'Foreign children in Chuncheon' },
    tel: '', org: '춘천시', src: 'P26' },
  { id: 'n-hc-settle', scope: 'near', town: 'hongcheon', place: 'hongcheon', visas: ['*'], needs: ['family', 'culture', 'korean'],
    ko: { t: '홍천 외국인주민 정착 지원 · 세계문화축제', what: '정착 지원, 이중언어 교육, 세계문화축제(2026.10 제5회)를 운영합니다.', when: '연중', who: '홍천 외국인주민' },
    en: { t: 'Hongcheon settlement support & festival', what: 'Settlement help, bilingual education and the World Culture Festival (5th, Oct 2026).', when: 'Year-round', who: 'Foreign residents in Hongcheon' },
    tel: '', org: '홍천군', src: 'P26' },
  { id: 'n-gn-center', scope: 'near', town: 'gangneung', place: 'gangneung', visas: ['E-9', 'E-8', 'H-2', '*'], needs: ['work', 'life', 'korean'],
    ko: { t: '강릉 외국인근로자지원센터', what: '시가 직접 운영하는 근로자 상담·한국어 교육 센터입니다.', when: '상시', who: '강릉 외국인 근로자' },
    en: { t: 'Gangneung Foreign Workers Center', what: 'City-run counseling and Korean classes for workers.', when: 'Year-round', who: 'Foreign workers in Gangneung' },
    tel: '033-640-4748', org: '강릉시', src: 'P26' },
  { id: 'n-js-visit', scope: 'near', town: 'jeongseon', place: 'jeongseon', visas: ['F-6', '*'], needs: ['korean', 'family'],
    ko: { t: '정선 1:1 방문 한국어 · 국제우편 지원', what: '집으로 찾아가는 한국어 수업과 고향에 보내는 국제특급우편 비용을 지원합니다.', when: '연중', who: '정선 외국인주민' },
    en: { t: 'Jeongseon home Korean lessons & EMS support', what: 'One-to-one Korean lessons at home and help with international express mail to your family.', when: 'Year-round', who: 'Foreign residents in Jeongseon' },
    tel: '', org: '정선군', src: 'P26' },

  /* ───────── 전국 ───────── */
  { id: 'k-1345', scope: 'national', town: '*', place: null, visas: ['*'], needs: ['stay', 'life'],
    ko: { t: '외국인종합안내센터 1345', what: '체류·비자·생활 민원을 여러 언어로 안내합니다.', when: '평일 (언어별 시간 확인)', who: '모든 외국인' },
    en: { t: 'Immigration Contact Center 1345', what: 'Multilingual help on visas, stay and daily-life matters.', when: 'Weekdays (hours vary by language)', who: 'All foreigners' },
    tel: '1345', org: '법무부', src: 'MOJ' },
  { id: 'k-kiip', scope: 'national', town: '*', place: 'cityhall', visas: ['*'], needs: ['korean', 'stay'],
    ko: { t: '사회통합프로그램(KIIP)', what: '한국어와 한국 사회를 배우는 법무부 과정입니다. 이수하면 체류·영주·국적 심사에서 혜택이 있습니다. 원주에서는 외국인주민지원센터에서 들을 수 있습니다.', when: '학기별 신청', who: '등록외국인 등', url: 'https://www.socinet.go.kr' },
    en: { t: 'KIIP (Korea Immigration & Integration Program)', what: 'Ministry of Justice course on Korean language and society; completion helps in visa, permanent residence and naturalization reviews. Available at the Wonju support center.', when: 'Apply each term', who: 'Registered foreigners etc.', url: 'https://www.socinet.go.kr' },
    tel: '1345', org: '법무부', src: 'MOJ' },
  { id: 'k-labor', scope: 'national', town: '*', place: null, visas: ['E-9', 'H-2', 'E-8', '*'], needs: ['work', 'safety'],
    ko: { t: '외국인력상담센터', what: '임금 체불·사업장 변경·근로계약 문제를 모국어로 상담합니다.', when: '평일', who: '외국인 근로자·사업주' },
    en: { t: 'Foreign Workforce Counseling Center', what: 'Help in your language with unpaid wages, job changes and contracts.', when: 'Weekdays', who: 'Foreign workers & employers' },
    tel: '1644-0644', org: '고용노동부', src: 'MOEL' },
  { id: 'k-danuri', scope: 'national', town: '*', place: null, visas: ['F-6', '*'], needs: ['family', 'safety'],
    ko: { t: '다누리콜센터', what: '다문화가족·이주여성을 위한 생활·위기 상담과 통역(여러 언어).', when: '24시간', who: '다문화가족·이주여성' },
    en: { t: 'Danuri Helpline', what: 'Life and crisis counseling with interpreters for multicultural families and migrant women.', when: '24 hours', who: 'Multicultural families & migrant women' },
    tel: '1577-1366', org: '성평등가족부', src: 'MOGEF' },
  { id: 'k-legal', scope: 'national', town: '*', place: null, visas: ['*'], needs: ['work', 'safety'],
    ko: { t: '대한법률구조공단', what: '임금 체불 등 법률 문제를 무료 또는 적은 비용으로 상담·소송 지원합니다.', when: '평일', who: '요건을 갖춘 외국인 포함' },
    en: { t: 'Korea Legal Aid Corporation', what: 'Free or low-cost legal advice and court help, e.g. for unpaid wages.', when: 'Weekdays', who: 'Eligible residents incl. foreigners' },
    tel: '132', org: '법무부 산하', src: 'KLAC' }
];

export const SOURCES = {
  P26: '법무부 「제4차 외국인정책 기본계획」 2026년도 시행계획 (강원특별자치도)',
  HK: '헤럴드경제 2026.1.22 — 원주 체류 외국인 6,750명',
  WJ: '원주시 공지·보도 (2026)',
  NHIS: '국민건강보험공단 외국인 건강보험 안내',
  MOJ: '법무부 출입국·외국인정책본부',
  MOEL: '고용노동부',
  MOGEF: '성평등가족부 다누리',
  KLAC: '대한법률구조공단'
};

/* 맞춤 추천 — 점수와 "왜 추천했는지" 이유를 함께 돌려줍니다. */
export function recommend({ visa, town, needs, family }) {
  const want = new Set(needs || []);
  if (family) { want.add('family'); }
  const out = [];
  for (const p of PROGRAMS) {
    // 사는 곳: 원주·강원·전국은 모두, 인근 시군 사업은 그 시군에 살 때만
    if (p.scope === 'near' && p.town !== town) continue;
    if (p.scope === 'wonju' && town !== 'wonju') continue;
    const anyVisa = p.visas.includes('*');
    const visaHit = visa && p.visas.includes(visa);
    if (!anyVisa && !visaHit) continue;
    const hits = p.needs.filter((n) => want.has(n));
    if (want.size && !hits.length && !visaHit && !p.hot) continue;
    let s = SCOPE[p.scope].w + (visaHit ? 22 : 0) + hits.length * 14 + (p.hot ? 6 : 0) + (p.fresh ? 3 : 0);
    if (p.id === 'g-f2r' && town === 'wonju') s -= 8;
    const why = [];
    if (p.scope === 'wonju') why.push('wonju');
    else if (p.scope === 'near') why.push('town');
    else if (p.scope === 'gangwon') why.push('gangwon');
    if (visaHit) why.push('visa');
    hits.forEach((h) => why.push('need:' + h));
    if (p.fresh) why.push('fresh');
    out.push({ p, s, why });
  }
  return out.sort((a, b) => b.s - a.s);
}
