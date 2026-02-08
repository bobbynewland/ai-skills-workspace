#!/usr/bin/env python3
"""Upload template packs to Google Drive"""
import os
import json
from google_workspace import get_creds, drive_upload

creds, email = get_creds()

# Load folder IDs
with open('/root/.openclaw/workspace/.drive_folders.json', 'r') as f:
    folders = json.load(f)

tp_id = folders['template_packs']

# Template packs to upload
template_packs = [
    # Pop Art Pack
    ('pop-art-pack.json', 'Pop Art Pack'),
    ('pop-art-pack-v2.json', 'Pop Art Pack'),
    ('pop-art-pack-a.png', 'Pop Art Pack'),
    ('pop-art-pack-b.png', 'Pop Art Pack'),
    ('pop-art-pack-c.png', 'Pop Art Pack'),
    ('pop-art-pack-thumb.png', 'Pop Art Pack'),
    ('pop-art-pack-thumb-v2.png', 'Pop Art Pack'),
    # Bold Fashion V3
    ('bold-fashion-v3.json', 'Bold Fashion V3'),
    ('v3-a.png', 'Bold Fashion V3'),
    ('v3-b.png', 'Bold Fashion V3'),
    ('v3-c.png', 'Bold Fashion V3'),
    ('v3-thumb.png', 'Bold Fashion V3'),
    # Bold Fashion V4
    ('bold-fashion-v4-schema.json', 'Bold Fashion V4'),
    ('v4-a.png', 'Bold Fashion V4'),
    ('v4-b.png', 'Bold Fashion V4'),
    ('v4-c.png', 'Bold Fashion V4'),
]

print("Uploading template packs to Google Drive...\n")

for filename, pack_name in template_packs:
    if os.path.exists(filename):
        result = drive_upload(filename, None, tp_id)
        print(f"✅ {filename}")
    else:
        print(f"❌ {filename} - NOT FOUND")

print("\nUpload complete!")
