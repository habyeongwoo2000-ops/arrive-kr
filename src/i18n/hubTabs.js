/* 정착 화면 탭 이름 — 정착 지원 홈(기한·보험·인터뷰)으로 가는 탭. 큰 번역 파일 없이 가볍게 따로 둡니다. */
const TABS = {
  ko: { tabDl: '변경 기한', tabIns: '만기보험', tabItv: '인터뷰', tabHome: '정착 지원 홈' },
  en: { tabDl: 'Job deadline', tabIns: 'Insurance', tabItv: 'Interviews', tabHome: 'Settle home' },
  vi: { tabDl: 'Hạn chuyển việc', tabIns: 'Bảo hiểm', tabItv: 'Phỏng vấn', tabHome: 'Trang định cư' },
  id: { tabDl: 'Batas pindah', tabIns: 'Asuransi', tabItv: 'Wawancara', tabHome: 'Beranda menetap' },
  km: { tabDl: 'កាលកំណត់', tabIns: 'ធានារាប់រង', tabItv: 'បទសម្ភាសន៍', tabHome: 'ទំព័រតាំងលំនៅ' },
  ne: { tabDl: 'म्याद', tabIns: 'बीमा', tabItv: 'अन्तर्वार्ता', tabHome: 'बसोबास गृहपृष्ठ' }
};
export const hubTabs = (lang) => ({ ...TABS.en, ...(TABS[lang] || {}) });
