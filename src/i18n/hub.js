/* 정착 지원 홈(E9-Bridge 디자인) 화면에서 ArriveKR 이 새로 쓰는 문구.
   기한 계산·출국만기보험·인터뷰·바닥글 문구는 E9-Bridge 번역(src/data/e9.js)을 그대로 씁니다. */
import { E9T } from '../data/e9.js';

const HUB = {
  ko: {
    brandSub: '원주 정착 지원', eyebrow: 'ArriveKR',
    heroTitle: '원주 정착, 이제 헤매지 마세요',
    heroLead: '도착 후 할 일부터 맞춤 지원, 사업장 변경 기한과 출국만기보험까지. 내 언어로, 근거와 함께 확인하세요.',
    menu: 'MENU', menuOpen: '전체 메뉴 열기', menuClose: '전체 메뉴 닫기', home: '정착 지원 홈', login: '로그인', me: '내 정보', lang: '언어',
    svcTodo: '도착 후 할 일', svcFind: '맞춤 지원 찾기', svcPlan: '30일 일정', svcDeadline: '사업장 변경 기한', svcIns: '출국만기보험',
    svcItv: '인터뷰', svcKorean: '한국어 공부', svcRoute: '입국 경로',
    calcTitle: '일하다가 꼭 챙길 두 가지', calcLead: '회사를 옮기게 되거나 한국을 떠날 때, 기한을 놓치면 체류자격이나 받을 돈을 잃을 수 있습니다.',
    goDeadline: '기한 계산하기', goIns: '보험금 계산하기',
    stTitle: '숫자로 보는 사업장 변경',
    nd3: '여권번호, 계좌번호 같은 개인정보를 요구하지 않습니다. 서류 사진과 AI에게 보낸 글은 저장하지 않습니다.',
    ftLine: 'ArriveKR · 탑승부터 원주 정착까지 · 팀 E9-Bridge (3조)', github: '소스코드 (MIT 오픈소스)',
    enDeadline: 'Job Change', enIns: 'Departure Insurance', enItv: 'Interview',
    toMap: '지도', backHome: '정착 지원 홈으로', pcView: 'PC로 보기', mobileView: '모바일로 보기', top: 'TOP',
    payHero: '떠나기 전에 확인할 다섯 가지'
  },
  en: {
    brandSub: 'Settle in Wonju', eyebrow: 'ArriveKR',
    heroTitle: 'Settling in Wonju, without the guesswork',
    heroLead: 'From your first to-dos and support that fits you, to job-change deadlines and departure insurance. In your language, with sources.',
    menu: 'MENU', menuOpen: 'Open full menu', menuClose: 'Close full menu', home: 'Settle home', login: 'Sign in', me: 'My info', lang: 'Language',
    svcTodo: 'After arrival', svcFind: 'Find support', svcPlan: '30-day plan', svcDeadline: 'Job change deadline', svcIns: 'Departure insurance',
    svcItv: 'Interviews', svcKorean: 'Learn Korean', svcRoute: 'Entry route',
    calcTitle: 'Two things to keep in mind at work', calcLead: 'When you change workplaces or leave Korea, missing a deadline can cost you your status or money you are owed.',
    goDeadline: 'Check deadlines', goIns: 'Estimate insurance',
    stTitle: 'Changing workplaces in numbers',
    nd3: 'We never ask for passport or bank account numbers. Document photos and messages sent to the AI are not stored.',
    ftLine: 'ArriveKR · From boarding to settling in Wonju · Team E9-Bridge (Team 3)', github: 'Source code (MIT open source)',
    enDeadline: 'Job Change', enIns: 'Departure Insurance', enItv: 'Interview',
    toMap: 'Map', backHome: 'Back to Settle home', pcView: 'PC view', mobileView: 'Mobile view', top: 'TOP',
    payHero: 'Five things to check before you leave'
  },
  vi: {
    brandSub: 'Định cư tại Wonju', eyebrow: 'ArriveKR',
    heroTitle: 'Định cư ở Wonju, không còn bối rối',
    heroLead: 'Từ việc cần làm khi mới đến, hỗ trợ phù hợp, đến hạn chuyển nơi làm việc và bảo hiểm xuất cảnh. Bằng ngôn ngữ của bạn, có nguồn rõ ràng.',
    menu: 'MENU', menuOpen: 'Mở toàn bộ menu', menuClose: 'Đóng menu', home: 'Trang định cư', login: 'Đăng nhập', me: 'Thông tin của tôi', lang: 'Ngôn ngữ',
    svcTodo: 'Việc sau khi đến', svcFind: 'Tìm hỗ trợ', svcPlan: 'Lịch 30 ngày', svcDeadline: 'Hạn chuyển nơi làm việc', svcIns: 'Bảo hiểm xuất cảnh',
    svcItv: 'Phỏng vấn', svcKorean: 'Học tiếng Hàn', svcRoute: 'Lộ trình nhập cảnh',
    calcTitle: 'Hai điều cần nhớ khi làm việc', calcLead: 'Khi chuyển nơi làm việc hoặc rời Hàn Quốc, lỡ hạn có thể khiến bạn mất tư cách lưu trú hoặc khoản tiền được nhận.',
    goDeadline: 'Tính thời hạn', goIns: 'Tính tiền bảo hiểm',
    stTitle: 'Chuyển nơi làm việc qua các con số',
    nd3: 'Chúng tôi không hỏi số hộ chiếu hay số tài khoản. Ảnh giấy tờ và nội dung gửi cho AI không được lưu.',
    ftLine: 'ArriveKR · Từ lúc lên máy bay đến khi định cư ở Wonju · Nhóm E9-Bridge (nhóm 3)', github: 'Mã nguồn (mã nguồn mở MIT)',
    enDeadline: 'Job Change', enIns: 'Departure Insurance', enItv: 'Interview',
    toMap: 'Bản đồ', backHome: 'Về trang định cư', pcView: 'Xem bản PC', mobileView: 'Xem bản di động', top: 'TOP',
    payHero: 'Năm điều cần kiểm tra trước khi về nước'
  },
  id: {
    brandSub: 'Menetap di Wonju', eyebrow: 'ArriveKR',
    heroTitle: 'Menetap di Wonju, tak perlu bingung lagi',
    heroLead: 'Dari tugas setelah tiba dan bantuan yang cocok, hingga batas waktu pindah tempat kerja dan asuransi kepulangan. Dalam bahasa Anda, dengan sumber yang jelas.',
    menu: 'MENU', menuOpen: 'Buka semua menu', menuClose: 'Tutup menu', home: 'Beranda menetap', login: 'Masuk', me: 'Info saya', lang: 'Bahasa',
    svcTodo: 'Setelah tiba', svcFind: 'Cari bantuan', svcPlan: 'Rencana 30 hari', svcDeadline: 'Batas pindah kerja', svcIns: 'Asuransi kepulangan',
    svcItv: 'Wawancara', svcKorean: 'Belajar Korea', svcRoute: 'Rute masuk',
    calcTitle: 'Dua hal penting saat bekerja', calcLead: 'Saat pindah tempat kerja atau meninggalkan Korea, terlambat dari batas waktu bisa membuat Anda kehilangan izin tinggal atau uang yang menjadi hak Anda.',
    goDeadline: 'Hitung batas waktu', goIns: 'Hitung asuransi',
    stTitle: 'Pindah tempat kerja dalam angka',
    nd3: 'Kami tidak meminta nomor paspor atau nomor rekening. Foto dokumen dan pesan untuk AI tidak disimpan.',
    ftLine: 'ArriveKR · Dari naik pesawat sampai menetap di Wonju · Tim E9-Bridge (Tim 3)', github: 'Kode sumber (open source MIT)',
    enDeadline: 'Job Change', enIns: 'Departure Insurance', enItv: 'Interview',
    toMap: 'Peta', backHome: 'Kembali ke beranda', pcView: 'Tampilan PC', mobileView: 'Tampilan ponsel', top: 'TOP',
    payHero: 'Lima hal yang dicek sebelum pulang'
  },
  km: {
    brandSub: 'តាំងលំនៅនៅ Wonju', eyebrow: 'ArriveKR',
    heroTitle: 'តាំងលំនៅនៅ Wonju ដោយមិនវង្វេង',
    heroLead: 'ចាប់ពីកិច្ចការក្រោយមកដល់ និងជំនួយដែលសមនឹងអ្នក រហូតដល់កាលកំណត់ប្ដូរកន្លែងការងារ និងធានារាប់រងពេលចាកចេញ។ ជាភាសារបស់អ្នក មានប្រភពច្បាស់លាស់។',
    menu: 'MENU', menuOpen: 'បើកម៉ឺនុយទាំងអស់', menuClose: 'បិទម៉ឺនុយ', home: 'ទំព័រតាំងលំនៅ', login: 'ចូល', me: 'ព័ត៌មានរបស់ខ្ញុំ', lang: 'ភាសា',
    svcTodo: 'ក្រោយមកដល់', svcFind: 'ស្វែងរកជំនួយ', svcPlan: 'ផែនការ ៣០ ថ្ងៃ', svcDeadline: 'កាលកំណត់ប្ដូរការងារ', svcIns: 'ធានារាប់រងចាកចេញ',
    svcItv: 'បទសម្ភាសន៍', svcKorean: 'រៀនភាសាកូរ៉េ', svcRoute: 'ផ្លូវចូលប្រទេស',
    calcTitle: 'រឿងពីរដែលត្រូវចាំពេលធ្វើការ', calcLead: 'ពេលប្ដូរកន្លែងការងារ ឬចាកចេញពីកូរ៉េ បើហួសកាលកំណត់ អ្នកអាចបាត់បង់សិទ្ធិស្នាក់នៅ ឬប្រាក់ដែលត្រូវបាន។',
    goDeadline: 'គណនាកាលកំណត់', goIns: 'គណនាធានារាប់រង',
    stTitle: 'ការប្ដូរកន្លែងការងារជាលេខ',
    nd3: 'យើងមិនសុំលេខលិខិតឆ្លងដែន ឬលេខគណនីធនាគារទេ។ រូបថតឯកសារ និងសារដែលផ្ញើទៅ AI មិនត្រូវបានរក្សាទុកទេ។',
    ftLine: 'ArriveKR · ពីពេលឡើងយន្តហោះ ដល់តាំងលំនៅនៅ Wonju · ក្រុម E9-Bridge (ក្រុមទី ៣)', github: 'កូដប្រភព (MIT open source)',
    enDeadline: 'Job Change', enIns: 'Departure Insurance', enItv: 'Interview',
    toMap: 'ផែនទី', backHome: 'ត្រឡប់ទៅទំព័រតាំងលំនៅ', pcView: 'មើលជា PC', mobileView: 'មើលជាទូរស័ព្ទ', top: 'TOP',
    payHero: 'រឿងប្រាំដែលត្រូវពិនិត្យមុនចាកចេញ'
  },
  ne: {
    brandSub: 'वोन्जुमा बसोबास', eyebrow: 'ArriveKR',
    heroTitle: 'वोन्जुमा बसोबास, अब अलमलिनु पर्दैन',
    heroLead: 'आइपुगेपछिका काम र तपाईंलाई मिल्ने सहयोगदेखि कार्यस्थल परिवर्तनको म्याद र प्रस्थान बीमासम्म। आफ्नै भाषामा, स्रोतसहित।',
    menu: 'MENU', menuOpen: 'पूरा मेनु खोल्नुहोस्', menuClose: 'मेनु बन्द गर्नुहोस्', home: 'बसोबास गृहपृष्ठ', login: 'लगइन', me: 'मेरो जानकारी', lang: 'भाषा',
    svcTodo: 'आइपुगेपछि', svcFind: 'सहयोग खोज्नुहोस्', svcPlan: '३० दिने योजना', svcDeadline: 'काम परिवर्तनको म्याद', svcIns: 'प्रस्थान बीमा',
    svcItv: 'अन्तर्वार्ता', svcKorean: 'कोरियाली सिक्नुहोस्', svcRoute: 'प्रवेश रुट',
    calcTitle: 'काम गर्दा सम्झनुपर्ने दुई कुरा', calcLead: 'कार्यस्थल बदल्दा वा कोरिया छोड्दा म्याद नाघे बसाइ अनुमति वा पाउनुपर्ने पैसा गुम्न सक्छ।',
    goDeadline: 'म्याद हेर्नुहोस्', goIns: 'बीमा अनुमान गर्नुहोस्',
    stTitle: 'अंकमा कार्यस्थल परिवर्तन',
    nd3: 'हामी राहदानी नम्बर वा बैंक खाता नम्बर माग्दैनौं। कागजातको फोटो र AI लाई पठाएको सन्देश राखिँदैन।',
    ftLine: 'ArriveKR · उडानदेखि वोन्जुमा बसोबाससम्म · टोली E9-Bridge (टोली ३)', github: 'स्रोत कोड (MIT खुला स्रोत)',
    enDeadline: 'Job Change', enIns: 'Departure Insurance', enItv: 'Interview',
    toMap: 'नक्सा', backHome: 'बसोबास गृहपृष्ठमा फर्कनुहोस्', pcView: 'PC मा हेर्नुहोस्', mobileView: 'मोबाइलमा हेर्नुहोस्', top: 'TOP',
    payHero: 'जानुअघि जाँच्ने पाँच कुरा'
  }
};

/* E9-Bridge 문구 위에 ArriveKR 문구를 얹어 한 묶음으로 */
export const hub = (lang) => ({ ...E9T.en, ...(E9T[lang] || {}), ...HUB.en, ...(HUB[lang] || {}) });
