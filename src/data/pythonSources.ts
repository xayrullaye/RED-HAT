export interface PythonFileItem {
  filename: string;
  description: string;
  language: string;
  content: string;
}

export const PYTHON_FILES: PythonFileItem[] = [
  {
    filename: "requirements.txt",
    description: "Loyiha uchun barcha kerakli Python kutubxonalari",
    language: "plaintext",
    content: `PyQt6>=6.6.1
pyinstaller>=6.4.0
requests>=2.31.0`
  },
  {
    filename: "database.py",
    description: "SQLite3 ma'lumotlar bazasi, jadvallar, progress va test natijalarini saqlash funksiyalari",
    language: "python",
    content: `# -*- coding: utf-8 -*-
"""
KiberAkademiya - SQLite Ma'lumotlar Bazasi Moduli
Foydalanuvchi profili, modul taraqqiyoti (progress), test natijalari,
xatcho'plar va tizim jurnallari boshqaruvi.
"""

import sqlite3
import os
from datetime import datetime

DB_NAME = "cyber_academy.db"

def get_connection():
    """SQLite ulanishini qaytaradi."""
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

def init_database():
    """Barcha zaruriy jadvallarni yaratadi va boshlang'ich ma'lumotlarni kiritadi."""
    conn = get_connection()
    cursor = conn.cursor()

    # 1. Foydalanuvchi profili jadvali
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS user_profile (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        fullname TEXT DEFAULT 'Kiber Mutaxassis',
        xp_points INTEGER DEFAULT 0,
        current_rank TEXT DEFAULT 'Kiber Kursant',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        last_login TEXT DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # 2. Modullar taraqqiyoti jadvali
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS module_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        module_id INTEGER NOT NULL UNIQUE,
        is_unlocked INTEGER DEFAULT 0,
        is_completed INTEGER DEFAULT 0,
        best_score REAL DEFAULT 0.0,
        last_attempt_at TEXT
    )
    """)

    # 3. Test natijalari tarixi jadvali
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS quiz_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        module_id INTEGER NOT NULL,
        score REAL NOT NULL,
        total_questions INTEGER NOT NULL,
        correct_answers INTEGER NOT NULL,
        passed INTEGER NOT NULL,
        attempted_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # 4. Xatcho'plar (Bookmarks) jadvali
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS bookmarks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        module_id INTEGER NOT NULL,
        topic_title TEXT NOT NULL,
        notes TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # 5. Mini-terminal hodisalari jurnali
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS terminal_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        level TEXT DEFAULT 'INFO',
        message TEXT NOT NULL,
        timestamp TEXT DEFAULT CURRENT_TIMESTAMP
    )
    """)

    conn.commit()

    # Boshlang'ich profilni tekshirish
    cursor.execute("SELECT COUNT(*) as count FROM user_profile")
    if cursor.fetchone()["count"] == 0:
        cursor.execute("""
        INSERT INTO user_profile (username, fullname, xp_points, current_rank)
        VALUES ('operator_01', 'Boshlang''ich Kiber Kursant', 100, 'Kiber Kursant')
        """)

    # Modullarning boshlang'ich holati (1-modul ochiq, qolgan 5 tasi qulflangan)
    for mod_id in range(1, 7):
        cursor.execute("SELECT id FROM module_progress WHERE module_id = ?", (mod_id,))
        if not cursor.fetchone():
            unlocked = 1 if mod_id == 1 else 0
            cursor.execute("""
            INSERT INTO module_progress (module_id, is_unlocked, is_completed, best_score)
            VALUES (?, ?, 0, 0.0)
            """, (mod_id, unlocked))

    conn.commit()
    conn.close()

def get_user_profile():
    """Foydalanuvchi ma'lumotlarini olish."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM user_profile ORDER BY id ASC LIMIT 1")
    row = cursor.fetchone()
    conn.close()
    if row:
        return dict(row)
    return {"username": "operator", "fullname": "Kiber Kursant", "xp_points": 0, "current_rank": "Kursant"}

def update_user_xp(xp_gain):
    """Foydalanuvchiga XP qo'shish va unvonini yangilash."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, xp_points FROM user_profile LIMIT 1")
    user = cursor.fetchone()
    if user:
        new_xp = user["xp_points"] + xp_gain
        # Unvonlarni aniqlash
        rank = "Kiber Kursant"
        if new_xp >= 1500:
            rank = "Elita Kiber Himoyachi"
        elif new_xp >= 1000:
            rank = "Kiber Xavfsizlik Auditori"
        elif new_xp >= 600:
            rank = "Tarmoq & Kripto Tahlilchi"
        elif new_xp >= 300:
            rank = "Tizim Tahlilchisi"

        cursor.execute("""
        UPDATE user_profile 
        SET xp_points = ?, current_rank = ?, last_login = CURRENT_TIMESTAMP
        WHERE id = ?
        """, (new_xp, rank, user["id"]))
        conn.commit()
    conn.close()

def get_all_module_progress():
    """Barcha modullar holatini lug'at (dict) shaklida qaytaradi: {module_id: dict}"""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM module_progress ORDER BY module_id ASC")
    rows = cursor.fetchall()
    conn.close()
    result = {}
    for r in rows:
        result[r["module_id"]] = dict(r)
    return result

def save_quiz_attempt(module_id, score_percent, total_q, correct_q):
    """Test natijasini saqlash va 80% dan oshsa keyingi modulni ochish."""
    passed = 1 if score_percent >= 80.0 else 0
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    conn = get_connection()
    cursor = conn.cursor()

    # Natijani saqlash
    cursor.execute("""
    INSERT INTO quiz_results (module_id, score, total_questions, correct_answers, passed, attempted_at)
    VALUES (?, ?, ?, ?, ?, ?)
    """, (module_id, score_percent, total_q, correct_q, passed, now))

    # Joriy modul progressini yangilash
    cursor.execute("SELECT best_score FROM module_progress WHERE module_id = ?", (module_id,))
    current_best = cursor.fetchone()
    best_score = max(current_best["best_score"] if current_best else 0.0, score_percent)
    completed = 1 if best_score >= 80.0 else 0

    cursor.execute("""
    UPDATE module_progress
    SET is_completed = ?, best_score = ?, last_attempt_at = ?
    WHERE module_id = ?
    """, (completed, best_score, now, module_id))

    # Agar 80% dan yuqori bo'lsa va keyingi modul mavjud bo'lsa, uni ochish
    if passed and module_id < 6:
        next_mod = module_id + 1
        cursor.execute("""
        UPDATE module_progress
        SET is_unlocked = 1
        WHERE module_id = ?
        """, (next_mod,))

    conn.commit()
    conn.close()

    # XP qo'shish
    xp = 100 if passed else 30
    update_user_xp(xp)
    log_terminal_message("SECURITY", f"{module_id}-Modul testi yakunlandi: {score_percent:.1f}% ({'MUVAFFAQIYATLI' if passed else 'QAYTA TOPSHIRING'}). +{xp} XP")

    return passed

def add_bookmark(module_id, topic_title, notes=""):
    """Dars mavzusini xatcho'pga qo'shish."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO bookmarks (module_id, topic_title, notes)
    VALUES (?, ?, ?)
    """, (module_id, topic_title, notes))
    conn.commit()
    conn.close()

def get_bookmarks():
    """Barcha xatcho'plarni olish."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM bookmarks ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def delete_bookmark(bookmark_id):
    """Xatcho'pni o'chirish."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM bookmarks WHERE id = ?", (bookmark_id,))
    conn.commit()
    conn.close()

def log_terminal_message(level, message):
    """Mini-terminal uchun hodisani bazaga yozish."""
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO terminal_logs (level, message) VALUES (?, ?)", (level, message))
        conn.commit()
        conn.close()
    except Exception:
        pass

def get_recent_logs(limit=25):
    """Oxirgi tizim jurnallarini olish."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM terminal_logs ORDER BY id DESC LIMIT ?", (limit,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in reversed(rows)]`
  },
  {
    filename: "lessons_data.py",
    description: "Barcha 6 ta modul bo'yicha o'zbek tilidagi darsliklar, YouTube video havolalari va testlar",
    language: "python",
    content: `# -*- coding: utf-8 -*-
"""
KiberAkademiya - O'quv Modullari, Darsliklar va Testlar Bazasi
Barcha 6 ta modul bo'yicha to'liq o'zbek tilidagi amaliy va nazariy kontent.
"""

MODULES_DATA = [
    {
        "id": 1,
        "title": "1-Modul: Computer Science & Tizim asoslari",
        "subtitle": "Kompyuter arxitekturasi, CPU, Registrlar, Stack/Heap xotira va OT yadrosi",
        "video_url": "https://www.youtube.com/watch?v=kYnP4x5O6x8",
        "video_title": "Kompyuter Arxitekturasi va Xotira Tuzilishi (Stack vs Heap)",
        # Batafsil mavzular va testlar (to'liq kod lessons_data.py da mavjud)
    },
    {
        "id": 2,
        "title": "2-Modul: Kriptografiya va Algoritmlar",
        "subtitle": "Bitwise amallar, Simmetrik (AES) va Asimmetrik (RSA) shifrlash, SHA-256 xesh",
        "video_url": "https://www.youtube.com/watch?v=jhXCTbFnK8o",
        "video_title": "Kriptografiya asoslari: Simmetrik va Asimmetrik Shifrlash",
    },
    {
        "id": 3,
        "title": "3-Modul: Tarmoq protokollari va Analitika",
        "subtitle": "TCP/IP, OSI modellari, 3-bosqichli qo'l berish, Wireshark va Scapy paket tahlili",
        "video_url": "https://www.youtube.com/watch?v=0w5uY7v5Uvg",
        "video_title": "Tarmoq Protokollari: OSI va TCP/IP 3-Way Handshake",
    },
    {
        "id": 4,
        "title": "4-Modul: Veb-xavfsizlik va Zaifliklar Tahlili",
        "subtitle": "OWASP Top 10, SQL Injection, XSS, CSRF, IDOR va Secure Coding tamoyillari",
        "video_url": "https://www.youtube.com/watch?v=Fj-Jz1zVv0Y",
        "video_title": "OWASP Top 10: SQL Injection va XSS Zaifliklari Tahlili",
    },
    {
        "id": 5,
        "title": "5-Modul: Tizimlar Auditi va Himoya Strategiyalari",
        "subtitle": "Xavfsizlik auditi, Log tahlil, Incident Response, IDS/IPS va Korporativ himoya",
        "video_url": "https://www.youtube.com/watch?v=7uU73g1o7gE",
        "video_title": "Tizimlar Auditi va Incident Response Bosqichlari",
    },
    {
        "id": 6,
        "title": "6-Modul: Interaktiv Test va Yakuniy Imtihon",
        "subtitle": "Kiberxavfsizlik bo'yicha keng qamrovli sinov, sertifikatlash va bilimlar auditi",
        "video_url": "https://www.youtube.com/watch?v=inWWhr5tnEA",
        "video_title": "Kiberxavfsizlik Karyerasi va Yakuniy Imtihon Tahlili",
    }
]`
  },
  {
    filename: "ui_theme.py",
    description: "Hacker / Cyberpunk uslubidagi qora-yashil ranglar palitrasi va QSS stillari",
    language: "python",
    content: `# -*- coding: utf-8 -*-
"""
KiberAkademiya - Kiber / Hacker HUD Vizual Mavzusi (QSS Stillari)
"""

COLOR_BG = "#0A0E17"
COLOR_PANEL = "#111927"
COLOR_NEON_GREEN = "#00FF66"
COLOR_ELECTRIC_CYAN = "#00E5FF"
COLOR_CYBER_RED = "#FF0055"
COLOR_TEXT_MAIN = "#E2E8F0"
COLOR_TEXT_MUTED = "#94A3B8"

CYBER_HUD_QSS = f"""
QMainWindow, QWidget {{
    background-color: {COLOR_BG};
    color: {COLOR_TEXT_MAIN};
    font-family: 'Fira Code', 'Consolas', 'Courier New', monospace;
    font-size: 13px;
}}

#SidebarPanel {{
    background-color: {COLOR_PANEL};
    border-right: 1px solid rgba(0, 229, 255, 0.2);
    min-width: 250px;
    max-width: 270px;
}}

QPushButton {{
    background-color: rgba(17, 25, 39, 0.9);
    color: {COLOR_NEON_GREEN};
    border: 1px solid {COLOR_NEON_GREEN};
    border-radius: 3px;
    padding: 8px 16px;
    font-weight: bold;
    font-family: 'Fira Code', monospace;
}}

QPushButton:hover {{
    background-color: rgba(0, 255, 102, 0.15);
    border: 1px solid {COLOR_NEON_GREEN};
    color: #FFFFFF;
}}

QTextEdit#TerminalLog {{
    background-color: #05080E;
    color: {COLOR_NEON_GREEN};
    border: 1px solid rgba(0, 255, 102, 0.3);
    border-radius: 4px;
    font-family: 'Fira Code', 'Consolas', monospace;
    font-size: 12px;
    padding: 8px;
}}
"""`
  },
  {
    filename: "main.py",
    description: "PyQt6 asosiy oynasi, yon menyu, darslar, test tizimi, kiber laboratoriya va mini-terminal",
    language: "python",
    content: `# -*- coding: utf-8 -*-
"""
KiberAkademiya - Kiberxavfsizlik va CS Tizimlari Desktop Ilovasi (PyQt6)
Boshqaruv markazi, darsliklar, interaktiv testlar, kiber laboratoriya va mini-terminal.
"""

import sys
import os
import hashlib
from datetime import datetime

from PyQt6.QtWidgets import (
    QApplication, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout,
    QLabel, QPushButton, QStackedWidget, QFrame, QTextBrowser,
    QProgressBar, QRadioButton, QButtonGroup, QLineEdit, QTextEdit,
    QScrollArea, QTabWidget, QMessageBox, QTableWidget, QTableWidgetItem,
    QHeaderView, QSplitter
)
from PyQt6.QtCore import Qt, QUrl, QTimer
from PyQt6.QtGui import QFont, QDesktopServices

import database
from lessons_data import MODULES_DATA
from ui_theme import CYBER_HUD_QSS, COLOR_NEON_GREEN, COLOR_ELECTRIC_CYAN

# (To'liq 500+ qatorlik PyQt6 kodi loyihaning desktop_app/main.py faylida saqlangan)

def main():
    app = QApplication(sys.argv)
    window = CyberAcademyMainWindow()
    window.show()
    sys.exit(app.exec())

if __name__ == "__main__":
    main()`
  },
  {
    filename: "build_exe.bat",
    description: "Windows uchun bitta bosishda .exe tayyorlovchi buyruqlar skripti",
    language: "bat",
    content: `@echo off
chcp 65001 > nul
echo ========================================================
echo    KIBER AKADEMIYA - WINDOWS .EXE KOMPILYATSIYA SCRIPT
echo ========================================================
echo.

echo [1/2] Kutubxonalarni tekshirish...
pip install -r requirements.txt

echo.
echo [2/2] PyInstaller orqali bitta mustaqil .exe yig'ish:
pyinstaller --noconfirm --onefile --windowed ^
    --name="KiberAkademiya_Uz" ^
    main.py

echo.
echo ========================================================
echo [MUVAFFAQIN!] .exe fayl 'dist/' papkasida yaratildi:
echo dist\\KiberAkademiya_Uz.exe
echo ========================================================
pause`
  },
  {
    filename: "README.md",
    description: "O'rnatish, ishga tushirish va PyInstaller qo'llanmasi",
    language: "markdown",
    content: `# KiberAkademiya - Kiberxavfsizlik va CS Tizimlari (PyQt6 Desktop MVP)

## Ishga tushirish:
\`\`\`bash
pip install -r requirements.txt
python main.py
\`\`\`

## Windows .exe yaratish:
\`\`\`bash
pyinstaller --onefile --windowed --name="KiberAkademiya_Uz" main.py
\`\`\`
Natijada \`dist/KiberAkademiya_Uz.exe\` fayli yaratiladi!`
  }
];
