# Ngrok Troubleshooting Script

Write-Host "=== Ngrok Troubleshooting ===" -ForegroundColor Cyan
Write-Host ""

# Check if ngrok is installed
Write-Host "1. Checking if ngrok is installed..." -ForegroundColor Yellow
try {
    $ngrokVersion = ngrok version 2>&1
    Write-Host "   ✓ Ngrok is installed" -ForegroundColor Green
    Write-Host "   Version: $ngrokVersion" -ForegroundColor Gray
} catch {
    Write-Host "   ✗ Ngrok is NOT installed" -ForegroundColor Red
    Write-Host "   Solution: Download from https://ngrok.com/download" -ForegroundColor Yellow
    Write-Host "   Or use: npx ngrok http 3000" -ForegroundColor Yellow
    exit
}

Write-Host ""

# Check if port 3000 is in use
Write-Host "2. Checking if port 3000 is available..." -ForegroundColor Yellow
$port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($port3000) {
    Write-Host "   ⚠ Port 3000 is already in use" -ForegroundColor Yellow
    Write-Host "   Process using port 3000:" -ForegroundColor Gray
    $port3000 | ForEach-Object {
        $process = Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue
        if ($process) {
            Write-Host "     - $($process.ProcessName) (PID: $($process.Id))" -ForegroundColor Gray
        }
    }
    Write-Host "   Solution: Stop the process or use different port" -ForegroundColor Yellow
} else {
    Write-Host "   ✓ Port 3000 is available" -ForegroundColor Green
}

Write-Host ""

# Check if ngrok is already running
Write-Host "3. Checking if ngrok is already running..." -ForegroundColor Yellow
try {
    $ngrokStatus = Invoke-RestMethod -Uri "http://localhost:4040/api/tunnels" -ErrorAction SilentlyContinue
    if ($ngrokStatus.tunnels) {
        Write-Host "   ⚠ Ngrok is already running!" -ForegroundColor Yellow
        $httpsUrl = ($ngrokStatus.tunnels | Where-Object { $_.proto -eq "https" }).public_url
        if ($httpsUrl) {
            Write-Host "   Ngrok URL: $httpsUrl" -ForegroundColor Green
            Write-Host ""
            Write-Host "   Update your .env file with:" -ForegroundColor Cyan
            Write-Host "   NEXT_PUBLIC_BASE_URL=$httpsUrl" -ForegroundColor White
        }
    } else {
        Write-Host "   ✓ Ngrok is not running" -ForegroundColor Green
    }
} catch {
    Write-Host "   ✓ Ngrok is not running (this is OK)" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== To Start Ngrok ===" -ForegroundColor Cyan
Write-Host "Run this command:" -ForegroundColor Yellow
Write-Host "  ngrok http 3000" -ForegroundColor White
Write-Host ""
Write-Host "Or if ngrok is not in PATH:" -ForegroundColor Yellow
Write-Host "  npx ngrok http 3000" -ForegroundColor White
Write-Host ""
Write-Host "After ngrok starts, copy the HTTPS URL and update .env file" -ForegroundColor Yellow
