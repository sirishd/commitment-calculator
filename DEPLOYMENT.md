# GitHub Pages Deployment Guide

## Prerequisites Completed
- ✅ Application built and ready
- ⏳ Git installation (in progress)
- ⏳ GitHub account

## Step-by-Step Instructions

### 1. Install Git (Do this first!)
```bash
xcode-select --install
```
Click "Install" in the dialog that appears and wait for completion.

### 2. Configure Git (After installation)
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 3. Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `commitment-calculator` (or your preferred name)
3. Description: "Business commitment savings calculator"
4. Choose **Public** (required for free GitHub Pages)
5. **DO NOT** initialize with README, .gitignore, or license
6. Click "Create repository"

### 4. Initialize Local Repository
```bash
cd /Users/sirishrdavuluri/.gemini/antigravity/scratch/commitment-calculator

# Initialize git
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Commitment Savings Calculator"

# Rename branch to main
git branch -M main
```

### 5. Connect to GitHub and Push
Replace `YOUR_USERNAME` with your actual GitHub username:

```bash
git remote add origin https://github.com/YOUR_USERNAME/commitment-calculator.git
git push -u origin main
```

You'll be prompted for your GitHub credentials.

### 6. Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** (top right)
3. Click **Pages** (left sidebar)
4. Under "Source":
   - Branch: Select `main`
   - Folder: Select `/ (root)`
5. Click **Save**

### 7. Access Your Live Site
After a few minutes, your site will be live at:
```
https://YOUR_USERNAME.github.io/commitment-calculator/
```

GitHub will show you the exact URL in the Pages settings.

---

## Alternative: Using GitHub CLI (Faster)

If you prefer, you can install GitHub CLI for easier setup:

```bash
# Install GitHub CLI (if you have Homebrew)
brew install gh

# Authenticate
gh auth login

# Create repo and push in one go
cd /Users/sirishrdavuluri/.gemini/antigravity/scratch/commitment-calculator
git init
git add .
git commit -m "Initial commit: Commitment Savings Calculator"
gh repo create commitment-calculator --public --source=. --push

# Enable Pages
gh api repos/:owner/commitment-calculator/pages -X POST -f source[branch]=main -f source[path]=/
```

---

## Troubleshooting

**If push fails with authentication error:**
- GitHub no longer accepts passwords for git operations
- You'll need to create a Personal Access Token:
  1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
  2. Generate new token with `repo` scope
  3. Use the token as your password when prompted

**If the site doesn't load:**
- Wait 2-3 minutes for GitHub to build and deploy
- Check the Actions tab in your repo for build status
- Ensure the repository is public

---

## Next Steps After Deployment

1. Share the URL: `https://YOUR_USERNAME.github.io/commitment-calculator/`
2. Collect feedback
3. Make updates by:
   ```bash
   # Edit files
   git add .
   git commit -m "Description of changes"
   git push
   ```
4. Changes will automatically deploy in 1-2 minutes

---

## Custom Domain (Optional)

If you want a custom domain like `calculator.yourcompany.com`:
1. Add a `CNAME` file to your repo with your domain
2. Configure DNS settings with your domain provider
3. Update GitHub Pages settings with your custom domain
