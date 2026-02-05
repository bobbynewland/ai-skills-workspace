# Repository Organization

## 🏢 Repository Structure

### 1. **ai-skills-workspace** (This Repo)
**Purpose:** Internal tools, workflows, and automation

**Contents:**
- `command-board/` - Mission Control dashboard
- `skills/` - Custom OpenClaw skills
- `workflows/` - Workflow templates and generators
- `video_scripts/` - AI avatar video scripts
- `memory/` - Session logs and memories
- Internal scripts and tools

**URL:** `github.com/bobbynewland/ai-skills-workspace`

---

### 2. **Webistes** (Client Projects)
**Purpose:** Client website projects

**Contents:**
- `church_website/` - True Gospel Evangelistic Ministry
- Future client projects
- Completed website deliveries

**URL:** `github.com/bobbynewland/Webistes`

---

## 🔄 Workflow

### For New Client Websites:

1. **Develop in ai-skills-workspace**
   ```
   /workflows/client_name/
   ```

2. **Test and refine**

3. **Move to Webistes repo**
   ```bash
   cp -r workflows/client_name /path/to/Webistes/
   cd /path/to/Webistes
   git add -A && git commit -m "Add client website"
   git push
   ```

4. **Deliver to client** from Webistes repo

---

## 💡 Why Separate Repos?

| Repo | Purpose | Audience |
|------|---------|----------|
| **ai-skills-workspace** | Internal tools, automation, workflows | Developer (you) |
| **Webistes** | Client deliverables, production websites | Clients |

**Benefits:**
- ✅ Clean separation of concerns
- ✅ Clients only see their projects
- ✅ Internal tools stay private
- ✅ Easier project management
- ✅ Professional delivery

---

## 📂 Current Locations

### Church Website
- **Development:** `ai-skills-workspace/workflows/church_website/`
- **Production:** `Webistes/church_website/`
- **Live URL:** http://147.93.40.188:8080/workflows/church_website/index.html

---

## 🚀 Quick Commands

### Clone Both Repos
```bash
# Internal tools
git clone https://github.com/bobbynewland/ai-skills-workspace.git

# Client projects
git clone https://github.com/bobbynewland/Webistes.git
```

### Push Client Project
```bash
cd /path/to/Webistes
git add client_name/
git commit -m "Add [client] website"
git push
```

---

**Organization complete!** 🎯
