# Backs up the whole toolkit folder to its private GitHub repo
# (github.com/bustercherry99/MINIBOX-TOOLKIT). Runs 3x/day via the
# "MiniBox GitHub Backup" scheduled task — see register-backup-task.ps1.
#
# Silent no-op if nothing changed since the last run. .gitignore already
# keeps .env.local, the wetransfer training zip, the two offline install
# zips, and the bank/W-9 PDFs out of every commit - never remove those
# entries just to make a stuck commit go through.

$ErrorActionPreference = 'Stop'
$repo = 'C:\Users\erikb\Documents\Claude\Projects\MINIBOXSALES TOOL'
Set-Location $repo

$status = git status --porcelain
if (-not $status) {
    exit 0   # nothing changed - nothing to do
}

git add -A

$stamp = Get-Date -Format 'yyyy-MM-dd HH:mm'
git commit -q -m "Auto-backup: $stamp"

git push origin main
