# Platform API Reference

## Base URL
```
https://ai-skills-bootcamp-portal.vercel.app/api
```

## Authentication
API requests require Bearer token authentication:
```
Authorization: Bearer <token>
```

## Endpoints

### Upload Template (Draft)

**POST** `/templates`

Upload a new template as a draft.

**Request:**
```bash
curl -X POST https://ai-skills-bootcamp-portal.vercel.app/api/templates \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@template-image.png" \
  -F "template=@template.json" \
  -F "status=draft"
```

**Parameters:**
- `image` (file, required): Template image file (PNG, JPG, WebP)
- `template` (file, required): JSON template configuration file
- `status` (string, optional): "draft" or "published". Default: "draft"

**Response:**
```json
{
  "success": true,
  "templateId": "tpl_abc123",
  "url": "https://ai-skills-bootcamp-portal.vercel.app/templates/tpl_abc123",
  "status": "draft",
  "createdAt": "2024-02-03T00:00:00Z"
}
```

### List Templates

**GET** `/templates`

List all templates (optional filters).

**Query Parameters:**
- `status`: Filter by status (draft, published)
- `category`: Filter by business category
- `type`: Filter by template type

**Response:**
```json
{
  "templates": [
    {
      "templateId": "tpl_abc123",
      "name": "Kids Clothing Sale",
      "type": "instagram-post",
      "category": "fashion",
      "status": "draft",
      "thumbnailUrl": "https://..."
    }
  ]
}
```

### Update Template

**PUT** `/templates/{templateId}`

Update an existing template.

### Publish Template

**POST** `/templates/{templateId}/publish`

Publish a draft template to make it available to users.

## Error Codes

- `400` - Bad Request (invalid data)
- `401` - Unauthorized (missing/invalid token)
- `413` - Payload Too Large (image too big)
- `500` - Server Error

## Rate Limits

- 100 requests per minute per API key
- Max image size: 10MB
- Max JSON size: 1MB