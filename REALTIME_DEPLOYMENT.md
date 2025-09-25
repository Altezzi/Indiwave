# Real-Time Import System Deployment Guide

## 🚀 What's New

Your Indiwave site now has a **real-time import system** that automatically detects changes in the `series` folder and imports new manga without any deployments!

## ✨ Features

- **🔄 Real-Time Import**: Automatically imports new manga when added to the `series` folder
- **📱 Admin Panel**: New Import Review panel with real-time controls
- **⚡ Instant Updates**: No more deployments needed for new manga
- **🎯 Auto-Publish**: New imports are automatically published
- **📊 Status Tracking**: Real-time import status and progress

## 🛠️ Deployment Steps

### Step 1: Update Portainer Stack

1. **Open your Portainer dashboard**
2. **Go to "Stacks"** → Find your indiwave stack
3. **Click "Editor"** to edit the stack
4. **Update the image reference**:

```yaml
services:
  indiwave-app:
    image: indiwave:realtime  # Changed from indiwave:latest
    # ... rest of your configuration
```

5. **Click "Update the stack"**

### Step 2: Verify Deployment

1. **Check container logs** in Portainer to ensure both services are running:
   - Next.js app (port 3000)
   - Real-time import watcher

2. **Test the admin panel**:
   - Go to `https://indiwave.io/admin`
   - Click on "Import Review" tab
   - You should see new buttons:
     - 🔄 Trigger Import
     - ▶️ Enable Auto-Import

### Step 3: Test Real-Time Import

1. **Add a new manga** to your `series` folder
2. **Watch the logs** - you should see import activity
3. **Check your site** - new manga should appear automatically

## 🎮 How to Use

### Admin Panel Controls

- **🔄 Trigger Import**: Manually trigger an import scan
- **▶️ Enable Auto-Import**: Start watching the series folder
- **⏸️ Disable Auto-Import**: Stop watching the series folder
- **Accept All**: Publish all imported manga
- **Decline All**: Unpublish all imported manga

### Real-Time Import

1. **Enable Auto-Import** in the admin panel
2. **Add new manga** to the `series` folder
3. **The system automatically**:
   - Detects new folders
   - Reads metadata.json and chapters.json
   - Imports to database
   - Publishes immediately
   - Updates the live site

## 🔧 Technical Details

### New API Endpoints

- `POST /api/admin/auto-import` - Scans and imports from series folder
- `POST /api/admin/trigger-import` - Manually triggers import

### File Structure

```
scripts/
├── file-watcher.js          # Watches series folder for changes
├── start-realtime-import.js # Starts the watcher service
└── ...

app/api/admin/
├── auto-import/route.ts     # Auto-import endpoint
└── trigger-import/route.ts  # Manual trigger endpoint
```

### Docker Changes

- **New image**: `indiwave:realtime`
- **Background service**: File watcher runs alongside Next.js
- **Dependencies**: Added `chokidar` for file watching

## 🚨 Troubleshooting

### If imports aren't working:

1. **Check container logs** in Portainer
2. **Verify series folder** is mounted correctly
3. **Test manual import** using "Trigger Import" button
4. **Check file permissions** on series folder

### If admin panel isn't showing:

1. **Clear browser cache**
2. **Check if you're logged in as admin**
3. **Verify the new image is deployed**

## 🎉 Benefits

- **No more deployments** for new manga
- **Instant updates** to your live site
- **Automatic publishing** of new content
- **Real-time monitoring** of import status
- **Bulk management** of imported content

## 📞 Support

If you encounter any issues:
1. Check the container logs in Portainer
2. Test the manual import button
3. Verify your series folder structure
4. Ensure metadata.json and chapters.json are present

---

**Your site is now ready for real-time manga imports! 🎊**
