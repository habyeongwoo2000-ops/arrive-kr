/* 모의시험 3종 — EPS-TOPIK · KIIP 사전평가 · TOPIK I
   · 문제는 모두 ArriveKR 이 새로 만든 연습용입니다 (실제 기출 아님).
   · 점수 환산·단계 추정은 연습용 어림입니다. 실제 기준은 각 시행기관 공지를 확인하세요.
   a = 정답 번호(1~4), s = 듣기 대본(음성으로 읽어 줌), pic = 그림, exp = 짧은 풀이(AI가 없을 때 보여 줌) */

export const EXAMS = {
  eps: {
    id: 'eps', short: 'EPS-TOPIK', color: '#1f5fbf', minutes: 15,
    name: { ko: 'EPS-TOPIK 형식 모의시험', en: 'EPS-TOPIK-style mock test' },
    who: { ko: '고용허가제(E-9) 입국 전 · 근로자 선발 시험', en: 'Before entry on E-9 · worker selection test' },
    session: { ko: '읽기 · 듣기', en: 'Reading · Listening' },
    max: 200, scoring: 'eps',
    note: { ko: '실제 시험: 읽기 25문항(1~25번) + 듣기 25문항(26~50번), 200점. 이 모의시험은 실제 번호 구간과 유형을 따르되 유형별 대표 문항만 담았습니다. 합격선은 나라·회차마다 다릅니다.', en: 'Real test: 25 reading (Q1–25) + 25 listening (Q26–50), 200 points. This mock follows the real numbering and question types with one sample per type. Pass marks differ by country and round.' },
    links: [{ ko: '고용허가제 누리집 (EPS-TOPIK 안내)', en: 'EPS portal (EPS-TOPIK info)', url: 'https://www.eps.go.kr' }],
    sections: [
      { id: 'r', ko: '읽기 (1~25번)', en: 'Reading (Q1–25)', items: [
        { n: 1, q: '다음 그림을 보고 알맞은 단어를 고르십시오.', pic: 'helmet', c: ['장갑', '안전모', '작업복', '안전화'], a: 2, exp: '머리를 보호하는 모자는 "안전모"입니다.' },
        { n: 2, q: '다음 표지의 뜻으로 알맞은 것을 고르십시오.', pic: 'nosmoke', c: ['담배를 피우면 안 됩니다.', '불을 끄십시오.', '여기에서 쉬십시오.', '음식을 먹으면 안 됩니다.'], a: 1, exp: '담배에 빨간 줄이 있으면 "금연(담배를 피우면 안 됨)"입니다.' },
        { n: 3, q: '다음 그림을 보고 알맞은 단어를 고르십시오.', pic: 'extinguisher', c: ['소화기', '사다리', '손수레', '망치'], a: 1, exp: '불을 끌 때 쓰는 빨간 통은 "소화기"입니다.' },
        { n: 4, q: '밑줄 친 부분과 의미가 비슷한 것을 고르십시오.', box: '우리 공장은 <u>매우</u> 큽니다.', c: ['아주', '조금', '별로', '전혀'], a: 1, exp: '"매우"와 "아주"는 정도가 크다는 뜻입니다.' },
        { n: 5, q: '빈칸에 들어갈 가장 알맞은 것을 고르십시오.', box: '몸이 아프면 (　　　)에 가세요.', c: ['은행', '병원', '우체국', '식당'], a: 2, exp: '아플 때는 "병원"에 갑니다.' },
        { n: 6, q: '빈칸에 들어갈 가장 알맞은 것을 고르십시오.', box: '기계를 고치기 전에 반드시 전원을 (　　　).', c: ['켜십시오', '끄십시오', '누르십시오', '바꾸십시오'], a: 2, exp: '안전을 위해 고치기 전에는 전원을 "끕니다".' },
        { n: 7, q: '다음 글의 내용과 같은 것을 고르십시오.', box: '우리 회사는 아침 8시 30분에 일을 시작합니다. 점심시간은 12시부터 1시까지입니다. 일은 오후 5시 30분에 끝납니다.', c: ['점심시간은 두 시간입니다.', '일은 8시에 시작합니다.', '오후 5시 30분에 일이 끝납니다.', '점심은 1시에 시작합니다.'], a: 3, exp: '글에 "오후 5시 30분에 끝납니다"라고 나옵니다.' },
        { n: 8, q: '통장을 만들 때 필요한 것을 고르십시오.', box: '월급은 매달 10일에 은행 통장으로 들어갑니다. 통장을 만들 때 외국인등록증이 필요합니다.', c: ['여권 사진', '외국인등록증', '근로계약서', '건강보험증'], a: 2, exp: '글에 "통장을 만들 때 외국인등록증이 필요합니다"라고 나옵니다.' }
      ] },
      { id: 'l', ko: '듣기 (26~50번)', en: 'Listening (Q26–50)', items: [
        { n: 26, q: '듣고 들은 단어와 같은 것을 고르십시오.', s: ['작업복'], c: ['작업장', '작업복', '작업자', '작업대'], a: 2, exp: '들은 말은 "작업복"입니다.' },
        { n: 27, q: '질문을 듣고 알맞은 대답을 고르십시오.', s: ['어디가 아파요?'], c: ['머리가 아파요.', '네, 아파요.', '병원에 가요.', '약을 먹어요.'], a: 1, exp: '"어디"를 물었으니 아픈 곳(머리)을 말해야 합니다.' },
        { n: 28, q: '대화를 듣고 남자가 할 일을 고르십시오.', s: ['여: 민수 씨, 이 상자를 창고로 옮겨 주세요.', '남: 네, 지금 바로 옮기겠습니다.'], c: ['상자를 산다.', '창고를 청소한다.', '상자를 창고로 옮긴다.', '상자를 연다.'], a: 3, exp: '남자는 "지금 바로 옮기겠습니다"라고 했습니다.' },
        { n: 29, q: '안내 방송을 듣고 해야 할 일을 고르십시오.', s: ['잠시 후 전기 점검이 있습니다. 작업 중인 기계를 모두 멈추고 휴게실로 이동해 주십시오.'], c: ['기계를 계속 사용한다.', '기계를 멈추고 휴게실로 간다.', '전기를 켠다.', '퇴근한다.'], a: 2, exp: '방송에서 "기계를 멈추고 휴게실로 이동"하라고 했습니다.' }
      ] }
    ]
  },

  kiip: {
    id: 'kiip', short: 'KIIP', color: '#0a8f5b', minutes: 15,
    name: { ko: 'KIIP 사전평가 형식 모의시험', en: 'KIIP placement-style mock test' },
    who: { ko: '사회통합프로그램 시작 단계 정하기 · 입국 후', en: 'Find your starting level in the Social Integration Program · after arrival' },
    session: { ko: '필기 · 구술(말하기)', en: 'Written · Oral' },
    max: 100, scoring: 'kiip',
    note: { ko: '실제 사전평가는 필기시험과 구술시험으로 시작 단계(0~5단계)를 정합니다. 이 모의시험은 실제 구성(필기 → 구술)과 유형을 따른 대표 문항이며, 단계 추정은 연습용 어림입니다. 실제 기준은 공식 누리집에서 확인하세요.', en: 'The real placement test has a written and an oral part and sets your level (0–5). This mock follows that structure with sample items; the level is only an estimate — check the official sites.' },
    links: [{ ko: '사회통합프로그램 평가 누리집', en: 'KIIP test site', url: 'https://www.kiiptest.org' }, { ko: '사회통합정보망 (신청·안내)', en: 'Socinet (apply & info)', url: 'https://www.socinet.go.kr' }],
    sections: [
      { id: 'w', ko: '필기시험', en: 'Written test', items: [
        { n: 1, q: '다음 중 가족이 아닌 것을 고르십시오.', c: ['어머니', '형', '친구', '동생'], a: 3, exp: '"친구"는 가족이 아닙니다.' },
        { n: 2, q: '빈칸에 알맞은 것을 고르십시오.', box: '저는 매일 아침 7시(　　) 일어납니다.', c: ['에', '를', '이', '와'], a: 1, exp: '시간 뒤에는 "에"를 씁니다 (7시에).' },
        { n: 3, q: '빈칸에 알맞은 것을 고르십시오.', box: '버스를 (　　　) 시장에 갑니다.', c: ['타고', '먹고', '입고', '쓰고'], a: 1, exp: '버스는 "타다"와 함께 씁니다.' },
        { n: 4, q: '다음 말의 반대말을 고르십시오.', box: '싸다', c: ['크다', '비싸다', '많다', '좋다'], a: 2, exp: '"싸다"의 반대말은 "비싸다"입니다.' },
        { n: 5, q: '대화를 완성하십시오.', box: '가: 주말에 뭐 했어요?<br>나: (　　　　　　)', c: ['친구를 만났어요.', '친구를 만날 거예요.', '친구예요.', '만나고 싶어요.'], a: 1, exp: '"했어요?"는 지난 일이므로 과거형 "만났어요"로 답합니다.' },
        { n: 6, q: '빈칸에 알맞은 것을 고르십시오.', box: '비가 오(　　) 우산을 가져가세요.', c: ['니까', '지만', '고', '서도'], a: 1, exp: '이유를 말하고 부탁할 때는 "-니까"를 씁니다.' },
        { n: 7, q: '불이 났을 때 거는 번호를 고르십시오.', c: ['112', '119', '1345', '114'], a: 2, exp: '불이 나거나 응급 환자가 있으면 119입니다. 112는 경찰입니다.' },
        { n: 8, q: '외국인을 위한 종합 안내 전화번호를 고르십시오.', c: ['1345', '119', '112', '120'], a: 1, exp: '외국인종합안내센터는 1345입니다.' },
        { n: 9, q: '빈칸에 알맞은 것을 고르십시오.', box: '한국에서는 일반 쓰레기를 (　　　　)에 담아서 버립니다.', c: ['종량제 봉투', '아무 봉투', '종이 상자', '가방'], a: 1, exp: '일반 쓰레기는 돈을 내고 사는 "종량제 봉투"에 버립니다.' },
        { n: 10, q: '다음 글의 내용과 같은 것을 고르십시오.', box: '다음 주 월요일은 휴일이라서 은행이 쉽니다. 화요일에 다시 문을 엽니다.', c: ['월요일에 은행에 갈 수 있다.', '화요일에 은행이 문을 연다.', '은행은 일주일 동안 쉰다.', '휴일은 화요일이다.'], a: 2, exp: '글에 "화요일에 다시 문을 엽니다"라고 나옵니다.' }
      ] },
      { id: 'o', ko: '구술시험 (말하기)', en: 'Oral test', open: true, items: [
        { n: 11, q: '자기소개를 해 보십시오. (이름, 나라, 하는 일을 넣어서)', max: 15, rubric: 'Includes name, country and job/what they do; complete sentences; polite -요/-ㅂ니다 endings; basic grammar.', model: '안녕하세요. 저는 응우옌 반 안입니다. 베트남에서 왔습니다. 원주에 있는 공장에서 일합니다.' },
        { n: 12, q: '주말에 보통 무엇을 해요? 두 문장 이상으로 말해 보십시오.', max: 15, rubric: 'At least two sentences about weekend activities; time/place words; connectors like -고/그리고/-아서; polite endings.', model: '주말에는 보통 친구를 만나요. 같이 시장에 가서 장을 보고 한국 음식을 먹어요.' }
      ] }
    ]
  },

  topik: {
    id: 'topik', short: 'TOPIK I', color: '#c2410c', minutes: 15, grouped: true,
    name: { ko: 'TOPIK I 형식 모의시험', en: 'TOPIK I-style mock test' },
    who: { ko: '일반 한국어능력시험 초급 · 유학·취업·비자 점수', en: 'General Korean test, beginner · study, jobs, visa points' },
    session: { ko: '듣기 · 읽기 (+ 쓰기 맛보기)', en: 'Listening · Reading (+ writing taste)' },
    max: 200, scoring: 'topik',
    note: { ko: 'TOPIK I은 듣기 30문항(1~30번) 100점 + 읽기 40문항(31~70번) 100점, 80점 이상 1급 · 140점 이상 2급입니다. 이 모의시험은 실제 문항 번호와 ※[ ] 지시문 유형을 그대로 따르되 유형별 대표 문항만 담았습니다. 쓰기(51번 유형)는 TOPIK II 맛보기로 점수에 넣지 않습니다.', en: 'TOPIK I: listening Q1–30 (100) + reading Q31–70 (100); 80+ Level 1, 140+ Level 2. This mock keeps the real question numbers and instruction types with one sample per type. The writing item (TOPIK II Q51 type) is scored separately.' },
    links: [{ ko: '한국어능력시험 TOPIK 누리집 (기출문제 공개)', en: 'TOPIK official site (past papers)', url: 'https://www.topik.go.kr' }],
    sections: [
      { id: 'l', ko: '듣기 (1~30번)', en: 'Listening (Q1–30)', items: [
        { n: 1, g: '[1~4] 다음을 듣고 물음에 맞는 대답을 고르십시오.', q: '듣고 물음에 맞는 대답을 고르십시오.', s: ['가방이에요?'], c: ['네, 가방이에요.', '네, 가방이 없어요.', '아니요, 가방이 커요.', '아니요, 가방을 사요.'], a: 1, exp: '"가방이에요?"에는 "네, 가방이에요"로 답합니다.' },
        { n: 3, q: '듣고 물음에 맞는 대답을 고르십시오.', s: ['어디에서 일해요?'], c: ['공장에서 일해요.', '내일 일해요.', '친구와 일해요.', '많이 일해요.'], a: 1, exp: '"어디에서"는 장소를 묻습니다.' },
        { n: 5, g: '[5~6] 다음을 듣고 이어지는 말을 고르십시오.', q: '이어지는 말을 고르십시오.', s: ['생일 축하해요.'], c: ['고마워요.', '미안해요.', '괜찮아요.', '잘 먹겠습니다.'], a: 1, exp: '축하를 받으면 "고마워요"라고 합니다.' },
        { n: 7, g: '[7~10] 여기는 어디입니까? 알맞은 것을 고르십시오.', q: '여기는 어디입니까?', s: ['여: 어서 오세요. 무엇을 드릴까요?', '남: 사과 세 개 주세요.'], c: ['병원', '가게', '은행', '학교'], a: 2, exp: '물건(사과)을 사는 곳은 가게입니다.' },
        { n: 11, g: '[11~14] 다음은 무엇에 대해 말하고 있습니까? 알맞은 것을 고르십시오.', q: '무엇에 대해 말하고 있습니까?', s: ['남: 여동생이 있어요?', '여: 아니요, 오빠만 있어요.'], c: ['가족', '친구', '직업', '고향'], a: 1, exp: '여동생·오빠는 가족에 대한 말입니다.' },
        { n: 17, g: '[17~21] 다음을 듣고 대화 내용과 같은 것을 고르십시오.', q: '대화 내용과 같은 것을 고르십시오.', s: ['남: 내일 같이 영화 볼까요?', '여: 미안해요. 내일은 일이 있어요. 토요일은 어때요?'], c: ['여자는 내일 영화를 봅니다.', '여자는 내일 일이 있습니다.', '남자는 토요일에 일합니다.', '두 사람은 오늘 영화를 봅니다.'], a: 2, exp: '여자가 "내일은 일이 있어요"라고 했습니다.' },
        { n: 22, g: '[22~24] 다음을 듣고 여자의 중심 생각을 고르십시오.', q: '여자의 중심 생각을 고르십시오.', s: ['남: 저는 주말에는 집에서 쉬어요.', '여: 주말에 밖에서 운동을 하면 건강에 좋아요. 같이 공원에 가요.'], c: ['주말에 운동을 하는 것이 좋습니다.', '집에서 쉬는 것이 좋습니다.', '공원은 너무 멉니다.', '남자는 운동을 잘합니다.'], a: 1, exp: '여자는 "주말에 운동을 하면 건강에 좋다"고 말합니다.' }
      ] },
      { id: 'r', ko: '읽기 (31~70번)', en: 'Reading (Q31–70)', items: [
        { n: 31, g: '[31~33] 무엇에 대한 내용입니까? 알맞은 것을 고르십시오.', q: '무엇에 대한 내용입니까?', box: '사과가 있습니다. 배도 있습니다.', c: ['과일', '날씨', '운동', '가족'], a: 1, exp: '사과와 배는 과일입니다.' },
        { n: 34, g: '[34~39] (　　)에 들어갈 가장 알맞은 것을 고르십시오.', q: '(　　)에 들어갈 가장 알맞은 것을 고르십시오.', box: '책을 빌립니다. (　　　)에 갑니다.', c: ['도서관', '수영장', '시장', '공항'], a: 1, exp: '책을 빌리는 곳은 도서관입니다.' },
        { n: 35, q: '(　　)에 들어갈 가장 알맞은 것을 고르십시오.', box: '날씨가 (　　　) 창문을 열었습니다.', c: ['더워서', '추워서', '맑지만', '춥고'], a: 1, exp: '더우니까 창문을 엽니다 — 이유의 "-아서".' },
        { n: 40, g: '[40~42] 다음을 읽고 맞지 않는 것을 고르십시오.', q: '맞지 않는 것을 고르십시오.', box: '<b>무료 한국어 교실</b><br>· 매주 토요일 오전 10시<br>· 장소: 시청 3층<br>· 신청: 전화로 신청하세요', c: ['토요일에 수업합니다.', '돈을 내야 합니다.', '시청에서 수업합니다.', '전화로 신청합니다.'], a: 2, exp: '"무료"이므로 돈을 내지 않습니다.' },
        { n: 43, g: '[43~45] 다음의 내용과 같은 것을 고르십시오.', q: '내용과 같은 것을 고르십시오.', box: '회사 앞에 새 식당이 생겼습니다. 음식이 맛있고 값도 쌉니다. 그래서 점심시간에는 사람이 많습니다.', c: ['식당은 오래되었습니다.', '음식 값이 비쌉니다.', '점심시간에 사람이 많습니다.', '회사 안에 식당이 있습니다.'], a: 3, exp: '"점심시간에는 사람이 많습니다"라고 나옵니다.' },
        { n: 46, g: '[46~48] 다음을 읽고 중심 생각을 고르십시오.', q: '중심 생각을 고르십시오.', box: '저는 한국 음식을 좋아합니다. 특히 김치찌개를 자주 먹습니다. 다음에는 직접 만들어 보고 싶습니다.', c: ['김치찌개를 직접 만들고 싶습니다.', '한국 음식을 싫어합니다.', '식당에서 일하고 싶습니다.', '김치를 팔고 싶습니다.'], a: 1, exp: '마지막 문장 "직접 만들어 보고 싶습니다"가 중심 생각입니다.' },
        { n: 49, g: '[49~50] 다음을 읽고 물음에 답하십시오.', q: '㉠에 들어갈 알맞은 것을 고르십시오.', box: '저는 운동을 좋아합니다. 그래서 매일 아침 공원에서 ( ㉠ ). 공원에는 저처럼 아침에 운동하는 사람이 많습니다.', c: ['달립니다', '잡니다', '요리합니다', '공부합니다'], a: 1, exp: '운동을 좋아해서 공원에서 "달립니다".' }
      ] },
      { id: 'w', ko: '쓰기 맛보기 (TOPIK II 51번 유형)', en: 'Writing taste (TOPIK II Q51 type)', open: true, extra: true, items: [
        { n: 51, g: '[51] 다음 글의 ㉠에 알맞은 말을 각각 한 문장으로 쓰십시오.', q: '㉠에 알맞은 말을 한 문장으로 쓰십시오.', box: '<b>기숙사 세탁기 사용 안내</b><br>1층 세탁기가 고장 났습니다. 그래서 이번 주에는 ( ㉠ ).<br>다음 주 월요일부터 다시 사용할 수 있습니다.', max: 10, rubric: 'Must say the washing machine cannot be used this week (e.g. 세탁기를 사용할 수 없습니다). Formal -ㅂ니다 ending fits a notice. Grammar and spelling.', model: '세탁기를 사용할 수 없습니다' }
      ] }
    ]
  }
};

