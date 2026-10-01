# -*- coding: utf-8 -*-
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
    return [dict(r) for r in reversed(rows)]

# Bazani dastlabki tekshirish
init_database()
