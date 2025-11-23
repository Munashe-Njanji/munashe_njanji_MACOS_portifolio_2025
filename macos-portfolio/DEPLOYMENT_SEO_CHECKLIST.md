# Pre-Deployment SEO Checklist

Use this checklist before deploying your portfolio to ensure all SEO elements are properly configured.

## 🎨 Visual Assets

- [ ] **OG Image Created** (1200x630px)
  - Location: `public/og-image.png`
  - Shows portfolio screenshot or branded graphic
  - File size < 1MB
  - Format: PNG or JPG

- [ ] **Favicons Present**
  - favicon.ico ✓
  - favicon-16x16.png ✓
  - favicon-32x32.png ✓
  - apple-touch-icon.png ✓
  - android-chrome icons ✓

## 📝 Content Updates

- [ ] **index.html Updated**
  - [ ] Title tag includes your name and keywords
  - [ ] Meta description is compelling (150-160 chars)
  - [ ] Keywords are relevant to your skills
  - [ ] Author name is correct
  - [ ] Canonical URL matches your domain
  - [ ] OG URL matches your domain
  - [ ] Twitter URL matches your domain

- [ ] **Social Links Updated**
  - [ ] GitHub URL is correct
  - [ ] LinkedIn URL is correct
  - [ ] Other social profiles added (if any)

- [ ] **Structured Data Verified**
  - [ ] Name is correct
  - [ ] Job title is accurate
  - [ ] Skills list is up-to-date
  - [ ] Social links are working

## 🗺️ Sitemap & Robots

- [ ] **sitemap.xml**
  - [ ] Contains all pages
  - [ ] URLs are absolute (include domain)
  - [ ] Last modified dates are current
  - [ ] Priorities are set correctly

- [ ] **robots.txt**
  - [ ] Allows all crawlers
  - [ ] Points to correct sitemap URL
  - [ ] No unintended blocks

## 🔒 Security & Headers

- [ ] **vercel.json Configured**
  - [ ] Security headers present
  - [ ] Cache headers optimized
  - [ ] Redirects configured (if needed)

- [ ] **_headers File**
  - [ ] Security headers set
  - [ ] Cache control configured
  - [ ] Content types correct

## 🧪 Pre-Deployment Testing

### Local Testing
```bash
# Build the project
yarn build

# Preview the build
yarn preview

# Check for errors in console
# Test all links work
# Verify images load
```

- [ ] **Build Successful**
  - No TypeScript errors
  - No build warnings
  - All assets bundled correctly

- [ ] **Preview Works**
  - Site loads correctly
  - All features functional
  - No console errors
  - Images display properly

### SEO Testing (Local)
- [ ] **Lighthouse Audit**
  - Open Chrome DevTools (F12)
  - Go to Lighthouse tab
  - Run SEO audit
  - Score should be 90+

- [ ] **Meta Tags Visible**
  - View page source
  - Verify all meta tags present
  - Check structured data is valid

## 🚀 Deployment

- [ ] **Git Repository**
  ```bash
  git add .
  git commit -m "Add SEO optimization"
  git push origin main
  ```

- [ ] **Vercel Deployment**
  - Push triggers automatic deployment
  - Wait for deployment to complete
  - Check deployment logs for errors

- [ ] **Verify Live Site**
  - Visit deployed URL
  - Test all functionality
  - Check mobile responsiveness
  - Verify OG image loads

## 🔍 Post-Deployment Testing

### Immediate Tests (Within 1 Hour)

- [ ] **Google Rich Results Test**
  - URL: https://search.google.com/test/rich-results
  - Enter your site URL
  - Verify no errors
  - Check structured data displays

- [ ] **Facebook Sharing Debugger**
  - URL: https://developers.facebook.com/tools/debug/
  - Enter your site URL
  - Click "Scrape Again"
  - Verify OG image shows
  - Check title and description

- [ ] **Twitter Card Validator**
  - URL: https://cards-dev.twitter.com/validator
  - Enter your site URL
  - Verify card preview
  - Check image displays

- [ ] **PageSpeed Insights**
  - URL: https://pagespeed.web.dev/
  - Test mobile and desktop
  - Check Core Web Vitals
  - Aim for green scores

### Search Engine Submission (Within 24 Hours)

- [ ] **Google Search Console**
  1. Go to https://search.google.com/search-console
  2. Add property (your domain)
  3. Verify ownership (HTML tag method)
  4. Submit sitemap: `https://your-domain.com/sitemap.xml`
  5. Request indexing for homepage

- [ ] **Bing Webmaster Tools**
  1. Go to https://www.bing.com/webmasters
  2. Add your site
  3. Verify ownership
  4. Submit sitemap
  5. Request indexing

### Analytics Setup (Within 24 Hours)

- [ ] **Google Analytics**
  - Create GA4 property
  - Add tracking code to site
  - Verify tracking works
  - Set up goals/conversions

- [ ] **Search Console Integration**
  - Link Search Console to Analytics
  - Enable data sharing
  - Set up reports

## 📊 Week 1 Monitoring

- [ ] **Day 1-2**
  - Check Search Console for crawl errors
  - Verify sitemap submitted successfully
  - Check indexing status

- [ ] **Day 3-5**
  - Monitor for first indexed pages
  - Check for any crawl issues
  - Verify mobile usability

- [ ] **Day 6-7**
  - Review search performance data
  - Check for any security issues
  - Verify all pages indexed

## 🎯 Success Criteria

After 1 week, you should see:
- ✅ Site indexed by Google
- ✅ No crawl errors in Search Console
- ✅ Lighthouse SEO score 90+
- ✅ Social sharing works correctly
- ✅ Mobile usability 100%
- ✅ Core Web Vitals in green

## 🆘 Troubleshooting

### Site Not Indexed?
1. Check robots.txt isn't blocking
2. Verify sitemap is accessible
3. Request indexing in Search Console
4. Wait 1-2 weeks (indexing takes time)

### OG Image Not Showing?
1. Clear Facebook cache in debugger
2. Verify image is accessible
3. Check image dimensions (1200x630)
4. Ensure absolute URL is used

### Low Lighthouse Score?
1. Check for console errors
2. Optimize images
3. Reduce JavaScript
4. Improve accessibility

## 📝 Notes

- Keep this checklist for future deployments
- Update sitemap when adding new pages
- Re-run tests after major changes
- Monitor Search Console weekly

---

**Last Updated**: January 2025
**Next Review**: After deployment

✨ **Ready to deploy?** Make sure all checkboxes are ticked!
