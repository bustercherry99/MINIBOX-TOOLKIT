@echo off
REM ============================================================
REM  PFT Billing Helper - Windows launcher
REM  Double-click this to open the tool in its own app window
REM  (no browser tabs, no address bar). Works fully offline.
REM  Keep this file in the same folder as the "PFT_Billing_App"
REM  folder.
REM ============================================================
set "APP=%~dp0PFT_Billing_App\index.html"

if not exist "%APP%" (
  echo Could not find the app at:
  echo   %APP%
  echo Make sure this .cmd file stays next to the PFT_Billing_App folder.
  pause
  exit /b 1
)

REM 1) Try Microsoft Edge in app mode (own window, no browser chrome)
start "" msedge --app="file:///%APP%" --window-size=1180,940 2>nul
if not errorlevel 1 goto done

REM 2) Fall back to Google Chrome in app mode
start "" chrome --app="file:///%APP%" --window-size=1180,940 2>nul
if not errorlevel 1 goto done

REM 3) Last resort: open in the default browser
start "" "%APP%"

:done
exit /b 0
