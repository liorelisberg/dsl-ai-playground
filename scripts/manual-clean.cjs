#!/usr/bin/env node

const fs = require('fs');

// Define all hallucinated example IDs based on our validation report
const HALLUCINATED_IDS = [
  // Array operations
  'array-flat-6', 'array-flat-7', 'array-flat-8', 'array-flat-9', 'array-flat-10',
  
  // Date operations  
  'date-1', 'date-12', 'date-13', 'date-const-5', 'date-const-6', 'date-const-7',
  'date-const-8', 'date-const-9', 'date-const-10', 'date-const-11', 'date-parts-9', 'date-parts-10',
  
  // Mathematical operations
  'math-8', 'math-23', 'complex-math-3', 'complex-math-9', 'complex-math-13', 'complex-math-22',
  'complex-math-26', 'complex-math-29', 'complex-math-31', 'complex-math-32', 'complex-math-34',
  'decimal-2', 'decimal-4', 'decimal-6', 'decimal-7', 'decimal-8', 'round-10',
  
  // String operations
  'str-adv-1', 'str-adv-2', 'str-adv-5', 'str-adv-6', 'str-adv-7', 'str-adv-8',
  'str-adv-9', 'str-adv-10', 'str-adv-11', 'str-adv-12'
];

function cleanFile(filePath) {
  console.log(`\n🔧 Manually cleaning ${filePath}...`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Create backup
    const backupPath = filePath.replace('.ts', '.manual-backup.ts');
    fs.writeFileSync(backupPath, content);
    console.log(`  📁 Manual backup created: ${backupPath}`);
    
    let cleanedContent = content;
    let removedCount = 0;
    
    // Remove each hallucinated example
    for (const id of HALLUCINATED_IDS) {
      const pattern = new RegExp(
        `\\s*{[^}]*id:\\s*['"\`]${id}['"\`][^}]*}(?:\\s*,)?`,
        'gs'
      );
      
      const beforeLength = cleanedContent.length;
      cleanedContent = cleanedContent.replace(pattern, '');
      
      if (cleanedContent.length < beforeLength) {
        console.log(`    🗑️  Removed: ${id}`);
        removedCount++;
      }
    }
    
    // Clean up any extra commas that might be left
    cleanedContent = cleanedContent.replace(/,(\s*,)+/g, ','); // Multiple commas
    cleanedContent = cleanedContent.replace(/,(\s*])/g, '$1'); // Comma before closing bracket
    
    // Add cleanup header
    const headerRegex = /(export const \w+Examples: Example\[\] = \[)/;
    cleanedContent = cleanedContent.replace(headerRegex, 
      `$1\n  // ⚠️  MANUALLY CLEANED - ${removedCount} hallucinated examples removed\n  // 📅  Cleaned on: ${new Date().toISOString()}`
    );
    
    // Write cleaned file
    fs.writeFileSync(filePath, cleanedContent);
    console.log(`  ✅ File cleaned: ${removedCount} examples removed`);
    
  } catch (error) {
    console.error(`  ❌ Error cleaning ${filePath}: ${error.message}`);
  }
}

function main() {
  console.log('🧹 Manual DSL Example Cleaner\n');
  console.log(`Targeting ${HALLUCINATED_IDS.length} hallucinated examples:\n`);
  console.log(HALLUCINATED_IDS.join(', '));
  
  const filesToClean = [
    'src/examples/arrayOperationsExamples.ts',
    'src/examples/dateOperationsExamples.ts', 
    'src/examples/mathematicalOperationsExamples.ts',
    'src/examples/stringOperationsExamples.ts'
  ];
  
  // Clean each file
  for (const file of filesToClean) {
    cleanFile(file);
  }
  
  console.log('\n✅ Manual cleanup complete!');
  console.log('\nNext: Run validation again to confirm all hallucinations removed');
}

if (require.main === module) {
  main();
} 