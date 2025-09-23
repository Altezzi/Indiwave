# Indiwave Docker Deployment Script
# This script deploys the Indiwave application using Docker directly (no Portainer)

Write-Host "🚀 Starting Indiwave Docker Deployment..." -ForegroundColor Green

# Stop and remove existing containers
Write-Host "🛑 Stopping existing containers..." -ForegroundColor Yellow
docker-compose -f docker-compose.live.yml down

# Build the application image
Write-Host "🔨 Building application image..." -ForegroundColor Yellow
docker-compose -f docker-compose.live.yml build --no-cache

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

# Start the services
Write-Host "🚀 Starting services..." -ForegroundColor Yellow
docker-compose -f docker-compose.live.yml up -d

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    exit 1
}

# Wait for services to start
Write-Host "⏳ Waiting for services to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Check if services are running
Write-Host "🔍 Checking service status..." -ForegroundColor Yellow
docker-compose -f docker-compose.live.yml ps

# Test the API
Write-Host "🧪 Testing API..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:2222/api/comics" -UseBasicParsing -TimeoutSec 10
    $data = $response.Content | ConvertFrom-Json
    Write-Host "✅ API is working! Found $($data.pagination.total) comics" -ForegroundColor Green
} catch {
    Write-Host "⚠️ API test failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "🎉 Deployment complete!" -ForegroundColor Green
Write-Host "📱 Your site is available at: http://localhost:2222" -ForegroundColor Cyan
Write-Host "📊 API endpoint: http://localhost:2222/api/comics" -ForegroundColor Cyan

Write-Host "`n📋 Useful commands:" -ForegroundColor White
Write-Host "  View logs: docker-compose -f docker-compose.live.yml logs -f" -ForegroundColor Gray
Write-Host "  Stop services: docker-compose -f docker-compose.live.yml down" -ForegroundColor Gray
Write-Host "  Restart: docker-compose -f docker-compose.live.yml restart" -ForegroundColor Gray
