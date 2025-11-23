#!/usr/bin/env node

/**
 * Sitemap Generator Script
 * 
 * This script generates a sitemap.xml file for your portfolio.
 * Run with: node scripts/generate-sitemap.js
 * 
 * Update the URLs array below with your actual pages.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuration
const SITE_URL = 'https://www.afroblush.store'
const OUTPUT_PATH = path.join(__dirname, '../public/sitemap.xml')

// Define your URLs here
const urls = [
  {
    loc: '/',
    changefreq: 'weekly',
    priority: '1.0',
  },
  // Add more URLs as your site grows
  // {
  //   loc: '/about',
  //   changefreq: 'monthly',
  //   priority: '0.8',
  // },
]

// Generate sitemap XML
function generateSitemap() {
  const today = new Date().toISOString().split('T')[0]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls
  .map(
    url => `  
  <url>
    <loc>${SITE_URL}${url.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join('\n')}
  
</urlset>`

  return xml
}

// Write sitemap to file
function writeSitemap() {
  try {
    const sitemap = generateSitemap()
    fs.writeFileSync(OUTPUT_PATH, sitemap, 'utf8')
    console.log('✅ Sitemap generated successfully!')
    console.log(`📍 Location: ${OUTPUT_PATH}`)
    console.log(`🔗 URLs included: ${urls.length}`)
  } catch (error) {
    console.error('❌ Error generating sitemap:', error)
    process.exit(1)
  }
}

// Run the script
writeSitemap()
