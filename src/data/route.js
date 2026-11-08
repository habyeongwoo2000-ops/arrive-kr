/* 경로(구간 5개)와 체크 항목, 난기류(위험)
   ------------------------------------------------------------------
   · lead  : 입국 예정일 며칠 전까지 끝내야 하는지(연료 = 남은 준비 기간)
   · after : 입국 뒤 며칠 안에 해야 하는지
   · 근거  : 한국산업인력공단 고용허가제 안내, 외국인고용법 제7·9·10·11조,
             출입국관리법 제31조(외국인등록 90일), 각국 송출기관 2026 공지
   · lead 일수는 공식 기한이 아니라 "이만큼 미리 하면 안전하다"는 권장값입니다
     (시험 접수 → 합격 → 명부 → 선발 → 비자까지 보통 몇 달이 걸리기 때문).
   ------------------------------------------------------------------ */

const L = (ko, en, vi, id, km, ne) => ({ ko, en, vi, id, km, ne });

export const LEGS = [
  { key: 'prep', at: 0.12, icon: 'doc',
    name: L('출발 준비', 'Get ready', 'Chuẩn bị', 'Persiapan', 'ត្រៀមខ្លួន', 'तयारी'),
    items: [
      { id: 'passport', lead: 300, t: L('여권 준비', 'Passport', 'Hộ chiếu', 'Paspor', 'លិខិតឆ្លងដែន', 'राहदानी'),
        d: L('유효기간을 넉넉히 남기고, 이름·생년월일·성별을 원서와 똑같이 씁니다.', 'Keep plenty of validity, and write your name, birth date and sex exactly as in the passport.', 'Còn hạn dài, ghi tên, ngày sinh, giới tính đúng như hộ chiếu.', 'Masa berlaku cukup panjang; tulis nama, tanggal lahir, jenis kelamin persis seperti paspor.', 'ត្រូវមានសុពលភាពយូរ ហើយសរសេរឈ្មោះ ថ្ងៃកំណើត ភេទ ដូចលិខិតឆ្លងដែន។', 'लामो म्याद राख्नुहोस्; नाम, जन्ममिति, लिङ्ग राहदानीजस्तै लेख्नुहोस्।') },
      { id: 'photo', lead: 300, t: L('증명사진·스캔 파일', 'Photo and scans', 'Ảnh và bản scan', 'Foto dan pindaian', 'រូបថត និងឯកសារស្កេន', 'फोटो र स्क्यान'),
        d: L('3.5×4.5cm, 흰 배경, 최근 3~6개월. 나라마다 용량(KB)·픽셀 규격이 다릅니다.', '3.5×4.5 cm, white background, recent 3–6 months. Size (KB) and pixel rules differ by country.', '3.5×4.5cm, nền trắng, chụp trong 3–6 tháng. Mỗi nước quy định dung lượng (KB) khác nhau.', '3,5×4,5 cm, latar putih, 3–6 bulan terakhir. Ukuran (KB) dan piksel berbeda tiap negara.', '៣.៥×៤.៥ សម ផ្ទៃសខាងក្រោយ ថតក្នុង ៣–៦ ខែ។ ទំហំ (KB) ខុសគ្នាតាមប្រទេស។', '३.५×४.५ सेमी, सेतो पृष्ठभूमि, ३–६ महिनाभित्र। KB/पिक्सेल नियम देशअनुसार फरक।') },
      { id: 'extra', lead: 300, country: true, t: L('우리나라 추가 서류', 'Country-specific papers', 'Giấy tờ riêng của nước bạn', 'Dokumen khusus negara Anda', 'ឯកសារបន្ថែមរបស់ប្រទេសអ្នក', 'आफ्नो देशका थप कागजात'),
        d: L('송출기관이 따로 요구하는 서류입니다.', 'Extra documents your sending agency asks for.', 'Giấy tờ cơ quan phái cử yêu cầu thêm.', 'Dokumen tambahan dari lembaga pengirim.', 'ឯកសារបន្ថែមដែលស្ថាប័នបញ្ជូនស្នើ។', 'पठाउने निकायले माग्ने थप कागजात।') }
    ] },
  { key: 'exam', at: 0.32, icon: 'pen',
    name: L('한국어·기능 시험', 'Korean & skills test', 'Thi tiếng Hàn & tay nghề', 'Ujian bahasa & keterampilan', 'ប្រឡងភាសាកូរ៉េ និងជំនាញ', 'कोरियाली र सीप परीक्षा'),
    items: [
      { id: 'apply', lead: 270, t: L('EPS-TOPIK 접수', 'Apply for EPS-TOPIK', 'Đăng ký EPS-TOPIK', 'Daftar EPS-TOPIK', 'ចុះឈ្មោះ EPS-TOPIK', 'EPS-TOPIK आवेदन'),
        d: L('본국 송출기관에서만 접수합니다(대리·단체 접수 불가). 응시료 외에 돈을 요구하면 거절하세요.', 'Apply only through your sending agency (no proxy or group applications). Refuse any payment beyond the fee.', 'Chỉ đăng ký qua cơ quan phái cử (không nộp hộ, không nộp theo nhóm). Từ chối mọi khoản tiền ngoài lệ phí.', 'Daftar hanya lewat lembaga pengirim (tidak boleh diwakilkan/kelompok). Tolak pembayaran selain biaya ujian.', 'ចុះឈ្មោះតាមស្ថាប័នបញ្ជូនតែប៉ុណ្ណោះ (មិនអាចជំនួស ឬជាក្រុម)។ បដិសេធការទាមទារលុយក្រៅពីថ្លៃប្រឡង។', 'पठाउने निकायमार्फत मात्र आवेदन (प्रतिनिधि/समूह होइन)। शुल्कबाहेक पैसा माग्दा अस्वीकार गर्नुहोस्।') },
      { id: 'testday', lead: 240, t: L('시험 당일', 'Test day', 'Ngày thi', 'Hari ujian', 'ថ្ងៃប្រឡង', 'परीक्षा दिन'),
        d: L('수험표와 접수 때 쓴 여권 원본을 가져갑니다. 여권이 바뀌면 응시할 수 없습니다.', 'Bring the admission ticket and the original passport you applied with. A different passport is not accepted.', 'Mang phiếu dự thi và hộ chiếu gốc đã dùng khi đăng ký. Hộ chiếu khác sẽ không được chấp nhận.', 'Bawa kartu ujian dan paspor asli yang dipakai saat daftar. Paspor lain tidak diterima.', 'យកប័ណ្ណប្រឡង និងលិខិតឆ្លងដែនដើមដែលបានប្រើពេលចុះឈ្មោះ។', 'प्रवेशपत्र र आवेदनमा प्रयोग गरेको सक्कली राहदानी ल्याउनुहोस्।') },
      { id: 'skill', lead: 200, t: L('기능시험·역량평가', 'Skills test', 'Thi tay nghề', 'Uji keterampilan', 'ប្រឡងជំនាញ', 'सीप परीक्षा'),
        d: L('분야(제조·어업·농업 등)별로 봅니다. 점수가 높을수록 선발에 유리합니다.', 'Held by sector (manufacturing, fishery, farming…). Higher scores help selection.', 'Theo ngành (sản xuất, ngư nghiệp, nông nghiệp…). Điểm cao giúp được chọn.', 'Per sektor (manufaktur, perikanan, pertanian…). Nilai tinggi membantu seleksi.', 'តាមវិស័យ (ផលិតកម្ម នេសាទ កសិកម្ម…)។ ពិន្ទុខ្ពស់ជួយឱ្យត្រូវបានជ្រើស។', 'क्षेत्रअनुसार (उत्पादन, माछा, कृषि…)। उच्च अङ्कले छनोटमा मद्दत।') }
    ] },
  { key: 'select', at: 0.52, icon: 'check',
    name: L('건강검진·선발', 'Health check & selection', 'Khám sức khỏe & tuyển chọn', 'Cek kesehatan & seleksi', 'ពិនិត្យសុខភាព និងការជ្រើសរើស', 'स्वास्थ्य जाँच र छनोट'),
    items: [
      { id: 'medical', lead: 150, t: L('지정 병원 건강검진', 'Health check at an approved hospital', 'Khám sức khỏe tại bệnh viện chỉ định', 'Cek kesehatan di RS yang ditunjuk', 'ពិនិត្យសុខភាពនៅមន្ទីរពេទ្យកំណត់', 'तोकिएको अस्पतालमा जाँच'),
        d: L('색각이상·결핵 등은 불합격입니다. 검진 뒤 3개월이 지나면 입국 전에 다시 받습니다.', 'Color blindness, TB and similar conditions fail. Redo it if more than 3 months pass before entry.', 'Mù màu, lao… sẽ không đạt. Quá 3 tháng trước khi nhập cảnh phải khám lại.', 'Buta warna, TBC, dll. tidak lulus. Ulangi jika lewat 3 bulan sebelum berangkat.', 'ពិការភ្នែកពណ៌ របេង… មិនជាប់។ បើលើស ៣ ខែមុនចូល ត្រូវពិនិត្យម្តងទៀត។', 'रङ अन्धोपन, क्षयरोग आदि भए असफल। प्रवेशअघि ३ महिना नाघे फेरि जाँच।') },
      { id: 'roster', lead: 140, t: L('구직자 명부 등록', 'Job seeker roster', 'Đăng ký danh sách tìm việc', 'Daftar pencari kerja', 'ចុះឈ្មោះបញ្ជីអ្នករកការងារ', 'रोजगार खोज्नेको सूची'),
        d: L('합격 결과는 2년 동안 유효합니다. 이 기간에 한국 사업주가 근로자를 고릅니다.', 'Your pass is valid for 2 years. Korean employers choose workers during this period.', 'Kết quả đỗ có hiệu lực 2 năm. Chủ Hàn Quốc chọn người trong thời gian này.', 'Kelulusan berlaku 2 tahun. Majikan Korea memilih pekerja di masa ini.', 'លទ្ធផលជាប់មានសុពលភាព ២ ឆ្នាំ។ និយោជកកូរ៉េជ្រើសក្នុងរយៈពេលនេះ។', 'उत्तीर्ण नतिजा २ वर्ष मान्य। यसबीच कोरियाली रोजगारदाताले छान्छन्।') },
      { id: 'contract', lead: 60, t: L('표준근로계약 확인', 'Standard labor contract', 'Hợp đồng lao động mẫu', 'Kontrak kerja standar', 'កិច្ចសន្យាការងារស្តង់ដារ', 'मानक श्रम सम्झौता'),
        d: L('송출기관에서 임금·근무시간·숙소를 꼭 읽고 동의합니다.', 'Read wage, hours and housing carefully at the sending agency before you agree.', 'Đọc kỹ lương, giờ làm, chỗ ở trước khi đồng ý.', 'Baca gaji, jam kerja, dan tempat tinggal sebelum setuju.', 'អានប្រាក់ខែ ម៉ោងធ្វើការ កន្លែងស្នាក់នៅ មុនយល់ព្រម។', 'तलब, समय, बस्ने ठाउँ ध्यानले पढेर मात्र सहमति।') }
    ] },
  { key: 'depart', at: 0.72, icon: 'plane',
    name: L('출국 준비', 'Before departure', 'Trước khi xuất cảnh', 'Sebelum berangkat', 'មុនចេញដំណើរ', 'प्रस्थानअघि'),
    items: [
      { id: 'pretrain', lead: 30, t: L('입국 전 교육', 'Pre-departure training', 'Đào tạo trước xuất cảnh', 'Pelatihan pra-keberangkatan', 'វគ្គបណ្តុះបណ្តាលមុនចេញ', 'प्रस्थानपूर्व तालिम'),
        d: L('본국 교육기관에서 한국어·문화·안전 기초를 배웁니다.', 'Basic Korean, culture and safety at a training center at home.', 'Học tiếng Hàn, văn hóa, an toàn cơ bản tại nước nhà.', 'Belajar dasar bahasa, budaya, keselamatan di negara asal.', 'រៀនភាសា វប្បធម៌ សុវត្ថិភាពមូលដ្ឋាននៅប្រទេសកំណើត។', 'स्वदेशमा भाषा, संस्कृति, सुरक्षाको आधारभूत तालिम।') },
      { id: 'visa', lead: 25, t: L('E-9 사증(비자)', 'E-9 visa', 'Visa E-9', 'Visa E-9', 'ទិដ្ឋាការ E-9', 'E-9 भिसा'),
        d: L('사증발급인정서는 한국 사업주가 신청합니다. 송출기관이 한국 대사관에 비자를 신청해 줍니다.', 'The Korean employer applies for the visa issuance certificate; your sending agency applies for the visa at the Korean embassy.', 'Chủ Hàn Quốc xin giấy chứng nhận cấp visa; cơ quan phái cử nộp visa tại Đại sứ quán.', 'Majikan Korea mengurus sertifikat; lembaga pengirim mengajukan visa ke Kedutaan.', 'និយោជកកូរ៉េស្នើវិញ្ញាបនបត្រ ស្ថាប័នបញ្ជូនដាក់ពាក្យទិដ្ឋាការនៅស្ថានទូត។', 'प्रमाणपत्र कोरियाली रोजगारदाताले, भिसा पठाउने निकायले दूतावासमा।') },
      { id: 'confirm', lead: 7, t: L('입국 확정', 'Entry confirmed', 'Xác nhận nhập cảnh', 'Konfirmasi keberangkatan', 'បញ្ជាក់ការចូល', 'प्रवेश पुष्टि'),
        d: L('송출기관이 입국 7일 전까지 한국에 알립니다. 안내받은 날짜에 출발하세요.', 'The agency confirms with Korea at least 7 days before. Leave on the date you are given.', 'Cơ quan phái cử báo trước 7 ngày. Đi đúng ngày được thông báo.', 'Lembaga memberi tahu Korea 7 hari sebelumnya. Berangkat sesuai tanggal.', 'ស្ថាប័នជូនដំណឹង ៧ ថ្ងៃមុន។ ចេញដំណើរតាមថ្ងៃដែលបានប្រាប់។', 'निकायले ७ दिनअघि जानकारी दिन्छ। तोकिएको दिन प्रस्थान।') }
    ] },
  { key: 'arrive', at: 0.94, icon: 'flag',
    name: L('한국 도착 후', 'After arrival', 'Sau khi đến Hàn Quốc', 'Setelah tiba', 'ក្រោយមកដល់', 'आइपुगेपछि'),
    items: [
      { id: 'edu', after: 15, t: L('취업교육 16시간 + 건강진단', '16-hour employment training + health check', 'Đào tạo 16 giờ + khám sức khỏe', 'Pelatihan 16 jam + cek kesehatan', 'វគ្គ ១៦ ម៉ោង + ពិនិត្យសុខភាព', '१६ घण्टा तालिम + स्वास्थ्य जाँच'),
        d: L('입국 후 15일 안에 받습니다(비용은 사업주). 건강진단 불합격이면 귀국합니다.', 'Within 15 days of entry (paid by the employer). Failing the health check means returning home.', 'Trong 15 ngày (chủ trả phí). Khám không đạt sẽ phải về nước.', 'Dalam 15 hari (dibayar majikan). Gagal cek kesehatan berarti pulang.', 'ក្នុង ១៥ ថ្ងៃ (និយោជកបង់)។ មិនជាប់សុខភាព ត្រូវត្រឡប់។', '१५ दिनभित्र (रोजगारदाताले तिर्छ)। जाँच असफल भए फर्कनुपर्छ।') },
      { id: 'arc', after: 90, t: L('외국인등록', 'Alien registration', 'Đăng ký người nước ngoài', 'Registrasi orang asing', 'ចុះឈ្មោះជនបរទេស', 'विदेशी दर्ता'),
        d: L('입국일부터 90일 안에 출입국·외국인관서에서 합니다. 수수료·서류는 하이코리아에서 확인하세요.', 'Within 90 days of entry at an immigration office. Check fees and documents on HiKorea.', 'Trong 90 ngày tại cơ quan XNC. Xem phí và giấy tờ trên HiKorea.', 'Dalam 90 hari di kantor imigrasi. Cek biaya & dokumen di HiKorea.', 'ក្នុង ៩០ ថ្ងៃ នៅការិយាល័យអន្តោប្រវេសន៍។ មើលថ្លៃនៅ HiKorea។', '९० दिनभित्र अध्यागमन कार्यालयमा। शुल्क HiKorea मा हेर्नुहोस्।') },
      { id: 'ins', after: null, t: L('보험 가입 확인', 'Check your insurance', 'Kiểm tra bảo hiểm', 'Cek asuransi', 'ពិនិត្យធានារ៉ាប់រង', 'बीमा जाँच'),
        d: L('귀국비용보험·상해보험(근로자), 출국만기보험·보증보험(사업주) 가입을 사업주와 함께 확인합니다.', 'Check return-cost and accident insurance (yours) and departure-guarantee and wage-guarantee insurance (employer’s).', 'Kiểm tra bảo hiểm chi phí về nước, tai nạn (của bạn) và bảo hiểm mãn hạn, bảo lãnh (của chủ).', 'Cek asuransi biaya pulang & kecelakaan (Anda) serta asuransi kepulangan & jaminan upah (majikan).', 'ពិនិត្យធានារ៉ាប់រងថ្លៃត្រឡប់ និងគ្រោះថ្នាក់ (អ្នក) និងធានារ៉ាប់រងរបស់និយោជក។', 'फिर्ती खर्च र दुर्घटना बीमा (तपाईंको), रोजगारदाताको बीमा जाँच्नुहोस्।') }
    ] }
];

