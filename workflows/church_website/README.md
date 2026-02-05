# Church Website Workflow

## 🎯 Complete Client Workflow for Church Websites

This folder contains everything needed to build professional church websites as a template for future clients.

---

## 📁 Files

| File | Purpose |
|------|---------|
| `CLIENT_BRIEF.md` | Client intake form and project specs |
| `DESIGN_RESEARCH.md` | Research on top church websites |
| `MOOD_BOARD.md` | Color palette, typography, design specs |
| `index.html` | Complete website template |
| `generate_site.py` | Script to regenerate with AI |

---

## 🚀 Quick Start

### 1. Customize for Client
Edit these sections in `index.html`:
- Church name (search "Grace Community")
- Pastor name
- Service times
- Address and contact info
- Social media links
- Images (replace Unsplash URLs)

### 2. Go High Level Integration
Add your webhook URL in the JavaScript:
```javascript
// In index.html, replace the form submission:
fetch('YOUR_GHL_WEBHOOK_URL', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
});
```

### 3. Deploy
- Upload `index.html` to any web host
- Or use Netlify/Vercel drag-and-drop
- Free hosting options: Netlify, Vercel, GitHub Pages

---

## 🎨 Customization Guide

### Colors
Edit CSS custom properties in `<style>`:
```css
--color-primary: #1E3A5F;  /* Navy */
--color-accent: #D4AF37;   /* Gold */
```

### Fonts
Change in Google Fonts link and CSS:
```css
font-family: 'Playfair Display', serif;  /* Headings */
font-family: 'Inter', sans-serif;         /* Body */
```

### Images
Replace Unsplash URLs with client photos:
```html
<img src="client-photo.jpg" alt="...">
```

---

## 📊 Go High Level Webhook Setup

### 1. Create Workflow in GHL
- Go to Automation → Workflows
- Create new workflow
- Trigger: Webhook
- Copy webhook URL

### 2. Update Form
Replace the form submission JavaScript:
```javascript
fetch('https://your-ghl-webhook-url', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        message: data.message,
        prayerRequest: data.prayerRequest,
        source: 'church_website'
    })
});
```

### 3. Automation Actions
- Send welcome email
- Tag: "Website Lead"
- Tag: "Church Visitor"
- Notify pastor
- Add to newsletter (if opted in)

---

## 💰 Pricing for Future Clients

### Simple HTML Sites (like this one)
- **Base Price:** $1,500-2,500
- **Includes:** Design, development, mobile responsive
- **Timeline:** 1 week
- **Hosting:** Client provides or +$20/month

### WordPress Custom Theme
- **Base Price:** $3,000-5,000
- **Includes:** Custom theme, blog, CMS
- **Timeline:** 2-3 weeks
- **Hosting:** WordPress hosting required

### E-commerce Add-on
- **Additional:** +$1,500-2,500
- **Platform:** WooCommerce or Shopify

---

## 🎯 Future Templates

Use this workflow for:
- Churches (this template)
- Service businesses (modify colors/content)
- Restaurants (add menu section)
- Nonprofits (add donation section)
- Small businesses (generic template)

---

## 🔧 Tech Stack

- **HTML5** - Semantic structure
- **Tailwind CSS** - Styling via CDN
- **GSAP** - Animations via CDN
- **Font Awesome** - Icons via CDN
- **Google Fonts** - Typography
- **Vanilla JS** - No frameworks needed

---

## ✅ Pre-Launch Checklist

- [ ] Replace all placeholder text
- [ ] Add client logo
- [ ] Upload client photos
- [ ] Update contact information
- [ ] Test all links
- [ ] Test form submission
- [ ] Verify Go High Level webhook
- [ ] Test on mobile devices
- [ ] Check page speed
- [ ] Set up Google Analytics
- [ ] SEO meta tags filled out

---

## 📱 Testing

Open in browser:
```
http://147.93.40.188:8080/workflows/church_website/index.html
```

Or local:
```bash
cd workflows/church_website
python3 -m http.server 8000
```

Then open: http://localhost:8000

---

## 🎓 Lessons Learned

Document here for future projects:
- Client communication tips
- Common revision requests
- Technical challenges
- Time estimates

---

**Ready to deploy!** 🚀
