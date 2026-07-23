@echo off
REM Double-click this file to open a ready Outlook draft (body + attachments) for Dr. Nejat.
REM It opens the draft for review only. It does NOT send. Add the recipient and hit Send.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0Open_Outlook_Draft.ps1"
if %errorlevel% neq 0 (
  echo.
  echo Something went wrong. Make sure desktop Outlook is installed and you are signed in.
  pause
)
