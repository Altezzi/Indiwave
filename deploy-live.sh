#!/bin/bash

echo "🚀 Deploying Indiwave Live Site with Local Series Support..."

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.live.yml down

# Build the new image
echo "🔨 Building Docker image..."
docker build -t indiwave:latest .

# Check if series folder exists
if [ ! -d "series" ]; then
    echo "⚠️  Warning: Series folder not found. Creating empty directory..."
    mkdir -p series
fi

# Start the live deployment
echo "🚀 Starting live deployment..."
docker-compose -f docker-compose.live.yml up -d

# Wait for the service to be ready
echo "⏳ Waiting for service to be ready..."
sleep 10

# Check if the service is running
if docker-compose -f docker-compose.live.yml ps | grep -q "Up"; then
    echo "✅ Deployment successful!"
    echo "🌐 Site should be available at: http://indiwave.io:2222"
    echo "📁 Local series folder is mounted and ready"
    echo ""
    echo "📋 Next steps:"
    echo "1. Go to http://indiwave.io:2222/admin"
    echo "2. Click 'Local Series Management' tab"
    echo "3. Click 'Check Status' to see your series folders"
    echo "4. Click 'Sync Series Folder' to import your manga"
else
    echo "❌ Deployment failed. Check logs with:"
    echo "docker-compose -f docker-compose.live.yml logs"
fi

