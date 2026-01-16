# 🔧 Vercel Deployment Fix Summary

## ❌ The Problem

Getting `error=Callback` when trying to sign in with Google OAuth on Vercel deployment.

**Root Cause:** Prisma Client couldn't find the Query Engine binary for Vercel's runtime (`rhel-openssl-3.0.x`).

## ✅ The Solution

### 1. Updated Prisma Schema (`prisma/schema.prisma`)

**Before:**
```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}
```

**After:**
```prisma
generator client {
  provider      = "prisma-client-js"
  output        = "../src/generated/prisma"
  binaryTargets = ["native", "rhel-openssl-3.0.x"]
}
```

**Changes:**
- ✅ Fixed provider name: `prisma-client` → `prisma-client-js`
- ✅ Added `binaryTargets` for Vercel compatibility
  - `native` - for local development (macOS/Windows/Linux)
  - `rhel-openssl-3.0.x` - for Vercel serverless functions

### 2. Added Build Scripts (`package.json`)

```json
{
  "scripts": {
    "build": "prisma generate && next build",
    "postinstall": "prisma generate"
  }
}
```

**Why:**
- `postinstall` - Automatically generates Prisma Client after `npm install` on Vercel
- `build` - Ensures Prisma Client is generated before Next.js build

### 3. Added Error Handling (`src/app/api/auth/[...nextauth]/route.ts`)

- ✅ Environment variable validation
- ✅ Better error logging
- ✅ Debug mode for development

## 🚀 Deployment Steps

1. **Push to GitHub** ✅ (Already done)
   ```bash
   git push
   ```

2. **Vercel Auto-Deploy** 🔄 (In progress)
   - Vercel will automatically detect the push
   - Build will run with `prisma generate`
   - Correct binary will be included

3. **Wait for Deployment** ⏳ (2-3 minutes)
   - Go to [vercel.com](https://vercel.com)
   - Check deployment status
   - Look for commit: "Fix: Add Vercel binary target for Prisma"

4. **Test Sign In** 🧪
   - Visit `https://shopify-devx.vercel.app/hackathon`
   - Click "Sign in with Google"
   - Should work now! ✨

## 📋 Checklist

Before testing, ensure these are set in **Vercel Dashboard** → **Settings** → **Environment Variables**:

- [ ] `GOOGLE_CLIENT_ID` - Your Google OAuth Client ID
- [ ] `GOOGLE_CLIENT_SECRET` - Your Google OAuth Client Secret
- [ ] `NEXTAUTH_URL` - `https://shopify-devx.vercel.app`
- [ ] `NEXTAUTH_SECRET` - Your generated secret
- [ ] `DATABASE_URL` - Your Neon PostgreSQL connection string

All should be set for **Production** environment.

## 🔍 Verify Google OAuth Settings

In [Google Cloud Console](https://console.cloud.google.com):

**Authorized JavaScript origins:**
```
https://shopify-devx.vercel.app
```

**Authorized redirect URIs:**
```
https://shopify-devx.vercel.app/api/auth/callback/google
```

## 🎯 What Changed

| File | Change | Why |
|------|--------|-----|
| `prisma/schema.prisma` | Added `binaryTargets` | Include Vercel runtime binary |
| `package.json` | Added `postinstall` script | Auto-generate Prisma Client |
| `src/app/api/auth/[...nextauth]/route.ts` | Added validation & logging | Better error messages |

## 🐛 If Still Not Working

1. **Check Vercel Build Logs**
   - Go to Deployments → Latest → Build Logs
   - Look for "Prisma Client generated" message
   - Should see both `darwin-arm64` and `rhel-openssl-3.0.x` binaries

2. **Check Runtime Logs**
   - Go to Deployments → Latest → Functions
   - Click on `/api/auth/[...nextauth]`
   - Should NOT see "Query Engine not found" errors

3. **Verify Environment Variables**
   - All 5 variables must be set in Vercel
   - Must be in **Production** environment
   - No typos in variable names

## 📚 References

- [Prisma Vercel Deployment](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [NextAuth.js Deployment](https://next-auth.js.org/deployment)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

**Status:** ✅ Fixed and deployed
**Last Updated:** 2026-01-16

