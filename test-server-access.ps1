# Quick Server Access Test
# Run this to verify server is accessible

Write-Host "=== Server Access Test ===" -ForegroundColor Cyan
Write-Host ""

$serverIP = "192.168.1.210"
$port = 3000
$baseUrl = "http://${serverIP}:${port}"

Write-Host "Testing server at: $baseUrl" -ForegroundColor Yellow
Write-Host ""

# Test 1: Check if port is listening
Write-Host "Test 1: Checking if port $port is listening..." -ForegroundColor Yellow
$portCheck = netstat -an | Select-String ":$port" | Select-String "LISTENING"
if ($portCheck) {
    Write-Host "✓ Port $port is listening" -ForegroundColor Green
    if ($portCheck -match "0\.0\.0\.0") {
        Write-Host "✓ Server is listening on all interfaces (network accessible)" -ForegroundColor Green
    } elseif ($portCheck -match "127\.0\.0\.1") {
        Write-Host "✗ Server is ONLY listening on localhost (NOT network accessible!)" -ForegroundColor Red
        Write-Host "  → Restart server with: npm run dev:network" -ForegroundColor Yellow
    }
} else {
    Write-Host "✗ Port $port is NOT listening" -ForegroundColor Red
    Write-Host "  → Start server with: npm run dev:network" -ForegroundColor Yellow
}

Write-Host ""

# Test 2: Try to access server
Write-Host "Test 2: Testing server accessibility..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri $baseUrl -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
    Write-Host "✓ Server is accessible!" -ForegroundColor Green
    Write-Host "  Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "  Response length: $($response.Content.Length) bytes" -ForegroundColor Green
} catch {
    Write-Host "✗ Cannot access server" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Possible issues:" -ForegroundColor Yellow
    Write-Host "  1. Server not running" -ForegroundColor Yellow
    Write-Host "  2. Server not started with network access" -ForegroundColor Yellow
    Write-Host "  3. Firewall blocking" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Solutions:" -ForegroundColor Cyan
    Write-Host "  → Start server: npm run dev:network" -ForegroundColor Cyan
    Write-Host "  → Check firewall: Allow Node.js through Windows Firewall" -ForegroundColor Cyan
}

Write-Host ""

# Test 3: Check firewall
Write-Host "Test 3: Checking firewall rules..." -ForegroundColor Yellow
$firewallRules = Get-NetFirewallRule | Where-Object { 
    ($_.DisplayName -like "*Node*") -or 
    ($_.DisplayName -like "*3000*") -or
    ($_.DisplayName -like "*Next*")
} | Select-Object DisplayName, Enabled, Direction

if ($firewallRules) {
    Write-Host "Found firewall rules:" -ForegroundColor Green
    $firewallRules | Format-Table -AutoSize
} else {
    Write-Host "⚠ No specific firewall rules found for Node.js/port 3000" -ForegroundColor Yellow
    Write-Host "  → You may need to allow Node.js through firewall" -ForegroundColor Yellow
}

Write-Host ""

# Summary
Write-Host "=== Summary ===" -ForegroundColor Cyan
Write-Host "Server IP: $serverIP" -ForegroundColor White
Write-Host "Port: $port" -ForegroundColor White
Write-Host "URL: $baseUrl" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Make sure server is running: npm run dev:network" -ForegroundColor Cyan
Write-Host "2. Test on phone: Open $baseUrl in phone browser" -ForegroundColor Cyan
Write-Host "3. Ensure phone and computer are on same WiFi" -ForegroundColor Cyan
Write-Host "4. If still not working, check firewall settings" -ForegroundColor Cyan
