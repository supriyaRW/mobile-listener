# Push Code to GitHub - Guide

## Repository
https://github.com/supriyaRW/mobile-listener

## Quick Push (Easiest)

**Double-click this file:**
```
PUSH-TO-GITHUB.bat
```

This will:
1. Initialize git (if needed)
2. Create README.md
3. Add all files
4. Commit changes
5. Add remote repository
6. Push to GitHub

## Manual Steps

### Step 1: Navigate to Frontend Directory

```powershell
cd "C:\Users\DereddySupriya\Desktop\New folder\exp_date\frontend"
```

### Step 2: Initialize Git (if not already)

```powershell
git init
```

### Step 3: Create README.md

```powershell
echo "# Mobile Listener - Desktop to Mobile App Opener" > README.md
```

### Step 4: Add All Files

```powershell
git add .
```

**Note:** `.gitignore` will exclude:
- `node_modules/`
- `.next/`
- `.env` (contains API keys - should not be pushed!)
- Build files

### Step 5: Commit

```powershell
git commit -m "Initial commit: Mobile listener with desktop-to-mobile app opening"
```

### Step 6: Add Remote

```powershell
git remote add origin https://github.com/supriyaRW/mobile-listener.git
```

### Step 7: Push to GitHub

```powershell
git branch -M main
git push -u origin main
```

## Important: .env File

**⚠️ WARNING:** The `.env` file contains your API key!

**Before pushing, make sure `.gitignore` includes:**
```
.env
.env.local
.env*.local
```

**Check `.gitignore` file** - it should already exclude `.env`

## If Push Fails

### Authentication Required

**Option 1: Use Personal Access Token**
1. GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token with `repo` permissions
3. Use token as password when prompted

**Option 2: Use GitHub CLI**
```powershell
gh auth login
git push -u origin main
```

### Repository Doesn't Exist

1. Go to: https://github.com/supriyaRW/mobile-listener
2. Create repository if it doesn't exist
3. Don't initialize with README (we're pushing code)

### Permission Denied

- Make sure you have write access to the repository
- Check you're authenticated with correct GitHub account

## What Gets Pushed

✅ **Will be pushed:**
- Source code (`src/`)
- Configuration files (`package.json`, `tsconfig.json`, etc.)
- Public assets (`public/`)
- Documentation files (`.md` files)
- Scripts (`.bat`, `.ps1` files)

❌ **Will NOT be pushed** (excluded by `.gitignore`):
- `node_modules/`
- `.next/` (build output)
- `.env` (API keys)
- Build artifacts

## After Pushing

Your code will be available at:
https://github.com/supriyaRW/mobile-listener

## Next Steps

1. **Clone on another machine:**
   ```powershell
   git clone https://github.com/supriyaRW/mobile-listener.git
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```

3. **Create `.env` file** (copy from template, add your API key)

4. **Start server:**
   ```powershell
   npm run dev:network
   ```

## Troubleshooting

### "Repository not found"
- Check repository exists on GitHub
- Verify URL is correct
- Check you have access

### "Authentication failed"
- Use Personal Access Token instead of password
- Or use GitHub CLI: `gh auth login`

### "Permission denied"
- Check you have write access
- Verify you're authenticated with correct account

### Large files
- Make sure `.gitignore` excludes large files
- Don't commit `node_modules/` or `.next/`
