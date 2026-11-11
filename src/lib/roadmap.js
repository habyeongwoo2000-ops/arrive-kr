/* 정착 로드맵 — 도착 후 할 일을 '언제까지 하는 일인지'로 단계를 나누고, 끝낸 비율로 정착도를 정합니다.
   원주 정착 화면(Settle)과 내 정보 화면(MyPage)이 같이 씁니다. */

/* 도착 후 할 일 → 정착 로드맵 (언제까지 하는 일인지로 단계를 나눕니다) */
export const RM = {
  ko: { d7: '도착 첫 주', d15: '첫 2주', d30: '첫 한 달', d90: '석 달 안', life: '살면서 챙기기',
        now: '지금 할 일', done: '끝냄', lv0: '이제 막 도착했어요', lv1: '첫발을 뗐어요', lv2: '원주에 적응하는 중', lv3: '거의 다 자리 잡았어요', lv4: '원주 주민이 됐어요!',
        level: '정착도', fromHome: '체크하면 집에서 그곳까지 걸어가는 모습이 지도에 보여요', noHome: '집 주소를 정하면 거기서 출발해요', setHome: '집 주소 정하기', walking: '{p}(으)로 가는 중' },
  en: { d7: 'First week', d15: 'First 2 weeks', d30: 'First month', d90: 'Within 3 months', life: 'Along the way',
        now: 'Now', done: 'Done', lv0: 'Just arrived', lv1: 'First steps taken', lv2: 'Getting used to Wonju', lv3: 'Almost settled', lv4: 'You are a Wonju resident!',
        level: 'Settled', fromHome: 'Check an item to see yourself walk there from home on the map', noHome: 'Set your home address and trips start there', setHome: 'Set home address', walking: 'Heading to {p}' }
};
export const rm = (lang) => (lang === 'ko' ? RM.ko : RM.en);
export const STAGES = ['d7', 'd15', 'd30', 'd90', 'life'];
export const stageOf = (it) => (it.after == null ? 'life' : it.after <= 7 ? 'd7' : it.after <= 15 ? 'd15' : it.after <= 30 ? 'd30' : 'd90');
export const levelOf = (r) => (r >= 1 ? 'lv4' : r >= 0.67 ? 'lv3' : r >= 0.34 ? 'lv2' : r > 0 ? 'lv1' : 'lv0');
