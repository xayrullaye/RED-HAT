@echo off
chcp 65001 > nul
echo ========================================================
echo    KIBER AKADEMIYA - WINDOWS .EXE KOMPILYATSIYA SCRIPT
echo ========================================================
echo.

echo [1/3] Virtual muhit va kutubxonalar tekshirilmoqda...
pip install -r requirements.txt

echo.
echo [2/3] PyInstaller orqali bitta mustaqil .exe yig'ilmoqda...
pyinstaller --noconfirm --onedir --windowed ^
    --name="KiberAkademiya_Uz" ^
    --add-data="cyber_academy.db;." ^
    main.py

echo.
echo [3/3] Bitta mustaqil .exe fayl (Onefile rejimi):
pyinstaller --noconfirm --onefile --windowed ^
    --name="KiberAkademiya_Standalone" ^
    main.py

echo.
echo ========================================================
echo [MUVAFFAQIN!] .exe fayl 'dist/' papkasida yaratildi:
echo dist\KiberAkademiya_Standalone.exe
echo ========================================================
pause
