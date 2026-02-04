# Template JSON Schema

Complete schema for template configuration files.

## Root Object

```json
{
  "templateId": "string (auto-generated)",
  "name": "string (required)",
  "description": "string (optional)",
  "type": "enum (required)",
  "category": "string (required)",
  "dimensions": "object (required)",
  "layers": "array (required)",
  "metadata": "object (optional)",
  "version": "string (default: 1.0)"
}
```

## Template Types

- `instagram-post` - 1080x1080px square
- `instagram-story` - 1080x1920px vertical
- `facebook-ad` - 1200x628px landscape
- `twitter-post` - 1600x900px landscape
- `print-flyer` - 2550x3300px (8.5x11in @ 300dpi)
- `business-card` - 1050x600px (3.5x2in @ 300dpi)
- `poster` - 2400x3600px (24x36in @ 100dpi)

## Dimensions Object

```json
{
  "width": 1080,
  "height": 1080,
  "unit": "px"
}
```

## Layer Types

### Image Layer (Background)

```json
{
  "id": "background",
  "type": "image",
  "src": "url-to-image",
  "position": {"x": 0, "y": 0},
  "size": {"width": 1080, "height": 1080},
  "zIndex": 0,
  "editable": false
}
```

### Text Layer

```json
{
  "id": "headline",
  "type": "text",
  "placeholder": "Your Headline",
  "defaultText": "Sale Ends Soon!",
  "position": {"x": 100, "y": 200},
  "font": {
    "family": "Arial",
    "size": 48,
    "weight": "bold",
    "color": "#000000",
    "align": "center"
  },
  "maxLength": 50,
  "editable": true,
  "zIndex": 1
}
```

### Image Placeholder Layer

```json
{
  "id": "product-image",
  "type": "image-placeholder",
  "position": {"x": 300, "y": 400},
  "size": {"width": 500, "height": 500},
  "placeholder": "Drop your image here",
  "aspectRatio": "1:1",
  "editable": true,
  "zIndex": 1
}
```

### Shape Layer

```json
{
  "id": "accent-shape",
  "type": "shape",
  "shapeType": "rectangle|circle|triangle",
  "position": {"x": 50, "y": 50},
  "size": {"width": 200, "height": 100},
  "fill": "#FF5733",
  "opacity": 0.8,
  "editable": false,
  "zIndex": 0
}
```

### Button/CTA Layer

```json
{
  "id": "cta-button",
  "type": "button",
  "placeholder": "Shop Now",
  "position": {"x": 400, "y": 900},
  "size": {"width": 280, "height": 60},
  "style": {
    "backgroundColor": "#FF5733",
    "textColor": "#FFFFFF",
    "borderRadius": 30,
    "fontSize": 24
  },
  "action": "link",
  "editable": true,
  "zIndex": 2
}
```

## Metadata Object

```json
{
  "createdAt": "ISO-8601 timestamp",
  "updatedAt": "ISO-8601 timestamp",
  "author": "user-id",
  "style": "modern|vintage|minimalist|playful|luxury",
  "colors": ["#FF5733", "#33FF57", "#3357FF"],
  "tags": ["fashion", "kids", "sale", "instagram"],
  "targetAudience": "small-business-owners",
  "complexity": "simple|moderate|complex"
}
```

## Full Example

```json
{
  "templateId": "tpl_kids_fashion_001",
  "name": "Kids Fashion Sale - Instagram",
  "description": "Colorful template for kids clothing promotions",
  "type": "instagram-post",
  "category": "fashion",
  "dimensions": {
    "width": 1080,
    "height": 1080,
    "unit": "px"
  },
  "layers": [
    {
      "id": "bg",
      "type": "image",
      "src": "template-bg-kids-fashion.png",
      "position": {"x": 0, "y": 0},
      "size": {"width": 1080, "height": 1080},
      "zIndex": 0,
      "editable": false
    },
    {
      "id": "headline",
      "type": "text",
      "placeholder": "Sale Headline",
      "defaultText": "50% OFF KIDS WEAR!",
      "position": {"x": 540, "y": 150},
      "font": {
        "family": "Poppins",
        "size": 64,
        "weight": "bold",
        "color": "#FFFFFF",
        "align": "center"
      },
      "maxLength": 30,
      "editable": true,
      "zIndex": 2
    },
    {
      "id": "product-area",
      "type": "image-placeholder",
      "position": {"x": 290, "y": 280},
      "size": {"width": 500, "height": 500},
      "placeholder": "Add product photo",
      "aspectRatio": "1:1",
      "editable": true,
      "zIndex": 1
    },
    {
      "id": "cta",
      "type": "button",
      "placeholder": "Call to Action",
      "defaultText": "Shop Now",
      "position": {"x": 390, "y": 900},
      "size": {"width": 300, "height": 70},
      "style": {
        "backgroundColor": "#FF6B6B",
        "textColor": "#FFFFFF",
        "borderRadius": 35,
        "fontSize": 28
      },
      "editable": true,
      "zIndex": 3
    }
  ],
  "metadata": {
    "createdAt": "2024-02-03T00:00:00Z",
    "style": "playful",
    "colors": ["#FF6B6B", "#4ECDC4", "#FFE66D"],
    "tags": ["kids", "fashion", "sale", "instagram"],
    "complexity": "simple"
  },
  "version": "1.0"
}
```