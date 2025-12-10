<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Nano Banana Studio

A browser-based application for generating 9 unique image perspectives from a single image using Google's Gemini 3 Pro Image Preview model. Edit images with natural language prompts.

## Features

- ✅ **100% Browser-Based**: No server backend needed
- ✅ **9-Angle Generation**: Automatically generates 9 unique perspectives from a single image
- ✅ **Magic Editor**: Edit images using natural language prompts
- ✅ **Secure API Key Storage**: API key stored locally in browser cookies
- ✅ **Modern UI**: Beautiful, responsive interface built with React and shadcn/ui

## How It Works

1. Enter your Gemini API key (stored locally in your browser)
2. Upload a single image
3. Generate 9 unique perspectives automatically
4. Click on any variation to edit it with text prompts

## Installation

**Prerequisites:** Node.js

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Usage

1. Open the application in your browser
2. Enter your Gemini API key when prompted (stored in browser cookies)
3. Upload your image
4. Click "Generate 9 Angles" to create variations
5. Click on any variation to open the Magic Editor

## API Key Setup

Your Gemini API key is stored locally in your browser using cookies. It never leaves your device and persists across sessions.

Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

## Technical Details

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6
- **UI Components**: shadcn/ui (Radix UI + Tailwind CSS)
- **AI Model**: Gemini 3 Pro Image Preview
- **Styling**: Tailwind CSS with PostCSS

## Pushing to a New GitHub Repository

If you want to push this project to a new GitHub repository:

1. **Create a new repository on GitHub**:
   - Go to [GitHub](https://github.com) and click "New repository"
   - Choose a repository name (e.g., `nano-nine`)
   - Choose Public or Private
   - **Do NOT** initialize with README, .gitignore, or license (this repo already has them)
   - Click "Create repository"

2. **Push your code to GitHub**:
   ```bash
   # If you haven't initialized git yet (unlikely, but just in case)
   git init
   
   # Add all files
   git add .
   
   # Commit your changes
   git commit -m "Initial commit"
   
   # Add the remote repository (replace YOUR_USERNAME and REPO_NAME)
   git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
   
   # Or if you prefer SSH:
   # git remote add origin git@github.com:YOUR_USERNAME/REPO_NAME.git
   
   # Push to GitHub
   git branch -M main
   git push -u origin main
   ```

3. **If you already have a remote configured** (like the current `origin`):
   ```bash
   # Check current remote
   git remote -v
   
   # To change the remote URL to your new repository:
   git remote set-url origin https://github.com/YOUR_USERNAME/REPO_NAME.git
   
   # Then push
   git push -u origin main
   ```

## Deployment to GitHub Pages

This app can be easily deployed to GitHub Pages for free hosting!

### Automatic Deployment (Recommended)

1. **Push your code to GitHub** (see instructions above if you haven't already)
2. **Enable GitHub Pages**:
   - Go to your repository Settings → Pages
   - Under "Source", select "GitHub Actions"
3. **Update the base path** (if needed):
   - If your repository is named `nano-nine`, the default config will work
   - If your repository has a different name, update `.github/workflows/deploy.yml`:
     ```yaml
     VITE_BASE_PATH: /your-repo-name/
     ```
4. **Push to main/master branch** - The GitHub Action will automatically build and deploy!

### Manual Deployment

```bash
# Build the project
npm run build

# The dist/ folder contains the static files
# You can deploy this folder to any static hosting service
```

### Custom Domain

If you're using a custom domain or `username.github.io` repository:
- Update `.github/workflows/deploy.yml`:
  ```yaml
  VITE_BASE_PATH: /
  ```

### Live Demo

Once deployed, your app will be available at:
- `https://yourusername.github.io/nano-nine/` (for project pages)
- `https://yourusername.github.io/` (for user/organization pages)

## Browser Compatibility

Works in modern browsers that support:
- WebAssembly
- File API
- Cookies API

Tested on Chrome, Firefox, Safari, and Edge.
