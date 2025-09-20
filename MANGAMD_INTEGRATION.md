# MangaMD Integration

This document describes the MangaMD integration features added to IndiWave.

## Overview

The MangaMD integration allows administrators to import manga metadata from MangaDex, including covers, descriptions, tags, authors, and other metadata. This enhances the platform's content discovery and organization capabilities.

## Features

### 1. MangaMD API Service (`lib/mangaMD.ts`)

- **Search Functionality**: Search for manga by title
- **Metadata Fetching**: Retrieve detailed manga information including:
  - Title (with multiple language support)
  - Description
  - Status (ongoing, completed, hiatus, cancelled)
  - Publication year
  - Content rating
  - Tags (organized by groups: content, format, genre, theme)
  - Authors and artists
  - Alternative titles
  - Cover images

- **Rate Limiting**: Built-in rate limiting to respect MangaDex API limits
- **Error Handling**: Comprehensive error handling for API failures

### 2. Database Schema Updates

The `Series` model has been extended with MangaMD-specific fields:

```prisma
model Series {
  // ... existing fields ...
  
  // MangaMD integration fields
  mangaMDId     String?   @unique // MangaMD manga ID
  mangaMDTitle  String?   // Original MangaMD title
  mangaMDStatus String?   // ongoing, completed, hiatus, cancelled
  mangaMDYear   Int?      // Publication year from MangaMD
  contentRating  String?   // safe, suggestive, erotica, pornographic
  tags           String?   // JSON array of tags
  authors        String?   // JSON array of author names
  artists        String?   // JSON array of artist names
  altTitles      String?   // JSON array of alternative titles
  isImported     Boolean   @default(false) // Whether this series was imported from MangaMD
}
```

### 3. Admin Interface

#### MangaMD Import Page (`/admin/mangaMD-import`)

- **Search Interface**: Search MangaDex for manga by title
- **Creator Assignment**: Assign imported manga to existing creators
- **Preview**: Preview manga metadata before importing
- **Import Process**: One-click import with automatic metadata population

#### Admin Dashboard Integration

- New "MangaMD Import" tab in the admin dashboard
- Quick access to the import tool
- Import guidelines and best practices

### 4. API Endpoints

#### `GET /api/admin/mangaMD/search`
Search MangaDex for manga by title.

**Parameters:**
- `q` (required): Search query
- `limit` (optional): Number of results (default: 20)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "manga-id",
      "title": "Manga Title",
      "description": "Manga description...",
      "status": "ongoing",
      "year": 2020,
      "contentRating": "safe",
      "authors": ["Author Name"],
      "artists": ["Artist Name"],
      "tags": ["Action", "Adventure"],
      "altTitles": [{"en": "Alternative Title"}]
    }
  ],
  "pagination": {
    "limit": 20,
    "offset": 0,
    "total": 100
  }
}
```

#### `POST /api/admin/mangaMD/import`
Import a manga from MangaDex.

**Body:**
```json
{
  "mangaMDId": "manga-id",
  "creatorId": "creator-user-id"
}
```

**Response:**
```json
{
  "success": true,
  "series": {
    "id": "series-id",
    "title": "Manga Title",
    "description": "Manga description...",
    "coverImage": "https://uploads.mangadex.org/covers/...",
    "mangaMDId": "manga-id",
    "mangaMDStatus": "ongoing",
    "tags": ["Action", "Adventure"],
    "authors": ["Author Name"],
    "artists": ["Artist Name"]
  }
}
```

### 5. UI Components Updates

#### ComicCard Component

Enhanced to display MangaMD metadata:
- **Import Indicator**: "MD" badge for imported series
- **Status Badge**: Color-coded status indicator (ongoing, completed, etc.)
- **Tags Display**: Preview of manga tags
- **Author/Artist Info**: Enhanced author and artist information

#### Library Page

Updated to fetch and display both user-created and imported series:
- Combined display of static comics and database series
- Proper handling of MangaMD metadata
- Enhanced comic cards with import indicators

## Usage

### For Administrators

1. **Access the Import Tool**:
   - Go to `/admin` dashboard
   - Click on "MangaMD Import" tab
   - Click "Open MangaMD Import Tool"

2. **Search for Manga**:
   - Enter a manga title in the search box
   - Review the search results
   - Check metadata, tags, and other information

3. **Import Manga**:
   - Select a creator to assign the manga to
   - Click "Import" on the desired manga
   - The manga will be added to your platform with all metadata

### For Users

- Imported manga appears in the library alongside other content
- MangaMD imported series are marked with an "MD" indicator
- Status badges show the current publication status
- Tags help with content discovery and filtering

## Technical Details

### Rate Limiting

The MangaMD service includes built-in rate limiting:
- 1 second delay between API requests
- Respects MangaDex API guidelines
- Prevents API abuse and ensures reliable service

### Error Handling

Comprehensive error handling for:
- Network failures
- API rate limits
- Invalid manga IDs
- Missing metadata
- Database errors

### Data Storage

- MangaMD metadata is stored as JSON strings in the database
- Cover images are referenced via MangaDex CDN URLs
- Original MangaMD IDs are preserved for future updates

## Best Practices

1. **Permission**: Only import manga you have permission to use
2. **Creator Assignment**: Always assign imported manga to appropriate creators
3. **Metadata Review**: Review imported metadata for accuracy
4. **Content Rating**: Be aware of content ratings and platform policies
5. **Updates**: Consider periodic updates for ongoing series

## Future Enhancements

Potential future improvements:
- Automatic metadata updates for ongoing series
- Bulk import functionality
- MangaDex chapter integration
- Advanced filtering and search
- User favorites and reading lists integration

## Dependencies

- `mangadex-full-api` (to be installed): Unofficial MangaDex API wrapper
- Existing Prisma database setup
- Next.js API routes
- Admin authentication system

## Installation

1. Install the MangaDex API dependency:
   ```bash
   npm install mangadex-full-api
   ```

2. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

3. Restart your development server:
   ```bash
   npm run dev
   ```

The MangaMD integration is now ready to use!
