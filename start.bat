@echo off
echo === PetVet - Pornire ===

echo [1/3] Pornesc MySQL...
start "MySQL" /min "D:\xampp\mysql\bin\mysqld.exe" --defaults-file="D:\xampp\mysql\bin\my.ini"
timeout /t 3 /nobreak >nul

echo [2/3] Pornesc serverul backend (HTTPS :3443)...
start "PetVet Backend" cmd /k "cd /d D:\petvet-app\server && npm run dev"
timeout /t 2 /nobreak >nul

echo [3/3] Pornesc frontend-ul (HTTPS :5173)...
start "PetVet Frontend" cmd /k "cd /d D:\petvet-app && npm run dev"

echo.
echo Gata! Deschide pe telefon: https://192.168.10.122:5173
echo (accepta avertismentul de certificat la prima accesare)
pause
