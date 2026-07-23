# One-time setup: registers the "MiniBox GitHub Backup" Windows Scheduled Task,
# which runs scripts/backup-to-github.ps1 three times a day. Safe to re-run -
# it replaces any existing task of the same name.
#
# Run it from the repo:
#   powershell -ExecutionPolicy Bypass -File scripts\register-backup-task.ps1
#
# To change the times, edit $Times below and re-run. To remove it:
#   Unregister-ScheduledTask -TaskName "MiniBox GitHub Backup" -Confirm:$false

$TaskName = 'MiniBox GitHub Backup'
$script   = 'C:\Users\erikb\Documents\Claude\Projects\MINIBOXSALES TOOL\scripts\backup-to-github.ps1'

# Morning, afternoon, and overnight - per Erik: "I'm changing things literally
# hourly," so three checkpoints a day catches a full day's work in the worst
# case gap and one before the workday even starts.
$Times = @('8:00AM', '2:00PM', '2:00AM')

$action = New-ScheduledTaskAction -Execute 'powershell.exe' `
    -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$script`""

$trigger = $Times | ForEach-Object { New-ScheduledTaskTrigger -Daily -At $_ }

# Run in the logged-in user's session (so git uses your saved GitHub login).
$principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType Interactive -RunLevel Limited

# Reliability settings, same as the Dragons stats task:
#   -StartWhenAvailable        run a missed run as soon as the PC is available again
#   -WakeToRun                 wake the PC from sleep for the 2 AM run
#   -AllowStartIfOnBatteries   run even on battery (laptop unplugged)
#   -DontStopIfGoingOnBatteries don't kill the push mid-run if it unplugs
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -WakeToRun `
    -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries `
    -ExecutionTimeLimit (New-TimeSpan -Minutes 10)

Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $trigger `
    -Principal $principal -Settings $settings `
    -Description 'Commits and pushes any MiniBox toolkit changes to the private GitHub repo, 3x/day. Silent no-op if nothing changed.' `
    -Force | Out-Null

Write-Output "Registered scheduled task '$TaskName' - runs at $($Times -join ', ') daily."
