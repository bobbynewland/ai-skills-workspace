# Clawdbot Schemas & API Documentation

This document serves as a reference for the database schemas and API payloads used by the Clawdbot for uploading content.

## Database Schemas

### `template_packs`
Stores collections of templates.

### `prompts` (Templates)
Stores individual templates/prompts.

### `lessons` & `lesson_contents`
Stores course material.

### `blog_posts` [NEW]
Stores news and articles.
```sql
CREATE TABLE "public"."blog_posts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "slug" "text" NOT NULL UNIQUE,
    "content" "text",
    "excerpt" "text",
    "featured_image_url" "text",
    "is_published" boolean DEFAULT false,
    "published_at" timestamp with time zone,
    "tags" "text"[] DEFAULT '{}'::"text"[],
    "author_id" "uuid"
);
```

### `resources` [NEW]
Stores downloadable files and links.
```sql
CREATE TABLE "public"."resources" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "url" "text" NOT NULL,
    "type" "text",
    "is_public" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"()
);
```

---

## API Endpoints

Base URL: `/api/v1/clawdbot`
Auth Header: `x-api-key: f0959c2b9c94427b13401afccb60e699bcd320fbc25398d3eef2456364330f03`

### 1. Upload Template Pack or Lesson Content
`POST /upload-pack`

**Payload (Template Pack):**
```json
{
  "pack": { "name": "...", "description": "...", "thumbnail_url": "..." },
  "templates": [ { "title": "...", "prompt_text": "...", "image_url": "..." } ]
}
```

**Payload (Lesson Content):**
```json
{
  "lesson_id": "uuid",
  "contents": [ { "type": "video", "content": { "video_url": "...", "thumbnail_url": "..." } } ]
}
```

### 2. Create Blog Post [NEW]
`POST /blog`

**Payload:**
```json
{
  "post": {
    "title": "My New Article",
    "slug": "my-new-article", // Optional, auto-generated if missing
    "content": "# Markdown Content...",
    "excerpt": "Brief summary",
    "featured_image_url": "https://external.com/image.jpg", // Auto-rehosted
    "is_published": true,
    "tags": ["news", "ai"]
  }
}
```

### 3. Create Resource [NEW]
`POST /resources`

**Payload:**
```json
{
  "resource": {
    "title": "Project Guide PDF",
    "description": "A helpful guide.",
    "url": "https://external.com/guide.pdf", // Auto-rehosted if rehost=true
    "type": "application/pdf",
    "is_public": true,
    "rehost": true // Optional: Force download and upload to bootcamp-assets
  }
}
```
