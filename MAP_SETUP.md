# Google Maps Integration Guide

## Overview

The NYC Affordable Housing Finder uses Google Maps Embed API to display an interactive map showing property locations across all five NYC boroughs. This guide will help you set up your own Google Maps API key.

## Current Implementation

The map currently uses a demo/public Google Maps Embed API that works without authentication but has limited features. For production use, you should create your own API key.

## How to Get Your Own Google Maps API Key

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Click "Select a project" → "New Project"
4. Enter project name: `NYC Affordable Housing`
5. Click "Create"

### Step 2: Enable the Maps Embed API

1. In the Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Maps Embed API"
3. Click on it and press "Enable"

### Step 3: Create an API Key

1. Go to "APIs & Services" → "Credentials"
2. Click "+ CREATE CREDENTIALS" → "API key"
3. Your new API key will be created (it looks like: `AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`)
4. Click "Edit API key" to restrict it

### Step 4: Restrict Your API Key (Important for Security!)

1. Under "Application restrictions":
   - Choose "HTTP referrers (websites)"
   - Add: `http://localhost:5173/*` (for development)
   - Add your production domain when you deploy

2. Under "API restrictions":
   - Choose "Restrict key"
   - Select "Maps Embed API"
   - Click "Save"

### Step 5: Update the Code

Open `client/src/App.jsx` and find the MapView component. Replace the iframe src:

**Current code:**
```javascript
src={`https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&center=40.7128,-74.0060&zoom=11&maptype=roadmap`}
```

**Updated code with your key:**
```javascript
src={`https://www.google.com/maps/embed/v1/view?key=YOUR_API_KEY_HERE&center=40.7128,-74.0060&zoom=11&maptype=roadmap`}
```

Replace `YOUR_API_KEY_HERE` with your actual API key.

## Alternative: Use Environment Variables (Recommended)

For better security, use environment variables:

### 1. Create `.env` file in client directory:

```env
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
```

### 2. Update `client/src/App.jsx`:

```javascript
const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8';

// In MapView component:
src={`https://www.google.com/maps/embed/v1/view?key=${GOOGLE_MAPS_KEY}&center=40.7128,-74.0060&zoom=11&maptype=roadmap`}
```

### 3. Add `.env` to `.gitignore`:

```
# Environment variables
.env
.env.local
```

## Google Maps API Pricing

- **Maps Embed API**: $7 per 1,000 requests after free tier
- **Free tier**: $200 credit per month (approximately 28,500 map loads)
- For a prototype/coursework project, you'll stay well within the free tier

## Features in Current Implementation

✅ **What's Working:**
- Embedded Google Maps showing NYC
- Property list with coordinates
- Click links to open exact locations in Google Maps
- Color-coded properties by price
- Borough statistics
- Responsive design

📌 **What's NOT Working (requires paid API or additional setup):**
- Custom markers directly on embedded map (requires Maps JavaScript API)
- Real-time marker clustering
- Interactive tooltips on map hover

## Upgrade to Full Interactive Map (Optional Advanced Feature)

If you want custom markers directly on the map, you'll need to:

1. Enable **Maps JavaScript API** (in addition to Embed API)
2. Use the Google Maps JavaScript library instead of iframe
3. Add custom marker icons and info windows

This is more complex but provides better user experience. Let me know if you want help with this!

## Testing the Map

### Test URLs for Properties:

Each property has coordinates. Test a few by clicking the property links:

**Manhattan - Midtown East:**
- Lat: 40.7520, Lng: -73.9745
- Link: https://www.google.com/maps/search/?api=1&query=40.7520,-73.9745

**Brooklyn - Williamsburg:**
- Lat: 40.7178, Lng: -73.9573
- Link: https://www.google.com/maps/search/?api=1&query=40.7178,-73.9573

**Queens - Astoria:**
- Lat: 40.7644, Lng: -73.9200
- Link: https://www.google.com/maps/search/?api=1&query=40.7644,-73.9200

## Troubleshooting

### Map Not Loading?
- Check browser console for API key errors
- Verify API key restrictions allow your domain
- Make sure Maps Embed API is enabled

### "This page can't load Google Maps correctly"?
- Your API key may be restricted incorrectly
- Check billing is enabled (even for free tier)
- Verify the API key is copied correctly

### Quota Exceeded?
- You've exceeded the free $200/month credit
- Upgrade to paid tier or optimize requests

## Alternative: OpenStreetMap (Free Forever)

If you prefer a completely free solution without API keys, you can use OpenStreetMap with Leaflet.js. Let me know if you want me to implement this instead!

## Support

For Google Maps API issues:
- [Google Maps Platform Documentation](https://developers.google.com/maps/documentation)
- [Google Maps Platform Support](https://developers.google.com/maps/support)

For implementation questions about this project, refer to the main README.md file.