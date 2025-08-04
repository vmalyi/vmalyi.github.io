#!/bin/bash

# vmalyi.com Production Deployment Script
# Safely migrates Jekyll to MkDocs with backup and rollback capabilities

set -e  # Exit on any error

echo "🚀 Starting vmalyi.com production deployment..."

# Configuration
REPO_URL="https://github.com/vmalyi/vmalyi.github.io.git"
BACKUP_DIR="vmalyi-jekyll-backup-$(date +%Y%m%d-%H%M%S)"
CURRENT_DIR=$(pwd)
MKDOCS_SOURCE="$CURRENT_DIR"

# Step 1: Create backup
echo "📦 Creating backup of current Jekyll site..."
git clone $REPO_URL $BACKUP_DIR
cd $BACKUP_DIR
git checkout master 2>/dev/null || git checkout main
echo "✅ Backup created in: $BACKUP_DIR"

# Step 2: Clone production repo
cd "$CURRENT_DIR"
echo "📥 Cloning production repository..."
if [ -d "vmalyi.github.io" ]; then
    rm -rf vmalyi.github.io
fi
git clone $REPO_URL vmalyi.github.io
cd vmalyi.github.io

# Step 3: Create main branch if it doesn't exist
echo "🌿 Setting up main branch..."
git checkout -b main 2>/dev/null || git checkout main
git push -u origin main 2>/dev/null || echo "Main branch already exists on remote"

# Step 4: Clear Jekyll files but keep .git
echo "🧹 Removing Jekyll files..."
find . -maxdepth 1 -not -name '.git' -not -name '.' -not -name '..' -delete

# Step 5: Copy MkDocs files
echo "📋 Copying MkDocs files..."
cp -r "$MKDOCS_SOURCE"/* .
cp "$MKDOCS_SOURCE/.gitignore" . 2>/dev/null || echo "No .gitignore to copy"
cp -r "$MKDOCS_SOURCE/.github" . 2>/dev/null || echo "No .github directory to copy"

# Step 6: Stage all changes
echo "📝 Staging changes..."
git add .
git add .github/ 2>/dev/null || echo "No .github directory to add"

# Step 7: Commit migration
echo "💾 Committing migration..."
git commit -m "Migrate from Jekyll to MkDocs with authority building focus

- Replace Jekyll with modern MkDocs static site generator
- Implement professional authority building strategy  
- Add comprehensive SEO optimization
- Include RSS feeds for content syndication
- Set up automated GitHub Actions deployment
- Maintain vmalyi.com custom domain configuration

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Step 8: Push to production (this triggers deployment)
echo "🚀 Deploying to production..."
echo "⚠️  This will trigger the live deployment to vmalyi.com"
read -p "Continue with deployment? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    git push origin main
    echo "✅ Deployment initiated!"
    echo "🌐 Check GitHub Actions at: https://github.com/vmalyi/vmalyi.github.io/actions"
    echo "🎯 Site will be live at: https://vmalyi.com in ~2-5 minutes"
else
    echo "❌ Deployment cancelled"
    echo "🔄 To deploy later, run: git push origin main"
fi

# Step 9: Cleanup instructions
echo ""
echo "📋 Next steps:"
echo "1. Go to GitHub repo Settings → Pages → Source: GitHub Actions"
echo "2. Verify custom domain is set to: vmalyi.com"
echo "3. Monitor deployment at: https://github.com/vmalyi/vmalyi.github.io/actions"
echo "4. Test site at: https://vmalyi.com"
echo ""
echo "💾 Backup location: $CURRENT_DIR/$BACKUP_DIR"
echo "🔄 To rollback: cd $BACKUP_DIR && git push --force-with-lease origin master"

echo "🎉 Production deployment script completed!"