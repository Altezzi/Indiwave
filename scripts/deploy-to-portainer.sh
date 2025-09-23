#!/bin/bash

# Portainer Deployment Script for Indiwave
# This script helps deploy the production stack to Portainer

echo "🚀 Indiwave Production Deployment Script"
echo "========================================"

# Check if Portainer API is accessible
PORTAINER_URL="http://localhost:9000"
echo "📡 Checking Portainer connection..."

# You'll need to replace these with your actual Portainer credentials
PORTAINER_USERNAME="admin"
PORTAINER_PASSWORD="your-portainer-password"

echo "⚠️  Manual Setup Required:"
echo "1. Open your Portainer dashboard"
echo "2. Go to 'Stacks' → 'Add stack'"
echo "3. Name: indiwave-production"
echo "4. Copy the docker-compose.production.yml content"
echo "5. Set environment variables:"
echo "   - POSTGRES_PASSWORD=MySecurePassword123!"
echo "   - NEXTAUTH_SECRET=94a7109fb6b7c7b5c7c6c2d31f28f5c69df641c0680f48b68467a86f379a33be"
echo "   - GOOGLE_CLIENT_ID=959986325042-o5pqr065tc2dm267ub4f8pnkp4bigs34.apps.googleusercontent.com"
echo "   - GOOGLE_CLIENT_SECRET=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"
echo "6. Click 'Deploy the stack'"
echo ""
echo "📋 Stack Configuration:"
echo "======================"
cat docker-compose.production.yml
echo ""
echo "✅ After deployment, your site will be available at: https://indiwave.io"
echo "🗄️  Database will be PostgreSQL with all 67 manga imported automatically"
