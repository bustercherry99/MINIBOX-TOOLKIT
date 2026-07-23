# MiniBox+ Toolkit — desktop pop for the problem-report watcher.
#
# The watcher runs every 15 minutes all day. Notifying on every run would make
# it wallpaper, so it stays silent and calls this ONLY when it actually did
# something: a report came in, or one needs Erik.
#
#   powershell -ExecutionPolicy Bypass -File notify.ps1 -Title "..." -Body "..."

param(
  [Parameter(Mandatory = $true)][string]$Title,
  [Parameter(Mandatory = $true)][string]$Body
)

# Ride the built-in PowerShell app id so no toast app has to be registered.
$AppId = '{1AC14E77-02E7-4E5D-B744-2EB1AE5198B7}\WindowsPowerShell\v1.0\powershell.exe'

try {
  [Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime] | Out-Null
  [Windows.Data.Xml.Dom.XmlDocument, Windows.Data.Xml.Dom, ContentType = WindowsRuntime] | Out-Null

  $template = [Windows.UI.Notifications.ToastNotificationManager]::GetTemplateContent(
    [Windows.UI.Notifications.ToastTemplateType]::ToastText02)

  $texts = $template.GetElementsByTagName('text')
  $texts.Item(0).AppendChild($template.CreateTextNode($Title)) | Out-Null
  $texts.Item(1).AppendChild($template.CreateTextNode($Body)) | Out-Null

  $toast = [Windows.UI.Notifications.ToastNotification]::new($template)
  [Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier($AppId).Show($toast)
  Write-Output 'popped'
}
catch {
  # A missing toast is not a reason to fail the run — the write-up is already
  # in the Command Center either way. Say so and move on.
  Write-Output ('no-toast: ' + $_.Exception.Message)
}
