# Quick Onboard Minister Example
# This script creates a sample minister user for testing

Write-Host "🎯 Creating Sample Minister User for PPMS" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Sample minister credentials
$email = "minister@ppms.gov.in"
$password = "Minister@2024!"
$displayName = "Hon. Chief Minister"
$role = "minister"
$department = "Chief Minister's Office"

Write-Host "Creating user with:" -ForegroundColor Yellow
Write-Host "  Email: $email" -ForegroundColor White
Write-Host "  Name: $displayName" -ForegroundColor White
Write-Host "  Role: $role" -ForegroundColor White
Write-Host "  Department: $department" -ForegroundColor White
Write-Host ""

# Run the onboarding script
.\onboard-user.ps1 `
    -Email $email `
    -Password $password `
    -DisplayName $displayName `
    -Role $role `
    -Department $department

Write-Host ""
Write-Host "✅ Sample minister user created!" -ForegroundColor Green
Write-Host ""
Write-Host "You can now login at: http://localhost:4201/login" -ForegroundColor Cyan
Write-Host ""
Write-Host "Login Credentials:" -ForegroundColor Yellow
Write-Host "  Email: $email" -ForegroundColor White
Write-Host "  Password: $password" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  Remember to change the password after first login!" -ForegroundColor Yellow
