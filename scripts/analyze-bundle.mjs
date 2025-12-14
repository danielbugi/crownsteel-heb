#!/usr/bin/env node
// scripts/analyze-bundle.mjs
// Bundle size analysis script

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BUNDLE_DIR = path.join(__dirname, '../.next');
const OUTPUT_FILE = path.join(__dirname, '../bundle-analysis.json');

// Size thresholds (in KB)
const THRESHOLDS = {
  js: 250, // Total JS per page
  css: 50, // Total CSS per page
  chunk: 100, // Individual chunk
};

function getDirectorySize(dirPath) {
  let totalSize = 0;

  if (!fs.existsSync(dirPath)) {
    return totalSize;
  }

  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      totalSize += getDirectorySize(filePath);
    } else {
      totalSize += stats.size;
    }
  });

  return totalSize;
}

function formatBytes(bytes) {
  return (bytes / 1024).toFixed(2) + ' KB';
}

function analyzeBundle() {
  const staticDir = path.join(BUNDLE_DIR, 'static');

  if (!fs.existsSync(staticDir)) {
    console.error('❌ Build directory not found. Run `npm run build` first.');
    process.exit(1);
  }

  // Analyze JavaScript chunks
  const chunksDir = path.join(staticDir, 'chunks');
  const jsFiles = fs.existsSync(chunksDir)
    ? fs.readdirSync(chunksDir).filter((f) => f.endsWith('.js'))
    : [];

  const jsAnalysis = jsFiles
    .map((file) => {
      const filePath = path.join(chunksDir, file);
      const size = fs.statSync(filePath).size;
      const sizeKB = size / 1024;

      return {
        file,
        size: sizeKB,
        formatted: formatBytes(size),
        warning: sizeKB > THRESHOLDS.chunk,
      };
    })
    .sort((a, b) => b.size - a.size);

  // Analyze CSS
  const cssDir = path.join(staticDir, 'css');
  const cssFiles = fs.existsSync(cssDir)
    ? fs.readdirSync(cssDir).filter((f) => f.endsWith('.css'))
    : [];

  const cssAnalysis = cssFiles
    .map((file) => {
      const filePath = path.join(cssDir, file);
      const size = fs.statSync(filePath).size;

      return {
        file,
        size: size / 1024,
        formatted: formatBytes(size),
      };
    })
    .sort((a, b) => b.size - a.size);

  // Total sizes
  const totalJSSize = jsAnalysis.reduce((sum, f) => sum + f.size, 0);
  const totalCSSSize = cssAnalysis.reduce((sum, f) => sum + f.size, 0);

  const report = {
    timestamp: new Date().toISOString(),
    javascript: {
      total: formatBytes(totalJSSize * 1024),
      totalKB: totalJSSize.toFixed(2),
      files: jsAnalysis.slice(0, 10), // Top 10 largest
      warning: totalJSSize > THRESHOLDS.js,
    },
    css: {
      total: formatBytes(totalCSSSize * 1024),
      totalKB: totalCSSSize.toFixed(2),
      files: cssAnalysis,
      warning: totalCSSSize > THRESHOLDS.css,
    },
    summary: {
      totalSize: formatBytes((totalJSSize + totalCSSSize) * 1024),
      jsFiles: jsFiles.length,
      cssFiles: cssFiles.length,
    },
  };

  // Save report
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(report, null, 2));

  // Console output
  console.log('\n📦 Bundle Size Analysis\n');
  console.log('JavaScript:');
  console.log(
    `  Total: ${report.javascript.total} ${report.javascript.warning ? '⚠️' : '✅'}`
  );
  console.log(`  Files: ${report.summary.jsFiles}`);
  console.log('\nTop 5 Largest JS Chunks:');
  report.javascript.files.slice(0, 5).forEach((file, i) => {
    console.log(
      `  ${i + 1}. ${file.file}: ${file.formatted} ${file.warning ? '⚠️' : ''}`
    );
  });

  console.log('\nCSS:');
  console.log(
    `  Total: ${report.css.total} ${report.css.warning ? '⚠️' : '✅'}`
  );
  console.log(`  Files: ${report.summary.cssFiles}`);

  console.log('\n📊 Total Bundle Size:', report.summary.totalSize);
  console.log(`\n✅ Report saved to: ${OUTPUT_FILE}\n`);

  // Exit with warning if thresholds exceeded
  if (report.javascript.warning || report.css.warning) {
    console.log('⚠️  Warning: Bundle size exceeds recommended thresholds');
    process.exit(1);
  }
}

analyzeBundle();
