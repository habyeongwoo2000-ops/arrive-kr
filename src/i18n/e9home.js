/* E9-Bridge 화면 · 정착 지원 옆 서랍에서 새로 쓰는 짧은 문구 (나머지는 data/e9.js · i18n/hub.js 를 그대로 씁니다) */
const T = {
  ko: { sub: 'E-9 근로자를 위해 처음 만든 서비스', heroT: '사업장 변경, 이제 헤매지 마세요', heroL: '회사를 옮기거나 한국을 떠날 때 놓치기 쉬운 기한과 받을 돈을 내 언어로, 근거와 함께 확인하세요.', seeAll: '모두 보기', back: '뒤로', close: '닫기' },
  en: { sub: 'Our first service, built for E-9 workers', heroT: 'Changing jobs, without the guesswork', heroL: 'Check the deadlines and money that are easy to miss when you change workplaces or leave Korea, in your language and with sources.', seeAll: 'See all', back: 'Back', close: 'Close' },
  vi: { sub: 'Dịch vụ đầu tiên dành cho lao động E-9', heroT: 'Chuyển nơi làm việc, không còn bối rối', heroL: 'Kiểm tra các thời hạn và khoản tiền dễ bị bỏ lỡ khi chuyển nơi làm việc hoặc rời Hàn Quốc, bằng ngôn ngữ của bạn, kèm căn cứ.', seeAll: 'Xem tất cả', back: 'Quay lại', close: 'Đóng' },
  id: { sub: 'Layanan pertama kami untuk pekerja E-9', heroT: 'Pindah kerja tanpa bingung', heroL: 'Periksa batas waktu dan uang yang mudah terlewat saat pindah tempat kerja atau meninggalkan Korea, dalam bahasa Anda, dengan dasar hukumnya.', seeAll: 'Lihat semua', back: 'Kembali', close: 'Tutup' },
  km: { sub: 'សេវាដំបូងរបស់យើងសម្រាប់កម្មករ E-9', heroT: 'ប្ដូរកន្លែងធ្វើការ ដោយមិនវង្វេង', heroL: 'ពិនិត្យកាលកំណត់ និងប្រាក់ដែលងាយខកខាន ពេលប្ដូរកន្លែងធ្វើការ ឬចាកចេញពីកូរ៉េ ជាភាសារបស់អ្នក ជាមួយមូលដ្ឋាន។', seeAll: 'មើលទាំងអស់', back: 'ត្រឡប់', close: 'បិទ' },
  ne: { sub: 'E-9 कामदारका लागि हाम्रो पहिलो सेवा', heroT: 'काम परिवर्तन, अब अलमल नगर्नुहोस्', heroL: 'कार्यस्थल परिवर्तन गर्दा वा कोरिया छोड्दा छुट्न सक्ने म्याद र पाउनुपर्ने रकम आफ्नै भाषामा, आधारसहित जाँच गर्नुहोस्।', seeAll: 'सबै हेर्नुहोस्', back: 'फर्कनुहोस्', close: 'बन्द गर्नुहोस्' }
};
export const e9home = (lang) => ({ ...T.en, ...(T[lang] || {}) });
