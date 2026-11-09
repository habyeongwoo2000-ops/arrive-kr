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
  hana: { lat: 37.3270, lng: 127.9790, exact: false, ko: '하나은행 원주혁신도시지점', en: 'Hana Bank Wonju Innovation City branch' },
  nhis: { lat: 37.3245, lng: 127.9838, exact: false, ko: '국민건강보험공단 본사 (혁신도시)', en: 'NHIS headquarters (Innovation City)' },
  sangji: { lat: 37.3696, lng: 127.9300, exact: false, ko: '상지대학교', en: 'Sangji University' },
  yonsei: { lat: 37.2810, lng: 127.9020, exact: false, ko: '연세대 미래캠퍼스', en: 'Yonsei Univ. Mirae Campus' },
  chuncheon: { lat: 37.8813, lng: 127.7298, exact: false, ko: '춘천 (강원특별자치도청)', en: 'Chuncheon (Provincial Office)' },
  hoengseong: { lat: 37.4918, lng: 127.9850, exact: false, ko: '횡성군청 일대', en: 'Hoengseong County Office' },
  hongcheon: { lat: 37.6970, lng: 127.8888, exact: false, ko: '홍천군청 일대', en: 'Hongcheon County Office' },
  gangneung: { lat: 37.7519, lng: 128.8761, exact: false, ko: '강릉시 일대', en: 'Gangneung' },
  jeongseon: { lat: 37.3807, lng: 128.6608, exact: false, ko: '정선군 일대', en: 'Jeongseon' }
};

/* 외국인 식료품점 — 카카오맵 장소 정보로 위치 확인 (2026-11-09, 검색어 40여 개로 확인)
   unsure: 카카오맵에 업종·연락처가 없어 방문 전 확인이 필요한 곳
   영업시간·품목은 바뀔 수 있어 카카오맵 링크와 전화번호를 함께 보여 줍니다. */
const KM = (id) => 'https://place.map.kakao.com/' + id;
export const SHOPS = [
  { id: 's-asia-jayu', lat: 37.35132, lng: 127.94891, town: 'wonju', tel: '033-742-4160', url: KM('1404445236'),
    ko: { t: '아시아마트', what: '아시아 식료품', addr: '원주시 자유시장길 14-1 1층 (자유시장 옆)' },
    en: { t: 'Asia Mart', what: 'Asian groceries', addr: '14-1 Jayusijang-gil, Wonju (by Jayu Market)' } },
  { id: 's-miso', lat: 37.35096, lng: 127.94794, town: 'wonju', tel: '010-3293-2534', url: KM('938993813'),
    ko: { t: '미소아시아마트', what: '아시아 식료품', addr: '원주시 원일로 130-1 1층' },
    en: { t: 'Miso Asia Mart', what: 'Asian groceries', addr: '130-1 Wonil-ro, Wonju' } },
  { id: 's-asian-usan', lat: 37.36787, lng: 127.93497, town: 'wonju', tel: '', url: KM('965486842'), unsure: true,
    ko: { t: '아시안마트 (우산동)', what: '아시아 식료품 (카카오맵 정보가 적어요)', addr: '원주시 우산초교길 65' },
    en: { t: 'Asian Mart (Usan-dong)', what: 'Asian groceries (little info on KakaoMap)', addr: '65 Usanchogyo-gil, Wonju' } },
  { id: 's-asiafood', lat: 37.30575, lng: 127.81546, town: 'wonju', tel: '010-3936-7139', url: KM('230197149'),
    ko: { t: '아시아푸드월드마트', what: '아시아 식료품', addr: '원주시 문막읍 문막시장1길 52-9 1층' },
    en: { t: 'Asia Food World Mart', what: 'Asian groceries', addr: '52-9 Munmaksijang 1-gil, Munmak-eup' } },
  { id: 's-viet', lat: 37.32275, lng: 127.82877, town: 'wonju', tel: '', url: KM('1038182494'),
    ko: { t: '베트남마트', what: '베트남 식료품', addr: '원주시 문막읍 왕건로 41-3' },
    en: { t: 'Vietnam Mart', what: 'Vietnamese groceries', addr: '41-3 Wanggeon-ro, Munmak-eup' } },
  { id: 's-asia-hs', lat: 37.49002, lng: 127.98899, town: 'hoengseong', tel: '', url: KM('1414481305'),
    ko: { t: '아시아마트 (횡성)', what: '아시아 식료품', addr: '횡성군 횡성읍 문정로19번길 27' },
    en: { t: 'Asia Mart (Hoengseong)', what: 'Asian groceries', addr: '27 Munjeong-ro 19beon-gil, Hoengseong' } },
  { id: 's-china-hs', lat: 37.48664, lng: 127.98995, town: 'hoengseong', tel: '010-3103-3996', url: KM('1530084874'),
    ko: { t: '중국식품 (횡성)', what: '중국 식료품', addr: '횡성군 횡성읍 읍상로 8' },
    en: { t: 'Chinese Food Store (Hoengseong)', what: 'Chinese groceries', addr: '8 Eupsang-ro, Hoengseong' } }
];