/* 공통 난기류 — 경로 위 위치(at)에서 비행기가 흔들립니다. */
export const TURBULENCE = [
  { at: 0.2, sev: 2, t: L('이름·생년월일 불일치', 'Name or birth date mismatch', 'Sai tên hoặc ngày sinh', 'Nama/tanggal lahir tidak sama', 'ឈ្មោះ ឬថ្ងៃកំណើតមិនត្រូវ', 'नाम वा जन्ममिति मेल नखाने'),
    d: L('원서가 여권과 한 글자라도 다르면 응시가 무효되거나 입국이 거부될 수 있어요.', 'If your form differs from your passport by even one letter, the test can be void or entry refused.', 'Sai một chữ so với hộ chiếu có thể bị hủy thi hoặc từ chối nhập cảnh.', 'Beda satu huruf dengan paspor bisa membatalkan ujian atau menolak masuk.', 'ខុសតែមួយអក្សរពីលិខិតឆ្លងដែន អាចត្រូវលុបចោល ឬបដិសេធការចូល។', 'राहदानीसँग एक अक्षर फरक भए पनि परीक्षा रद्द वा प्रवेश अस्वीकार हुन सक्छ।') },
  { at: 0.38, sev: 3, t: L('브로커·추가 비용 요구', 'Brokers asking for money', 'Môi giới đòi tiền', 'Calo meminta uang', 'ឈ្មួញកណ្តាលទាមទារលុយ', 'दलालले पैसा माग्ने'),
    d: L('응시료는 USD 28(필리핀 24)뿐입니다. 합격·선발을 약속하며 돈을 요구하면 사기입니다.', 'The test fee is only USD 28 (USD 24 in the Philippines). Anyone promising a pass or a job for money is a scam.', 'Lệ phí chỉ USD 28 (Philippines 24). Hứa đỗ/được chọn để lấy tiền là lừa đảo.', 'Biaya hanya USD 28 (Filipina 24). Janji lulus/kerja dengan bayaran adalah penipuan.', 'ថ្លៃប្រឡងតែ USD 28 (ហ្វីលីពីន 24)។ សន្យាជាប់ ឬការងារដើម្បីលុយ គឺការបោកប្រាស់។', 'शुल्क USD 28 मात्र (फिलिपिन्स 24)। पैसा लिएर पास/जागिरको वाचा ठगी हो।') },
  { at: 0.46, sev: 2, t: L('사진·파일 규격 반려', 'Photo or file rejected', 'Ảnh/tệp bị trả lại', 'Foto/berkas ditolak', 'រូបថត/ឯកសារត្រូវបដិសេធ', 'फोटो/फाइल अस्वीकार'),
    d: L('용량(KB)·픽셀·배경색이 하나라도 맞지 않으면 접수가 안 됩니다.', 'If size (KB), pixels or background are wrong, your application is not accepted.', 'Sai dung lượng, pixel hoặc nền sẽ không được nhận.', 'Ukuran, piksel, atau latar salah membuat pendaftaran ditolak.', 'ទំហំ ភីកសែល ឬផ្ទៃខាងក្រោយខុស នឹងមិនទទួល។', 'साइज, पिक्सेल वा पृष्ठभूमि गलत भए आवेदन लिइँदैन।') },
  { at: 0.6, sev: 3, t: L('건강검진 불합격', 'Failing the health check', 'Không đạt sức khỏe', 'Gagal cek kesehatan', 'មិនជាប់ពិនិត្យសុខភាព', 'स्वास्थ्य जाँच असफल'),
    d: L('색각이상·결핵 등은 시험에 붙어도 갈 수 없어요. 응시 전에 미리 확인하세요.', 'Color blindness, TB and similar conditions stop you even after passing. Check before you apply.', 'Mù màu, lao… dù đỗ cũng không đi được. Hãy kiểm tra trước.', 'Buta warna, TBC, dll. menggagalkan meski lulus. Cek dulu.', 'ពិការភ្នែកពណ៌ របេង… ទោះជាប់ក៏មិនអាចទៅ។ ពិនិត្យមុន។', 'रङ अन्धोपन, क्षयरोग भए पास भए पनि जान पाइँदैन। पहिले जाँच्नुहोस्।') },
  { at: 0.8, sev: 2, t: L('위조·대리 서류', 'Fake or proxy documents', 'Giấy tờ giả/nhờ người làm', 'Dokumen palsu/diwakilkan', 'ឯកសារក្លែង ឬជំនួស', 'नक्कली वा अरूले बनाइदिएको कागज'),
    d: L('서류를 꾸미면 사증이 거부되고 다시 응시하기 어려워집니다.', 'Altered documents lead to visa refusal and make it hard to apply again.', 'Giấy tờ sửa đổi sẽ bị từ chối visa và khó thi lại.', 'Dokumen palsu menyebabkan visa ditolak dan sulit mendaftar lagi.', 'ឯកសារកែប្រែ នាំឱ្យបដិសេធទិដ្ឋាការ និងពិបាកដាក់ពាក្យម្តងទៀត។', 'नक्कली कागजले भिसा अस्वीकार र फेरि आवेदन गाह्रो।') },
  { at: 0.98, sev: 1, t: L('도착 후 기한 놓침', 'Missing deadlines after arrival', 'Quên hạn sau khi đến', 'Lupa batas waktu setelah tiba', 'ភ្លេចកាលកំណត់ក្រោយមកដល់', 'आइपुगेपछि म्याद छुट्ने'),
    d: L('외국인등록을 90일 안에 하지 않으면 과태료를 낼 수 있어요.', 'Not registering within 90 days can lead to a fine.', 'Không đăng ký trong 90 ngày có thể bị phạt.', 'Tidak registrasi dalam 90 hari bisa didenda.', 'មិនចុះឈ្មោះក្នុង ៩០ ថ្ងៃ អាចត្រូវពិន័យ។', '९० दिनभित्र दर्ता नगरे जरिवाना लाग्न सक्छ।') }
];

