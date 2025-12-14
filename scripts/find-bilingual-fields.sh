#!/bin/bash

# Script to find all files containing bilingual field references
# Outputs results to bilingual-fields-report.txt

OUTPUT_FILE="bilingual-fields-report.txt"

echo "🔍 Scanning for bilingual field references..." > "$OUTPUT_FILE"
echo "========================================" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Define patterns to search for
PATTERNS=(
  "nameEn"
  "nameHe"
  "descriptionEn"
  "descriptionHe"
  "titleEn"
  "titleHe"
  "contentEn"
  "contentHe"
  "excerptEn"
  "excerptHe"
  "variantLabelEn"
  "variantLabelHe"
)

# Track total files found
total_files=0

# Search for each pattern
for pattern in "${PATTERNS[@]}"; do
  echo "Searching for: $pattern" >> "$OUTPUT_FILE"
  echo "---" >> "$OUTPUT_FILE"
  
  # Find files containing the pattern (excluding node_modules, .next, .git)
  files=$(grep -rl "$pattern" \
    --include="*.ts" \
    --include="*.tsx" \
    --include="*.js" \
    --include="*.jsx" \
    --exclude-dir=node_modules \
    --exclude-dir=.next \
    --exclude-dir=.git \
    --exclude-dir=dist \
    --exclude-dir=build \
    src/ scripts/ prisma/ 2>/dev/null)
  
  if [ -n "$files" ]; then
    echo "$files" | while read -r file; do
      echo "  📄 $file" >> "$OUTPUT_FILE"
      ((total_files++))
    done
  else
    echo "  ✅ No files found" >> "$OUTPUT_FILE"
  fi
  
  echo "" >> "$OUTPUT_FILE"
done

# Summary
echo "========================================" >> "$OUTPUT_FILE"
echo "Summary: Found bilingual references in files listed above" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Get unique files
echo "Unique files with bilingual fields:" >> "$OUTPUT_FILE"
echo "---" >> "$OUTPUT_FILE"

grep -rl \
  -e "nameEn" -e "nameHe" \
  -e "descriptionEn" -e "descriptionHe" \
  -e "titleEn" -e "titleHe" \
  -e "contentEn" -e "contentHe" \
  -e "excerptEn" -e "excerptHe" \
  -e "variantLabelEn" -e "variantLabelHe" \
  --include="*.ts" \
  --include="*.tsx" \
  --include="*.js" \
  --include="*.jsx" \
  --exclude-dir=node_modules \
  --exclude-dir=.next \
  --exclude-dir=.git \
  --exclude-dir=dist \
  --exclude-dir=build \
  src/ scripts/ prisma/ 2>/dev/null | sort -u >> "$OUTPUT_FILE"

echo "" >> "$OUTPUT_FILE"
echo "✅ Scan complete! Results saved to: $OUTPUT_FILE" >> "$OUTPUT_FILE"

# Print to console
cat "$OUTPUT_FILE"

echo ""
echo "📋 Full report saved to: $OUTPUT_FILE"
