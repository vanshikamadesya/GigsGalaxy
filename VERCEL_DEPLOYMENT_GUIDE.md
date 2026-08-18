# Vercel Deployment Guide for Gig Galaxy Frontend

## Current Issue: "services" Framework Error

If you're getting this error:
```
Error: Project framework is set to "services", but no services are declared.
```

This happens when Vercel incorrectly detects your project framework. Follow these steps:

## Solution 1: Change Framework in Vercel Dashboard (Recommended)

1. Go to your Vercel project: https://vercel.com/dashboard
2. Click on your project (`gigs-galaxy`)
3. Go to **Settings** → **General**
4. Scroll to **Framework Preset**
5. Change from `Services` to **Other** (or `Vite`)
6. Click **Save**
7. Go to **Deployments** tab
8. Click the **three dots** (•••) on the latest deployment
9. Click **Redeploy**

## Solution 2: Delete and Recreate Project (If Solution 1 Doesn't Work)

If changing the framework doesn't work, you need to delete and recreate:

1. **Delete the current Vercel project:**
   - Go to Settings → General → scroll to bottom
   - Click "Delete Project"
   - Type the project name to confirm

2. **Create a new Vercel project:**
   - Go to https://vercel.com/new
   - Click "Import Git Repository"
   - Select your `gig-galaxy` repository
   - **IMPORTANT: Set Framework Preset to "Other" or "Vite"** (NOT "Services")
   - Set Root Directory to `frontend`
   - Configure environment variables (see below)
   - Click Deploy

## Configuration Details

### Build Settings (Vercel Dashboard)

When creating/configuring the project:

- **Framework Preset:** `Other` or `Vite`
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `dist/spa`
- **Install Command:** `npm install`
- **Development Command:** `npm run dev`

### Environment Variables

Add these in Vercel dashboard (Settings → Environment Variables):

```env
VITE_APP_NAME=GigGalaxy
VITE_APP_VERSION=1.0.0
VITE_API_BASE_URL=https://gigsgalaxy.onrender.com/api
VITE_SOCKET_URL=https://gigsgalaxy.onrender.com
VITE_API_TIMEOUT=30000
VITE_LOG_LEVEL=info
```

**Important:** Make sure to use your backend URL: `https://gigsgalaxy.onrender.com`

## What the vercel.json Does

The `vercel.json` file:

1. **Specifies Build Configuration:**
   - Tells Vercel how to build the app (`npm run build`)
   - Specifies output directory (`dist/spa`)
   - Sets framework to `null` to prevent auto-detection

2. **Enables SPA Routing:**
   - Rewrites all routes to `/index.html`
   - This allows Vue Router to handle client-side routing
   - Without this, refreshing pages would give 404 errors

3. **Adds Security Headers:**
   - X-Content-Type-Options: Prevents MIME type sniffing
   - X-Frame-Options: Prevents clickjacking
   - X-XSS-Protection: Enables XSS filtering

4. **Optimizes Caching:**
   - Static assets (JS, CSS, images) are cached for 1 year
   - Improves performance for returning visitors

## Verification Steps

After deployment:

1. **Check if frontend loads:**
   - Visit: https://gigs-galaxy.vercel.app
   - You should see the homepage

2. **Test API connection:**
   - Open browser console (F12)
   - Check for CORS errors
   - API calls should go to: `https://gigsgalaxy.onrender.com/api`

3. **Test routing:**
   - Navigate to different pages
   - Refresh the page (should not give 404)
   - All routes should work properly

## Troubleshooting

### Still Getting "services" Error?

- **Must delete and recreate the project** - the framework setting may be stuck
- When recreating, ensure Root Directory is set to `frontend`
- Ensure Framework Preset is set to `Other` or `Vite` (NOT "Services")

### Build Fails?

- Check build logs in Vercel dashboard
- Ensure Node.js version is compatible (20.x or higher)
- Check that all environment variables are set

### 404 Errors on Routes?

- Verify `vercel.json` is in `frontend/` directory
- Check that "rewrites" section exists in vercel.json
- Redeploy the project

### API Calls Failing?

- Check environment variables in Vercel dashboard
- Verify `VITE_API_BASE_URL` points to: `https://gigsgalaxy.onrender.com/api`
- Check backend CORS settings include Vercel domain
- Open browser console to see exact error

### CORS Errors?

Backend is already configured for CORS with:
- `https://gigs-galaxy.vercel.app`
- All Vercel preview deployments (`*.vercel.app`)

If still facing CORS issues:
1. Check backend is running: https://gigsgalaxy.onrender.com/health
2. Verify backend logs on Render dashboard
3. Confirm frontend is using correct API URL

## Local Development

To test locally with production backend:

1. Update `frontend/.env`:
```env
VITE_API_BASE_URL=https://gigsgalaxy.onrender.com/api
VITE_SOCKET_URL=https://gigsgalaxy.onrender.com
```

2. Run development server:
```bash
cd frontend
npm run dev
```

## Production URLs

- **Frontend:** https://gigs-galaxy.vercel.app
- **Backend:** https://gigsgalaxy.onrender.com
- **Backend API:** https://gigsgalaxy.onrender.com/api
- **Backend Health:** https://gigsgalaxy.onrender.com/health

## Need More Help?

If issues persist:
1. Check Vercel deployment logs
2. Check Render backend logs
3. Share the exact error message you're seeing
4. Verify both services are running (check health endpoints)
