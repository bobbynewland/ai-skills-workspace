# Course Factory Workflow: The "Cinematic Academy" Pipeline

## 1. Goal
Scale the AI Skills Studio course library by automating the production of multi-scene AI avatar videos featuring B-roll, screen shares, and premium editing.

## 2. Architecture: "The Multi-Input Engine"

### Phase A: Intelligence (Win + LLM)
- **Task:** Create Course Outline + Lesson Scripts.
- **Scene Mapping:** For each lesson, define segments based on avatar style (Normal, Circle Overlay, etc.) and visual content.

### Phase B: Asset Acquisition (Win + Google Drive)
- **Task:** Gather background and B-roll assets.
- **B-roll / Screen Shares:** Hosted on Drive (Public links). HeyGen V2 can pull assets via URLs if specified in the `video_inputs` array.

### Phase C: Production (HeyGen V2 API)
- **Task:** Submit a multi-input "Video Generate" request.
- **Endpoint:** `POST https://api.heygen.com/v2/video/generate`
- **Structure:**
  ```json
  {
    "video_inputs": [
      { "character": { ... }, "voice": { ... }, "background": { "type": "video", "url": "..." } },
      { "character": { ... }, "voice": { ... }, "background": { "type": "image", "url": "..." } }
    ]
  }
  ```

### Phase D: Deployment (CMS)
- **Task:** Poll for completion, download final .mp4, and update the CMS `lessons` table.

## 3. Automation Tooling (`course_factory.py`)
I will build a script that:
1. Takes a Lesson ID and Script.
2. Maps script segments to visual inputs.
3. Fires off the HeyGen V2 Multi-Input API.
4. Auto-updates the platform.

---

# Current Course Project: "Mastering the Remix Tool"
- **Status:** Test Video #2 Fired (Multi-Scene Segmented).
- **Video ID:** `17e8df80ade143f682a6d539fb827976`
- **Objective:** Finalize the pipeline with B-roll injection once test processing completes.
