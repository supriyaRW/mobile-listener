# Network Connectivity Test Script
# Run this script to diagnose network issues

Write-Host "=== Network Connectivity Diagnostic ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if server is running
Write-Host "Step 1: Checking if server is running..." -ForegroundColor Yellow
$serverRunning = Test-NetConnection -ComputerName localhost -Port 3000 -InformationLevel Quiet -WarningAction SilentlyContinue
if ($serverRunning) {
    Write-Host "✓ Server is running on port 3000" -ForegroundColor Green
} else {
    Write-Host "✗ Server is NOT running on port 3000" -ForegroundColor Red
    Write-Host "  → Start server with: npm run dev:network" -ForegroundColor Yellow
    Write-Host ""
    exit
}

# Step 2: Get network IP
Write-Host ""
Write-Host "Step 2: Finding your network IP address..." -ForegroundColor Yellow
$ipConfig = ipconfig | Select-String -Pattern "IPv4" | Select-Object -First 1
$ipAddress = ($ipConfig -split ":")[1].Trim()
Write-Host "✓ Your IP address: $ipAddress" -ForegroundColor Green

# Step 3: Check .env file
Write-Host ""
Write-Host "Step 3: Checking .env configuration..." -ForegroundColor Yellow
if (Test-Path ".env") {
    $envContent = Get-Content ".env" -Raw
    if ($envContent -match "NEXT_PUBLIC_BASE_URL=(.+)") {
        $envUrl = $matches[1].Trim()
        Write-Host "✓ .env BASE_URL: $envUrl" -ForegroundColor Green
        
        if ($envUrl -match "localhost|127\.0\.0\.1") {
            Write-Host "⚠ WARNING: .env contains localhost!" -ForegroundColor Red
            Write-Host "  → Update .env to use: http://$ipAddress:3000" -ForegroundColor Yellow
        }
    } else {
        Write-Host "✗ NEXT_PUBLIC_BASE_URL not found in .env" -ForegroundColor Red
    }
} else {
    Write-Host "✗ .env file not found" -ForegroundColor Red
}

# Step 4: Test network accessibility
Write-Host ""
Write-Host "Step 4: Testing network accessibility..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://$ipAddress:3000" -TimeoutSec 3 -UseBasicParsing -ErrorAction Stop
    Write-Host "✓ Server is accessible at http://$ipAddress:3000" -ForegroundColor Green
    Write-Host "  Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "✗ Cannot access server at http://$ipAddress:3000" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Possible issues:" -ForegroundColor Yellow
    Write-Host "  1. Server not started with network access" -ForegroundColor Yellow
    Write-Host "     → Run: npm run dev:network" -ForegroundColor Cyan
    Write-Host "  2. Firewall blocking port 3000" -ForegroundColor Yellow
    Write-Host "     → Allow Node.js through Windows Firewall" -ForegroundColor Cyan
    Write-Host "  3. Wrong IP address" -ForegroundColor Yellow
    Write-Host "     → Update .env with correct IP" -ForegroundColor Cyan
}

# Step 5: Check firewall
Write-Host ""
Write-Host "Step 5: Checking Windows Firewall..." -ForegroundColor Yellow
$firewallRules = Get-NetFirewallRule | Where-Object { $_.DisplayName -like "*Node*" -or $_.DisplayName -like "*3000*" }
if ($firewallRules) {
    Write-Host "✓ Found firewall rules for Node.js/Port 3000" -ForegroundColor Green
} else {
    Write-Host "⚠ No firewall rules found for Node.js" -ForegroundColor Yellow
    Write-Host "  → You may need to allow Node.js through firewall" -ForegroundColor Yellow
}

# Summary
Write-Host ""
Write-Host "=== Summary ===" -ForegroundColor Cyan
Write-Host "Network IP: $ipAddress" -ForegroundColor White
Write-Host "Test URL: http://$ipAddress:3000" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Make sure server is running: npm run dev:network" -ForegroundColor Cyan
Write-Host "2. Test on mobile: Open http://$ipAddress:3000 in phone browser" -ForegroundColor Cyan
Write-Host "3. If mobile can't access, check firewall settings" -ForegroundColor Cyan
Write-Host "4. Ensure phone and computer are on same WiFi network" -ForegroundColor Cyan
