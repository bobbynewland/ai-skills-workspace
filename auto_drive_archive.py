#!/root/.openclaw/workspace/venv/bin/python
"""Upload generated assets to Google Drive and optionally delete local files.

Usage:
  auto_drive_archive.py /abs/or/rel/file1.png /path/file2.png
  auto_drive_archive.py --folder template_packs --keep-local file.png
"""
import argparse
import json
import os
import sys

from google_workspace import drive_upload

WORKSPACE = "/root/.openclaw/workspace"
FOLDERS_FILE = f"{WORKSPACE}/.drive_folders.json"


def resolve_path(p: str) -> str:
    if os.path.isabs(p):
        return p
    return os.path.join(WORKSPACE, p)


def load_folder_id(folder_key: str) -> str:
    with open(FOLDERS_FILE, "r") as f:
        data = json.load(f)
    folder_id = data.get(folder_key)
    if not folder_id:
        raise ValueError(f"Folder key '{folder_key}' not found in {FOLDERS_FILE}")
    return folder_id


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("files", nargs="+", help="Files to upload")
    parser.add_argument("--folder", default="template_packs", help="Folder key in .drive_folders.json")
    parser.add_argument("--keep-local", action="store_true", help="Do not delete local files after upload")
    args = parser.parse_args()

    folder_id = load_folder_id(args.folder)

    any_fail = False
    for p in args.files:
        full = resolve_path(p)
        name = os.path.basename(full)
        if not os.path.exists(full):
            print(f"MISSING\t{name}")
            any_fail = True
            continue
        try:
            res = drive_upload(full, name=name, folder_id=folder_id)
            url = res.get("webViewLink", "")
            file_id = res.get("id", "")
            print(f"UPLOADED\t{name}\t{file_id}\t{url}")
            if not args.keep_local:
                os.remove(full)
                print(f"DELETED\t{name}")
        except Exception as e:
            any_fail = True
            print(f"FAILED\t{name}\t{e}")

    sys.exit(1 if any_fail else 0)


if __name__ == "__main__":
    main()