/* E-9 송출국이 아닌 나라 — 일반 취업 비자(E-7 등) 기본 흐름만 보여 줍니다. */
export const GENERAL = [
  { key: 'prep', at: 0.15, name: L('출발 준비', 'Get ready', 'Chuẩn bị', 'Persiapan', 'ត្រៀមខ្លួន', 'तयारी'),
    items: [{ id: 'g-passport', lead: 180, t: L('여권', 'Passport', 'Hộ chiếu', 'Paspor', 'លិខិតឆ្លងដែន', 'राहदानी'), d: L('유효기간을 넉넉히 남깁니다.', 'Keep plenty of validity.', 'Còn hạn dài.', 'Masa berlaku cukup.', 'សុពលភាពយូរ។', 'लामो म्याद।') }] },
  { key: 'job', at: 0.4, name: L('일자리·고용계약', 'Job & contract', 'Việc làm & hợp đồng', 'Kerja & kontrak', 'ការងារ និងកិច្ចសន្យា', 'जागिर र सम्झौता'),
    items: [{ id: 'g-contract', lead: 120, t: L('한국 사업주와 고용계약', 'Contract with a Korean employer', 'Hợp đồng với chủ Hàn Quốc', 'Kontrak dengan majikan Korea', 'កិច្ចសន្យាជាមួយនិយោជកកូរ៉េ', 'कोरियाली रोजगारदातासँग सम्झौता'), d: L('체류자격(E-7 등)과 요건은 직종마다 다릅니다.', 'Visa type (E-7 etc.) and requirements depend on the job.', 'Loại visa (E-7…) tùy công việc.', 'Jenis visa (E-7, dll.) tergantung pekerjaan.', 'ប្រភេទទិដ្ឋាការអាស្រ័យលើការងារ។', 'भिसा प्रकार कामअनुसार।') }] },
  { key: 'papers', at: 0.6, name: L('학력·경력 서류', 'Degree & career papers', 'Bằng cấp & kinh nghiệm', 'Ijazah & pengalaman', 'សញ្ញាបត្រ និងបទពិសោធន៍', 'शैक्षिक र अनुभव'),
    items: [{ id: 'g-apostille', lead: 90, t: L('아포스티유·영사확인', 'Apostille or consular legalization', 'Hợp pháp hóa lãnh sự/Apostille', 'Apostille/legalisasi', 'Apostille/បញ្ជាក់កុងស៊ុល', 'एपोस्टिल/कन्सुलर प्रमाणीकरण'), d: L('외국 서류는 인증이 필요한 경우가 많습니다.', 'Foreign documents often need certification.', 'Giấy tờ nước ngoài thường cần chứng thực.', 'Dokumen asing sering perlu disahkan.', 'ឯកសារបរទេសច្រើនត្រូវបញ្ជាក់។', 'विदेशी कागज प्रायः प्रमाणित गर्नुपर्छ।') }] },
  { key: 'visa', at: 0.78, name: L('사증', 'Visa', 'Visa', 'Visa', 'ទិដ្ឋាការ', 'भिसा'),
    items: [{ id: 'g-visa', lead: 30, t: L('재외공관 사증 신청', 'Apply at a Korean embassy', 'Nộp visa tại Đại sứ quán', 'Ajukan di Kedutaan Korea', 'ដាក់ពាក្យនៅស្ថានទូតកូរ៉េ', 'कोरियाली दूतावासमा आवेदन'), d: L('결핵 고위험국 국민은 결핵진단서를 내야 할 수 있습니다.', 'Citizens of TB high-risk countries may need a TB certificate.', 'Công dân nước có nguy cơ lao cao có thể cần giấy khám lao.', 'Warga negara risiko TBC tinggi mungkin perlu surat TBC.', 'អាចត្រូវការវិញ្ញាបនបត្ររបេង។', 'क्षयरोग प्रमाणपत्र चाहिन सक्छ।') }] },
  { key: 'arrive', at: 0.95, name: L('한국 도착 후', 'After arrival', 'Sau khi đến', 'Setelah tiba', 'ក្រោយមកដល់', 'आइपुगेपछि'),
    items: [{ id: 'g-arc', after: 90, t: L('외국인등록', 'Alien registration', 'Đăng ký người nước ngoài', 'Registrasi orang asing', 'ចុះឈ្មោះជនបរទេស', 'विदेशी दर्ता'), d: L('입국일부터 90일 안에 합니다.', 'Within 90 days of entry.', 'Trong 90 ngày.', 'Dalam 90 hari.', 'ក្នុង ៩០ ថ្ងៃ។', '९० दिनभित्र।') }] }
];
