# KiberAkademiya - Kiberxavfsizlik va CS Tizimlari (PyQt6 Desktop MVP)

Kompyuter arxitekturasi va Computer Science asoslaridan boshlab, algoritmlar, kriptografiya, tarmoq tahlili, veb-xavfsizlik (OWASP Top 10) hamda tizim himoyasi asoslarigacha o‘rgatuvchi 100% o‘zbek tilidagi mukammal Desktop dastur.

---

## 🚀 O‘rnatish va Ishga Tushirish (Python muhitida)

1. Python 3.10 yoki undan yuqori versiyasi o‘rnatilganligini tekshiring.
2. Kerakli kutubxonalarni o‘rnating:
   ```bash
   pip install -r requirements.txt
   ```
3. Dasturni ishga tushiring:
   ```bash
   python main.py
   ```

---

## 📦 Windows uchun mustaqil `.exe` (Standalone Executable) yaratish

Dasturni hech qanday Python o'rnatilmagan kompyuterlarda ham mustaqil `.exe` shaklida ishlatish uchun **PyInstaller** ishlatiladi:

### 1-Usul: Avtomatlashtirilgan `.bat` skript
Loyiha papkasidagi `build_exe.bat` faylini sichqoncha bilan ikki marta bosing.

### 2-Usul: Terminal orqali bitta buyruq bilan yig‘ish:
```bash
pyinstaller --onefile --windowed --name="KiberAkademiya_Uz" main.py
```

Buyruq parametrlari tushuntirishi:
- `--onefile`: Barcha kodlar, SQLite logikasi va kutubxonalarni bitta yagona `KiberAkademiya_Uz.exe` fayliga joylaydi.
- `--windowed` (yoki `-w`): Dastur ochilganda ortiqcha qora cmd konsoli ochilmasdan, faqat chiroyli PyQt6 oynasi ko'rinishini ta'minlaydi.
- `--name="..."`: Hosil bo‘luvchi .exe fayl nomini belgilaydi.

Natija: Loyiha papkasida `dist/KiberAkademiya_Uz.exe` fayli paydo bo'ladi. Uni istalgan Windows kompyuteriga tashlab to'g'ridan-to'g'ri ishga tushirishingiz mumkin!

---

## 📂 Fayllar Strukturasi

* `main.py` — Bosh oyna, sahifalar almashtirgichi, test topshirish logikasi, kiber laboratoriya va mini-terminal konsoli.
* `database.py` — SQLite3 ma'lumotlar bazasi (`cyber_academy.db`), foydalanuvchi profili, modullarning ochilish holati (progress), test natijalari, xatcho'plar va tizim loglari.
* `lessons_data.py` — Barcha 6 ta modul bo'yicha to'liq o'zbek tilidagi nazariy va amaliy darslar, YouTube video darsliklar havolalari va test savollari bazasi.
* `ui_theme.py` — Hacker HUD dizayn tizimi: chuqur kiber-qora (`#0A0E17`), qora slanes (`#111927`), neon yashil (`#00FF66`), elektr feruza (`#00E5FF`), kiber qizil (`#FF0055`) va to'liq QSS stillari.
* `requirements.txt` — PyQt6 va PyInstaller kutubxonalari.
* `build_exe.bat` — Windows uchun bitta tugma bilan .exe yig'ish skripti.
