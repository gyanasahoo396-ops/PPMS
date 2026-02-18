# User Onboarding Script for PPMS
# PowerShell wrapper for easy user creation

param(
    [Parameter(Mandatory=$true)]
    [string]$Email,
    
    [Parameter(Mandatory=$true)]
    [string]$Password,
    
    [Parameter(Mandatory=$true)]
    [string]$DisplayName,
    
    [Parameter(Mandatory=$true)]
    [ValidateSet('minister', 'admin', 'manager', 'viewer')]
    [string]$Role,
    
    [Parameter(Mandatory=$false)]
    [string]$Department = ""
)

Write-Host "🚀 PPMS User Onboarding Script" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: Node.js is not installed" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check if firebase-admin-key.json exists
if (-not (Test-Path "firebase-admin-key.json")) {
    Write-Host "⚠️  Warning: firebase-admin-key.json not found" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To create this file:" -ForegroundColor White
    Write-Host "1. Go to Firebase Console: https://console.firebase.google.com/" -ForegroundColor White
    Write-Host "2. Select your project (ppms-b8d2b)" -ForegroundColor White
    Write-Host "3. Go to Project Settings > Service Accounts" -ForegroundColor White
    Write-Host "4. Click 'Generate New Private Key'" -ForegroundColor White
    Write-Host "5. Save the file as 'firebase-admin-key.json' in the project root" -ForegroundColor White
    Write-Host ""
    
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne 'y') {
        exit 1
    }
}

# Install firebase-admin if not already installed
Write-Host ""
Write-Host "📦 Checking dependencies..." -ForegroundColor Cyan
if (-not (Test-Path "node_modules/firebase-admin")) {
    Write-Host "Installing firebase-admin..." -ForegroundColor Yellow
    npm install firebase-admin
}

# Run the onboarding script
Write-Host ""
if ($Department) {
    node onboard-user.mjs "$Email" "$Password" "$DisplayName" "$Role" "$Department"
} else {
    node onboard-user.mjs "$Email" "$Password" "$DisplayName" "$Role"
}
