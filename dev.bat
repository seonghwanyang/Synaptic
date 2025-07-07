@echo off
echo Starting Frontend and Backend servers...
echo.

start cmd /k "cd frontend && echo Starting Frontend on http://localhost:3000 && npm run dev"
start cmd /k "cd backend && echo Starting Backend on http://localhost:5000 && npm run dev"

echo.
echo Servers are starting in separate windows...
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:5000
echo.
echo Press any key to exit...
pause >nul