/* 선불폰을 개통해 주는 휴대폰 매장 — 외국인등록증이 나오기 전 여권으로 개통하는 곳
   카카오맵 휴대폰 매장 220여 곳의 소개·공지·후기를 확인해 "선불폰·알뜰폰"을 내건 곳만 골랐습니다 (2026-11-09).
   foreign: 매장이 직접 "외국인 개통 가능"을 알린 곳 */
export const PHONES = [
  { id: 'p-ds', lat: 37.35101, lng: 127.95060, town: 'wonju', tel: '033-765-4321', url: KM('2008675574'), foreign: true,
    ko: { t: '디에스이동통신 (다승텔레콤)', what: '외국인 여권 개통 · 선불폰 · 국제전화', addr: '원주시 평원로 59 (중앙동, 우체국 옆)' },
    en: { t: 'DS Mobile (Daseung Telecom)', what: 'Passport activation for foreigners · prepaid · international calls', addr: '59 Pyeongwon-ro, Jungang-dong (next to the post office)' } },
  { id: 'p-flex', lat: 37.34112, lng: 127.97248, town: 'wonju', tel: '010-2988-7664', url: KM('1505274601'), foreign: true,
    ko: { t: '플렉스모바일', what: '외국인 즉시개통 · 선불폰·알뜰폰 · 유심/eSIM', addr: '원주시 영랑길 13 101호 (행구동)' },
    en: { t: 'Flex Mobile', what: 'Same-day activation for foreigners · prepaid & budget lines · USIM/eSIM', addr: '#101, 13 Yeongnang-gil, Haenggu-dong, Wonju' } },
  { id: 'p-ntel', lat: 37.34526, lng: 127.93737, town: 'wonju', tel: '033-762-2017', url: KM('90613777'),
    ko: { t: '앤텔레콤 원주센터', what: '선불폰 개통센터', addr: '원주시 단구로37번길 3 2층 (단계동)' },
    en: { t: 'N Telecom Wonju Center', what: 'Prepaid phone activation center', addr: '2F, 3 Dangu-ro 37beon-gil, Dangye-dong, Wonju' } },
  { id: 'p-ttal', lat: 37.38312, lng: 127.94760, town: 'wonju', tel: '010-9926-1088', url: KM('26854899'),
    ko: { t: '딸부자통신', what: '선불폰·알뜰폰 · 알뜰유심', addr: '원주시 흥양로 4 (태장동)' },
    en: { t: 'Ttalbuja Telecom', what: 'Prepaid & budget lines · budget SIMs', addr: '4 Heungyang-ro, Taejang-dong, Wonju' } },
  { id: 'p-dome', lat: 37.34875, lng: 127.95021, town: 'wonju', tel: '033-748-2345', url: KM('1247523832'),
    ko: { t: '휴대폰도매샵 원주본점', what: '선불폰·알뜰폰 개통 (선불·알뜰폰 지정점)', addr: '원주시 원일로 90 1층 (중앙동)' },
    en: { t: 'Hyudaepon Domaeshop Wonju', what: 'Prepaid & budget (MVNO) lines', addr: '90 Wonil-ro, Jungang-dong, Wonju' } },
  { id: 'p-epic', lat: 37.34529, lng: 127.93794, town: 'wonju', tel: '', url: KM('192421099'),
    ko: { t: '에픽선불폰', what: '선불폰 개통', addr: '원주시 단구로37번길 8-1 1층' },
    en: { t: 'Epic Prepaid Phone', what: 'Prepaid phone lines', addr: '8-1 Dangu-ro 37beon-gil, Wonju' } },
  { id: 'p-kings', lat: 37.33381, lng: 127.92924, town: 'wonju', tel: '033-743-6788', url: KM('967247604'),
    ko: { t: '킹스중고폰선불폰 원주점', what: '선불폰 개통 · 중고폰 판매·매입', addr: '원주시 능라동길 42 프라임시티 3층 301호 (무실동)' },
    en: { t: "King's Used & Prepaid Phone Wonju", what: 'Prepaid lines · used phones bought and sold', addr: '3F #301, 42 Neungnadong-gil, Musil-dong, Wonju' } },
  { id: 'p-im', lat: 37.31629, lng: 127.94761, town: 'wonju', tel: '0503-7154-5674', url: KM('380057674'),
    ko: { t: '아이엠통신', what: '선불폰·알뜰폰 상담 · 비대면 셀프개통', addr: '원주시 오성마을길 63-25 상가동 201호 (단구동)' },
    en: { t: 'IM Telecom', what: 'Prepaid & budget lines · self-activation online', addr: 'Shop 201, 63-25 Oseongmaeul-gil, Dangu-dong, Wonju' } }
];

