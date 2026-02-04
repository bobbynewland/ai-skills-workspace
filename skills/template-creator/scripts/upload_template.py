#!/usr/bin/env python3
"""
Template Upload Utility for AI Skills Bootcamp Portal
Uploads template images and JSON files to the platform API
"""

import argparse
import json
import sys
from pathlib import Path
import urllib.request
import urllib.error


def upload_template(image_path: str, json_path: str, api_token: str, base_url: str = "https://ai-skills-bootcamp-portal.vercel.app/api"):
    """
    Upload a template image and JSON file to the platform
    
    Args:
        image_path: Path to the template image file
        json_path: Path to the template JSON file
        api_token: Authorization Bearer token
        base_url: Platform API base URL
    """
    
    # Validate files exist
    image_file = Path(image_path)
    json_file = Path(json_path)
    
    if not image_file.exists():
        print(f"Error: Image file not found: {image_path}", file=sys.stderr)
        return False
    
    if not json_file.exists():
        print(f"Error: JSON file not found: {json_path}", file=sys.stderr)
        return False
    
    # Check file sizes
    image_size = image_file.stat().st_size
    json_size = json_file.stat().st_size
    
    if image_size > 10 * 1024 * 1024:  # 10MB
        print(f"Error: Image too large ({image_size / 1024 / 1024:.1f}MB). Max 10MB.", file=sys.stderr)
        return False
    
    if json_size > 1024 * 1024:  # 1MB
        print(f"Error: JSON too large ({json_size / 1024:.1f}KB). Max 1MB.", file=sys.stderr)
        return False
    
    # Validate JSON
    try:
        with open(json_file, 'r') as f:
            template_data = json.load(f)
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON file: {e}", file=sys.stderr)
        return False
    
    # Build multipart form data manually (no external deps)
    boundary = '----FormBoundary7MA4YWxkTrZu0gW'
    
    def encode_file(field_name: str, file_path: Path, content_type: str):
        with open(file_path, 'rb') as f:
            content = f.read()
        return (
            f'--{boundary}\r\n'
            f'Content-Disposition: form-data; name="{field_name}"; filename="{file_path.name}"\r\n'
            f'Content-Type: {content_type}\r\n\r\n'
        ).encode() + content + b'\r\n'
    
    body = b''
    body += encode_file('image', image_file, 'image/png')
    body += encode_file('template', json_file, 'application/json')
    body += f'--{boundary}--\r\n'.encode()
    
    # Build request
    url = f"{base_url}/templates"
    headers = {
        'Authorization': f'Bearer {api_token}',
        'Content-Type': f'multipart/form-data; boundary={boundary}'
    }
    
    req = urllib.request.Request(url, data=body, headers=headers, method='POST')
    
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            result = json.loads(response.read().decode())
            print(f"✓ Template uploaded successfully!")
            print(f"  Template ID: {result.get('templateId')}")
            print(f"  URL: {result.get('url')}")
            print(f"  Status: {result.get('status')}")
            return True
    except urllib.error.HTTPError as e:
        error_body = e.read().decode()
        print(f"Error: HTTP {e.code} - {error_body}", file=sys.stderr)
        return False
    except urllib.error.URLError as e:
        print(f"Error: Connection failed - {e.reason}", file=sys.stderr)
        return False
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        return False


def validate_template_json(json_path: str):
    """
    Validate a template JSON file against the schema
    
    Args:
        json_path: Path to the JSON file
    """
    json_file = Path(json_path)
    
    if not json_file.exists():
        print(f"Error: File not found: {json_path}", file=sys.stderr)
        return False
    
    try:
        with open(json_file, 'r') as f:
            data = json.load(f)
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON - {e}", file=sys.stderr)
        return False
    
    # Required fields
    required = ['name', 'type', 'category', 'dimensions', 'layers']
    missing = [f for f in required if f not in data]
    
    if missing:
        print(f"Error: Missing required fields: {', '.join(missing)}", file=sys.stderr)
        return False
    
    # Validate dimensions
    dims = data.get('dimensions', {})
    if 'width' not in dims or 'height' not in dims:
        print("Error: Dimensions must include 'width' and 'height'", file=sys.stderr)
        return False
    
    # Validate layers
    layers = data.get('layers', [])
    if not layers:
        print("Error: At least one layer required", file=sys.stderr)
        return False
    
    for i, layer in enumerate(layers):
        if 'id' not in layer or 'type' not in layer:
            print(f"Error: Layer {i} missing 'id' or 'type'", file=sys.stderr)
            return False
    
    print(f"✓ Template JSON is valid")
    print(f"  Name: {data.get('name')}")
    print(f"  Type: {data.get('type')}")
    print(f"  Category: {data.get('category')}")
    print(f"  Dimensions: {dims.get('width')}x{dims.get('height')}")
    print(f"  Layers: {len(layers)}")
    return True


def main():
    parser = argparse.ArgumentParser(description='Template Upload Utility')
    subparsers = parser.add_subparsers(dest='command', help='Available commands')
    
    # Upload command
    upload_parser = subparsers.add_parser('upload', help='Upload template to platform')
    upload_parser.add_argument('image', help='Path to template image')
    upload_parser.add_argument('json', help='Path to template JSON')
    upload_parser.add_argument('--token', required=True, help='API Bearer token')
    upload_parser.add_argument('--url', default='https://ai-skills-bootcamp-portal.vercel.app/api', help='API base URL')
    
    # Validate command
    validate_parser = subparsers.add_parser('validate', help='Validate template JSON')
    validate_parser.add_argument('json', help='Path to template JSON')
    
    args = parser.parse_args()
    
    if args.command == 'upload':
        success = upload_template(args.image, args.json, args.token, args.url)
        sys.exit(0 if success else 1)
    elif args.command == 'validate':
        success = validate_template_json(args.json)
        sys.exit(0 if success else 1)
    else:
        parser.print_help()
        sys.exit(1)


if __name__ == '__main__':
    main()