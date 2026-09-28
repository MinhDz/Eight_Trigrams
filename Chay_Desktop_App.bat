@echo off
chcp 65001 > nul
echo ======================================================
echo    ☯ KHỞI ĐỘNG ỨNG DỤNG BÁT QUÁI CHẠY NGẦM WINDOWS ☯
echo ======================================================
echo.
cd /d "%~dp0"

if not exist "node_modules\electron" (
    echo Đang cài đặt thư viện Electron lần đầu (vui lòng chờ trong giây lát)...
    call npm install electron --save-dev
)

echo Đang khởi chạy ứng dụng Desktop chạy ngầm trong khay hệ thống...
echo Bạn có thể mở Bát Quái bất kỳ lúc nào bằng phím tắt: Ctrl + Shift + B
echo.
npm start

