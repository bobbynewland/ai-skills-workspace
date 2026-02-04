---
name: github
description: GitHub CLI integration for repo management, issues, PRs, and workflows. Backup and sync workspace to GitHub.
---

# GitHub Skill

Manage GitHub repos, issues, pull requests, and actions from the command line.

## Installation

Requires GitHub CLI (`gh`). Already installed in this workspace.

## Authentication

```bash
gh auth login
```

Or use token:
```bash
gh auth login --with-token < token.txt
```

## Common Commands

### Repo Management
```bash
# Create new repo
gh repo create my-project --public

# Clone repo
gh repo clone owner/repo

# View repo
gh repo view owner/repo --web
```

### Issues
```bash
# List issues
gh issue list

# Create issue
gh issue create --title "Bug" --body "Description"

# Close issue
gh issue close 123
```

### Pull Requests
```bash
# Create PR
gh pr create --title "Feature" --body "Changes"

# List PRs
gh pr list

# Merge PR
gh pr merge 123
```

### Backup Workspace
```bash
# Sync entire workspace to GitHub
cd /root/.openclaw/workspace
git init
git add .
git commit -m "Backup $(date)"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/openclaw-workspace.git
git push -u origin main
```

## Workflow Examples

**Daily Backup:**
```bash
cd /root/.openclaw/workspace
git add .
git commit -m "Daily backup $(date '+%Y-%m-%d %H:%M')"
git push
```

**Create Release:**
```bash
gh release create v1.0.0 --title "Version 1.0" --notes "Release notes"
```
