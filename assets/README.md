# Assets Folder

Place your real screenshots and images here. The website references these files.

## Required Images

### App Screenshots (Optional but Recommended)

| Filename | Description | Recommended Size |
|----------|-------------|------------------|
| `screenshot-lost-mode.png` | Lost Mode toggle screen | 390x844px (iPhone 14 Pro) |
| `screenshot-qr-code.png` | QR Code generation screen | 390x844px |
| `screenshot-nfc-write.png` | NFC tag writing screen | 390x844px |
| `screenshot-finder-view.png` | What finders see when scanning | 390x844px |
| `screenshot-health-dashboard.png` | Health tracking dashboard | 390x844px |

### How to Add Screenshots

1. Take screenshots from the iOS Simulator (Cmd+S) or real device
2. Rename to match the filenames above
3. Drop into this `/assets` folder
4. Commit and push to GitHub

### Image Optimization

Before adding images, optimize them for web:
- Use [TinyPNG](https://tinypng.com/) or [Squoosh](https://squoosh.app/)
- Target file size: under 200KB per image
- Format: PNG for screenshots, WebP for photos

## Current Assets

The website works without screenshots. When present, they enhance the visual presentation.

| File | Status |
|------|--------|
| `../logo.png` | Present (in root) |
| Screenshots | Not yet added |

## Notes

- The website layout gracefully handles missing images
- Add screenshots when ready - no code changes needed
- All images should have appropriate alt text (already in HTML)
