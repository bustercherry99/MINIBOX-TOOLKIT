# Opens a ready-to-send Outlook draft for Dr. Nejat with the body written and the PDFs attached.
# It only OPENS the draft for your review. It does NOT send. You add the recipient and hit Send.

$ErrorActionPreference = 'Stop'
$dir = $PSScriptRoot

$attachments = @(
  'Dr_Nejat_Allergy_MiniBox_Email.pdf',
  'Allergy_Will_You_Get_Paid_Reference.pdf',
  'Dr_Nejat_ROI_Allergy.pdf',
  'Dr_Nejat_Quote_00007445.pdf',
  'MiniBox_CHEST_Validation_Study.pdf',
  'MiniBox_Full_Brochure.pdf'
)

try {
    $outlook = New-Object -ComObject Outlook.Application
} catch {
    Write-Host "Could not start Outlook. Make sure the desktop Outlook app is installed and you are signed in." -ForegroundColor Red
    Read-Host "Press Enter to close"
    exit 1
}

$mail = $outlook.CreateItem(0)
$mail.Subject = "MiniBox+ for NY Allergy and Sinus Centers, everything for your team to review"

$mail.HTMLBody = @"
<div style='font-family:Calibri,Arial,sans-serif;font-size:11pt;color:#222'>
<p>Dr. Nejat,</p>
<p>Thank you again for your time. As promised, here is everything you and your team need to review the MiniBox+ in one place. I kept the documents organized so each person can go straight to what matters to them:</p>
<ul>
<li><b>Briefing</b> &ndash; the clinical case for full PFTs (lung volumes and DLCO, not just spirometry) in an allergy practice, plus how it is coded and covered in New York.</li>
<li><b>Will You Get Paid reference</b> &ndash; the allergy and asthma CPT, coverage, frequency, and ICD-10 pairing sheet for your biller.</li>
<li><b>ROI</b> &ndash; what the device returns at your patient volume, and when it pays for itself.</li>
<li><b>Quote</b> &ndash; the all in pricing (number 00007445).</li>
<li><b>CHEST validation study</b> and the <b>full MiniBox+ brochure</b> &ndash; the published data and the complete product overview.</li>
</ul>
<p>Take a look, share it with whoever needs to weigh in, and tell me if anything else would help. I am happy to jump on a quick call with your team if any questions come up.</p>
<p>Best regards,<br>
Erik Bernard<br>
PulmOne Advanced Medical Devices<br>
[phone] | erik.bernard@pulm-one.com</p>
</div>
"@

foreach ($name in $attachments) {
    $path = Join-Path $dir $name
    if (Test-Path $path) {
        $mail.Attachments.Add($path) | Out-Null
    } else {
        Write-Host "WARNING: could not find $name in this folder." -ForegroundColor Yellow
    }
}

$mail.Display()
