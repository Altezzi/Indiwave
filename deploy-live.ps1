# Indiwave Live Deployment Script for Windows
Write-Host "🚀 Deploying Indiwave Live Site with Local Series Support..." -ForegroundColor Green

# Stop existing containers
Write-Host "🛑 Stopping existing containers..." -ForegroundColor Yellow
docker-compose -f docker-compose.live.yml down

# Build the new image
Write-Host "🔨 Building Docker image..." -ForegroundColor Yellow
docker build -t indiwave:latest .

# Check if series folder exists
if (-not (Test-Path "series")) {
    Write-Host "⚠️  Warning: Series folder not found. Creating empty directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path "series" -Force
}

# Start the live deployment
Write-Host "🚀 Starting live deployment..." -ForegroundColor Green
docker-compose -f docker-compose.live.yml up -d

# Wait for the service to be ready
Write-Host "⏳ Waiting for service to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check if the service is running
$containers = docker-compose -f docker-compose.live.yml ps
if ($containers -match "Up") {
    Write-Host "✅ Deployment successful!" -ForegroundColor Green
    Write-Host "🌐 Site should be available at: http://indiwave.io:2222" -ForegroundColor Cyan
    Write-Host "📁 Local series folder is mounted and ready" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📋 Next steps:" -ForegroundColor White
    Write-Host "1. Go to http://indiwave.io:2222/admin" -ForegroundColor White
    Write-Host "2. Click 'Local Series Management' tab" -ForegroundColor White
    Write-Host "3. Click 'Check Status' to see your series folders" -ForegroundColor White
    Write-Host "4. Click 'Sync Series Folder' to import your manga" -ForegroundColor White
} else {
    Write-Host "❌ Deployment failed. Check logs with:" -ForegroundColor Red
    Write-Host "docker-compose -f docker-compose.live.yml logs" -ForegroundColor Red
}
