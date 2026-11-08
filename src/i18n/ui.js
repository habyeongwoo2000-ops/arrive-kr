/* 화면 문구 (6개 언어) */

export const LANGS = ['ko', 'en', 'vi', 'id', 'km', 'ne'];
export const LANG_NAMES = { ko: '한국어', en: 'English', vi: 'Tiếng Việt', id: 'Bahasa Indonesia', km: 'ខ្មែរ', ne: 'नेपाली' };

const ko = {
  app: 'ArriveKR', tag: '외국인근로자 한국 입국 준비',
  search: '출발할 나라 검색', hint: '지구본에서 출발할 나라를 누르세요', noResult: '결과 없음',
  sat: '위성', map: '지도', from: '출발', to: '도착 · 대한민국 인천국제공항',
  entry: '입국 예정일', fuel: '연료', fuelHelp: '연료 = 입국 예정일까지 그 일을 준비할 수 있는 남은 시간',
  fOk: '여유', fLow: '빠듯함', fOut: '늦음', due: '{date}까지', dleft: 'D-{n}', after: '입국 후 {n}일 안', afterAny: '입국 후',
  fly: '비행 시작', flying: '비행 중…', replay: '다시 비행', turb: '난기류 구간', turbOk: '알겠어요',
  notE9: '고용허가제(E-9) 송출국이 아닙니다. 일반 취업 비자(E-7 등)의 기본 흐름만 보여 드려요.',
  korea: '여기가 목적지예요. 출발할 나라를 골라 주세요.',
  agency: '송출기관', fee: '응시료', source: '확인 자료', checked: '확인일 2026-11-08',
  lvl: { official: '공지 원문 확인', summary: '공지 정리 글로 확인', check: '송출기관만 확인 — 공지 확인 필요' },
  extraNone: '이 나라의 이번 회차 추가 서류는 송출기관 공지에서 확인하세요.',
  done: '완료', progress: '{done}/{total} 완료', newCountry: '2026년 새 송출국 — 첫 시험 공지를 기다리는 중',
  signIn: '로그인', signUp: '계정 만들기', uid: '아이디', pw: '비밀번호', pw2: '비밀번호 확인', signOut: '로그아웃',
  hello: '{id} 님', localNote: '계정과 체크 기록은 이 브라우저에만 저장됩니다(데모). 비밀번호는 암호화해 저장합니다.',
  eId: '아이디는 영문·숫자 4~20자', ePw: '비밀번호는 8자 이상', eMatch: '비밀번호가 서로 다릅니다', eExists: '이미 있는 아이디입니다', eWrong: '아이디 또는 비밀번호가 틀립니다',
  haveAcc: '이미 계정이 있어요', noAcc: '계정이 없어요', close: '닫기', saved: '내 체크 기록을 저장했어요',
  tutor: '한국어 시험 도우미', practice: '연습 문제', askAi: 'AI에게 묻기', askPh: '모르는 한국어 낱말이나 표현을 물어보세요',
  send: '보내기', aiOff: 'AI가 아직 연결되지 않았어요. 연습 문제로 공부해 보세요.', aiErr: '지금은 답할 수 없어요. 잠시 뒤 다시 해 주세요.',
  thinking: '생각 중…', right: '정답!', wrong: '아쉬워요', next: '다음 문제', score: '{n}/{t} 맞음', hintL: '힌트', again: '처음부터',
  tutorFor: '{country} 출신 근로자를 위한 설명', note: '이 서비스는 법률 판단을 하지 않습니다. 회차마다 바뀌니 꼭 송출기관 공지와 하이코리아에서 확인하세요.'
};
const en = {
  app: 'ArriveKR', tag: 'Arrival planner for foreign workers coming to Korea',
  search: 'Search your country', hint: 'Tap the country you leave from', noResult: 'No results',
  sat: 'Satellite', map: 'Map', from: 'From', to: 'To · Incheon International Airport, Korea',
  entry: 'Planned entry date', fuel: 'Fuel', fuelHelp: 'Fuel = time left to prepare this before your planned entry date',
  fOk: 'Enough', fLow: 'Tight', fOut: 'Late', due: 'by {date}', dleft: 'D-{n}', after: 'within {n} days after entry', afterAny: 'after entry',
  fly: 'Start flight', flying: 'Flying…', replay: 'Fly again', turb: 'Turbulence', turbOk: 'Got it',
  notE9: 'Not an EPS (E-9) sending country. Showing the basic steps for other work visas (E-7 etc.).',
  korea: 'This is the destination. Choose the country you leave from.',
  agency: 'Sending agency', fee: 'Test fee', source: 'Checked source', checked: 'Checked 2026-11-08',
  lvl: { official: 'Official notice checked', summary: 'Checked via a notice summary', check: 'Agency only — check the notice' },
  extraNone: 'Check this round’s extra documents in your sending agency’s notice.',
  done: 'Done', progress: '{done}/{total} done', newCountry: 'New sending country in 2026 — waiting for the first test notice',
  signIn: 'Sign in', signUp: 'Create account', uid: 'ID', pw: 'Password', pw2: 'Confirm password', signOut: 'Sign out',
  hello: 'Hi, {id}', localNote: 'Your account and checklist are saved only in this browser (demo). Passwords are stored hashed.',
  eId: 'ID: 4–20 letters or numbers', ePw: 'Password: 8+ characters', eMatch: 'Passwords do not match', eExists: 'That ID already exists', eWrong: 'Wrong ID or password',
  haveAcc: 'I have an account', noAcc: 'I need an account', close: 'Close', saved: 'Your checklist is saved',
  tutor: 'Korean test helper', practice: 'Practice', askAi: 'Ask AI', askPh: 'Ask about a Korean word or phrase',
  send: 'Send', aiOff: 'AI is not connected yet. Try the practice questions.', aiErr: 'Cannot answer right now. Please try again later.',
  thinking: 'Thinking…', right: 'Correct!', wrong: 'Not quite', next: 'Next', score: '{n}/{t} correct', hintL: 'Hint', again: 'Start again',
  tutorFor: 'Explained for workers from {country}', note: 'This service gives no legal judgments. Rules change each round, so always check your sending agency’s notice and HiKorea.'
};
const vi = {
  tag: 'Chuẩn bị nhập cảnh cho lao động nước ngoài đến Hàn Quốc',
  search: 'Tìm quốc gia của bạn', hint: 'Chạm vào quốc gia bạn xuất phát', noResult: 'Không có kết quả',
  sat: 'Vệ tinh', map: 'Bản đồ', from: 'Từ', to: 'Đến · Sân bay quốc tế Incheon, Hàn Quốc',
  entry: 'Ngày dự kiến nhập cảnh', fuel: 'Nhiên liệu', fuelHelp: 'Nhiên liệu = thời gian còn lại để chuẩn bị trước ngày nhập cảnh',
  fOk: 'Đủ', fLow: 'Gấp', fOut: 'Trễ', due: 'trước {date}', after: 'trong {n} ngày sau khi đến', afterAny: 'sau khi đến',
  fly: 'Bắt đầu bay', flying: 'Đang bay…', replay: 'Bay lại', turb: 'Vùng nhiễu động', turbOk: 'Đã hiểu',
  notE9: 'Không phải nước phái cử EPS (E-9). Hiển thị các bước cơ bản cho visa lao động khác (E-7…).',
  korea: 'Đây là điểm đến. Hãy chọn nước xuất phát.',
  agency: 'Cơ quan phái cử', fee: 'Lệ phí thi', source: 'Nguồn đã kiểm tra', checked: 'Kiểm tra 2026-11-08',
  lvl: { official: 'Đã xem thông báo gốc', summary: 'Xem qua bản tóm tắt', check: 'Chỉ có cơ quan — cần xem thông báo' },
  extraNone: 'Xem giấy tờ bổ sung của đợt này trong thông báo của cơ quan phái cử.',
  done: 'Xong', progress: 'Xong {done}/{total}', newCountry: 'Nước phái cử mới năm 2026 — chờ thông báo thi đầu tiên',
  signIn: 'Đăng nhập', signUp: 'Tạo tài khoản', uid: 'ID', pw: 'Mật khẩu', pw2: 'Nhập lại mật khẩu', signOut: 'Đăng xuất',
  hello: 'Chào {id}', localNote: 'Tài khoản và danh sách chỉ lưu trong trình duyệt này (demo). Mật khẩu được mã hóa.',
  eId: 'ID: 4–20 chữ hoặc số', ePw: 'Mật khẩu từ 8 ký tự', eMatch: 'Mật khẩu không khớp', eExists: 'ID đã tồn tại', eWrong: 'Sai ID hoặc mật khẩu',
  haveAcc: 'Tôi đã có tài khoản', noAcc: 'Tôi chưa có tài khoản', close: 'Đóng', saved: 'Đã lưu danh sách của bạn',
  tutor: 'Trợ lý thi tiếng Hàn', practice: 'Luyện tập', askAi: 'Hỏi AI', askPh: 'Hỏi về từ hoặc câu tiếng Hàn',
  send: 'Gửi', aiOff: 'AI chưa được kết nối. Hãy luyện tập câu hỏi.', aiErr: 'Hiện không trả lời được. Thử lại sau.',
  thinking: 'Đang nghĩ…', right: 'Đúng!', wrong: 'Chưa đúng', next: 'Câu tiếp', score: 'Đúng {n}/{t}', hintL: 'Gợi ý', again: 'Làm lại',
  tutorFor: 'Giải thích cho lao động từ {country}', note: 'Dịch vụ không đưa ra phán quyết pháp lý. Mỗi đợt có thể thay đổi, hãy kiểm tra thông báo và HiKorea.'
};
const id = {
  tag: 'Persiapan masuk Korea untuk pekerja asing',
  search: 'Cari negara Anda', hint: 'Ketuk negara keberangkatan Anda', noResult: 'Tidak ada hasil',
  sat: 'Satelit', map: 'Peta', from: 'Dari', to: 'Ke · Bandara Internasional Incheon, Korea',
  entry: 'Rencana tanggal masuk', fuel: 'Bahan bakar', fuelHelp: 'Bahan bakar = sisa waktu untuk menyiapkan ini sebelum tanggal masuk',
  fOk: 'Cukup', fLow: 'Mepet', fOut: 'Terlambat', due: 'sebelum {date}', after: 'dalam {n} hari setelah tiba', afterAny: 'setelah tiba',
  fly: 'Mulai terbang', flying: 'Terbang…', replay: 'Terbang lagi', turb: 'Turbulensi', turbOk: 'Mengerti',
  notE9: 'Bukan negara pengirim EPS (E-9). Menampilkan langkah dasar visa kerja lain (E-7, dll.).',
  korea: 'Ini tujuannya. Pilih negara keberangkatan.',
  agency: 'Lembaga pengirim', fee: 'Biaya ujian', source: 'Sumber dicek', checked: 'Dicek 2026-11-08',
  lvl: { official: 'Pengumuman resmi dicek', summary: 'Dicek lewat ringkasan', check: 'Hanya lembaga — cek pengumuman' },
  extraNone: 'Cek dokumen tambahan putaran ini di pengumuman lembaga pengirim.',
  done: 'Selesai', progress: '{done}/{total} selesai', newCountry: 'Negara pengirim baru 2026 — menunggu pengumuman ujian pertama',
  signIn: 'Masuk', signUp: 'Buat akun', uid: 'ID', pw: 'Kata sandi', pw2: 'Ulangi kata sandi', signOut: 'Keluar',
  hello: 'Hai, {id}', localNote: 'Akun dan daftar hanya disimpan di browser ini (demo). Kata sandi disimpan terenkripsi.',
  eId: 'ID: 4–20 huruf/angka', ePw: 'Kata sandi minimal 8 karakter', eMatch: 'Kata sandi tidak sama', eExists: 'ID sudah dipakai', eWrong: 'ID atau kata sandi salah',
  haveAcc: 'Saya punya akun', noAcc: 'Saya belum punya akun', close: 'Tutup', saved: 'Daftar Anda tersimpan',
  tutor: 'Asisten ujian bahasa Korea', practice: 'Latihan', askAi: 'Tanya AI', askPh: 'Tanyakan kata atau ungkapan Korea',
  send: 'Kirim', aiOff: 'AI belum terhubung. Coba soal latihan.', aiErr: 'Belum bisa menjawab. Coba lagi nanti.',
  thinking: 'Berpikir…', right: 'Benar!', wrong: 'Belum tepat', next: 'Berikutnya', score: 'Benar {n}/{t}', hintL: 'Petunjuk', again: 'Ulangi',
  tutorFor: 'Penjelasan untuk pekerja dari {country}', note: 'Layanan ini tidak memberi keputusan hukum. Aturan bisa berubah, selalu cek pengumuman lembaga dan HiKorea.'
};
const km = {
  tag: 'ការត្រៀមចូលកូរ៉េសម្រាប់កម្មករបរទេស',
  search: 'ស្វែងរកប្រទេសរបស់អ្នក', hint: 'ចុចលើប្រទេសដែលអ្នកចេញដំណើរ', noResult: 'គ្មានលទ្ធផល',
  sat: 'ផ្កាយរណប', map: 'ផែនទី', from: 'ពី', to: 'ទៅ · អាកាសយានដ្ឋានអន្តរជាតិអ៊ីនឆន',
  entry: 'ថ្ងៃគ្រោងចូល', fuel: 'ប្រេង', fuelHelp: 'ប្រេង = ពេលនៅសល់ដើម្បីត្រៀមមុនថ្ងៃចូល',
  fOk: 'គ្រប់គ្រាន់', fLow: 'តឹង', fOut: 'យឺត', due: 'មុន {date}', after: 'ក្នុង {n} ថ្ងៃក្រោយមកដល់', afterAny: 'ក្រោយមកដល់',
  fly: 'ចាប់ផ្តើមហោះ', flying: 'កំពុងហោះ…', replay: 'ហោះម្តងទៀត', turb: 'ខ្យល់ច្របូកច្របល់', turbOk: 'យល់ហើយ',
  notE9: 'មិនមែនប្រទេសបញ្ជូន EPS (E-9) ទេ។ បង្ហាញជំហានមូលដ្ឋានសម្រាប់ទិដ្ឋាការការងារផ្សេង។',
  korea: 'នេះជាគោលដៅ។ សូមជ្រើសប្រទេសចេញដំណើរ។',
  agency: 'ស្ថាប័នបញ្ជូន', fee: 'ថ្លៃប្រឡង', source: 'ប្រភពបានពិនិត្យ', checked: 'ពិនិត្យ 2026-11-08',
  lvl: { official: 'បានពិនិត្យសេចក្តីជូនដំណឹងដើម', summary: 'ពិនិត្យតាមសេចក្តីសង្ខេប', check: 'មានតែស្ថាប័ន — ត្រូវពិនិត្យ' },
  extraNone: 'សូមពិនិត្យឯកសារបន្ថែមក្នុងសេចក្តីជូនដំណឹងរបស់ស្ថាប័ន។',
  done: 'រួច', progress: 'រួច {done}/{total}', newCountry: 'ប្រទេសបញ្ជូនថ្មីឆ្នាំ ២០២៦ — រង់ចាំការប្រឡងដំបូង',
  signIn: 'ចូល', signUp: 'បង្កើតគណនី', uid: 'ID', pw: 'ពាក្យសម្ងាត់', pw2: 'បញ្ជាក់ពាក្យសម្ងាត់', signOut: 'ចាកចេញ',
  hello: 'សួស្តី {id}', localNote: 'គណនី និងបញ្ជីរក្សាទុកតែក្នុងកម្មវិធីរុករកនេះ (សាកល្បង)។ ពាក្យសម្ងាត់ត្រូវបានអ៊ិនគ្រីប។',
  eId: 'ID: ៤–២០ អក្សរ ឬលេខ', ePw: 'ពាក្យសម្ងាត់ ៨ តួឡើង', eMatch: 'ពាក្យសម្ងាត់មិនដូចគ្នា', eExists: 'ID មានរួចហើយ', eWrong: 'ID ឬពាក្យសម្ងាត់ខុស',
  haveAcc: 'ខ្ញុំមានគណនី', noAcc: 'ខ្ញុំគ្មានគណនី', close: 'បិទ', saved: 'បានរក្សាទុកបញ្ជីរបស់អ្នក',
  tutor: 'ជំនួយប្រឡងភាសាកូរ៉េ', practice: 'លំហាត់', askAi: 'សួរ AI', askPh: 'សួរពីពាក្យ ឬឃ្លាកូរ៉េ',
  send: 'ផ្ញើ', aiOff: 'AI មិនទាន់ភ្ជាប់។ សាកល្បងលំហាត់។', aiErr: 'មិនអាចឆ្លើយឥឡូវ។ សាកម្តងទៀតពេលក្រោយ។',
  thinking: 'កំពុងគិត…', right: 'ត្រឹមត្រូវ!', wrong: 'មិនទាន់ត្រូវ', next: 'បន្ទាប់', score: 'ត្រូវ {n}/{t}', hintL: 'តម្រុយ', again: 'ចាប់ផ្តើមម្តងទៀត',
  tutorFor: 'ពន្យល់សម្រាប់កម្មករមកពី {country}', note: 'សេវានេះមិនវិនិច្ឆ័យផ្លូវច្បាប់។ សូមពិនិត្យសេចក្តីជូនដំណឹង និង HiKorea ជានិច្ច។'
};
const ne = {
  tag: 'कोरिया आउने विदेशी कामदारका लागि प्रवेश तयारी',
  search: 'आफ्नो देश खोज्नुहोस्', hint: 'प्रस्थान गर्ने देश थिच्नुहोस्', noResult: 'नतिजा छैन',
  sat: 'स्याटेलाइट', map: 'नक्सा', from: 'बाट', to: 'सम्म · इन्छन अन्तर्राष्ट्रिय विमानस्थल, कोरिया',
  entry: 'प्रवेश योजना मिति', fuel: 'इन्धन', fuelHelp: 'इन्धन = प्रवेश मितिअघि यो तयारी गर्न बाँकी समय',
  fOk: 'पर्याप्त', fLow: 'कसिलो', fOut: 'ढिलो', due: '{date} सम्म', after: 'आइपुगेको {n} दिनभित्र', afterAny: 'आइपुगेपछि',
  fly: 'उडान सुरु', flying: 'उडिरहेको…', replay: 'फेरि उडान', turb: 'हावाको हलचल', turbOk: 'बुझेँ',
  notE9: 'EPS (E-9) पठाउने देश होइन। अन्य कामदार भिसा (E-7 आदि) को आधारभूत चरण देखाइन्छ।',
  korea: 'यो गन्तव्य हो। प्रस्थान गर्ने देश छान्नुहोस्।',
  agency: 'पठाउने निकाय', fee: 'परीक्षा शुल्क', source: 'जाँचिएको स्रोत', checked: 'जाँच 2026-11-08',
  lvl: { official: 'आधिकारिक सूचना जाँचिएको', summary: 'सारांशबाट जाँचिएको', check: 'निकाय मात्र — सूचना जाँच्नुहोस्' },
  extraNone: 'यस चरणका थप कागजात पठाउने निकायको सूचनामा हेर्नुहोस्।',
  done: 'सकियो', progress: '{done}/{total} सकियो', newCountry: '२०२६ को नयाँ पठाउने देश — पहिलो परीक्षा सूचना पर्खँदै',
  signIn: 'लगइन', signUp: 'खाता बनाउनुहोस्', uid: 'ID', pw: 'पासवर्ड', pw2: 'पासवर्ड पुष्टि', signOut: 'लगआउट',
  hello: 'नमस्ते {id}', localNote: 'खाता र सूची यो ब्राउजरमा मात्र सुरक्षित (डेमो)। पासवर्ड इन्क्रिप्ट गरेर राखिन्छ।',
  eId: 'ID: ४–२० अक्षर/अङ्क', ePw: 'पासवर्ड ८ अक्षर वा बढी', eMatch: 'पासवर्ड मिलेन', eExists: 'ID पहिल्यै छ', eWrong: 'ID वा पासवर्ड गलत',
  haveAcc: 'मेरो खाता छ', noAcc: 'खाता छैन', close: 'बन्द', saved: 'तपाईंको सूची सुरक्षित भयो',
  tutor: 'कोरियाली परीक्षा सहयोगी', practice: 'अभ्यास', askAi: 'AI लाई सोध्नुहोस्', askPh: 'कोरियाली शब्द वा वाक्यबारे सोध्नुहोस्',
  send: 'पठाउनुहोस्', aiOff: 'AI जोडिएको छैन। अभ्यास प्रश्न गर्नुहोस्।', aiErr: 'अहिले जवाफ दिन सकिँदैन। पछि प्रयास गर्नुहोस्।',
  thinking: 'सोच्दै…', right: 'सही!', wrong: 'मिलेन', next: 'अर्को', score: '{n}/{t} सही', hintL: 'सङ्केत', again: 'फेरि सुरु',
  tutorFor: '{country} का कामदारका लागि व्याख्या', note: 'यो सेवाले कानुनी निर्णय दिँदैन। सधैं पठाउने निकायको सूचना र HiKorea हेर्नुहोस्।'
};

const ALL = { ko, en, vi, id, km, ne };
export const ui = (lang) => (lang === 'en' ? en : { ...en, ...(ALL[lang] || {}), lvl: { ...en.lvl, ...((ALL[lang] || {}).lvl || {}) } });
export const fill = (s, v) => String(s || '').replace(/\{(\w+)\}/g, (m, k) => (v && v[k] !== undefined ? v[k] : m));
export const tx = (o, lang) => (o ? (o[lang] || o.en || o.ko) : '');

/* 브라우저가 나라 이름을 그 언어로 바꿔 줍니다(Intl.DisplayNames). */
export function countryName(a2, lang, fallback) {
  try { if (a2) return new Intl.DisplayNames([lang, 'en'], { type: 'region' }).of(a2); } catch (e) { /* 지원 안 함 */ }
  return fallback || a2 || '';
}
