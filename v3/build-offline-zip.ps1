# ============================================================
#  build-offline-zip.ps1
#  Rebuilds the OFFLINE copy of the MiniBox Sales Toolkit.
#
#  WHY: the offline zip does NOT auto-update when we deploy the
#  online app. Run this whenever the toolkit changes so reps who
#  run it with no internet get the current version.
#
#  HOW: right-click this file -> Run with PowerShell.
#  (If a PDF/material changed, run build-materials-data.ps1 FIRST
#   so materials-data.js is rebuilt, then run this.)
# ============================================================

$ErrorActionPreference = 'Stop'
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $here

$master   = 'MiniBox Sales Toolkit (LATEST).html'   # the file we edit
$offline  = 'index.html'                             # offline entry point (double-click this)
$dataJs   = 'materials-data.js'
$matDir   = 'materials'
$readme   = 'README-OFFLINE.txt'
$zipName  = 'MiniBox_Toolkit_v3_offline.zip'

if (-not (Test-Path $master))  { throw "Missing master file: $master" }
if (-not (Test-Path $dataJs))  { throw "Missing $dataJs (run build-materials-data.ps1 first)" }
if (-not (Test-Path $matDir))  { throw "Missing $matDir folder" }

# 1) Refresh the offline entry point from the current master.
Copy-Item -LiteralPath $master -Destination $offline -Force
Write-Host "Refreshed $offline from '$master'"

# 2) Stage copies in a temp folder first. This sidesteps files that are
#    momentarily locked by another app (e.g. a browser/Explorer preview
#    holding an .mp4 open) and avoids locking the live materials while zipping.
$stage = Join-Path $env:TEMP ("mbx-offline-" + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $stage | Out-Null
try {
    Copy-Item -LiteralPath $offline -Destination (Join-Path $stage $offline) -Force
    Copy-Item -LiteralPath $dataJs  -Destination (Join-Path $stage $dataJs)  -Force
    Copy-Item -LiteralPath $matDir  -Destination (Join-Path $stage $matDir)  -Recurse -Force
    if (Test-Path $readme) { Copy-Item -LiteralPath $readme -Destination (Join-Path $stage $readme) -Force }

    # 3) (Re)build the zip from the staged copies, replacing any old one.
    if (Test-Path $zipName) { Remove-Item -LiteralPath $zipName -Force }
    Compress-Archive -Path (Join-Path $stage '*') -DestinationPath $zipName -CompressionLevel Optimal -Force
}
finally {
    Remove-Item -LiteralPath $stage -Recurse -Force -ErrorAction SilentlyContinue
}

$mb = [math]::Round((Get-Item $zipName).Length / 1MB, 1)
Write-Host ""
Write-Host "DONE. Rebuilt $zipName ($mb MB) with the current toolkit + $((Get-ChildItem $matDir -File).Count) materials."
Write-Host "Reps can unzip it anywhere and double-click index.html - fully offline, no internet needed."
