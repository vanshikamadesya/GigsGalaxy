# Step-by-Step: Fix Vercel Deployment Error

## Current Error
```
Error: Project framework is set to "services", but no services are declared.
```

---

## ✅ SOLUTION 1: Change Framework in Dashboard

### Step 1: Go to Vercel Dashboard
- Open: https://vercel.com/dashboard
- Find your project: `gigs-galaxy`
- Click on it

### Step 2: Navigate to Settings
- Click **Settings** tab (top navigation)
- Click **General** (left sidebar)

### Step 3: Find Framework Preset
- Scroll down to **Framework Preset** section
- You'll see it's currently set to: `Services` ❌

### Step 4: Change Framework
- Click the **Edit** button next to Framework Preset
- Select **Other** from the dropdown (or **Vite**)
- Click **Save**

### Step 5: Redeploy
- Go to **Deployments** tab
- Find the latest deployment
- Click the **three dots** (•••) on the right
- Click **Redeploy**
- Wait for deployment to complete (2-3 minutes)

### Step 6: Verify
- Visit: https://gigs-galaxy.vercel.app
- Should load successfully! ✅

---

## ✅ SOLUTION 2: Delete & Recreate (If Solution 1 Fails)

### Why This Might Be Needed
Sometimes the framework setting gets "stuck" and won't properly change. In that case, you need to start fresh.

### Step 1: Delete Current Project

1. Go to your Vercel dashboard
2. Click on `gigs-galaxy` project
3. Go to **Settings** → **General**
4. Scroll to the very bottom
5. Find **Delete Project** section
6. Click **Delete Project**
7. Type the project name: `gigs-galaxy`
8. Click confirm

### Step 2: Create New Project

1. Go to: https://vercel.com/new
2. Click **Add New...** → **Project**
3. Find your GitHub repository: `gig-galaxy`
4. Click **Import**

### Step 3: Configure Project (CRITICAL STEP)

**Configure Project Settings:**

```
Project Name: gigs-galaxy
Framework Preset: Other   ← MUST SELECT "Other" (NOT "Services")
Root Directory: frontend  ← Override this
```

**Build and Output Settings:**

```
Build Command: npm run build
Output Directory: dist/spa
Install Command: npm install
Development Command: npm run dev
```

### Step 4: Add Environment Variables

Click **Environment Variables** and add these:

| Name | Value |
|------|-------|
| `VITE_APP_NAME` | `GigGalaxy` |
| `VITE_APP_VERSION` | `1.0.0` |
| `VITE_API_BASE_URL` | `https://gigsgalaxy.onrender.com/api` |
| `VITE_SOCKET_URL` | `https://gigsgalaxy.onrender.com` |
| `VITE_API_TIMEOUT` | `30000` |
| `VITE_LOG_LEVEL` | `info` |

**Important:** Select `Production`, `Preview`, and `Development` for each variable.

### Step 5: Deploy

- Click **Deploy** button
- Wait 2-3 minutes for build to complete
- You should see: ✅ Deployment Successful

### Step 6: Verify Deployment

1. Click **Visit** button or go to: https://gigs-galaxy.vercel.app
2. Homepage should load
3. Try navigating to different pages
4. Check if API calls work (login, register, etc.)

---

## 🔍 What Each File Does

### `frontend/vercel.json`
```json
{
  "buildCommand": "npm run build",        // How to build
  "outputDirectory": "dist/spa",          // Where built files are
  "framework": null,                      // Prevent auto-detection
  "installCommand": "npm install",        // How to install deps
  "rewrites": [...]                       // SPA routing support
}
```

**Why it's needed:**
- Tells Vercel EXACTLY how to build your Quasar app
- Prevents framework auto-detection (which was failing)
- Enables client-side routing (Vue Router)
- Without rewrites, page refresh would give 404

---

## 🧪 Testing After Deployment

### 1. Test Homepage
```
Visit: https://gigs-galaxy.vercel.app
Expected: Homepage loads with categories, hero section
```

### 2. Test Navigation
```
Click: Browse Categories, Sign Up, Login
Expected: Pages load without 404 errors
```

### 3. Test Page Refresh
```
Navigate to: /categories
Press: F5 (refresh)
Expected: Page reloads (not 404 error)
```

### 4. Test API Connection
```
Open: Browser Console (F12)
Try: Login or Register
Expected: API calls go to https://gigsgalaxy.onrender.com/api
Check: No CORS errors
```

### 5. Test Backend Health
```
Visit: https://gigsgalaxy.onrender.com/health
Expected: {"status":"ok","timestamp":"..."}
```

---

## ❓ Common Issues After Deployment

### Issue: Pages show 404 on refresh
**Cause:** Rewrite rules not working  
**Fix:** Check `vercel.json` is in `frontend/` directory, redeploy

### Issue: API calls fail with CORS error
**Cause:** Backend CORS not configured  
**Fix:** Backend already configured for `*.vercel.app`, check backend is running

### Issue: Environment variables not working
**Cause:** Variables not set in Vercel  
**Fix:** Go to Settings → Environment Variables → Add all VITE_* variables

### Issue: Build fails
**Cause:** Node version or missing dependencies  
**Fix:** Check build logs, ensure Node 20.x, run `npm install` locally first

---

## 📋 Deployment Checklist

Before deploying:
- ✅ `frontend/vercel.json` exists and is properly configured
- ✅ Backend is running on Render: https://gigsgalaxy.onrender.com
- ✅ Backend CORS includes Vercel domain
- ✅ Environment variables ready to add

During deployment:
- ✅ Root Directory set to `frontend`
- ✅ Framework Preset set to `Other` (NOT "Services")
- ✅ Build command: `npm run build`
- ✅ Output directory: `dist/spa`
- ✅ All VITE_* environment variables added

After deployment:
- ✅ Homepage loads at https://gigs-galaxy.vercel.app
- ✅ Navigation works (no 404 errors)
- ✅ Page refresh works
- ✅ API calls successful
- ✅ No CORS errors in console

---

## 🆘 Still Need Help?

If you're still stuck:

1. **Check the error message exactly** - Share the full error from Vercel logs
2. **Verify settings:**
   - Framework Preset = `Other` (not "Services")
   - Root Directory = `frontend`
   - Build Command = `npm run build`
3. **Check build logs** - Click on failed deployment → View Build Logs
4. **Confirm file exists** - Make sure `frontend/vercel.json` is committed to Git

**Remember:** The "services" error means Vercel thinks your project needs service configuration. This is wrong - you're deploying a SPA, not services. The framework preset MUST be changed.
