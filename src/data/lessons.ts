export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface Topic {
  id: string;
  title: string;
  content: string;
  keyPoints?: string[];
  codeSnippet?: {
    language: string;
    code: string;
  };
}

export interface ModuleData {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  description: string;
  video_url: string;
  video_title: string;
  topics: Topic[];
  quiz: QuizQuestion[];
}

export const MODULES: ModuleData[] = [
  {
    id: 1,
    title: "1-Modul: Computer Science & Tizim asoslari",
    subtitle: "Kompyuter arxitekturasi, CPU, Registrlar, Stack/Heap xotira va OT yadrosi",
    icon: "Cpu",
    description: "Dasturlash va axborot xavfsizligining poydevori: mashina qanday hisoblaydi, xotira katakchalari qanday boshqariladi va operatsion tizim chaqiriqlari qanday ishlaydi.",
    video_url: "https://www.youtube.com/watch?v=kYnP4x5O6x8",
    video_title: "Kompyuter Arxitekturasi va Xotira Tuzilishi (Stack vs Heap)",
    topics: [
      {
        id: "1_1",
        title: "1.1. Kompyuter arxitekturasi: Protsessor (CPU) va Registrlar",
        content: `Kiberxavfsizlik mutaxassisi dasturiy ta'minotning eng quyi (low-level) qatlamini mukammal tushunishi shart. Har qanday dastur oxir-oqibat mashina kodiga (0 va 1) aylanadi va protsessor tomonidan bajariladi.

1. Protsessor (CPU) tuzilishi:
• ALU (Arifmetik-Mantiqiy Qurilma): Arifmetik (+, -, *, /) va mantiqiy (AND, OR, NOT, XOR) amallarni bajaradi.
• CU (Boshqaruv Qurilmasi - Control Unit): Xotiradan buyruqlarni o'qiydi (Fetch), ularni dekodlaydi (Decode) va bajarilishini ta'minlaydi (Execute).
• Registrlar (Registers): CPU ichida joylashgan eng yuqori tezlikka ega o'ta kichik xotira xujayralari.

2. x86 va x64 Asosiy Registrlari:
• EAX / RAX (Akumulyator): Arifmetik hisob-kitoblar va funksiyalardan qaytuvchi qiymatlarni saqlaydi.
• EBX / RBX (Baza): Xotiraga murojaat qilishda asosiy manzil sifatida ishlatiladi.
• ECX / RCX (Hisoblagich - Counter): Sikllar (loops) va satr amallari uchun sanagich.
• EDX / RDX (Ma'lumotlar - Data): Kirish-chiqish (I/O) va ko'paytirish/bo'lish amallarida qatnashadi.
• ESP / RSP (Stack Pointer): Stack xotirasining eng yuqori nuqtasini ko'rsatadi.
• EBP / RBP (Base Pointer): Joriy funksiya stack ramkasi (stack frame) asosini ushlab turadi.
• EIP / RIP (Instruction Pointer): Keyingi bajarilishi kerak bo'lgan buyruqning xotiradagi manzilini ko'rsatadi.

Xavfsizlik eslatmasi: Buffer Overflow (bufer to'lib ketishi) hujumlarida tajovuzkor aynan EIP/RIP registrini o'zining zararli kod (shellcode) manziliga yo'naltirishga intiladi!`,
        keyPoints: [
          "CPU sikli: Fetch -> Decode -> Execute",
          "EIP / RIP registri keyingi bajariladigan buyruq manzilini belgilaydi",
          "Registrlar RAM xotiraga qaraganda yuzlab marta tezroq ishlaydi"
        ],
        codeSnippet: {
          language: "nasm",
          code: `; x86 Assambleya buyrug'i namunasi
MOV EAX, 5       ; EAX registriga 5 sonini yozish
MOV EBX, 10      ; EBX registriga 10 sonini yozish
ADD EAX, EBX     ; EAX = EAX + EBX (natija 15 EAX ga yoziladi)
PUSH EAX         ; Natijani Stack xotirasiga kiritish`
        }
      },
      {
        id: "1_2",
        title: "1.2. Xotira tuzilmasi: Stack va Heap farqlari, Ko'rsatkichlar (Pointers)",
        content: `Dastur ishga tushganda, operatsion tizim unga virtual xotira (Virtual Memory Space) ajratadi. Bu maydon bir necha segmentlarga bo'linadi:

1. Stack (Stak) xotirasi:
• Prinsipi: LIFO (Last In, First Out - Oxirgi kirgan birinchi chiqadi).
• Xususiyati: O'ta tez ishlaydi, hajmi cheklangan (odatda 1-8 MB), xotira avtomatik ravishda CPU tomonidan boshqariladi.
• Nimalar saqlanadi: Lokal o'zgaruvchilar, funksiyaga uzatilgan parametrlar, qaytish manzillari (return address).
• Xatolar: Agar funksiya o'zini cheksiz chaqirsa (rekursiya), Stack Overflow xatosi yuzaga keladi.

2. Heap (Uyulma) xotirasi:
• Prinsipi: Dinamik xotira ajratish (Dynamic Memory Allocation).
• Xususiyati: Hajmi katta (tizim RAM hajmiga tenglashishi mumkin), sekinroq ishlaydi, dasturchi tomonidan qo'lda ajratiladi va ozod qilinadi (malloc() / free() C tilida, new / delete C++ da).
• Nimalar saqlanadi: Dinamik massivlar, katta ob'ektlar va uzoq vaqt yashovchi tuzilmalar.

3. Xotira ko'rsatkichlari (Pointers) va Xotira sizib chiqishi (Memory Leak):
Ko'rsatkich — boshqa bir xotira katakchasining aniq manzilini o'zida saqlovchi maxsus o'zgaruvchi.
• Memory Leak (Xotira sizishi): Heap xotirasidan malloc() orqali joy ajratib, ish tugagach free() orqali bo'shatmaslik. Natijada tizim xotirasi asta-sekin tugaydi va dastur qulab tushadi (DoS).
• Dangling Pointer (Muallaq ko'rsatkich): Bo'shatilgan xotira manziliga qayta murojaat qilish (Use-After-Free zaifligi), bu esa kiberhujumchilar uchun kod ijro etish yo'lini ochadi.`,
        keyPoints: [
          "Stack LIFO bo'yicha avtomatik tozalanadi",
          "Heap dasturchi tomonidan boshqariladi va xavfsizlik kamchiliklariga eng moyil sohadir",
          "Use-After-Free va Memory Leak xavfsizlikning jiddiy muammolaridir"
        ],
        codeSnippet: {
          language: "c",
          code: `// C tilida dinamik xotira va xotira sizishi (Memory Leak)
int main() {
    int stack_var = 42; // Stack xotirasida
    
    // Heap xotiradan 100 ta butun son uchun joy ajratish
    int* ptr = (int*) malloc(100 * sizeof(int));
    
    if (ptr == NULL) return 1;
    ptr[0] = 999;
    
    // XAVF: Agar free(ptr) qilinmasa -> Xotira sizib chiqadi (Memory Leak)!
    free(ptr); // Xotirani ozod qilish shart
    ptr = NULL; // Dangling pointer bo'lmasligi uchun null ga tenglashtirish
    return 0;
}`
        }
      },
      {
        id: "1_3",
        title: "1.3. Operatsion tizimlar: Windows API va Linux Yadrosi (Kernel Syscalls)",
        content: `Dasturlar to'g'ridan-to'g'ri qattiq disk, tarmoq kartasi yoki RAM ga yozolmaydi. Ular operatsion tizim yadrosi (Kernel) orqali xavfsiz vositachilikda ishlaydi.

1. Foydalanuvchi rejimi (User Mode - Ring 3) va Yadro rejimi (Kernel Mode - Ring 0):
• User Mode: Oddiy dasturlar, brauzerlar, o'yinlar ishlaydigan xavfsiz izolyatsiyalangan muhit.
• Kernel Mode: Protsessorning barcha imkoniyatlari, apparat vositalari va jismoniy xotiraga to'liq ruxsat. Dastur yadroga faqat System Call (Tizim chaqiruvi) orqali murojaat qiladi.

2. Linux Yadrosi va Syscalls:
Linuxda har bir yadro harakati uchun tizim chaqiruvi mavjud:
• sys_read (Fayl yoki soketdan o'qish)
• sys_write (Chiqarish yoki tarmoqqa yuborish)
• sys_fork (Yangi jarayon yaratish)
• ptrace (Boshqa jarayonni tahlil qilish/audit - xakerlik va debag qilishda asosiy vosita).

3. Windows API (Win32):
Windows tizimida dasturchilar to'g'ridan-to'g'ri syscall emas, balki kernel32.dll, user32.dll, ntdll.dll kutubxonalari orqali ishlaydi:
• VirtualAlloc() / VirtualProtect(): Xotira sahifalarini ajratish va ruxsatlarini (RX, RWX) o'zgartirish.
• CreateRemoteThread(): DLL Injection kiberhujumida boshqa jarayon ichida yashirin kod ishga tushirish uchun ishlatiladi.`,
        keyPoints: [
          "Ring 0 = Kernel (to'liq ruxsat), Ring 3 = User space",
          "Syscall — dasturning operatsion tizim yadrosiga rasmiy murojaati",
          "DLL Injection boshqa jarayon xotirasiga suqilib kirishda ishlatiladi"
        ],
        codeSnippet: {
          language: "python",
          code: `# Python ctypes orqali Windows Win32 API ni chaqirish
import ctypes

user32 = ctypes.windll.user32
# Win32 MessageBoxA tizim chaqiruvini bajarish
user32.MessageBoxW(0, "KiberAkademiya Tizim Himoyasi Faol!", "Xavfsizlik Xabari", 0x40)`
        }
      }
    ],
    quiz: [
      {
        id: "q1_1",
        question: "Protsessorda keyingi bajarilishi lozim bo'lgan mashina buyrug'i manzilini saqlaydigan registr qaysi?",
        options: ["EAX (Akumulyator)", "ESP (Stack Pointer)", "EIP / RIP (Instruction Pointer)", "ECX (Counter)"],
        answer: 2,
        explanation: "EIP (32-bit) va RIP (64-bit) registrlari Instruction Pointer bo'lib, CPU aynan qaysi manzilni keyingi navbatda bajarishini belgilaydi."
      },
      {
        id: "q1_2",
        question: "Stack (Stak) xotirasining asosiy ishlash prinsipi qaysi?",
        options: ["FIFO (First In, First Out)", "LIFO (Last In, First Out)", "Tasodifiy kirish (Random Access)", "B-Tree tuzilmasi"],
        answer: 1,
        explanation: "Stack LIFO (Last In, First Out) prinsipi bo'yicha ishlaydi. Eng oxirgi qo'shilgan ma'lumot birinchi navbatda o'chiriladi."
      },
      {
        id: "q1_3",
        question: "C tilida dinamik xotira ajratilib, ish yakunida free() qilinmasa qanday muammo yuzaga keladi?",
        options: ["Segmentation Fault", "Memory Leak (Xotira sizishi)", "Buffer Overflow", "SQL Injection"],
        answer: 1,
        explanation: "Bo'shatilmagan xotira RAM da band bo'lib qoladi, bu hodisa Memory Leak (xotira sizib chiqishi) deb ataladi."
      },
      {
        id: "q1_4",
        question: "Xavfsizlik nuqtai nazaridan, oddiy dasturlar va ilovalar protsessorning qaysi halqasida (Ring) ishlaydi?",
        options: ["Ring 0 (Kernel Mode)", "Ring 1 (Device Drivers)", "Ring 2 (Hypervisor)", "Ring 3 (User Mode)"],
        answer: 3,
        explanation: "Oddiy foydalanuvchi dasturlari apparatga to'g'ridan-to'g'ri zarar yetkazmasligi uchun Ring 3 (User Mode) xavfsiz izolyatsiyasida ishlaydi."
      },
      {
        id: "q1_5",
        question: "Windows tizimida boshqa bir jarayon ichiga DLL in'ektsiya qilishda qaysi API funksiyasi keng qo'llaniladi?",
        options: ["CreateRemoteThread", "MessageBoxA", "GetSystemTime", "CloseHandle"],
        answer: 0,
        explanation: "CreateRemoteThread funksiyasi nishon jarayon xotirasida yangi oqim (thread) yaratib, begona DLL kodini ishga tushirishda ishlatiladi."
      }
    ]
  },
  {
    id: 2,
    title: "2-Modul: Kriptografiya va Algoritmlar",
    subtitle: "Bitwise amallar, Simmetrik (AES) va Asimmetrik (RSA) shifrlash, SHA-256 xesh",
    icon: "ShieldCheck",
    description: "Kriptografik himoya sirlari: ma'lumotlarni bit darajasida qayta ishlash, zamonaviy blokli shifrlash standartlari va raqamli imzolar.",
    video_url: "https://www.youtube.com/watch?v=jhXCTbFnK8o",
    video_title: "Kriptografiya asoslari: Simmetrik va Asimmetrik Shifrlash",
    topics: [
      {
        id: "2_1",
        title: "2.1. Bitwise amallar (XOR, AND, OR, SHIFT) va Kripto ahamiyati",
        content: `Kriptografiyaning asosi — bitlar ustida chaqmoqdek tez va qaytaruvchan amallarni bajarishdir.

1. Asosiy Bitwise amallar:
• AND (&): Ikkala bit ham 1 bo'lgandagina 1 qaytaradi. Filtrlash (maskalash) uchun ishlatiladi.
• OR (|): Hech bo'lmaganda bitta bit 1 bo'lsa 1 qaytaradi. Bayroqlarni yoqish uchun xizmat qiladi.
• XOR (^ - Eksklyuziv YOKI): Bitlar turli xil bo'lsa 1, bir xil bo'lsa 0 qaytaradi.
• SHIFT (<< va >>): Bitlarni chapga yoki o'ngga surish. Chapga surish 2 ga ko'paytirish, o'ngga surish 2 ga butunli bo'lishga teng.

2. Nima uchun XOR — Kriptografiya podshosi?
XOR amali mukammal simmetriyaga ega:
A ^ B = C bo'lsa, u holda C ^ B = A bo'ladi!
Ya'ni ochiq matnni kalit bilan XOR qilib shifrlaymiz, hosil bo'lgan shifr-matnni yana o'sha kalit bilan XOR qilsak, asl ochiq matn tiklanadi!
Bir martalik bloknot (One-Time Pad - OTP) aynan XOR ga asoslangan bo'lib, matematik jihatdan mutlaq buzilmas yagona shifrlash hisoblanadi.`,
        keyPoints: [
          "XOR operatsiyasi o'zini o'zi teskarilaydi: (A ^ K) ^ K = A",
          "Bitwise amallar protsessorda 1 taktda bajariladi",
          "Blokli va oqimli shifrlarning barchasida XOR asosiy o'rinda turadi"
        ],
        codeSnippet: {
          language: "python",
          code: `# Python'da Bitwise XOR shifrlash va deshifrlash
def xor_cipher(text: str, key: str) -> str:
    result = []
    for i, char in enumerate(text):
        k = key[i % len(key)]
        result.append(chr(ord(char) ^ ord(k)))
    return "".join(result)

original = "MaxfiyParol2026"
kalit = "CYBER"
shifrlangan = xor_cipher(original, kalit)
tiklangan = xor_cipher(shifrlangan, kalit) # Yana o'sha kalit bilan XOR!
print(f"Asl: {original} -> Tiklandi: {tiklangan}")`
        }
      },
      {
        id: "2_2",
        title: "2.2. Shifrlash turlari: Simmetrik (AES) va Asimmetrik (RSA) algoritmlar",
        content: `Zamonaviy axborot xavfsizligi ikki turdagi shifrlashdan birgalikda (Gibrid rejimda) foydalanadi.

1. Simmetrik shifrlash (AES - Advanced Encryption Standard):
• Xususiyati: Shifrlash va deshifrlash uchun bitta yagona maxfiy kalit ishlatiladi.
• Tezligi: O'ta tez va samarali. Katta hajmdagi ma'lumotlar, fayllar va qattiq disklarni shifrlashda qo'llaniladi.
• Blok o'lchami: 128 bit. Kalit o'lchamlari: AES-128 (10 raund), AES-192 (12 raund), AES-256 (14 raund).
• Muammo: Kalitni boshqa tomonga xavfsiz yetkazib berish (Key Distribution Problem).

2. Asimmetrik shifrlash (RSA, ECC):
• Xususiyati: Ikkita bog'liq kalit juftligidan foydalanadi:
  1. Ommaviy kalit (Public Key): Hamma uchun ochiq, ma'lumotni shifrlashda ishlatiladi.
  2. Maxfiy kalit (Private Key): Faqat egasida saqlanadi, shifrni yechishda ishlatiladi.
• Matematik asosi: Katta tub sonlarni bir-biriga ko'paytirish juda oson, biroq ularning ko'paytmasidan tub ko'paytuvchilarni topish (faktoriallash) o'ta murakkab.
• Ishlatilishi: HTTPS (TLS), SSH, raqamli imzo va simmetrik kalitlarni almashish.`,
        keyPoints: [
          "AES simmetrik: bitta kalit, o'ta tez, katta fayllar uchun",
          "RSA asimmetrik: 2 ta kalit (Public / Private), kalit almashish uchun",
          "HTTPS (TLS) da RSA orqali AES kaliti almashiladi (Gibrid tizim)"
        ],
        codeSnippet: {
          language: "python",
          code: `# Kriptotizimlarning ishlash mantig'i:
# 1. Alisa Bobga xabar yozmoqchi:
# 2. Alisa Bobning Public Key ini oladi va xabarni shifrlaydi.
# 3. Yo'lda hamma (xakerlar ham) shifrlangan matnni ko'ra oladi, ammo yecholmaydi.
# 4. Bob o'zining Private Keyi bilan xabarni ochadi!`
        }
      },
      {
        id: "2_3",
        title: "2.3. Xesh funksiyalar (SHA-256, HMAC) va Raqamli Imzo",
        content: `Shifrlash ma'lumotni maxfiy saqlasa, xeshlash uning butunligi (Integrity) buzilmaganini kafolatlaydi.

1. Kriptografik Xesh Funksiyasi nima?
Ixtiyoriy hajmdagi kiruvchi ma'lumotni qat'iy belgilangan uzunlikdagi (masalan, SHA-256 da 256 bit / 64 ta hex belgisi) unikal qolipga o'tkazuvchi bir tomonlama funksiya.
• Bir tomonlamalik: Xeshdan dastlabki matnni matematik hisoblab qaytarib bo'lmaydi.
• Ko'chki effekti (Avalanche Effect): Matnda bitta vergul yoki harf o'zgarsa, hosil bo'lgan xesh butunlay o'zgarib ketadi.
• Kolliziyaga chidamlilik: Bir xil xesh beruvchi ikkita turli matnni topish imkonsiz bo'lishi lozim (MD5 va SHA-1 eskirgan, xavfli).

2. Raqamli Imzo (Digital Signature):
Hujjatning xeshi olinadi va jo'natuvchining maxfiy kaliti (Private Key) bilan shifrlanadi.
Qabul qiluvchi uni jo'natuvchining ommaviy kaliti (Public Key) orqali tekshiradi:
1. Ma'lumot yo'lda o'zgarmaganligi isbotlanadi.
2. Jo'natuvchi o'z imzosini inkor eta olmaydi (Non-repudiation).`,
        keyPoints: [
          "Xesh bir tomonlama (hash -> text ga qaytib bo'lmaydi)",
          "SHA-256 uzunligi har doim 64 ta hex belgi (256 bit)",
          "Raqamli imzo = Hujjat xeshi + Shaxsiy maxfiy kalit"
        ],
        codeSnippet: {
          language: "python",
          code: `import hashlib

matn = "O'zbekiston Kiberxavfsizlik Markazi"
# SHA-256 xeshini hisoblash
xesh = hashlib.sha256(matn.encode('utf-8')).hexdigest()
print(f"Xesh: {xesh}")
# Bitta harf o'zgarsa:
xesh2 = hashlib.sha256((matn + "!").encode('utf-8')).hexdigest()
print(f"Yangi xesh (Ko'chki effekti): {xesh2}")`
        }
      }
    ],
    quiz: [
      {
        id: "q2_1",
        question: "A ^ B = C bo'lsa, qaysi amal orqali asl A qiymatini qayta tiklash mumkin?",
        options: ["C & B", "C | B", "C ^ B", "C >> B"],
        answer: 2,
        explanation: "XOR amali o'z-o'zini tiklovchi xususiyatga ega: (A ^ B) ^ B = A bo'ladi."
      },
      {
        id: "q2_2",
        question: "AES-256 shifrlash algoritmining kalit uzunligi necha bitni tashkil etadi?",
        options: ["64 bit", "128 bit", "256 bit", "512 bit"],
        answer: 2,
        explanation: "AES-256 algoritmi 256 bitli kalitdan foydalanadi va 14 bosqichli (round) o'zgartirishlardan iborat."
      },
      {
        id: "q2_3",
        question: "Asimmetrik kriptotizimda (masalan, RSA) xabarni shifrlash uchun qaysi kalit ishlatiladi?",
        options: ["Qabul qiluvchining ommaviy kaliti (Public Key)", "Jo'natuvchining maxfiy kaliti (Private Key)", "Umumiy simmetrik kalit", "Faqat sessiya tokeni"],
        answer: 0,
        explanation: "Xabarni maxfiy yuborish uchun qabul qiluvchining hamma biladigan ommaviy kaliti (Public Key) ishlatiladi, faqat u o'zining shaxsiy maxfiy kaliti bilan o'qiy oladi."
      },
      {
        id: "q2_4",
        question: "Kriptografik xesh funksiyasining qaysi xususiyati sababli dastlabki matndagi kichik o'zgarish xeshni tubdan o'zgartiradi?",
        options: ["Ko'chki effekti (Avalanche effect)", "Kolliziya hodisasi", "Kvant noaniqligi", "Asimmetrik o'tish"],
        answer: 0,
        explanation: "Avalanche effect (ko'chki effekti) kiruvchi ma'lumotning minimal o'zgarishi natijada 50% dan ortiq bitlarning o'zgarishiga olib kelishini ta'minlaydi."
      },
      {
        id: "q2_5",
        question: "Raqamli imzo yaratishda ma'lumot xeshi jo'natuvchining qaysi kaliti bilan shifrlanadi?",
        options: ["Ommaviy kalit (Public Key)", "Shaxsiy maxfiy kalit (Private Key)", "Sertifikat markazi kaliti", "AES kaliti"],
        answer: 1,
        explanation: "Imzo qo'yuvchi shaxs o'z shaxsiy maxfiy kaliti (Private Key) orqali xeshni shifrlaydi. Boshqalar esa uning ommaviy kaliti bilan buni tasdiqlaydi."
      }
    ]
  },
  {
    id: 3,
    title: "3-Modul: Tarmoq protokollari va Analitika",
    subtitle: "TCP/IP, OSI modellari, 3-bosqichli qo'l berish, Wireshark va Scapy paket tahlili",
    icon: "Network",
    description: "Internet qanday ishlaydi: tarmoq qatlamlari, paketlar anatomiyasi, Wireshark tahlili va Scapy orqali paketlarni qo'lda yasash.",
    video_url: "https://www.youtube.com/watch?v=0w5uY7v5Uvg",
    video_title: "Tarmoq Protokollari: OSI va TCP/IP 3-Way Handshake",
    topics: [
      {
        id: "3_1",
        title: "3.1. OSI va TCP/IP modellari, 3-bosqichli qo'l berish (Three-way Handshake)",
        content: `Internet orqali uzatiladigan har qanday ma'lumot qatlamlar bo'ylab o'tadi va sarlavhalar (headers) bilan o'raladi (Encapsulation).

1. OSI 7 qatlamli modeli:
1. Fizik (Physical): Kabellar, radio to'lqinlar, bitlar oqimi.
2. Kanal (Data Link): MAC manzillar, Ethernet kadrlar (Frames), Switchlar.
3. Tarmoq (Network): IP manzillar, marshrutlash (Routers), Paketlar (Packets).
4. Transport: Portlar, ishonchlilik (TCP) yoki tezlik (UDP), Segmentlar.
5. Seans (Session): Aloqa sessiyalarini boshqarish.
6. Taqdimot (Presentation): Shifrlash (TLS), ma'lumot formatlari (JSON, JPEG).
7. Ilova (Application): HTTP, DNS, SSH, FTP protokollari.

2. TCP 3-bosqichli qo'l berish (Three-way Handshake):
Ishonchli aloqa o'rnatish uchun mijoz va server o'rtasida 3 ta bayroq almashiladi:
1. Mijoz -> Server [SYN]: Aloqa o'rnatish so'rovi va boshlang'ich ketma-ketlik raqami (ISN - Sequence Number).
2. Server -> Mijoz [SYN-ACK]: Server so'rovni qabul qilganini bildiradi (Acknowledgement) va o'z ketma-ketlik raqamini yuboradi.
3. Mijoz -> Server [ACK]: Mijoz server javobini tasdiqlaydi. Aloqa o'rnatildi, ma'lumot almashinuvi boshlanadi!

Kiberhujum (SYN Flood): Xaker serverga millionlab soxta IP lardan SYN yuboradi, ammo oxirgi ACK ni yubormaydi. Server yarim ochiq ulanishlarni kutib xotirasi to'ladi va qulaydi (DoS).`,
        keyPoints: [
          "OSI 7 ta qatlam, TCP/IP esa 4 ta amaliy qatlamdan iborat",
          "TCP: SYN -> SYN-ACK -> ACK ketma-ketligi",
          "SYN Flood xuruji server navbatini to'ldirishga asoslanadi"
        ],
        codeSnippet: {
          language: "text",
          code: `[Mijoz: 192.168.1.10]               [Server: 93.184.216.34:80]
       |                                          |
       | ------- STEP 1: [SYN] Seq=1000 --------> | (Aloqa o'rnatamizmi?)
       |                                          |
       | <--- STEP 2: [SYN-ACK] Seq=5000 Ack=1001 | (Ha, tayyorman!)
       |                                          |
       | ------- STEP 3: [ACK] Ack=5001 --------> | (Ulanish tasdiqlandi!)
       |                                          |
       ================== ULANISH FAOL ==================`
        }
      },
      {
        id: "3_2",
        title: "3.2. Tarmoq paketlarini tahlil qilish: Wireshark va Scapy arxitekturasi",
        content: `Kiberxavfsizlik mutaxassisi tarmoq orqali o'tayotgan har bir baytni tahlil qila olishi shart.

1. Wireshark - Tarmoq Snifferi:
Wireshark tarmoq interfeysini "Promiscuous Mode" ga o'tkazib, u orqali o'tayotgan barcha paketlarni ushlab oladi (pcap fayllar).
• Asosiy filtrlash sintaksisi:
  • ip.addr == 192.168.1.1 - Muayyan IP bo'yicha paketlar.
  • tcp.port == 443 - HTTPS trafigi.
  • http.request.method == "POST" - Saytga yuborilayotgan login/parollar.
  • tcp.flags.syn == 1 and tcp.flags.ack == 0 - Yangi boshlanayotgan ulanishlar.

2. Python Scapy - Paketlar Injiniringi:
Scapy — Python kutubxonasi bo'lib, ixtiyoriy tarmoq paketini noldan yasash, yuborish va javoblarni tahlil qilish imkonini beradi:
Paket sarlavhalarini bir-biriga '/' operatori orqali ulash mumkin: IP() / TCP() / Raw().`,
        keyPoints: [
          "Wireshark tarmoq paketlarini ushlab tahlil qiladi",
          "Scapy dasturiy tarzda xohlagan bayroqli paketlarni generatsiya qiladi",
          "Shifrlanmagan HTTP/FTP protokollaridagi barcha parollar ko'rinib qoladi"
        ],
        codeSnippet: {
          language: "python",
          code: `# Python Scapy orqali maxsus TCP SYN paketi yasash
from scapy.all import IP, TCP, sr1

# 80-port (HTTP) ga SYN paketi yuborish
paket = IP(dst="192.168.1.50") / TCP(dport=80, flags="S")
javob = sr1(paket, timeout=2)

if javob and javob.haslayer(TCP):
    if javob[TCP].flags == 0x12: # SYN-ACK qaytsa
        print("80-port ochiq va xizmat ko'rsatmoqda!")
    elif javob[TCP].flags == 0x14: # RST-ACK qaytsa
        print("Port yopiq!")`
        }
      },
      {
        id: "3_3",
        title: "3.3. Portlar, Marshrutlash (Routing) va Tarmoq Xavfsizligi",
        content: `Har bir kompyuterda 0 dan 65535 gacha bo'lgan mantiqiy darvozalar — Portlar mavjud.

1. Standart Xavfsizlik Portlari:
• 21: FTP (Ochiq matnli fayl uzatish - xavfli)
• 22: SSH (Xavfsiz shifrlangan masofaviy boshqaruv)
• 53: DNS (Domen nomlarini IP ga aylantirish)
• 80: HTTP (Shifrlanmagan veb-sahifalar)
• 443: HTTPS (TLS/SSL bilan shifrlangan veb)
• 3389: RDP (Windows masofaviy ish stoli)

2. Tarmoq xavfsizligi mezonlari:
• NAT (Network Address Translation): Mahalliy (Local) xususiy IP larni yagona Ommaviy (Public) IP ga o'girish.
• Firewall (Xavfsizlik devori): Paketlarni IP, Port va protokollar bo'yicha saralovchi (Allow/Block) himoya qalqoni.
• DMZ (Demilitarized Zone): Ommaviy serverlarni (Web, Mail) ichki korporativ tarmoqdan ajratib turuvchi xavfsiz bufer hudud.`,
        keyPoints: [
          "0-1023: Tizim portlari (Well-known ports)",
          "Firewall qoidalari kiruvchi (Inbound) va chiquvchi (Outbound) trafikni nazorat qiladi",
          "DMZ ichki tarmoqni tashqi hujumlardan ihotalaydi"
        ]
      }
    ],
    quiz: [
      {
        id: "q3_1",
        question: "TCP aloqasini o'rnatishda (3-way handshake) ikkinchi qadamda server qanday bayroq qaytaradi?",
        options: ["SYN", "ACK", "SYN-ACK", "FIN-ACK"],
        answer: 2,
        explanation: "Server mijozning SYN so'rovini qabul qilib, o'zining SYN va ACK bayroqlarini birgalikda (SYN-ACK) qaytaradi."
      },
      {
        id: "q3_2",
        question: "OSI modelining qaysi qatlamida IP manzillash va marshrutlash (Routing) amalga oshiriladi?",
        options: ["2-qatlam: Kanal (Data Link)", "3-qatlam: Tarmoq (Network)", "4-qatlam: Transport", "7-qatlam: Ilova"],
        answer: 1,
        explanation: "Tarmoq (Network) qatlami IP manzillar orqali paketlarni manzilga yetkazib berish va marshrutlashni boshqaradi."
      },
      {
        id: "q3_3",
        question: "Wireshark dasturida faqat 443-port orqali o'tuvchi trafikni ko'rish uchun qanday filtr yoziladi?",
        options: ["port:443", "tcp.port == 443", "ip.port = 443", "filter(443)"],
        answer: 1,
        explanation: "Wireshark displey filtrlash tili bo'yicha 'tcp.port == 443' sintaksisi qo'llaniladi."
      },
      {
        id: "q3_4",
        question: "SSH (Secure Shell) xavfsiz boshqaruv protokoli odatda qaysi standart portdan foydalanadi?",
        options: ["21", "22", "80", "443"],
        answer: 1,
        explanation: "SSH protokoli sukut bo'yicha 22-portda ishlaydi."
      },
      {
        id: "q3_5",
        question: "Hujumchi serverga millionlab SYN so'rovlarini yuborib, ulanishni oxiriga yetkazmasdan tizimni to'ldirib qo'yishi qanday nomlanadi?",
        options: ["SQL Injection", "XSS attack", "SYN Flood (DoS)", "Man-in-the-Middle"],
        answer: 2,
        explanation: "SYN Flood hujumida server kutish navbatida to'lib ketadi va qonuniy foydalanuvchilarga xizmat ko'rsata olmay qoladi."
      }
    ]
  },
  {
    id: 4,
    title: "4-Modul: Veb-xavfsizlik va Zaifliklar Tahlili",
    subtitle: "OWASP Top 10, SQL Injection, XSS, CSRF, IDOR va Secure Coding tamoyillari",
    icon: "GlobeLock",
    description: "Veb-ilovalar xavfsizligi: zamonaviy ekspluatatsiyalar, zaifliklarni aniqlash va himoyalangan kod yozish qoidalari.",
    video_url: "https://www.youtube.com/watch?v=Fj-Jz1zVv0Y",
    video_title: "OWASP Top 10: SQL Injection va XSS Zaifliklari Tahlili",
    topics: [
      {
        id: "4_1",
        title: "4.1. OWASP Top 10 konseptlari: SQL Injection va IDOR mohiyati",
        content: `OWASP (Open Web Application Security Project) — har yili eng xavfli kiberzaifliklar ro'yxatini e'lon qilib boruvchi jahon tashkiloti.

1. SQL Injection (SQLi):
Foydalanuvchi kiritgan ma'lumotlar filtrlanmasdan to'g'ridan-to'g'ri ma'lumotlar bazasi so'roviga ulanib ketganda sodir bo'ladi.
• Zaif kod namunasi:
  query = f"SELECT * FROM users WHERE user = '{username}' AND pass = '{password}'"
• Hujum payload: username maydoniga ' OR '1'='1' -- kiritilsa:
  SELECT * FROM users WHERE user = '' OR '1'='1' -- AND pass = '...'
  Natijada shart har doim TO'G'RI (TRUE) bo'ladi va tajovuzkor parolsiz administrator sifatida tizimga kirib oladi!
• Himoyalanish: Hech qachon string konkatenatsiya qilmang! Parametrli so'rovlar (Prepared Statements) dan foydalaning:
  cursor.execute("SELECT * FROM users WHERE user = ? AND pass = ?", (username, password))

2. IDOR (Insecure Direct Object References):
Foydalanuvchi huquqlari tekshirilmasdan URL dagi identifikator (ID) orqali boshqa foydalanuvchilarning maxfiy ma'lumotlariga ruxsatsiz kirish zaifligi.
• Misol: Foydalanuvchi hisob-fakturasini ko'rish havolasi: https://bank.uz/invoice?id=1055
• Hujumchi ID ni 1054 yoki 1056 ga o'zgartirsa va tizim egasining sessiyasini tekshirmasdan begona hisobni ko'rsatib bersa — bu klassik IDOR hisoblanadi.`,
        keyPoints: [
          "SQL Injection dan himoya: Prepared Statements (Parametrlangan so'rovlar)",
          "IDOR: Server tomonida sessiya va foydalanuvchi huquqini tekshirish",
          "Kiruvchi barcha ma'lumotlar (user input) 'nopok' deb hisoblanishi shart"
        ],
        codeSnippet: {
          language: "python",
          code: `# XAVFSIZ VA ZAIF KOD SOLISHTIRUVI

# ❌ ZAIF USUL (SQL Injection mavjud):
query = f"SELECT * FROM accounts WHERE acc_id = {user_input}"
cursor.execute(query)

# ✅ XAVFSIZ USUL (Prepared Statement):
query = "SELECT * FROM accounts WHERE acc_id = ? AND owner_id = ?"
cursor.execute(query, (user_input, current_user.id))`
        }
      },
      {
        id: "4_2",
        title: "4.2. XSS (Cross-Site Scripting) va CSRF (Cross-Site Request Forgery)",
        content: `Brauzer foydalanuvchiga tegishli cookie-fayllar va sessiya tokenlarini o'zida saqlaydi. Ushbu zaifliklar aynan shularni o'g'irlashga qaratilgan.

1. XSS (Saytlararo skript yozish):
Hujumchi veb-sahifaga o'zining zararli JavaScript kodini joylashtiradi, boshqa qonuniy foydalanuvchi sahifani ochganda bu kod uning brauzerida ishga tushadi:
• Zarari: Foydalanuvchining document.cookie (sessiya tokenlari) o'g'irlanadi.
• Turlari:
  • Stored XSS (Saqlanuvchi): Izohlar yoki forumda ma'lumotlar bazasiga yozilib qoladi.
  • Reflected XSS (Qaytuvchi): Qidiruv so'rovi yoki URL parametri orqali keladi.
  • DOM-based XSS: Brauzerning o'zida JS logika xatosi sabab yuzaga keladi.
• Himoyalanish: Barcha kiruvchi ma'lumotlarni HTML-entitilarga aylantirish (HTML Escaping: < -> &lt;) va HttpOnly cookie bayrog'ini yoqish.

2. CSRF (Saytlararo so'rov soxtalashtirish):
Foydalanuvchi o'z bank saytida avtorizatsiyadan o'tgan paytda, boshqa zararlangan saytga kirsa, u yerdan yashirincha foydalanuvchi nomidan pul o'tkazish so'rovi yuboriladi.
• Himoyalanish: Har bir POST so'roviga tasodifiy, oldindan taxmin qilib bo'lmaydigan Anti-CSRF token biriktirish va Cookie larda SameSite=Strict parametrini o'rnatish.`,
        keyPoints: [
          "XSS brauzerda tajovuzkor JavaScript kodini ishga tushiradi",
          "HttpOnly cookie bayrog'i JavaScript ga tokenni ko'rsatmaydi",
          "CSRF tokenlari so'rov haqiqatan ham shu sahifadan yuborilganini tasdiqlaydi"
        ]
      },
      {
        id: "4_3",
        title: "4.3. HTTP sarlavhalari va Brauzer Xavfsizlik Siyosatlari (CORS, CSP)",
        content: `Brauzer bir veb-saytning resurslari boshqa begona sayt tomonidan o'zboshimchalik bilan ishlatilishini cheklash uchun qat'iy qoidalarga ega.

1. CSP (Content Security Policy):
Server tomonidan jo'natiladigan maxsus HTTP sarlavhasi bo'lib, sahifada qaysi manbalardan (domendan) skriptlar, stillar va rasmlar yuklanishi mumkinligini qat'iy belgilaydi:
Content-Security-Policy: default-src 'self'; script-src 'self' https://trustedscripts.uz;
Bu XSS hujumlarini deyarli butunlay zararsizlantiradi, chunki begona serverdagi zararli JS faylni brauzer bloklaydi.

2. CORS (Cross-Origin Resource Sharing):
SOP (Same-Origin Policy) bo'yicha bir domen (a.uz) ikkinchi domen (b.uz) API siga to'g'ridan-to'g'ri AJAX so'rov yuborolmaydi. CORS sarlavhalari serverga qaysi tashqi domenlarga o'z API sidan foydalanishga ruxsat berishini ko'rsatish imkonini beradi:
• Access-Control-Allow-Origin: https://hamkor.uz
• Xavfli xato: Access-Control-Allow-Origin: * qilib, maxfiy ma'lumotlarni ommaga ochib qo'yish.`,
        keyPoints: [
          "CSP sarlavhasi ruxsat berilgan domenlar ro'yxatini belgilaydi",
          "CORS o'zboshimchalik bilan API ga ulanishni taqiqlaydi",
          "X-Frame-Options: DENY clickjacking hujumlaridan himoya qiladi"
        ]
      }
    ],
    quiz: [
      {
        id: "q4_1",
        question: "SQL Injection zaifligidan himoyalanishning eng ishonchli va to'g'ri usuli qaysi?",
        options: ["Parollarni MD5 bilan shifrlash", "Parametrli so'rovlar (Prepared Statements) dan foydalanish", "So'rovlarni faqat GET orqali yuborish", "CAPTCHA o'rnatish"],
        answer: 1,
        explanation: "Parametrli so'rovlar foydalanuvchi kiritgan ma'lumotni buyruq sifatida emas, balki shunchaki xom matn sifatida qabul qilib, SQL in'ektsiyani butunlay yo'q qiladi."
      },
      {
        id: "q4_2",
        question: "XSS (Cross-Site Scripting) hujumida tajovuzkor qurbonning brauzerida qanday kodni ishga tushirishga intiladi?",
        options: ["SQL skript", "JavaScript", "Python bytecode", "Assembly ko'rsatkich"],
        answer: 1,
        explanation: "XSS hujumi orqali jabrlanuvchi brauzerida zararli JavaScript kodi bajariladi va sessiya ma'lumotlari o'g'irlanadi."
      },
      {
        id: "q4_3",
        question: "Cookie fayllarini JavaScript (document.cookie) orqali o'g'irlanishidan himoya qiluvchi bayroq qaysi?",
        options: ["Secure", "HttpOnly", "SameSite", "Max-Age"],
        answer: 1,
        explanation: "HttpOnly bayrog'i o'rnatilgan cookie-fayllarga JavaScript orqali murojaat qilib bo'lmaydi, bu esa XSS orqali sessiyani o'g'irlashni oldini oladi."
      },
      {
        id: "q4_4",
        question: "Foydalanuvchi URL dagi ID ni o'zgartirish orqali boshqa mijozlarning maxfiy hujjatlariga ruxsatsiz kira olish zaifligi nima deb ataladi?",
        options: ["CSRF", "IDOR", "DDoS", "Buffer Overflow"],
        answer: 1,
        explanation: "IDOR (Insecure Direct Object References) — ob'ekt identifikatoriga to'g'ridan-to'g'ri va ruxsatsiz murojaat qilish zaifligidir."
      },
      {
        id: "q4_5",
        question: "Brauzerda begona manbalardan ruxsatsiz skriptlar yuklanishini taqiqlovchi asosiy xavfsizlik sarlavhasi qaysi?",
        options: ["Content-Security-Policy (CSP)", "X-Frame-Options", "User-Agent", "Set-Cookie"],
        answer: 0,
        explanation: "Content-Security-Policy (CSP) brauzerga qaysi manbalardan skriptlar yuklanishiga ruxsat berilganligini buyuradi."
      }
    ]
  },
  {
    id: 5,
    title: "5-Modul: Tizimlar Auditi va Himoya Strategiyalari",
    subtitle: "Xavfsizlik auditi, Log tahlil, Incident Response, IDS/IPS va Korporativ himoya",
    icon: "ShieldAlert",
    description: "Kiberhimoya qalqoni: kiberhodisalarni aniqlash, SIEM tizimlari, log tahlili va tahdidlarga zudlik bilan javob berish.",
    video_url: "https://www.youtube.com/watch?v=7uU73g1o7gE",
    video_title: "Tizimlar Auditi va Incident Response Bosqichlari",
    topics: [
      {
        id: "5_1",
        title: "5.1. Tarmoq va Server Auditini o'tkazish metodologiyalari",
        content: `Xavfsizlik auditi — tizimdagi mavjud teshiklar va zaifliklarni hujumchilardan oldin aniqlash va bartaraf etish jarayonidir.

1. Tekshiruv turlari:
• Black Box (Qora quti): Audit o'tkazuvchiga tizim haqida hech qanday ichki ma'lumot berilmaydi. Haqiqiy tashqi xaker ko'zi bilan tekshiriladi.
• White Box (Oq quti): Manba kodlari, arxitektura chizmalari va tarmoq topologiyasi to'liq taqdim etiladi. Eng chuqur audit turi.
• Gray Box (Kulrang quti): Cheklangan ma'lumot (masalan, oddiy foydalanuvchi hisobi) bilan tekshirish.

2. Standart bosqichlar:
1. Reconnaissance (Razvedka): Ochiq manbalar (OSINT), IP diapazonlar, DNS yozuvlarini yig'ish.
2. Scanning (Skanerlash): Nmap orqali ochiq portlar va xizmatlar versiyalarini aniqlash.
3. Vulnerability Assessment: OpenVAS, Nessus yordamida zaifliklar mavjudligini avtomatlashtirilgan qidirish.
4. Exploitation & Reporting: Topilgan kamchiliklarni tekshirish va tuzatish bo'yicha rahbariyatga hisobot tayyorlash.`,
        keyPoints: [
          "Black Box tashqi xaker simulyatsiyasi",
          "White Box kod va arxitekturani to'liq tekshiradi",
          "Auditor natijalari bo'yicha tuzatish rejasi (Remediation) tuziladi"
        ]
      },
      {
        id: "5_2",
        title: "5.2. Jurnal yozuvlari (Log Analysis) va Incident Response bosqichlari",
        content: `Hujumni o'z vaqtida aniqlash — muvaffaqiyatli himoyaning 90% ini tashkil qiladi.

1. Log Tahlili va SIEM:
Tizimlar o'z faoliyatini loglarda aks ettiradi:
• Linux: /var/log/auth.log (SSH va login urinishlari), /var/log/syslog
• Windows: Event Viewer (Event ID 4624: Muvaffaqiyatli kirish, 4625: Noto'g'ri parol).
• SIEM tizimlari (Splunk, Elastic SIEM, Wazuh): Barcha serverlar loglarini bir joyga to'playdi va shubhali xatti-harakatlarni aniqlab signal beradi.

2. PICERL Metodologiyasi (Incident Response 6 bosqichi):
1. Preparation (Tayyorgarlik): Zaxira nusxalari, xodimlar treningi.
2. Identification (Aniqlash): Hujum sodir bo'lganini payqash.
3. Containment (Mahalliylashtirish): Zararlangan serverni tarmoqdan uzish.
4. Eradication (Yo'q qilish): Malware va backdoors ni butunlay o'chirish.
5. Recovery (Tiklash): Tizimni zaxira nusxadan qayta tiklash.
6. Lessons Learned (Xulosa): Xatolardan saboq chiqarish.`,
        keyPoints: [
          "Event ID 4625: Noto'g'ri parol kiritilgan",
          "Containment (izolyatsiya) tarqalishni to'xtatadi",
          "SIEM korrelyatsiya qoidalariga tayanadi"
        ]
      },
      {
        id: "5_3",
        title: "5.3. Himoya vositalari: IDS/IPS, Firewall va Autentifikatsiya protokollari",
        content: `Perimetr xavfsizligini ta'minlash uchun apparat va dasturiy komplekslar o'rnatiladi.

1. IDS (Intrusion Detection) va IPS (Intrusion Prevention):
• IDS (Snort, Suricata): Tarmoq trafigini kuzatadi, zararli naqshlarni (Signatures) qidiradi va faqat ogohlantirish (Alert) beradi.
• IPS: Bevosita trafik yo'lida turadi va hujumni ko'rishi bilanoq paketlarni bloklaydi.

2. Korporativ Autentifikatsiya protokollari:
• Kerberos: Windows Active Directory asosiy protokoli bo'lib, parollarni uzatmasdan, biletlar (TGT) orqali yagona kirishni (SSO) ta'minlaydi.
• OAuth 2.0 & OpenID Connect: Foydalanuvchi parolini bermasdan ruxsat berish (Token) va autentifikatsiya qilish standarti.`,
        keyPoints: [
          "IDS ogohlantiradi, IPS bloklaydi",
          "Kerberos chiptalar (TGT) orqali parollarni tarmoqqa chiqarmaydi",
          "OAuth 2.0 uchinchi tomon ilovalariga xavfsiz ruxsat beradi"
        ]
      }
    ],
    quiz: [
      {
        id: "q5_1",
        question: "Auditorga tizim manba kodlari, arxitekturasi va tarmoq tuzilmasi to'liq taqdim etiladigan tekshiruv turi qanday ataladi?",
        options: ["Black Box", "White Box", "Blind Test", "Stress Test"],
        answer: 1,
        explanation: "White Box (Oq quti) auditida mutaxassis barcha ichki hujjatlar va dastur kodlariga to'liq kirish huquqiga ega bo'ladi."
      },
      {
        id: "q5_2",
        question: "Windows tizimlarida muvaffaqiyatsiz (noto'g'ri) autentifikatsiya urinishlarini ko'rsatuvchi Event ID qaysi?",
        options: ["Event ID 4624", "Event ID 4625", "Event ID 1000", "Event ID 7036"],
        answer: 1,
        explanation: "Windows Security loglarida Event ID 4625 noto'g'ri parol yoki login kiritilganini bildiradi."
      },
      {
        id: "q5_3",
        question: "Kiberhodisalarga javob berish (Incident Response) ning qaysi bosqichida zararlangan kompyuter tarmoqdan uzib qo'yiladi?",
        options: ["Preparation", "Identification", "Containment (Mahalliylashtirish)", "Lessons Learned"],
        answer: 2,
        explanation: "Containment (mahalliylashtirish) bosqichida zararli dastur boshqa serverlarga tarqalmasligi uchun tizim izolyatsiya qilinadi."
      },
      {
        id: "q5_4",
        question: "IDS va IPS tizimlarining asosiy tub farqi nimada?",
        options: ["IDS faqat ogohlantiradi, IPS esa hujumni faol bloklaydi", "IDS apparat, IPS esa faqat dastur", "IPS simsiz ishlaydi", "Hech qanday farqi yo'q"],
        answer: 0,
        explanation: "IDS (Detection) hujumni faqat aniqlab signal beradi, IPS (Prevention) esa trafik yo'lida turib uni to'xtatadi."
      },
      {
        id: "q5_5",
        question: "Windows Active Directory muhitida chiptalar (tickets) orqali xavfsiz autentifikatsiyani ta'minlovchi protokol qaysi?",
        options: ["Kerberos", "Telnet", "HTTP", "SNMPv1"],
        answer: 0,
        explanation: "Kerberos protokoli tarmoqda parollarni uzatmasdan, TGT chiptalari yordamida o'zaro ishonchli autentifikatsiyani amalga oshiradi."
      }
    ]
  },
  {
    id: 6,
    title: "6-Modul: Interaktiv Test va Yakuniy Imtihon",
    subtitle: "Kiberxavfsizlik bo'yicha keng qamrovli sinov, sertifikatlash va bilimlar auditi",
    icon: "Award",
    description: "Yakuniy xavfsizlik sinovi: barcha 5 ta modul bo'yicha kompleks savollar. 80% dan yuqori natija ko'rsatgan o'quvchi Kiber Mutaxassis unvonini qo'lga kiritadi.",
    video_url: "https://www.youtube.com/watch?v=inWWhr5tnEA",
    video_title: "Kiberxavfsizlik Karyerasi va Yakuniy Imtihon Tahlili",
    topics: [
      {
        id: "6_1",
        title: "6.1. Yakuniy Imtihon Nizomi va Baholash Standartlari",
        content: `Tabriklaymiz! Siz KiberAkademiya platformasining 5 ta asosiy bo'limini muvaffaqiyatli yakunladingiz. Ushbu modul barcha o'rganilgan nazariy va amaliy bilimlarni jamlovchi yakuniy sinov hisoblanadi.

Imtihon shartlari:
• Imtihon barcha modullarni qamrab oluvchi 5 ta muhim amaliy va tahliliy savollardan iborat.
• Muvaffaqiyatli yakunlash uchun kamida 80% to'g'ri javob (4/5) to'plashingiz talab etiladi.
• Imtihondan muvaffaqiyatli o'tganingizda profilingizga 250 XP va 'Elita Kiber Himoyachi' faxriy unvoni beriladi!`,
        keyPoints: [
          "Barcha modullar bo'yicha kompleks savollar",
          "80% dan yuqori natija — Kiber Mutaxassis sertifikati",
          "Profilga qo'shimcha 250 XP taqdim etiladi"
        ]
      }
    ],
    quiz: [
      {
        id: "q6_1",
        question: "Xotirada bufer to'lib ketishi (Buffer Overflow) hujumida xaker qaysi registr qiymatini o'zgartirib dastur ijrosini boshqaradi?",
        options: ["EAX", "ECX", "EIP / RIP", "EDX"],
        answer: 2,
        explanation: "EIP/RIP (Instruction Pointer) keyingi mashina buyrug'i manzilini saqlaydi, uni o'zgartirish dastur boshqaruvini qo'lga kiritish demakdir."
      },
      {
        id: "q6_2",
        question: "Xabar butunligi (Integrity) buzilmaganligini tekshirish uchun quyidagilardan qaysi biri qo'llaniladi?",
        options: ["Kriptografik xesh (masalan, SHA-256)", "Base64 kodlash", "Rot13 shifrlash", "Faylni siqish (ZIP)"],
        answer: 0,
        explanation: "Kriptografik xesh funksiyalari (SHA-256) xabarning har qanday o'zgarishini ko'rsatib beradi."
      },
      {
        id: "q6_3",
        question: "Wireshark orqali tahlil qilinganda TCP ulanishini bekor qilish va uzish uchun qaysi bayroq qo'llaniladi?",
        options: ["SYN", "ACK", "FIN yoki RST", "URG"],
        answer: 2,
        explanation: "Ulanishni normal yakunlash uchun FIN, zudlik bilan majburiy uzish uchun esa RST (Reset) bayrog'i yuboriladi."
      },
      {
        id: "q6_4",
        question: "Veb-ilovada foydalanuvchidan olingan qiymatni to'g'ridan-to'g'ri SQL so'roviga birlashtirish (string formatting) qanday xavf tug'diradi?",
        options: ["SQL Injection", "XSS", "DDoS", "DNS Spoofing"],
        answer: 0,
        explanation: "Foydalanuvchi ma'lumotini tekshiruvsiz SQL so'roviga qo'shish bevosita SQL Injection zaifligini keltirib chiqaradi."
      },
      {
        id: "q6_5",
        question: "Korporativ tarmoq xavfsizligida barcha server va qurilmalarning loglarini yig'ib tahlil qiluvchi tizim qanday ataladi?",
        options: ["SIEM (Security Information and Event Management)", "DNS kesh", "DHCP server", "FTP server"],
        answer: 0,
        explanation: "SIEM tizimlari barcha tizimlardan jurnal yozuvlarini yagona markazga to'plab korrelyatsiya qiladi."
      }
    ]
  }
];