/* 고향 음식점 — 고른 나라(c, ISO 알파-2)의 음식점만 지도에 보여 줍니다.
   카카오맵 음식점 110여 곳의 메뉴·후기를 확인해 그 나라 음식을 내는 곳만 골랐습니다 (2026-11-09).
   한국 체인 쌀국수집은 뺐습니다. native: 후기에 "그 나라 사람이 운영"이 나오는 곳 */
export const FOODS = [
  { id: 'f-dostuk', c: ['UZ', 'KG'], lat: 37.34664, lng: 127.95340, tel: '010-3310-5544', url: KM('1632404288'),
    ko: { t: '도스툭 (Dostuk)', what: '중앙아시아(우즈벡·키르기스) 음식 · 플롭, 라그만, 추추바라, 마스타바, 삼사', addr: '원주시 중앙로 33 1층 (인동)' },
    en: { t: 'Dostuk', what: 'Central Asian (Uzbek & Kyrgyz) food · plov, lagman, chuchvara, mastava, samsa', addr: '33 Jungang-ro, In-dong' } },
  { id: 'f-sathanithai', c: ['TH'], lat: 37.34830, lng: 127.93311, tel: '', url: KM('1793333939'), unsure: true,
    ko: { t: '사타니타이', what: '태국 음식 (카카오맵 정보가 적어요)', addr: '원주시 금불1길 6-8 1층 (단계동)' },
    en: { t: 'Satani Thai', what: 'Thai food (little info on KakaoMap)', addr: '6-8 Geumbul 1-gil, Dangye-dong' } },
  { id: 'f-tashkent', c: ['UZ'], lat: 37.34779, lng: 127.95268, tel: '010-2928-0445', url: KM('468282389'),
    ko: { t: "타슈켄트", what: "우즈베키스탄 음식 · 솜사, 우즈벡 칼국수", addr: "원주시 중앙로 58 1층 (중앙동)" },
    en: { t: "Tashkent", what: "Uzbek food · somsa, Uzbek noodles", addr: "58 Jungang-ro, Jungang-dong" } },
  { id: 'f-janani', c: ['NP'], lat: 37.34986, lng: 127.95103, tel: '033-731-6555', url: KM('1353429854'), native: true,
    ko: { t: "저너니 (JANANI)", what: "인도·네팔 음식 · 커리, 사그, 틱카 마살라", addr: "원주시 중평길 28 2층 (중앙동)" },
    en: { t: "Janani", what: "Indian & Nepali food · curry, saag, tikka masala", addr: "2F, 28 Jungpyeong-gil, Jungang-dong" } },
  { id: 'f-thaisikdang', c: ['TH'], lat: 37.35098, lng: 127.94798, tel: '', url: KM('463635114'), native: true,
    ko: { t: "태국식당", what: "태국 음식 (이산 요리) · 팟타이, 쌀국수", addr: "원주시 원일로 130-1 2층 (중앙동)" },
    en: { t: "Thai Restaurant", what: "Thai food (Isan dishes) · pad thai, noodles", addr: "2F, 130-1 Wonil-ro, Jungang-dong" } },
  { id: 'f-aroi', c: ['TH'], lat: 37.35143, lng: 127.94837, tel: '033-742-0743', url: KM('272497556'), native: true,
    ko: { t: "아러이", what: "태국 음식 · 카우카무, 생선 요리", addr: "원주시 자유시장길 7-1 (중앙동)" },
    en: { t: "Aroi", what: "Thai food · khao kha mu, fish dishes", addr: "7-1 Jayusijang-gil, Jungang-dong" } },
  { id: 'f-prikthai', c: ['TH'], lat: 37.32034, lng: 127.94388, tel: '', url: KM('2033462624'),
    ko: { t: "프릭타이", what: "태국 음식 · 똠얌 쌀국수, 무카타", addr: "원주시 판부면 매봉길 30-11" },
    en: { t: "Prik Thai", what: "Thai food · tom yum noodles, mookata", addr: "30-11 Maebong-gil, Panbu-myeon" } },
  { id: 'f-nanabkk', c: ['TH'], lat: 37.34736, lng: 127.92771, tel: '033-733-1726', url: KM('2025408370'),
    ko: { t: "나나방콕", what: "태국 음식 · 쌀국수, 푸팟퐁 커리", addr: "원주시 천사로 16-3 1층 (단계동)" },
    en: { t: "Nana Bangkok", what: "Thai food · noodles, poo pad pong curry", addr: "16-3 Cheonsa-ro, Dangye-dong" } },
  { id: 'f-bkk66', c: ['TH'], lat: 37.32804, lng: 127.98855, tel: '0507-1462-3430', url: KM('130492280'),
    ko: { t: "방콕66 혁신점", what: "태국 음식 · 쌀국수, 카오카무", addr: "원주시 웅비3길 16-1 (반곡동)" },
    en: { t: "Bangkok66", what: "Thai food · noodles, khao kha mu", addr: "16-1 Ungbi 3-gil, Bangok-dong" } },
  { id: 'f-dongbang', c: ['TH'], lat: 37.34591, lng: 127.94312, tel: '', url: KM('1974802175'),
    ko: { t: "원주동방식당", what: "태국 음식 · 팟타이, 카오팟", addr: "원주시 일산초교길 6-1 (일산동)" },
    en: { t: "Dongbang Sikdang", what: "Thai food · pad thai, khao pad", addr: "6-1 Ilsanchogyo-gil, Ilsan-dong" } },
  { id: 'f-naegohyang', c: ['VN'], lat: 37.32071, lng: 127.96559, tel: '033-761-6437', url: KM('13567695'), native: true,
    ko: { t: "내고향베트남쌀국수", what: "베트남 음식 · 쌀국수, 반쎄오, 분짜", addr: "원주시 단구초교길 6-18 (단구동)" },
    en: { t: "Naegohyang Vietnamese Pho", what: "Vietnamese food · pho, banh xeo, bun cha", addr: "6-18 Danguchogyo-gil, Dangu-dong" } },
  { id: 'f-naegohyang-mm', c: ['VN'], lat: 37.31736, lng: 127.82861, tel: '010-8569-5240', url: KM('371427002'), native: true,
    ko: { t: "내고향쌀국수 (문막)", what: "베트남 음식 · 쌀국수, 분짜, 짜조", addr: "원주시 문막읍 원문로 1660 1층" },
    en: { t: "Naegohyang Pho (Munmak)", what: "Vietnamese food · pho, bun cha, cha gio", addr: "1660 Wonmun-ro, Munmak-eup" } },
  { id: 'f-minmin', c: ['VN'], lat: 37.35059, lng: 127.94888, tel: '010-3075-5775', url: KM('675129944'), native: true,
    ko: { t: "민민베트남쌀국수", what: "베트남 음식 · 쌀국수, 생선 쌀국수", addr: "원주시 자유시장 지하1층 30-7호 (중앙동)" },
    en: { t: "Minmin Vietnamese Pho", what: "Vietnamese food · pho, fish noodle soup", addr: "B1 #30-7, Jayu Market, Jungang-dong" } },
  { id: 'f-hochiminh', c: ['VN'], lat: 37.35572, lng: 127.94361, tel: '033-742-6104', url: KM('1130251741'), native: true,
    ko: { t: "호치민쌀국수", what: "베트남 음식 · 분보후에, 분리에우, 반쎄오", addr: "원주시 역전시장길 7 1층 (학성동)" },
    en: { t: "Ho Chi Minh Pho", what: "Vietnamese food · bun bo Hue, bun rieu, banh xeo", addr: "7 Yeokjeonsijang-gil, Hakseong-dong" } },
  { id: 'f-ruanon', c: ['VN'], lat: 37.34893, lng: 127.9297, tel: '', url: KM('1485347215'), native: true,
    ko: { t: "루아논꽌", what: "베트남 음식 · 분짜 하노이, 분보후에", addr: "원주시 금불1길 60-1 1층 (단계동)" },
    en: { t: "Rua Non Quan", what: "Vietnamese food · bun cha Hanoi, bun bo Hue", addr: "60-1 Geumbul 1-gil, Dangye-dong" } },
  { id: 'f-huongque', c: ['VN'], lat: 37.34673, lng: 127.92975, tel: '010-6789-7668', url: KM('932301961'),
    ko: { t: "Huong Que Quan", what: "베트남 음식", addr: "원주시 장미공원길 47-8 지하1층 (단계동)" },
    en: { t: "Huong Que Quan", what: "Vietnamese food", addr: "B1, 47-8 Jangmigongwon-gil, Dangye-dong" } },
  { id: 'f-hanoipho', c: ['VN'], lat: 37.36811, lng: 127.93515, tel: '', url: KM('945720480'),
    ko: { t: "하노이포", what: "베트남 음식 · 분리에우, 분까, 넴루이", addr: "원주시 우산초교길 64 1층 (우산동, 상지대 근처)" },
    en: { t: "Hanoi Pho", what: "Vietnamese food · bun rieu, bun ca, nem lui", addr: "64 Usanchogyo-gil, Usan-dong (near Sangji Univ.)" } },
  { id: 'f-kami-hs', c: ['VN'], lat: 37.48928, lng: 127.99452, tel: '0503-5281-0338', url: KM('2116612704'), native: true,
    ko: { t: "카미베트남쌀국수 (횡성)", what: "베트남 음식 · 쌀국수, 반미, 베트남 커피", addr: "횡성군 횡성읍 읍마북로 14 1층" },
    en: { t: "Kami Vietnamese Pho (Hoengseong)", what: "Vietnamese food · pho, banh mi, Vietnamese coffee", addr: "14 Eummabuk-ro, Hoengseong" } },
  { id: 'f-xinjiang', c: ['CN'], lat: 37.34863, lng: 127.93221, tel: '033-742-7180', url: KM('129377890'), native: true,
    ko: { t: "신강양꼬치", what: "중국 음식 · 양꼬치, 마라탕, 꿔바로우", addr: "원주시 금불3길 10 1층 (단계동)" },
    en: { t: "Xinjiang Lamb Skewers", what: "Chinese food · lamb skewers, mala tang, guobaorou", addr: "10 Geumbul 3-gil, Dangye-dong" } },
  { id: 'f-xinjiang2', c: ['CN'], lat: 37.34858, lng: 127.93055, tel: '033-747-7180', url: KM('1889092934'),
    ko: { t: "신강양꼬치 2호점", what: "중국 음식 · 양꼬치, 양갈비", addr: "원주시 금불2길 7 1층 (단계동)" },
    en: { t: "Xinjiang Lamb Skewers 2", what: "Chinese food · lamb skewers, lamb ribs", addr: "7 Geumbul 2-gil, Dangye-dong" } },
  { id: 'f-harbin', c: ['CN'], lat: 37.32212, lng: 127.95753, tel: '070-8851-3048', url: KM('968218451'),
    ko: { t: "하얼빈양꼬치", what: "중국 음식 · 양꼬치, 중국식 탕수육", addr: "원주시 토지길 31-10 1층 (단구동)" },
    en: { t: "Harbin Lamb Skewers", what: "Chinese food · lamb skewers, Chinese sweet-and-sour pork", addr: "31-10 Toji-gil, Dangu-dong" } },
  { id: 'f-hwaryong', c: ['CN'], lat: 37.34985, lng: 127.94385, tel: '033-733-1192', url: KM('26634880'),
    ko: { t: "화룡양꼬치", what: "중국 음식 · 양꼬치, 토마토계란볶음", addr: "원주시 천사로 176-1 (일산동)" },
    en: { t: "Hwaryong Lamb Skewers", what: "Chinese food · lamb skewers, tomato egg stir-fry", addr: "176-1 Cheonsa-ro, Ilsan-dong" } },
  { id: 'f-beijing', c: ['CN'], lat: 37.33211, lng: 127.95127, tel: '', url: KM('137541127'),
    ko: { t: "베이징양꼬치", what: "중국 음식 · 양꼬치, 마파두부, 마라탕", addr: "원주시 송림길 36-14 1층 (개운동)" },
    en: { t: "Beijing Lamb Skewers", what: "Chinese food · lamb skewers, mapo tofu, mala tang", addr: "36-14 Songnim-gil, Gaeun-dong" } },
  { id: 'f-baekdusan', c: ['CN'], lat: 37.34991, lng: 127.92673, tel: '', url: KM('1843784678'),
    ko: { t: "백두산양꼬치", what: "중국 음식 · 양꼬치, 건두부무침", addr: "원주시 봉화로 65-13 (단계동)" },
    en: { t: "Baekdusan Lamb Skewers", what: "Chinese food · lamb skewers, dried tofu salad", addr: "65-13 Bonghwa-ro, Dangye-dong" } },
  { id: 'f-taehyang', c: ['CN'], lat: 37.33214, lng: 127.93054, tel: '033-742-2566', url: KM('576005837'),
    ko: { t: "태향원", what: "중국 음식 · 훠궈, 양꼬치, 마라룽샤", addr: "원주시 봉바위길 52 1층 (무실동)" },
    en: { t: "Taehyangwon", what: "Chinese food · hot pot, lamb skewers, mala crayfish", addr: "52 Bongbawi-gil, Musil-dong" } },
  { id: 'f-miga', c: ['CN'], lat: 37.32283, lng: 127.82948, tel: '010-6436-2566', url: KM('649134639'), native: true,
    ko: { t: "미가양꼬치 (문막)", what: "중국 음식 · 양꼬치, 양갈비", addr: "원주시 문막읍 왕건로 37 2층" },
    en: { t: "Miga Lamb Skewers (Munmak)", what: "Chinese food · lamb skewers, lamb ribs", addr: "2F, 37 Wanggeon-ro, Munmak-eup" } },
  { id: 'f-ningxia', c: ['CN'], lat: 37.32582, lng: 127.98193, tel: '033-733-2148', url: KM('650214913'),
    ko: { t: "닝샤샤", what: "중국·대만 면 요리 · 우육면, 마라곱창면", addr: "원주시 양지뜰3길 14 1층 (반곡동)" },
    en: { t: "Ningxiaxia", what: "Chinese & Taiwanese noodles · beef noodle soup, mala noodles", addr: "14 Yangjitteul 3-gil, Bangok-dong" } },
];

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

  { id: 'w-hana', scope: 'wonju', town: 'wonju', place: 'hana', visas: ['*'], needs: ['life', 'work'],
    ko: { t: '외국인 일요일 은행 (하나은행 원주혁신도시지점)', what: '평일에 일하는 외국인을 위해 일요일에 문을 엽니다. 계좌 개설, 한도제한계좌 해제, 해외송금을 상담합니다. 외국인등록증과 근로계약서(또는 재직증명서)를 가져가세요.', when: '매월 둘째·넷째 일요일 10:00~16:00 (방문 전 전화 확인)', who: '원주 외국인 근로자' },
    en: { t: 'Sunday bank for foreigners (Hana Bank, Wonju Innovation City)', what: 'Open on Sundays for foreigners who work on weekdays: open an account, lift the transaction limit, send money home. Bring your ARC and labor contract (or employment certificate).', when: '2nd & 4th Sundays, 10:00–16:00 (call before visiting)', who: 'Foreign workers in Wonju' },
    tel: '1588-1111', org: '하나은행', src: 'NEWS' },

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
    tel: '1577-0071', org: '고용노동부 (17개 언어)', src: 'MOEL' },
  { id: 'k-region', scope: 'national', town: '*', place: null, visas: ['E-9'], needs: ['work', 'stay'], hot: true,
    ko: { t: 'E-9 사업장 변경 — 경북·강원 권역 안에서만', what: '2023년 9월 이후 입국자는 같은 권역 안에서만 일터를 옮길 수 있습니다. 원주는 경북·강원 권역입니다. 계약이 끝나면 1개월 안에 고용센터에 신청하고, 3개월 안에 새 일터를 찾아야 합니다(3년에 3번까지).', when: '계약 종료 후 1개월 안 신청', who: 'E-9 근로자' },
    en: { t: 'E-9 job change — only within Gyeongbuk-Gangwon', what: 'Workers who entered from Sept 2023 can change jobs only within their region; Wonju is in the Gyeongbuk-Gangwon region. Apply at the job center within 1 month after the job ends and find a new one within 3 months (up to 3 changes in 3 years).', when: 'Apply within 1 month after the job ends', who: 'E-9 workers' },
    tel: '1350', org: '고용노동부 · 원주고용센터', src: 'MOEL' },
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
  KLAC: '대한법률구조공단',
  NEWS: '언론 보도 (2025.12~2026.4) — 방문 전 확인'
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
