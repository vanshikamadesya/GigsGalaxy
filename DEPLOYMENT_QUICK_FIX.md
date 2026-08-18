# Quick Fix: Vercel "services" Framework Error

## The Problem
You're getting: `Error: Project framework is set to "services", but no services are declared.`

## The Cause
Vercel incorrectly detected your project as a "services" project instead of a Quasar/Vite SPA.

## Quick Fix (2 Minutes)

### Option 1: Change Framework Setting
1. Go to: https://vercel.com/dashboard
2. Click your project → **Settings** → **General**
3. Find **Framework Preset** section
4. Change from `Services` to `Other`
5. Click **Save**
6. Go to **Deployments** → Click **•••** → **Redeploy**

### Option 2: Delete and Recreate (If Option 1 Fails)
1. **Delete Project:**
   - Settings → General → Delete Project (at bottom)

2. **Create New Project:**
   - Import your repo
   - **Root Directory:** `frontend`
   - **Framework Preset:** `Other` (NOT "Services")
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist/spa`

3. **Add Environment Variables:**
   ```
   VITE_API_BASE_URL=https://gigsgalaxy.onrender.com/api
   VITE_SOCKET_URL=https://gigsgalaxy.onrender.com
   VITE_APP_NAME=GigGalaxy
   VITE_APP_VERSION=1.0.0
   VITE_API_TIMEOUT=30000
   VITE_LOG_LEVEL=info
   ```

4. **Deploy**

## Why This Happens
- Vercel tries to auto-detect framework
- Sometimes it incorrectly chooses "Services"
- The updated `vercel.json` now explicitly sets `"framework": null`
- This prevents auto-detection and uses your specified build commands

## Files Updated
- ✅ `frontend/vercel.json` - Now includes complete build configuration
- ✅ Build commands, output directory, and SPA routing configured
- ✅ Security headers and caching optimization added

## What to Do After Deployment
1. Visit: https://gigs-galaxy.vercel.app
2. Test the homepage loads
3. Navigate to different pages
4. Check browser console for API errors
5. Verify backend connection: https://gigsgalaxy.onrender.com/health

## Still Having Issues?
Read the detailed guide: `VERCEL_DEPLOYMENT_GUIDE.md`
