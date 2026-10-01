# -*- coding: utf-8 -*-
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
from PyQt6.QtGui import QFont, QDesktopServices, QIcon, QColor

# Mahalliylar
import database
from lessons_data import MODULES_DATA
from ui_theme import (
    CYBER_HUD_QSS, COLOR_BG, COLOR_PANEL, COLOR_NEON_GREEN,
    COLOR_ELECTRIC_CYAN, COLOR_CYBER_RED, COLOR_TEXT_MAIN, COLOR_TEXT_MUTED
)

class CyberAcademyMainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("KIBER AKADEMIYA // AXBOROT XAVFSIZLIGI VA TIZIMLAR TAHLILI v1.0.0")
        self.resize(1200, 780)
        self.setMinimumSize(1000, 680)

        # Ma'lumotlar bazasini initsializatsiya qilish
        database.init_database()

        # Joriy tanlangan modul va mavzu
        self.current_module_id = 1
        self.current_topic_index = 0
        self.quiz_current_q_index = 0
        self.quiz_user_answers = {}
        self.quiz_questions = []

        # Interfeysni qurish
        self.init_ui()
        self.setStyleSheet(CYBER_HUD_QSS)

        # Boshlang'ich terminal xabarlari
        self.log_to_terminal("SYSTEM", "Tizim muvaffaqiyatli ishga tushdi. Kiberxavfsizlik o'quv muhiti faol.")
        self.log_to_terminal("SECURITY", "Baza holati: SQLite OK. Profil va modullar tekshirildi.")

        # Ma'lumotlarni yangilash
        self.refresh_user_profile()
        self.refresh_modules_list()

    def init_ui(self):
        """Asosiy oynaning boshqaruv arxitekturasini yaratish."""
        central_widget = QWidget(self)
        self.setCentralWidget(central_widget)
        main_layout = QHBoxLayout(central_widget)
        main_layout.setContentsMargins(0, 0, 0, 0)
        main_layout.setSpacing(0)

        # 1. YON PANEL (Sidebar)
        sidebar = self.create_sidebar()
        main_layout.addWidget(sidebar)

        # 2. O'NG ASOSIY BO'LIM (Markaziy ekranlar + Mini-terminal)
        right_container = QWidget()
        right_container.setObjectName("ContentArea")
        right_layout = QVBoxLayout(right_container)
        right_layout.setContentsMargins(16, 16, 16, 16)
        right_layout.setSpacing(12)

        # Yuqori HUD paneli (Tizim holati, sana, operator)
        top_hud = self.create_top_hud()
        right_layout.addWidget(top_hud)

        # Ko'p sahifali stak (Dashboard, Darslar, Test, Laboratoriya, Xatcho'plar)
        self.stack = QStackedWidget()
        self.dashboard_page = self.create_dashboard_page()
        self.lessons_page = self.create_lessons_page()
        self.quiz_page = self.create_quiz_page()
        self.lab_page = self.create_lab_page()
        self.bookmarks_page = self.create_bookmarks_page()

        self.stack.addWidget(self.dashboard_page)  # Index 0
        self.stack.addWidget(self.lessons_page)    # Index 1
        self.stack.addWidget(self.quiz_page)       # Index 2
        self.stack.addWidget(self.lab_page)        # Index 3
        self.stack.addWidget(self.bookmarks_page)  # Index 4

        right_layout.addWidget(self.stack, stretch=1)

        # Pastki mini-terminal HUD bloki
        terminal_block = self.create_terminal_block()
        right_layout.addWidget(terminal_block)

        main_layout.addWidget(right_container, stretch=1)

    def create_sidebar(self):
        """Yon menyu paneli."""
        sidebar = QFrame()
        sidebar.setObjectName("SidebarPanel")
        layout = QVBoxLayout(sidebar)
        layout.setContentsMargins(14, 20, 14, 20)
        layout.setSpacing(10)

        # Logo va Brand
        logo_label = QLabel("🛡️ KIBER AKADEMIYA")
        logo_label.setStyleSheet(f"font-size: 16px; font-weight: bold; color: {COLOR_ELECTRIC_CYAN};")
        layout.addWidget(logo_label)

        sub_logo = QLabel("UZBEK CYBER WORKSTATION")
        sub_logo.setStyleSheet(f"font-size: 10px; color: {COLOR_NEON_GREEN}; letter-spacing: 2px;")
        layout.addWidget(sub_logo)

        # Bo'luvchi chiziq
        line = QFrame()
        line.setFrameShape(QFrame.Shape.HLine)
        line.setStyleSheet("color: #1E293B;")
        layout.addWidget(line)

        # Profil kartasi
        self.profile_box = QFrame()
        self.profile_box.setStyleSheet("background-color: #0A0E17; border: 1px solid #1E293B; border-radius: 4px; padding: 8px;")
        p_layout = QVBoxLayout(self.profile_box)
        p_layout.setContentsMargins(8, 8, 8, 8)
        p_layout.setSpacing(4)

        self.user_fullname_label = QLabel("Yuklanmoqda...")
        self.user_fullname_label.setStyleSheet("font-weight: bold; color: #FFFFFF;")
        p_layout.addWidget(self.user_fullname_label)

        self.user_rank_label = QLabel("Unvon: Kiber Kursant")
        self.user_rank_label.setStyleSheet(f"color: {COLOR_ELECTRIC_CYAN}; font-size: 11px;")
        p_layout.addWidget(self.user_rank_label)

        self.user_xp_label = QLabel("Tajriba (XP): 0")
        self.user_xp_label.setStyleSheet(f"color: {COLOR_NEON_GREEN}; font-size: 11px;")
        p_layout.addWidget(self.user_xp_label)

        layout.addWidget(self.profile_box)
        layout.addSpacing(10)

        # Navigatsiya tugmalari
        self.nav_buttons = []

        btn_dash = self.create_nav_button("📊 Asosiy Holat (Dashboard)", 0)
        btn_lessons = self.create_nav_button("📚 O'quv Modullari (1-6)", 1)
        btn_quiz = self.create_nav_button("⚡ Interaktiv Test & Imtihon", 2)
        btn_lab = self.create_nav_button("🧪 Kiber Laboratoriya", 3)
        btn_book = self.create_nav_button("🔖 Xatcho'plar (Saqlangan)", 4)

        for btn in [btn_dash, btn_lessons, btn_quiz, btn_lab, btn_book]:
            layout.addWidget(btn)
            self.nav_buttons.append(btn)

        self.nav_buttons[0].setProperty("active", "true")

        layout.addStretch()

        # Tizim statusi
        status_frame = QFrame()
        status_frame.setStyleSheet("background-color: #0A0E17; border-left: 3px solid #00FF66; padding: 6px;")
        s_layout = QVBoxLayout(status_frame)
        s_layout.setContentsMargins(6, 4, 6, 4)
        s_label = QLabel("TIZIM: ONLAYN [SECURE]")
        s_label.setStyleSheet(f"color: {COLOR_NEON_GREEN}; font-size: 10px; font-weight: bold;")
        s_layout.addWidget(s_label)
        sub_s = QLabel("Trafik: Shifrlangan TLS")
        sub_s.setStyleSheet("color: #64748B; font-size: 9px;")
        s_layout.addWidget(sub_s)
        layout.addWidget(status_frame)

        return sidebar

    def create_nav_button(self, text, page_index):
        btn = QPushButton(text)
        btn.setObjectName("NavButton")
        btn.setCursor(Qt.CursorShape.PointingHandCursor)
        btn.clicked.connect(lambda: self.switch_page(page_index))
        return btn

    def switch_page(self, page_index):
        self.stack.setCurrentIndex(page_index)
        for i, b in enumerate(self.nav_buttons):
            b.setProperty("active", "true" if i == page_index else "false")
            b.style().unpolish(b)
            b.style().polish(b)

        if page_index == 1:
            self.load_selected_lesson()
        elif page_index == 2:
            self.prepare_quiz_view(self.current_module_id)
        elif page_index == 4:
            self.refresh_bookmarks_table()

    def create_top_hud(self):
        """Yuqori HUD holat ko'rsatkichi."""
        hud = QFrame()
        hud.setObjectName("HUDCard")
        hud.setFixedHeight(48)
        layout = QHBoxLayout(hud)
        layout.setContentsMargins(12, 0, 12, 0)

        title = QLabel("// KIBER TAHLIL MARKAZI")
        title.setStyleSheet(f"color: {COLOR_ELECTRIC_CYAN}; font-weight: bold; font-size: 13px;")
        layout.addWidget(title)

        layout.addStretch()

        self.time_label = QLabel(datetime.now().strftime("%Y-%m-%d | %H:%M:%S UTC"))
        self.time_label.setStyleSheet(f"color: {COLOR_TEXT_MUTED}; font-size: 12px;")
        layout.addWidget(self.time_label)

        # Vaqtni yangilab turuvchi taymer
        timer = QTimer(self)
        timer.timeout.connect(lambda: self.time_label.setText(datetime.now().strftime("%Y-%m-%d | %H:%M:%S")))
        timer.start(1000)

        return hud

    # ------------------ DASHBOARD SAHIFASI ------------------
    def create_dashboard_page(self):
        page = QWidget()
        layout = QVBoxLayout(page)
        layout.setContentsMargins(0, 0, 0, 0)
        layout.setSpacing(14)

        # Xush kelibsiz banneri
        welcome_frame = QFrame()
        welcome_frame.setObjectName("HUDCard")
        w_layout = QVBoxLayout(welcome_frame)
        w_title = QLabel("Xush kelibsiz, Kiber Mutaxassis! 👋")
        w_title.setStyleSheet(f"font-size: 18px; font-weight: bold; color: {COLOR_NEON_GREEN};")
        w_layout.addWidget(w_title)

        w_desc = QLabel(
            "Ushbu dastur kompyuter arxitekturasi va Computer Science asoslaridan boshlab, "
            "kriptografiya, tarmoq xavfsizligi, veb-zaifliklar (OWASP Top 10) hamda tizimlar auditigacha "
            "bo'lgan barcha bilimlarni to'liq o'zbek tilida o'rgatuvchi yaxlit ta'lim muhitidir."
        )
        w_desc.setWordWrap(True)
        w_desc.setStyleSheet(f"color: {COLOR_TEXT_MAIN}; line-height: 1.5;")
        w_layout.addWidget(w_desc)
        layout.addWidget(welcome_frame)

        # Modullar holati jadvali / ko'rinishi
        mod_label = QLabel("⚡ O'QUV MODULLARI VA TARAQQIYOT (PROGRESS):")
        mod_label.setStyleSheet(f"color: {COLOR_ELECTRIC_CYAN}; font-weight: bold; font-size: 14px;")
        layout.addWidget(mod_label)

        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        scroll.setStyleSheet("background: transparent; border: none;")

        self.modules_container = QWidget()
        self.modules_layout = QVBoxLayout(self.modules_container)
        self.modules_layout.setContentsMargins(0, 0, 0, 0)
        self.modules_layout.setSpacing(10)
        scroll.setWidget(self.modules_container)

        layout.addWidget(scroll, stretch=1)
        return page

    def refresh_modules_list(self):
        """Barcha modullar kartalarini yangilash."""
        # Avvalgisini tozalash
        while self.modules_layout.count():
            item = self.modules_layout.takeAt(0)
            if item.widget():
                item.widget().deleteLater()

        progress_data = database.get_all_module_progress()

        for mod in MODULES_DATA:
            m_id = mod["id"]
            p_info = progress_data.get(m_id, {"is_unlocked": 1 if m_id == 1 else 0, "best_score": 0.0, "is_completed": 0})
            is_unlocked = bool(p_info.get("is_unlocked", 0))
            best_score = float(p_info.get("best_score", 0.0))

            card = QFrame()
            card.setObjectName("CardFrame")
            card_layout = QHBoxLayout(card)
            card_layout.setContentsMargins(14, 12, 14, 12)

            # Icon & Info
            info_layout = QVBoxLayout()
            title_text = f"Modul {m_id}: {mod['title']}"
            if not is_unlocked:
                title_text += " 🔒 [QULFLANGAN - Avvalgi moduldan 80%+ to'plang]"

            m_title = QLabel(title_text)
            m_title.setStyleSheet(f"font-size: 14px; font-weight: bold; color: {COLOR_NEON_GREEN if is_unlocked else '#64748B'};")
            info_layout.addWidget(m_title)

            m_sub = QLabel(mod["subtitle"])
            m_sub.setStyleSheet(f"color: {COLOR_TEXT_MUTED}; font-size: 11px;")
            info_layout.addWidget(m_sub)

            card_layout.addLayout(info_layout, stretch=1)

            # Natija va tugmalar
            action_layout = QVBoxLayout()
            score_lbl = QLabel(f"Eng yuqori natija: {best_score:.1f}%")
            score_lbl.setStyleSheet(f"color: {COLOR_ELECTRIC_CYAN}; font-size: 11px; font-weight: bold;")
            action_layout.addWidget(score_lbl)

            btn_box = QHBoxLayout()
            open_btn = QPushButton("Darsni O'qish" if is_unlocked else "Qulflangan")
            open_btn.setEnabled(is_unlocked)
            open_btn.setCursor(Qt.CursorShape.PointingHandCursor if is_unlocked else Qt.CursorShape.ForbiddenCursor)
            open_btn.clicked.connect(lambda checked, mid=m_id: self.open_module_lessons(mid))
            btn_box.addWidget(open_btn)

            test_btn = QPushButton("Test Topshirish")
            test_btn.setObjectName("CyanButton")
            test_btn.setEnabled(is_unlocked)
            test_btn.setCursor(Qt.CursorShape.PointingHandCursor if is_unlocked else Qt.CursorShape.ForbiddenCursor)
            test_btn.clicked.connect(lambda checked, mid=m_id: self.start_module_quiz(mid))
            btn_box.addWidget(test_btn)

            action_layout.addLayout(btn_box)
            card_layout.addLayout(action_layout)

            self.modules_layout.addWidget(card)

    def open_module_lessons(self, module_id):
        self.current_module_id = module_id
        self.current_topic_index = 0
        self.switch_page(1)

    def start_module_quiz(self, module_id):
        self.current_module_id = module_id
        self.prepare_quiz_view(module_id)
        self.switch_page(2)

    # ------------------ DARSLIKLAR SAHIFASI ------------------
    def create_lessons_page(self):
        page = QWidget()
        layout = QVBoxLayout(page)
        layout.setContentsMargins(0, 0, 0, 0)
        layout.setSpacing(10)

        # Yuqori sarlavha va video tugmasi
        top_bar = QFrame()
        top_bar.setObjectName("HUDCard")
        top_bar_layout = QHBoxLayout(top_bar)

        self.lesson_header_title = QLabel("1-Modul Darsliklari")
        self.lesson_header_title.setStyleSheet(f"font-size: 16px; font-weight: bold; color: {COLOR_ELECTRIC_CYAN};")
        top_bar_layout.addWidget(self.lesson_header_title)

        top_bar_layout.addStretch()

        self.bookmark_btn = QPushButton("🔖 Xatcho'pga Saqlash")
        self.bookmark_btn.clicked.connect(self.bookmark_current_topic)
        top_bar_layout.addWidget(self.bookmark_btn)

        self.video_btn = QPushButton("▶ YouTube Video Darsni Ko'rish")
        self.video_btn.setObjectName("CyanButton")
        self.video_btn.clicked.connect(self.open_current_video)
        top_bar_layout.addWidget(self.video_btn)

        layout.addWidget(top_bar)

        # Asosiy Splitter: Chap tomonda mavzular ro'yxati, o'ngda dars matni
        splitter = QSplitter(Qt.Orientation.Horizontal)

        # Chap: Mavzular ro'yxati
        left_topics_widget = QFrame()
        left_topics_widget.setStyleSheet(f"background-color: {COLOR_PANEL}; border: 1px solid rgba(0, 229, 255, 0.2); border-radius: 4px;")
        self.topics_layout = QVBoxLayout(left_topics_widget)
        self.topics_layout.setContentsMargins(8, 8, 8, 8)
        self.topics_layout.setSpacing(6)
        splitter.addWidget(left_topics_widget)

        # O'ng: Dars brauzeri
        self.lesson_browser = QTextBrowser()
        self.lesson_browser.setObjectName("LessonBrowser")
        self.lesson_browser.setOpenExternalLinks(True)
        splitter.addWidget(self.lesson_browser)

        splitter.setStretchFactor(0, 1)
        splitter.setStretchFactor(1, 3)

        layout.addWidget(splitter, stretch=1)
        return page

    def load_selected_lesson(self):
        """Tanlangan modul va mavzuni ekranga chiqarish."""
        mod = next((m for m in MODULES_DATA if m["id"] == self.current_module_id), MODULES_DATA[0])
        self.lesson_header_title.setText(mod["title"])

        # Mavzular ro'yxatini tozalash va to'ldirish
        while self.topics_layout.count():
            item = self.topics_layout.takeAt(0)
            if item.widget():
                item.widget().deleteLater()

        topics = mod.get("topics", [])
        for idx, t in enumerate(topics):
            btn = QPushButton(t["title"])
            btn.setObjectName("NavButton")
            btn.setCursor(Qt.CursorShape.PointingHandCursor)
            if idx == self.current_topic_index:
                btn.setProperty("active", "true")
            btn.clicked.connect(lambda checked, i=idx: self.select_topic(i))
            self.topics_layout.addWidget(btn)

        self.topics_layout.addStretch()

        # Dars matnini o'rnatish
        if topics and 0 <= self.current_topic_index < len(topics):
            curr_t = topics[self.current_topic_index]
            html = f"""
            <div style="font-family: 'Fira Code', monospace; color: #E2E8F0;">
                <h2 style="color: {COLOR_NEON_GREEN}; border-bottom: 1px solid rgba(0, 255, 102, 0.3); padding-bottom: 8px;">
                    {curr_t['title']}
                </h2>
                <div style="font-size: 14px; line-height: 1.7; white-space: pre-wrap;">
{curr_t['content']}
                </div>
            </div>
            """
            self.lesson_browser.setHtml(html)
            self.log_to_terminal("LEARN", f"Dars yuklandi: {curr_t['title']}")

    def select_topic(self, topic_idx):
        self.current_topic_index = topic_idx
        self.load_selected_lesson()

    def open_current_video(self):
        mod = next((m for m in MODULES_DATA if m["id"] == self.current_module_id), MODULES_DATA[0])
        v_url = mod.get("video_url", "https://www.youtube.com")
        QDesktopServices.openUrl(QUrl(v_url))
        self.log_to_terminal("MEDIA", f"YouTube darsligi brauzerda ochildi: {v_url}")

    def bookmark_current_topic(self):
        mod = next((m for m in MODULES_DATA if m["id"] == self.current_module_id), MODULES_DATA[0])
        topics = mod.get("topics", [])
        if topics and 0 <= self.current_topic_index < len(topics):
            topic_title = topics[self.current_topic_index]["title"]
            database.add_bookmark(self.current_module_id, topic_title, "O'rganilishi lozim bo'lgan darslik")
            QMessageBox.information(self, "Xatcho'p Saqlandi", f"'{topic_title}' xatcho'plar ro'yxatiga muvaffaqiyatli saqlandi!")
            self.log_to_terminal("BOOKMARK", f"Xatcho'p qo'shildi: {topic_title}")

    # ------------------ TEST SAHIFASI ------------------
    def create_quiz_page(self):
        page = QWidget()
        layout = QVBoxLayout(page)
        layout.setContentsMargins(0, 0, 0, 0)
        layout.setSpacing(12)

        # Header
        q_head = QFrame()
        q_head.setObjectName("HUDCard")
        qh_layout = QHBoxLayout(q_head)

        self.quiz_title_label = QLabel("Interaktiv Test: 1-Modul")
        self.quiz_title_label.setStyleSheet(f"font-size: 16px; font-weight: bold; color: {COLOR_NEON_GREEN};")
        qh_layout.addWidget(self.quiz_title_label)

        qh_layout.addStretch()

        self.quiz_rule_label = QLabel("Talab: 80% to'g'ri javob (Keyingi modulni ochish uchun)")
        self.quiz_rule_label.setStyleSheet(f"color: {COLOR_ELECTRIC_CYAN}; font-size: 11px;")
        qh_layout.addWidget(self.quiz_rule_label)

        layout.addWidget(q_head)

        # Savollar kartasi
        self.quiz_card = QFrame()
        self.quiz_card.setObjectName("CardFrame")
        self.qc_layout = QVBoxLayout(self.quiz_card)
        self.qc_layout.setContentsMargins(20, 20, 20, 20)
        self.qc_layout.setSpacing(14)

        # Progress indikatori
        self.q_progress = QProgressBar()
        self.qc_layout.addWidget(self.q_progress)

        self.question_text = QLabel("Savol matni shu yerda paydo bo'ladi...")
        self.question_text.setWordWrap(True)
        self.question_text.setStyleSheet("font-size: 15px; font-weight: bold; color: #FFFFFF; line-height: 1.4;")
        self.qc_layout.addWidget(self.question_text)

        # Variantlar guruhi
        self.options_button_group = QButtonGroup(self)
        self.option_radios = []
        for i in range(4):
            radio = QRadioButton(f"Variant {i+1}")
            self.option_radios.append(radio)
            self.options_button_group.addButton(radio, i)
            self.qc_layout.addWidget(radio)

        # Tushuntirish / Feedback maydoni
        self.feedback_label = QLabel("")
        self.feedback_label.setWordWrap(True)
        self.feedback_label.setStyleSheet(f"color: {COLOR_ELECTRIC_CYAN}; font-size: 12px; padding: 6px; border: 1px dashed rgba(0, 229, 255, 0.4);")
        self.feedback_label.hide()
        self.qc_layout.addWidget(self.feedback_label)

        # Tugmalar paneli
        btn_row = QHBoxLayout()
        self.submit_answer_btn = QPushButton("Javobni Tekshirish")
        self.submit_answer_btn.setObjectName("CyanButton")
        self.submit_answer_btn.clicked.connect(self.check_quiz_answer)
        btn_row.addWidget(self.submit_answer_btn)

        self.next_q_btn = QPushButton("Keyingi Savol ➔")
        self.next_q_btn.setEnabled(False)
        self.next_q_btn.clicked.connect(self.next_quiz_question)
        btn_row.addWidget(self.next_q_btn)

        self.qc_layout.addLayout(btn_row)
        layout.addWidget(self.quiz_card, stretch=1)
        return page

    def prepare_quiz_view(self, module_id):
        self.current_module_id = module_id
        mod = next((m for m in MODULES_DATA if m["id"] == module_id), MODULES_DATA[0])
        self.quiz_title_label.setText(f"Interaktiv Test: {mod['title']}")
        self.quiz_questions = mod.get("quiz", [])
        self.quiz_current_q_index = 0
        self.quiz_user_answers = {}
        self.load_quiz_question(0)

    def load_quiz_question(self, index):
        if not self.quiz_questions or index >= len(self.quiz_questions):
            return

        self.quiz_current_q_index = index
        q = self.quiz_questions[index]

        total = len(self.quiz_questions)
        self.q_progress.setValue(int(((index) / total) * 100))
        self.question_text.setText(f"Savol {index + 1}/{total}: {q['question']}")

        self.options_button_group.setExclusive(False)
        for r in self.option_radios:
            r.setChecked(False)
            r.setEnabled(True)
        self.options_button_group.setExclusive(True)

        for i, opt in enumerate(q["options"]):
            if i < len(self.option_radios):
                self.option_radios[i].setText(opt)
                self.option_radios[i].show()

        for j in range(len(q["options"]), len(self.option_radios)):
            self.option_radios[j].hide()

        self.feedback_label.hide()
        self.submit_answer_btn.setEnabled(True)
        self.next_q_btn.setEnabled(False)

    def check_quiz_answer(self):
        checked_id = self.options_button_group.checkedId()
        if checked_id == -1:
            QMessageBox.warning(self, "Diqqat", "Iltimos, javob variantlaridan birini tanlang!")
            return

        q = self.quiz_questions[self.quiz_current_q_index]
        is_correct = (checked_id == q["answer"])
        self.quiz_user_answers[self.quiz_current_q_index] = {
            "selected": checked_id,
            "correct": is_correct
        }

        # Feedback ko'rsatish
        color = COLOR_NEON_GREEN if is_correct else COLOR_CYBER_RED
        status_txt = "✅ TO'G'RI JAVOB!" if is_correct else "❌ NOTO'G'RI JAVOB!"
        self.feedback_label.setText(f"{status_txt}\n💡 Tushuntirish: {q.get('explanation', '')}")
        self.feedback_label.setStyleSheet(f"color: {color}; font-size: 12px; padding: 8px; border: 1px solid {color}; background-color: rgba(10, 14, 23, 0.9);")
        self.feedback_label.show()

        self.submit_answer_btn.setEnabled(False)
        self.next_q_btn.setEnabled(True)

    def next_quiz_question(self):
        next_idx = self.quiz_current_q_index + 1
        if next_idx < len(self.quiz_questions):
            self.load_quiz_question(next_idx)
        else:
            self.finish_quiz()

    def finish_quiz(self):
        """Test yakunlanishi va natijani saqlash."""
        total = len(self.quiz_questions)
        correct_count = sum(1 for v in self.quiz_user_answers.values() if v["correct"])
        score_percent = (correct_count / total) * 100.0 if total > 0 else 0.0

        passed = database.save_quiz_attempt(self.current_module_id, score_percent, total, correct_count)

        self.refresh_user_profile()
        self.refresh_modules_list()

        msg = f"Sizning natijangiz: {correct_count}/{total} ({score_percent:.1f}%)\n"
        if passed:
            msg += "\n🎉 TABRIKLAYMIZ! Siz 80% dan yuqori ball to'pladingiz.\nKeyingi modul muvaffaqiyatli ochildi!"
            QMessageBox.information(self, "Test Muvaffaqiyatli!", msg)
        else:
            msg += "\n⚠️ Afsuski, keyingi modulni ochish uchun kamida 80% to'plashingiz kerak edi. Darslikni qayta ko'rib chiqing va testni qayta topshiring."
            QMessageBox.warning(self, "Test Yakunlandi", msg)

        self.switch_page(0)

    # ------------------ KIBER LABORATORIYA ------------------
    def create_lab_page(self):
        page = QWidget()
        layout = QVBoxLayout(page)
        layout.setContentsMargins(0, 0, 0, 0)
        layout.setSpacing(10)

        # Tab vidjeti
        tabs = QTabWidget()

        # 1. Bitwise XOR Lab
        xor_tab = QWidget()
        xor_layout = QVBoxLayout(xor_tab)
        xor_layout.setContentsMargins(14, 14, 14, 14)
        xor_layout.setSpacing(8)

        xor_title = QLabel("🔑 Bitwise XOR Kripto Laboratoriyasi")
        xor_title.setStyleSheet(f"font-size: 15px; font-weight: bold; color: {COLOR_NEON_GREEN};")
        xor_layout.addWidget(xor_title)

        xor_desc = QLabel("Matn va kalit kiriting. Dastur ularni baytma-bayt XOR amali bilan shifrlaydi va ikkilik (binary) kodini ko'rsatadi.")
        xor_desc.setStyleSheet(f"color: {COLOR_TEXT_MUTED}; font-size: 12px;")
        xor_layout.addWidget(xor_desc)

        self.xor_input_text = QLineEdit("KiberXavfsizlik_2026")
        self.xor_input_text.setPlaceholderText("Shifrlanuvchi ochiq matn...")
        xor_layout.addWidget(self.xor_input_text)

        self.xor_key_text = QLineEdit("SECRETKEY")
        self.xor_key_text.setPlaceholderText("XOR kaliti...")
        xor_layout.addWidget(self.xor_key_text)

        xor_calc_btn = QPushButton("⚡ XOR Shifrlash / Qayta Tiklash")
        xor_calc_btn.clicked.connect(self.calculate_bitwise_xor)
        xor_layout.addWidget(xor_calc_btn)

        self.xor_result_box = QTextEdit()
        self.xor_result_box.setReadOnly(True)
        self.xor_result_box.setObjectName("TerminalLog")
        xor_layout.addWidget(self.xor_result_box)

        tabs.addTab(xor_tab, "Bitwise XOR Shifr")

        # 2. SHA-256 Kripto Xesh Kalkulyatori
        sha_tab = QWidget()
        sha_layout = QVBoxLayout(sha_tab)
        sha_layout.setContentsMargins(14, 14, 14, 14)
        sha_layout.setSpacing(8)

        sha_title = QLabel("🛡️ SHA-256 Xesh va Ko'chki Effekti (Avalanche Effect)")
        sha_title.setStyleSheet(f"font-size: 15px; font-weight: bold; color: {COLOR_ELECTRIC_CYAN};")
        sha_layout.addWidget(sha_title)

        self.sha_input = QLineEdit("Maxfiy Parol 123")
        self.sha_input.textChanged.connect(self.update_sha256_hash)
        sha_layout.addWidget(self.sha_input)

        self.sha_result_label = QLabel("SHA-256: ")
        self.sha_result_label.setStyleSheet(f"font-family: monospace; font-size: 12px; color: {COLOR_NEON_GREEN};")
        self.sha_result_label.setWordWrap(True)
        sha_layout.addWidget(self.sha_result_label)

        sha_desc = QLabel("Har bir belgi o'zgarganda xesh butunlay o'zgarishini ko'ring (Kriptografik ko'chki effekti).")
        sha_desc.setStyleSheet(f"color: {COLOR_TEXT_MUTED}; font-size: 11px;")
        sha_layout.addWidget(sha_desc)
        sha_layout.addStretch()

        tabs.addTab(sha_tab, "SHA-256 Xesh")

        # 3. Stack vs Heap xotira simulyatori
        mem_tab = QWidget()
        mem_layout = QVBoxLayout(mem_tab)
        mem_layout.setContentsMargins(14, 14, 14, 14)

        mem_title = QLabel("🧠 Xotira Tuzilishi: Stack va Heap Simulyatsiyasi")
        mem_title.setStyleSheet(f"font-size: 15px; font-weight: bold; color: {COLOR_NEON_GREEN};")
        mem_layout.addWidget(mem_title)

        self.mem_log = QTextEdit()
        self.mem_log.setReadOnly(True)
        self.mem_log.setObjectName("TerminalLog")
        self.mem_log.setText(
            "[XOTIRA SIMULYATORI]\n"
            "0x7FFF0000 - [STACK: main() funksiyasi ramkasi]\n"
            "0x7FFEFFEC - [STACK: int secret_pin = 4492]\n"
            "0x7FFEFFE8 - [STACK: char* buffer_ptr -> 0x00A15040]\n"
            "---------------------------------------------------\n"
            "0x00A15040 - [HEAP: malloc(1024) - Dinamik bufer ajratildi]\n"
            "0x00A15440 - [HEAP: free() qilinmagan xotira - Potensial Memory Leak!]\n"
        )
        mem_layout.addWidget(self.mem_log)

        tabs.addTab(mem_tab, "Xotira (Stack/Heap)")

        layout.addWidget(tabs)
        return page

    def calculate_bitwise_xor(self):
        text = self.xor_input_text.text()
        key = self.xor_key_text.text()
        if not text or not key:
            self.xor_result_box.setText("Xatolik: Matn va kalit kiritilishi shart!")
            return

        res = []
        bin_res = []
        for i, char in enumerate(text):
            k_char = key[i % len(key)]
            xor_val = ord(char) ^ ord(k_char)
            res.append(chr(xor_val))
            bin_res.append(f"{bin(ord(char))[2:].zfill(8)} ^ {bin(ord(k_char))[2:].zfill(8)} = {bin(xor_val)[2:].zfill(8)} (char: {repr(chr(xor_val))})")

        cipher_str = "".join(res)
        hex_str = cipher_str.encode('utf-8', errors='replace').hex()

        log_out = f"Ochiq Matn: {text}\nKalit: {key}\n"
        log_out += f"HEX natija: {hex_str}\n\nBitma-bit XOR operatsiyalari (Binary):\n"
        log_out += "\n".join(bin_res[:15])

        self.xor_result_box.setText(log_out)
        self.log_to_terminal("LAB", f"Bitwise XOR hisoblandi: {len(text)} bayt.")

    def update_sha256_hash(self, text):
        h = hashlib.sha256(text.encode('utf-8')).hexdigest()
        self.sha_result_label.setText(f"SHA-256 Xesh: {h}")

    # ------------------ XATCHO'PLAR SAHIFASI ------------------
    def create_bookmarks_page(self):
        page = QWidget()
        layout = QVBoxLayout(page)
        layout.setContentsMargins(0, 0, 0, 0)
        layout.setSpacing(10)

        header = QLabel("🔖 SAQLANGAN XATCHO'PLAR VA MUHIM MAVZULAR:")
        header.setStyleSheet(f"color: {COLOR_ELECTRIC_CYAN}; font-size: 15px; font-weight: bold;")
        layout.addWidget(header)

        self.bookmarks_table = QTableWidget()
        self.bookmarks_table.setColumnCount(4)
        self.bookmarks_table.setHorizontalHeaderLabels(["ID", "Modul", "Mavzu Sarlavhasi", "Sana"])
        self.bookmarks_table.horizontalHeader().setSectionResizeMode(2, QHeaderView.ResizeMode.Stretch)
        self.bookmarks_table.setStyleSheet("background-color: #111927; border: 1px solid #1E293B;")
        layout.addWidget(self.bookmarks_table)

        btn_row = QHBoxLayout()
        del_btn = QPushButton("Tanlangan Xatcho'pni O'chirish")
        del_btn.setObjectName("DangerButton")
        del_btn.clicked.connect(self.delete_selected_bookmark)
        btn_row.addWidget(del_btn)
        btn_row.addStretch()

        layout.addLayout(btn_row)
        return page

    def refresh_bookmarks_table(self):
        b_list = database.get_bookmarks()
        self.bookmarks_table.setRowCount(len(b_list))
        for row, b in enumerate(b_list):
            self.bookmarks_table.setItem(row, 0, QTableWidgetItem(str(b["id"])))
            self.bookmarks_table.setItem(row, 1, QTableWidgetItem(f"{b['module_id']}-Modul"))
            self.bookmarks_table.setItem(row, 2, QTableWidgetItem(b["topic_title"]))
            self.bookmarks_table.setItem(row, 3, QTableWidgetItem(str(b["created_at"])))

    def delete_selected_bookmark(self):
        curr_row = self.bookmarks_table.currentRow()
        if curr_row < 0:
            QMessageBox.warning(self, "Diqqat", "O'chirish uchun xatcho'pni tanlang!")
            return
        b_id = int(self.bookmarks_table.item(curr_row, 0).text())
        database.delete_bookmark(b_id)
        self.refresh_bookmarks_table()
        self.log_to_terminal("BOOKMARK", f"Xatcho'p o'chirildi (ID: {b_id})")

    # ------------------ MINI-TERMINAL HUD BLOKI ------------------
    def create_terminal_block(self):
        """Pastki mini-terminal konsol paneli."""
        terminal_frame = QFrame()
        terminal_frame.setFixedHeight(150)
        terminal_frame.setStyleSheet("background-color: #05080E; border: 1px solid rgba(0, 255, 102, 0.3); border-radius: 4px;")
        t_layout = QVBoxLayout(terminal_frame)
        t_layout.setContentsMargins(8, 6, 8, 6)
        t_layout.setSpacing(4)

        # Terminal sarlavhasi
        t_header = QHBoxLayout()
        t_title = QLabel("💻 KIBER TERMINAL & HODISALAR JURNALI (HUD CONSOLE)")
        t_title.setStyleSheet(f"color: {COLOR_NEON_GREEN}; font-size: 11px; font-weight: bold;")
        t_header.addWidget(t_title)

        t_header.addStretch()

        clear_btn = QPushButton("Tozalash")
        clear_btn.setStyleSheet("font-size: 10px; padding: 2px 8px; border: 1px solid #1E293B;")
        clear_btn.clicked.connect(self.clear_terminal)
        t_header.addWidget(clear_btn)

        t_layout.addLayout(t_header)

        # Konsol matn maydoni
        self.terminal_output = QTextEdit()
        self.terminal_output.setObjectName("TerminalLog")
        self.terminal_output.setReadOnly(True)
        t_layout.addWidget(self.terminal_output, stretch=1)

        # Buyruq kiritish qatori
        cmd_row = QHBoxLayout()
        prompt_label = QLabel("root@kiber-hud:~#")
        prompt_label.setStyleSheet(f"color: {COLOR_ELECTRIC_CYAN}; font-size: 11px; font-weight: bold;")
        cmd_row.addWidget(prompt_label)

        self.cmd_input = QLineEdit()
        self.cmd_input.setPlaceholderText("Buyruq kiriting ('help', 'status', 'modules', 'scan', 'clear')...")
        self.cmd_input.returnPressed.connect(self.execute_terminal_command)
        cmd_row.addWidget(self.cmd_input)

        t_layout.addLayout(cmd_row)
        return terminal_frame

    def log_to_terminal(self, level, message):
        """Terminalga xabar yozish."""
        timestamp = datetime.now().strftime("%H:%M:%S")
        color = COLOR_NEON_GREEN
        if level in ["DANGER", "SECURITY", "ERROR"]:
            color = COLOR_CYBER_RED
        elif level in ["MEDIA", "LEARN", "LAB"]:
            color = COLOR_ELECTRIC_CYAN

        html_line = f"<span style='color: #64748B;'>[{timestamp}]</span> <b style='color: {color};'>[{level}]</b> <span style='color: #E2E8F0;'>{message}</span>"
        self.terminal_output.append(html_line)

        # Scroll to bottom
        sb = self.terminal_output.verticalScrollBar()
        sb.setValue(sb.maximum())

    def clear_terminal(self):
        self.terminal_output.clear()
        self.log_to_terminal("SYSTEM", "Terminal tozalandi.")

    def execute_terminal_command(self):
        cmd = self.cmd_input.text().strip().lower()
        self.cmd_input.clear()
        if not cmd:
            return

        self.log_to_terminal("EXEC", f"> {cmd}")

        if cmd in ["help", "yordam", "?"]:
            help_text = (
                "Mavjud buyruqlar:\n"
                "  help       - Buyruqlar ro'yxatini chiqarish\n"
                "  status     - Tizim va o'quvchi xavfsizlik holati\n"
                "  modules    - 6 ta modul bo'yicha progress holati\n"
                "  scan       - Tarmoq va port xavfsizlik skaneri simulyatsiyasi\n"
                "  clear      - Terminalni tozalash\n"
                "  stats      - XP va testlar umumiy hisoboti"
            )
            self.log_to_terminal("SYSTEM", help_text)

        elif cmd == "status":
            prof = database.get_user_profile()
            self.log_to_terminal("STATUS", f"Foydalanuvchi: {prof['fullname']} | Unvon: {prof['current_rank']} | XP: {prof['xp_points']}")

        elif cmd == "modules":
            prog = database.get_all_module_progress()
            summary = ", ".join([f"M{m}: {'Ochiq' if prog.get(m, {}).get('is_unlocked') else 'Qulf'}" for m in range(1, 7)])
            self.log_to_terminal("INFO", f"Modullar holati: {summary}")

        elif cmd == "scan":
            self.log_to_terminal("SECURITY", "Tarmoq interfeyslari skanerlanmoqda: eth0, lo0...")
            self.log_to_terminal("SECURITY", "[OK] Port 22 (SSH) - Himoyalangan. Port 80, 443 - Kuzatuv ostida.")

        elif cmd == "stats":
            prof = database.get_user_profile()
            self.log_to_terminal("STATS", f"Jami XP: {prof['xp_points']} | Daraja: {prof['current_rank']}")

        elif cmd == "clear":
            self.clear_terminal()

        else:
            self.log_to_terminal("ERROR", f"Noma'lum buyruq: '{cmd}'. 'help' buyrug'ini tering.")

    def refresh_user_profile(self):
        prof = database.get_user_profile()
        self.user_fullname_label.setText(prof.get("fullname", "Kiber Operator"))
        self.user_rank_label.setText(f"Unvon: {prof.get('current_rank', 'Kursant')}")
        self.user_xp_label.setText(f"Tajriba (XP): {prof.get('xp_points', 0)}")

def main():
    app = QApplication(sys.argv)
    window = CyberAcademyMainWindow()
    window.show()
    sys.exit(app.exec())

if __name__ == "__main__":
    main()
