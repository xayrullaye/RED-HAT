# -*- coding: utf-8 -*-
"""
KiberAkademiya - Kiber / Hacker HUD Vizual Mavzusi (QSS Stillari)
Ranglar:
  Asosiy fon: #0A0E17 (Chuqur kiber-qora)
  Panellar va kartalar: #111927 (Qora slanes)
  Asosiy yorug'lik va matnlar: #00FF66 (Neon yashil) va #00E5FF (Elektr feruza)
  Ogohlantirishlar va aksentlar: #FF0055 (Kiber qizil)
  Shriftlar: Monospace ('Fira Code', 'Consolas', 'Courier New')
"""

COLOR_BG = "#0A0E17"
COLOR_PANEL = "#111927"
COLOR_PANEL_HOVER = "#1E293B"
COLOR_NEON_GREEN = "#00FF66"
COLOR_ELECTRIC_CYAN = "#00E5FF"
COLOR_CYBER_RED = "#FF0055"
COLOR_TEXT_MAIN = "#E2E8F0"
COLOR_TEXT_MUTED = "#94A3B8"
COLOR_BORDER = "#1E293B"

CYBER_HUD_QSS = f"""
/* Umumiy oyna va vidjetlar */
QMainWindow, QWidget {{
    background-color: {COLOR_BG};
    color: {COLOR_TEXT_MAIN};
    font-family: 'Fira Code', 'Consolas', 'Courier New', monospace;
    font-size: 13px;
}}

/* Yon panel (Sidebar) */
#SidebarPanel {{
    background-color: {COLOR_PANEL};
    border-right: 1px solid rgba(0, 229, 255, 0.2);
    min-width: 250px;
    max-width: 270px;
}}

/* Asosiy kontent maydoni */
#ContentArea {{
    background-color: {COLOR_BG};
}}

/* Kartalar va ramkalar */
QFrame#CardFrame, QFrame#HUDCard {{
    background-color: {COLOR_PANEL};
    border: 1px solid rgba(0, 229, 255, 0.25);
    border-radius: 4px;
    padding: 12px;
}}

QFrame#CardFrame:hover, QFrame#HUDCard:hover {{
    border: 1px solid {COLOR_ELECTRIC_CYAN};
}}

/* Kiber Tugmalar */
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

QPushButton:pressed {{
    background-color: rgba(0, 255, 102, 0.3);
}}

QPushButton:disabled {{
    background-color: #0F172A;
    color: #475569;
    border: 1px solid #334155;
}}

/* Maxsus qizil harakat tugmasi */
QPushButton#DangerButton {{
    color: {COLOR_CYBER_RED};
    border: 1px solid {COLOR_CYBER_RED};
}}

QPushButton#DangerButton:hover {{
    background-color: rgba(255, 0, 85, 0.15);
    color: #FFFFFF;
}}

/* Feruza aksentli tugma */
QPushButton#CyanButton {{
    color: {COLOR_ELECTRIC_CYAN};
    border: 1px solid {COLOR_ELECTRIC_CYAN};
}}

QPushButton#CyanButton:hover {{
    background-color: rgba(0, 229, 255, 0.15);
    color: #FFFFFF;
}}

/* Yon menyu tugmalari */
QPushButton#NavButton {{
    text-align: left;
    padding: 10px 14px;
    background-color: transparent;
    border: 1px solid transparent;
    color: {COLOR_TEXT_MAIN};
    border-radius: 2px;
}}

QPushButton#NavButton:hover {{
    background-color: rgba(0, 229, 255, 0.1);
    color: {COLOR_ELECTRIC_CYAN};
    border-left: 3px solid {COLOR_ELECTRIC_CYAN};
}}

QPushButton#NavButton[active="true"] {{
    background-color: rgba(0, 255, 102, 0.15);
    color: {COLOR_NEON_GREEN};
    border-left: 3px solid {COLOR_NEON_GREEN};
}}

/* Mini-terminal va Konsol */
QTextEdit#TerminalLog, QPlainTextEdit#TerminalLog {{
    background-color: #05080E;
    color: {COLOR_NEON_GREEN};
    border: 1px solid rgba(0, 255, 102, 0.3);
    border-radius: 4px;
    font-family: 'Fira Code', 'Consolas', monospace;
    font-size: 12px;
    padding: 8px;
    selection-background-color: rgba(0, 255, 102, 0.3);
}}

/* Matn kiritish maydonlari (Inputs) */
QLineEdit, QTextEdit, QPlainTextEdit {{
    background-color: #0A0E17;
    color: {COLOR_TEXT_MAIN};
    border: 1px solid rgba(0, 229, 255, 0.3);
    border-radius: 3px;
    padding: 6px 10px;
    font-family: 'Fira Code', monospace;
}}

QLineEdit:focus, QTextEdit:focus {{
    border: 1px solid {COLOR_ELECTRIC_CYAN};
    background-color: #0E1522;
}}

/* Dars matnini o'qish maydoni */
QTextBrowser#LessonBrowser {{
    background-color: {COLOR_PANEL};
    color: {COLOR_TEXT_MAIN};
    border: 1px solid rgba(0, 229, 255, 0.2);
    border-radius: 4px;
    padding: 18px;
    font-size: 14px;
    line-height: 1.6;
}}

/* Progress Bar (Kiber progress indikatori) */
QProgressBar {{
    background-color: #0A0E17;
    border: 1px solid rgba(0, 229, 255, 0.3);
    border-radius: 3px;
    text-align: center;
    color: #FFFFFF;
    font-weight: bold;
    height: 18px;
}}

QProgressBar::chunk {{
    background-color: qlineargradient(x1:0, y1:0, x2:1, y2:0,
                                      stop:0 {COLOR_ELECTRIC_CYAN}, stop:1 {COLOR_NEON_GREEN});
    border-radius: 2px;
}}

/* Radio tugmalar (Test variantlari) */
QRadioButton {{
    color: {COLOR_TEXT_MAIN};
    spacing: 10px;
    font-size: 13px;
    padding: 6px;
    border-radius: 3px;
}}

QRadioButton:hover {{
    background-color: rgba(0, 229, 255, 0.08);
}}

QRadioButton::indicator {{
    width: 16px;
    height: 16px;
    border: 1px solid {COLOR_ELECTRIC_CYAN};
    border-radius: 8px;
    background-color: #0A0E17;
}}

QRadioButton::indicator:checked {{
    background-color: {COLOR_NEON_GREEN};
    border: 2px solid #FFFFFF;
}}

/* Skroll paneli (Scrollbar) */
QScrollBar:vertical {{
    background-color: #0A0E17;
    width: 8px;
    margin: 0px;
}}

QScrollBar::handle:vertical {{
    background-color: #1E293B;
    border: 1px solid rgba(0, 229, 255, 0.2);
    border-radius: 4px;
    min-height: 20px;
}}

QScrollBar::handle:vertical:hover {{
    background-color: {COLOR_ELECTRIC_CYAN};
}}

QScrollBar::add-line:vertical, QScrollBar::sub-line:vertical {{
    height: 0px;
}}

/* Tab paneli */
QTabWidget::pane {{
    border: 1px solid rgba(0, 229, 255, 0.25);
    background-color: {COLOR_PANEL};
}}

QTabBar::tab {{
    background-color: #0A0E17;
    color: {COLOR_TEXT_MUTED};
    border: 1px solid rgba(0, 229, 255, 0.2);
    padding: 8px 16px;
    margin-right: 2px;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
}}

QTabBar::tab:selected {{
    background-color: {COLOR_PANEL};
    color: {COLOR_ELECTRIC_CYAN};
    border-bottom: 2px solid {COLOR_ELECTRIC_CYAN};
}}
"""