export const EXAM_LIST = ['eps', 'kiip', 'topik'];

/* 객관식 채점 + 시험별 점수 환산 (연습용) */
export function scoreExam(ex, ans, openScores = {}) {
  const secs = ex.sections.map((s) => {
    if (s.open) {
      const got = s.items.reduce((a, it) => a + (openScores[it.n] != null ? openScores[it.n] : 0), 0);
      const max = s.items.reduce((a, it) => a + it.max, 0);
      return { id: s.id, open: true, extra: !!s.extra, got, max, right: null, total: s.items.length };
    }
    const right = s.items.filter((it) => ans[it.n] === it.a).length;
    return { id: s.id, right, total: s.items.length };
  });
  const mc = secs.filter((x) => !x.open);
  let total = 0, level = '', pass = null;
  if (ex.scoring === 'eps') {
    const r = mc.reduce((a, x) => a + x.right, 0), n = mc.reduce((a, x) => a + x.total, 0);
    total = Math.round((r / n) * 200);
    mc.forEach((x) => { x.got = Math.round((x.right / x.total) * 100); x.max = 100; });
  } else if (ex.scoring === 'topik') {
    mc.forEach((x) => { x.got = Math.round((x.right / x.total) * 100); x.max = 100; });
    total = mc.reduce((a, x) => a + x.got, 0);
    level = total >= 140 ? '2급' : total >= 80 ? '1급' : '';
    pass = total >= 80;
  } else if (ex.scoring === 'kiip') {
    const w = mc[0];
    w.got = Math.round((w.right / w.total) * 70); w.max = 70;
    const o = secs.find((x) => x.open);
    total = w.got + (o ? Math.round((o.got / o.max) * 30) : 0);
    if (o) { o.got = Math.round((o.got / o.max) * 30); o.max = 30; }
    level = String(total >= 85 ? 5 : total >= 70 ? 4 : total >= 50 ? 3 : total >= 30 ? 2 : total >= 10 ? 1 : 0);
  }
  return { secs, total, max: ex.max, level, pass };
}
