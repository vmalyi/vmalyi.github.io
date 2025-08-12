# Blog Deployment Guide

## GitHub Pages Deployment

### 1. Repository Setup
```bash
# Navigate to project directory
cd /Users/viktormalyi/projects/singularity/projects/blog-migration/mkdocs-setup

# Initialize git repository if not already done
git init
git remote add origin https://github.com/vmalyi/vmalyi.github.io.git

# Add all files
git add .
git commit -m "Initial blog migration with MkDocs Material

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

### 2. GitHub Actions Workflow
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy MkDocs Site

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.x'
    
    - name: Install dependencies
      run: |
        pip install -r requirements.txt
    
    - name: Build site
      run: mkdocs build --clean
    
    - name: Upload artifact
      uses: actions/upload-pages-artifact@v2
      with:
        path: ./site

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
    - name: Deploy to GitHub Pages
      id: deployment
      uses: actions/deploy-pages@v2
```

### 3. GitHub Repository Settings
1. Go to repository Settings → Pages
2. Set Source to "GitHub Actions"
3. Site will be available at: `https://vmalyi.github.io`

## Local Development

### Server Commands
```bash
# Development server
mkdocs serve

# Build site
mkdocs build --clean

# Verbose mode for debugging
mkdocs serve --verbose
```

### Content Updates
- Blog posts: `docs/blog/`
- Speaking page: `docs/speaking/index.md`
- About page: `docs/about.md`
- Homepage: `docs/index.md`

## RSS Feed
- RSS feed automatically generated at: `/feed_rss_created.xml`
- JSON feed available at: `/feed_json_created.json`