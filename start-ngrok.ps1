# PowerShell script to start ngrok and update .env automatically

Write-Host "Starting ngrok on port 3000..." -ForegroundColor Green

# Start ngrok in background and capture output
$ngrokProcess = Start-Process -FilePath "ngrok" -ArgumentList "http", "3000" -NoNewWindow -PassThru -RedirectStandardOutput "ngrok-output.txt" -RedirectStandardError "ngrok-error.txt"

Start-Sleep -Seconds 3

# Try to get ngrok URL from API (if ngrok is running)
try {
    $ngrokInfo = Invoke-RestMethod -Uri "http://localhost:4040/api/tunnels" -ErrorAction SilentlyContinue
    if ($ngrokInfo.tunnels) {
        $httpsUrl = ($ngrokInfo.tunnels | Where-Object { $_.proto -eq "https" }).public_url
        if ($httpsUrl) {
            Write-Host "Ngrok URL found: $httpsUrl" -ForegroundColor Green
            Write-Host ""
            Write-Host "To update .env file, run:" -ForegroundColor Yellow
            Write-Host "  Set-Content -Path '.env' -Value (Get-Content '.env' | ForEach-Object { if (`$_ -match 'NEXT_PUBLIC_BASE_URL=') { 'NEXT_PUBLIC_BASE_URL=' + '$httpsUrl' } else { `$_ } })" -ForegroundColor Cyan
            Write-Host ""
            Write-Host "Or manually edit .env and set:" -ForegroundColor Yellow
            Write-Host "  NEXT_PUBLIC_BASE_URL=$httpsUrl" -ForegroundColor Cyan
        }
    }
} catch {
    Write-Host "Could not automatically detect ngrok URL." -ForegroundColor Yellow
    Write-Host "Check ngrok output window for the URL." -ForegroundColor Yellow
    Write-Host "Look for: Forwarding https://xxxxx.ngrok-free.app -> http://localhost:3000" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Ngrok is running. Press Ctrl+C to stop." -ForegroundColor Green
Write-Host "Don't close this window!" -ForegroundColor Yellow

# Keep script running
Wait-Process -Id $ngrokProcess.Id
