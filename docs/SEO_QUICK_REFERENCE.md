# SEO Quick Reference Card

## 🎯 Before Deployment

```bash
# 1. Create OG image (1200x630px)
# Save to: public/og-image.png

# 2. Update index.html
# Replace: munashe-njanji.vercel.app → your-domain.com
# Update: GitHub and LinkedIn URLs

# 3. Build and deploy
yarn build
git add .
git commit -m "Add SEO optimization"
git push
```

## 🔍 After Deployment

### Submit to Search Engines
- **Google**: https://search.google.com/search-console
- **Bing**: https://www.bing.com/webmasters

### Test SEO
```bash
# Lighthouse in Chrome DevTools (F12)
# Target: 90+ SEO score
```

### Test Social Sharing
- **Facebook**: https://developers.facebook.com/tools/debug/
- **Twitter**: https://cards-dev.twitter.com/validator

## 📊 Monitor

- Google Search Console (weekly)
- Google Analytics (daily)
- Core Web Vitals (monthly)

## 🛠️ Commands

```bash
yarn sitemap      # Generate sitemap
yarn build        # Production build
yarn preview      # Preview build
yarn lint         # Check code quality
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `index.html` | Meta tags & structured data |
| `public/robots.txt` | Crawler instructions |
| `public/sitemap.xml` | Site structure |
| `public/og-image.png` | Social sharing image |
| `vercel.json` | Headers & redirects |

## ✅ Checklist

- [ ] OG image created
- [ ] URLs updated
- [ ] Deployed to production
- [ ] Submitted to Google
- [ ] Submitted to Bing
- [ ] Lighthouse score 90+
- [ ] Social sharing tested
- [ ] Analytics set up

## 🎓 Resources

- [SEO_GUIDE.md](./SEO_GUIDE.md) - Full guide
- [SEO_CHECKLIST.md](./SEO_CHECKLIST.md) - Detailed checklist
- [SEO_IMPLEMENTATION_SUMMARY.md](./SEO_IMPLEMENTATION_SUMMARY.md) - What was done

## 💡 Quick Tips

1. Keep title under 60 characters
2. Keep description under 160 characters
3. Update sitemap when adding pages
4. Monitor Search Console weekly
5. Optimize images with alt text

---

**Need help?** Check SEO_GUIDE.md for detailed instructions
