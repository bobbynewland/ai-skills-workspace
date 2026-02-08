# Bold Fashion V4 - Manual Upload Instructions

## ✅ Files Ready for Upload

All files are prepared and waiting in `/root/.openclaw/workspace/`:

### Images (4 files)
| File | Size | Description |
|------|------|-------------|
| `v4-a.png` | 3.8 MB | BOLD EARTH - Hero Center |
| `v4-b.png` | 3.2 MB | NEON NOIR - Split Layout |
| `v4-c.png` | 3.6 MB | JEWEL TONES - Typography Hero |
| `v4-thumb.png` | 4.3 MB | Pack Thumbnail |

### Configuration (3 files)
| File | For Template |
|------|--------------|
| `v4-a-upload.json` | Template A |
| `v4-b-upload.json` | Template B |
| `v4-c-upload.json` | Template C |

---

## 📋 Manual Upload Steps

### Option 1: Admin Panel (Recommended)

1. **Go to Admin Panel:**
   ```
   https://ai-skills-bootcamp-portal.vercel.app/admin
   ```

2. **Login** with your admin credentials

3. **Navigate to Templates** section

4. **Click "Add Template"** or **"Upload"**

5. **Upload files one at a time:**

   **Template A:**
   - Image: `v4-a.png`
   - Config: `v4-a-upload.json`
   
   **Template B:**
   - Image: `v4-b.png`
   - Config: `v4-b-upload.json`
   
   **Template C:**
   - Image: `v4-c.png`
   - Config: `v4-c-upload.json`

6. **Set Status:** Draft → Publish when ready

---

### Option 2: API Fix Required

The API currently requires session-based auth (cookies), not Bearer tokens.

**To fix:**
1. Login to admin panel in browser (gets session cookie)
2. Export session cookie
3. Use cookie-based auth for API calls

**Example curl with cookies:**
```bash
curl -X POST "https://ai-skills-bootcamp-portal.vercel.app/admin/api/templates" \
  -H "Content-Type: multipart/form-data" \
  -b "session=YOUR_COOKIE" \
  -F "image=@v4-a.png" \
  -F "template=@v4-a-upload.json"
```

---

## 📊 Quick Stats

- **Total Files:** 7 (4 images + 3 configs)
- **Total Size:** ~19 MB
- **Templates:** 3 (A, B, C)
- **Categories:** Fashion & Lifestyle
- **Status:** Ready for upload

---

## 🔗 Direct File Links (if needed)

If you need to download files locally:

```bash
# SCP from server (if you have SSH access)
scp user@147.93.40.188:/root/.openclaw/workspace/v4-*.png ./
scp user@147.93.40.188:/root/.openclaw/workspace/v4-*-upload.json ./
```

---

## 📞 After Upload

1. Review templates in admin panel
2. Preview each template
3. Test the remix functionality
4. Publish when ready
5. Add to template library

---

**Generated:** February 8, 2026
**Location:** /root/.openclaw/workspace/
