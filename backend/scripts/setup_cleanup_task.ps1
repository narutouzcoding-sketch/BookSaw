# BooksCatalog — OAuth State Cleanup Scheduled Task
# ---------------------------------------------------
# Bu skript cleanup_oauth_states management commandni
# har soatda avtomatik ishga tushirish uchun Windows Task Scheduler'da
# yangi vazifa yaratadi.
#
# Ishlatish:
#   PowerShell'ni Administrator sifatida oching va shu skriptni bajaring:
#   .\backend\scripts\setup_cleanup_task.ps1
#
# Tekshirish:
#   Get-ScheduledTask -TaskName "BooksCatalog_OAuthCleanup" | Get-ScheduledTaskInfo
#   NextRunTime doim ~1 soatdan keyin ko'rsatilishi kerak.
# ---------------------------------------------------

$PythonExe = "d:\My Projects\BooksCatalog\venv\Scripts\python.exe"
$ManagePy  = "d:\My Projects\BooksCatalog\backend\manage.py"

$Action  = New-ScheduledTaskAction -Execute $PythonExe -Argument "$ManagePy cleanup_oauth_states --hours 1"

# -RepetitionDuration ([TimeSpan]::MaxValue) shart — bu qo'shilmasa
# ba'zi Windows versiyalarida (Server 2016, Windows 10 LTSC)
# -RepetitionInterval faqat 24 soat ichida ishlaydi, keyin to'xtaydi.
$Trigger = New-ScheduledTaskTrigger -Daily -At 00:00 `
    -RepetitionInterval (New-TimeSpan -Hours 1) `
    -RepetitionDuration ([TimeSpan]::MaxValue)

Register-ScheduledTask `
    -TaskName "BooksCatalog_OAuthCleanup" `
    -Action $Action `
    -Trigger $Trigger `
    -Description "Eski OAuthState, TelegramLoginState, TelegramOTP yozuvlarini har soatda tozalash"

Write-Host ""
Write-Host "Task ro'yxatdan o'tkazildi. Tekshirish:" -ForegroundColor Green
Get-ScheduledTask -TaskName "BooksCatalog_OAuthCleanup" | Get-ScheduledTaskInfo
