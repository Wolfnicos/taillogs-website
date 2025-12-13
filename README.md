# PetNudge Website

Official website for [PetNudge](https://petnudge.fr) - Your Pet's Health Companion iOS App.

## Pages

- `index.html` - Landing page
- `privacy.html` - Privacy Policy (required for App Store)
- `terms.html` - Terms of Use (required for App Store)

## GitHub Pages Setup

1. Create a new repository on GitHub named `taillogs-website` (or any name)
2. Push these files to the repository
3. Go to repository Settings > Pages
4. Under "Source", select "Deploy from a branch"
5. Select `main` branch and `/ (root)` folder
6. Click Save

## Custom Domain Setup

1. In your domain registrar (where you bought petnudge.fr), add these DNS records:

   **For apex domain (petnudge.fr):**
   ```
   A     @     185.199.108.153
   A     @     185.199.109.153
   A     @     185.199.110.153
   A     @     185.199.111.153
   ```

   **For www subdomain:**
   ```
   CNAME www   yourusername.github.io
   ```

2. In GitHub repository Settings > Pages:
   - Enter `petnudge.fr` in "Custom domain"
   - Check "Enforce HTTPS" (after DNS propagates)

3. Wait for DNS propagation (can take up to 24-48 hours)

## SSL Certificate

GitHub Pages automatically provides free SSL for custom domains. The `.app` TLD requires HTTPS, which GitHub Pages handles automatically.

## Files

```
taillogs-website/
├── index.html      # Landing page
├── privacy.html    # Privacy Policy
├── terms.html      # Terms of Use
├── CNAME           # Custom domain config
└── README.md       # This file
```

## Contact

support@petnudge.fr
