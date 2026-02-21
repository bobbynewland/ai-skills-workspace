# Daily Template Pack Workflow: The "Daily Drop" Pipeline

## 1. Goal
Scale AI Skills Studio to $1M+ MRR by automating the research, creative brief generation, asset creation, and CMS upload of high-end template packs every 24 hours.

## 2. Architecture

### Phase A: Intelligence (Kimi Swarm + Win)
- **Tool:** Kimi Swarm (10 Keys)
- **Task:** Daily scan of trending luxury brands, editorial aesthetics, and viral marketing copy.
- **Output:** `daily-trend-brief-[date].md` containing 3 distinct trend directions.

### Phase B: Visual Proofing (Win + Nano Banana)
- **Tool:** Chief of Staff (Win) + Nano Banana Pro
- **Task:** 
    - Generate ONE (1) high-fidelity sample image for EACH trend identified in Phase A.
    - Present samples to CEO for approval/refinement.
- **Goal:** Zero-waste creative direction.

### Phase C: Full Production (Win + Nano Banana)
- **Tool:** Chief of Staff (Win) + Nano Banana Pro
- **Task:** 
    - Once approved, generate the remaining 3x variations + 1x Pack Thumbnail (4:5).
    - Upload all assets to Google Drive (Set to Public).
    - Assemble final CMS-ready JSON.
    - Push to production endpoint.

## 3. Automation Rules
- ALWAYS use Direct Download URLs for Drive assets.
- ALWAYS set Drive permissions to "Public" before upload.
- ALWAYS provide a visual sample before full pack generation.

---

# Current Status: Visual Proofing Mode Active
- Pipeline updated 2026-02-21.
