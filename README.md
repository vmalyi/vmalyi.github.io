# Viktor Malyi - AI Implementation Expert

Professional blog built with MkDocs, showcasing practical AI implementation insights and technical expertise.

## 🌐 Live Site

**[vmalyi.com](https://vmalyi.com)** - Personal blog with technical articles on AI, machine learning, and software engineering.

## 🏗️ Built With

- **[MkDocs](https://www.mkdocs.org/)** - Static site generator
- **[shadcn Theme](https://github.com/chrieke/mkdocs-shadcn)** - Clean, modern design
- **[RSS Plugin](https://guts.github.io/mkdocs-rss-plugin/)** - Content syndication
- **GitHub Actions** - Automated deployment

## 📚 Content

- **Technical Articles** - AI implementation, machine learning, iOS development
- **Speaking** - Conference presentations and expertise areas
- **About** - Professional background and experience

## 🚀 Deployment

### Automatic Deployment
The site automatically deploys to GitHub Pages on every push to the `master` branch via GitHub Actions.

### Local Development
```bash
# Install dependencies
pip install -r requirements.txt

# Serve locally
mkdocs serve

# Build static site
mkdocs build
```

### Manual Deployment Options

**GitHub Pages (Current)**
- Configured via `.github/workflows/deploy.yml`
- Deploys to custom domain `vmalyi.com`
- SSL automatically managed

**Alternative Hosting**
```bash
# Build and deploy to any static host
mkdocs build
# Upload ./site/ directory to your hosting provider
```

## ⚙️ Configuration

- **Site Config**: `mkdocs.yml`
- **Content**: `docs/` directory
- **Theme Settings**: shadcn theme with custom styling
- **RSS Feeds**: Auto-generated at `/feed_rss_created.xml`

## 📝 Adding Content

### New Blog Post
1. Create `docs/blog/your-post-title.md`
2. Add frontmatter with date, description, keywords
3. Update `docs/blog/index.md` to include the new post
4. Commit and push to `master`

### Update Pages
- Homepage: `docs/index.md`
- About: `docs/about.md`  
- Speaking: `docs/speaking/index.md`

## 🔧 SEO Features

- Meta descriptions and keywords on all pages
- Open Graph and Twitter Card support
- Structured data (JSON-LD)
- Automatic sitemap generation
- RSS feed for content syndication

## 📊 Performance

- Fast static site generation
- Optimized for mobile devices
- Search functionality included
- Clean URLs and navigation

---

Built with ❤️ using MkDocs and deployed via GitHub Actions.