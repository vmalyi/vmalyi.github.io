# YouTube CTA Configuration Guide

The YouTube call-to-action (CTA) is now configurable per article using MkDocs metadata.

## How It Works

The `docs/snippets/youtube-cta.md` file uses MkDocs templating to check for a `youtube_url` in the article's frontmatter:

```markdown
{% if page.meta.youtube_url %}
!!! info "▶️ "
    **Prefer watching over reading?**
    **[Watch on YouTube]({{ page.meta.youtube_url }})**
{% endif %}
```

## Usage

### 1. Add YouTube URL to Article Frontmatter

Add the `youtube_url` field to your article's YAML frontmatter:

```yaml
---
title: "Your Article Title"
date:
  created: 2025-08-24
description: Your article description
youtube_url: "https://www.youtube.com/watch?v=YOUR_VIDEO_ID"
tags:
  - your-tags
---
```

### 2. Include YouTube CTA in Article

Add the snippet include to your article where you want the CTA to appear:

```markdown
--8<-- "youtube-cta.md"
```

## Behavior

- **With `youtube_url`**: Shows the YouTube CTA with the specified URL
- **Without `youtube_url`**: No CTA is displayed (clean fallback)

## Examples

### Article with YouTube Video
```yaml
---
title: "Stop Waiting for the Next Big Model"
youtube_url: "https://www.youtube.com/watch?v=abc123"
---
```
Result: Shows CTA linking to `youtube.com/watch?v=abc123`

### Article without YouTube Video
```yaml
---
title: "Stop Waiting for the Next Big Model"
# No youtube_url field
---
```
Result: No CTA shown

## Benefits

1. **Article-specific URLs**: Each article can link to its own YouTube video
2. **Clean fallback**: Articles without videos don't show broken or incorrect CTAs
3. **Easy maintenance**: Update URLs directly in article frontmatter
4. **Consistent styling**: All CTAs use the same visual format