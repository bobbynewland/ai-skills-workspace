# CLAWDBOT API - Template Upload Module
# Upload templates to AI Skills Bootcamp Portal

import urllib.request
import urllib.error
import json

API_KEY = "f0959c2b9c94427b13401afccb60e699bcd320fbc25398d3eef2456364330f03"
API_ENDPOINT = "https://ai-skills-bootcamp-portal.vercel.app/api/v1/clawdbot/upload-pack"


def upload_pack(pack_name, templates, thumbnail_url=None, category="General", is_published=False):
    """
    Upload a pack with templates to the CMS
    
    Args:
        pack_name: Display name for the pack
        templates: List of dicts with keys: title, prompt_text, image_url
        thumbnail_url: Optional pack cover image URL
        category: Template category (default: "General")
        is_published: Whether to publish immediately (default: False)
    
    Returns:
        dict with success status and results
    """
    import time
    
    payload = {
        "pack": {
            "name": pack_name,
            "slug": f"{pack_name.lower().replace(' ', '-')}-{int(time.time())}",
            "access_level": "free",
            "is_published": is_published,
            "thumbnail_url": thumbnail_url,
            "category": category
        },
        "templates": templates
    }
    
    data = json.dumps(payload).encode()
    headers = {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
    }
    
    req = urllib.request.Request(API_ENDPOINT, data=data, headers=headers, method='POST')
    
    try:
        with urllib.request.urlopen(req, timeout=90) as response:
            result = json.loads(response.read().decode())
            return {
                "success": True,
                "pack_id": result.get("pack_id"),
                "slug": result.get("slug"),
                "results": result.get("results", [])
            }
    except urllib.error.HTTPError as e:
        return {
            "success": False,
            "error": f"HTTP {e.code}: {e.read().decode()}"
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }


def upload_single_template(pack_name, template, thumbnail_url=None):
    """
    Upload a single template pack
    
    Args:
        pack_name: Name for the pack
        template: Dict with title, prompt_text, image_url
        thumbnail_url: Optional cover image
    
    Returns:
        dict with success status
    """
    return upload_pack(
        pack_name=pack_name,
        templates=[template],
        thumbnail_url=thumbnail_url
    )


# Example usage:
if __name__ == "__main__":
    result = upload_pack(
        pack_name="Bold Fashion V4",
        templates=[
            {
                "title": "BOSS - BOLD EARTH",
                "prompt_text": "High-fashion social media post...",
                "image_url": "https://example.com/image.png"
            }
        ],
        thumbnail_url="https://example.com/thumb.png",
        category="Fashion"
    )
    print(json.dumps(result, indent=2))
