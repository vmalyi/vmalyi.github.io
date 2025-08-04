# vmalyi.com Production Deployment Guide

## 🎯 **Migration Overview**

This guide covers migrating from Jekyll to MkDocs on your existing `vmalyi.github.io` repository while maintaining the custom domain `vmalyi.com`.

## 📋 **Pre-Migration Checklist**

### **1. Backup Current Site**
```bash
# Clone current Jekyll site as backup
git clone https://github.com/vmalyi/vmalyi.github.io.git vmalyi-jekyll-backup
cd vmalyi-jekyll-backup
git checkout master  # Ensure you're on the current production branch
```

### **2. Verify Domain Configuration**
- Current CNAME: `vmalyi.com`
- DNS should point to GitHub Pages servers
- SSL certificate will be automatically renewed

## 🚀 **Migration Steps**

### **Step 1: Prepare vmalyi.github.io Repository**

```bash
# Clone your production repository
git clone https://github.com/vmalyi/vmalyi.github.io.git
cd vmalyi.github.io

# Create new main branch (GitHub's new standard)
git checkout -b main
git push -u origin main
```

### **Step 2: Replace Jekyll with MkDocs Content**

```bash
# Remove Jekyll files (keep .git directory)
rm -rf _config.yml _includes _layouts _posts _site Gemfile* .jekyll-cache

# Copy MkDocs files from this project
cp -r /path/to/singularity/projects/blog-migration/mkdocs-setup/* .
cp -r /path/to/singularity/projects/blog-migration/mkdocs-setup/.github .
cp /path/to/singularity/projects/blog-migration/mkdocs-setup/.gitignore .

# Stage all changes
git add .
git add .github/  # Ensure GitHub Actions workflow is included
```

### **Step 3: Update Repository Settings**

1. **Go to Repository Settings → Pages**
   - Source: Deploy from a branch → GitHub Actions
   - Custom domain: `vmalyi.com` (should be preserved)

2. **Configure Branch Protection (Optional)**
   - Settings → Branches → Add rule for `main`
   - Require status checks to pass before merging
   - Require pull request reviews

### **Step 4: Initial Deployment**

```bash
# Commit the migration
git commit -m "$(cat <<'EOF'
Migrate from Jekyll to MkDocs with authority building focus

- Replace Jekyll with modern MkDocs static site generator
- Implement professional authority building strategy
- Add comprehensive SEO optimization
- Include RSS feeds for content syndication
- Set up automated GitHub Actions deployment
- Maintain vmalyi.com custom domain configuration

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"

# Push to trigger first deployment
git push origin main
```

### **Step 5: Update Default Branch**

1. **Go to Repository Settings → General**
2. **Default branch** → Switch to `main`
3. **Delete `master` branch** (after confirming deployment works)

## 🔧 **GitHub Actions Configuration**

The workflow is configured to:
- ✅ **Trigger on push to main** and manual dispatch
- ✅ **Build with Python 3.x** and cached dependencies
- ✅ **Deploy to GitHub Pages** using official actions
- ✅ **Maintain CNAME** for custom domain
- ✅ **Support git-based plugins** with full history

## 🌐 **DNS Configuration**

Your existing DNS should continue working:
- **A Records**: Point to GitHub Pages IPs
- **CNAME**: `vmalyi.com` → `vmalyi.github.io`
- **SSL**: Automatically managed by GitHub Pages

## 📊 **Post-Deployment Verification**

### **1. Site Functionality**
- [ ] Homepage loads at `https://vmalyi.com`
- [ ] All blog articles accessible
- [ ] Speaking page displays correctly
- [ ] RSS feeds working (`/feed_rss_created.xml`)
- [ ] Search functionality operational

### **2. SEO Preservation**
- [ ] Meta descriptions on all pages
- [ ] Open Graph tags present
- [ ] Structured data (JSON-LD) included
- [ ] Sitemap generated (`/sitemap.xml`)

### **3. Performance Check**
- [ ] Page load times < 2 seconds
- [ ] Mobile responsiveness maintained
- [ ] Lighthouse scores improved

## 🔄 **Content Update Workflow**

After migration, content updates follow this pattern:

```bash
# Local development
mkdocs serve  # Test changes locally

# Production deployment
git add .
git commit -m "Add new blog post: [title]"
git push origin main  # Triggers automatic deployment
```

## 🆘 **Rollback Plan**

If issues occur during migration:

```bash
# Emergency rollback to Jekyll
cd vmalyi-jekyll-backup
git push --force-with-lease origin master

# Or restore from GitHub backup
# Go to Settings → Pages → Source → Deploy from branch → master
```

## ✅ **Success Metrics**

- **Site Accessibility**: vmalyi.com loads correctly
- **Content Preservation**: All articles migrated and enhanced
- **SEO Improvement**: Better meta tags and structure
- **Authority Building**: Professional presentation maintained
- **Performance**: Faster load times with MkDocs
- **Maintenance**: Easier content management workflow

---

**🚀 Ready for production deployment with zero downtime migration strategy!**