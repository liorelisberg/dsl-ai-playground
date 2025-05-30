#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { DSLValidator } = require('./validate-examples.cjs');

class ExampleCleaner {
  constructor() {
    this.validator = new DSLValidator();
  }

  async cleanAllExamples() {
    console.log('🧹 Starting comprehensive example cleanup...\n');
    
    // Get validation results
    const result = this.validator.validateExamples();
    
    if (result.invalidExamples.length === 0) {
      console.log('✅ No hallucinated examples found. All examples are valid!');
      return;
    }

    console.log(`Found ${result.invalidExamples.length} invalid examples across ${result.hallucinations.length} functions`);
    
    // Group invalid examples by file
    const fileGroups = new Map();
    for (const example of result.invalidExamples) {
      const sourceFile = example.sourceFile || example.filename;
      if (!fileGroups.has(sourceFile)) {
        fileGroups.set(sourceFile, []);
      }
      fileGroups.get(sourceFile).push(example);
    }

    // Clean each file
    for (const [filePath, invalidExamples] of fileGroups) {
      await this.cleanFile(filePath, invalidExamples);
    }

    // Run validation again to confirm cleanup
    console.log('\n🔍 Re-validating after cleanup...');
    const finalResult = this.validator.validateExamples();
    
    if (finalResult.invalidExamples.length === 0) {
      console.log('✅ CLEANUP SUCCESSFUL! All examples are now valid.');
    } else {
      console.log(`⚠️  ${finalResult.invalidExamples.length} examples still invalid. Manual review required.`);
    }
  }

  async cleanFile(filePath, invalidExamples) {
    console.log(`\n🔧 Cleaning ${filePath}...`);
    
    try {
      // Read the original file
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Create backup
      const backupPath = filePath.replace('.ts', '.backup.ts');
      fs.writeFileSync(backupPath, content);
      console.log(`  📁 Backup created: ${backupPath}`);
      
      // Extract all example IDs to remove
      const idsToRemove = new Set(invalidExamples.map(ex => ex.id));
      console.log(`  🗑️  Removing ${idsToRemove.size} invalid examples: ${Array.from(idsToRemove).join(', ')}`);
      
      // Clean the content
      const cleanedContent = this.removeExamplesFromContent(content, idsToRemove);
      
      // Write cleaned file
      fs.writeFileSync(filePath, cleanedContent);
      console.log(`  ✅ File cleaned successfully`);
      
    } catch (error) {
      console.error(`  ❌ Error cleaning ${filePath}: ${error.message}`);
    }
  }

  removeExamplesFromContent(content, idsToRemove) {
    const lines = content.split('\n');
    const cleanedLines = [];
    let inExample = false;
    let currentExampleId = null;
    let braceDepth = 0;
    let skipCurrentExample = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Detect start of an example object
      if (line.trim().startsWith('{') && !inExample) {
        inExample = true;
        braceDepth = 1;
        
        // Look for the ID in the next few lines
        const exampleBlock = this.extractExampleBlock(lines, i);
        currentExampleId = this.extractIdFromBlock(exampleBlock);
        
        skipCurrentExample = currentExampleId && idsToRemove.has(currentExampleId);
        
        if (skipCurrentExample) {
          console.log(`    🗑️  Skipping example: ${currentExampleId}`);
          continue; // Skip this line
        }
      }
      
      // Track brace depth when inside an example
      if (inExample) {
        const openBraces = (line.match(/{/g) || []).length;
        const closeBraces = (line.match(/}/g) || []).length;
        braceDepth += openBraces - closeBraces;
        
        // End of example object
        if (braceDepth <= 0) {
          inExample = false;
          currentExampleId = null;
          
          if (skipCurrentExample) {
            skipCurrentExample = false;
            // Also skip trailing comma if it exists
            if (i + 1 < lines.length && lines[i + 1].trim() === ',') {
              i++; // Skip the comma line too
            }
            continue;
          }
        }
      }
      
      // Add line if we're not skipping
      if (!skipCurrentExample) {
        cleanedLines.push(line);
      }
    }
    
    // Add cleaned file header comment
    const headerIndex = cleanedLines.findIndex(line => line.includes('Example[]'));
    if (headerIndex !== -1) {
      cleanedLines.splice(headerIndex + 1, 0, 
        `  // ⚠️  CLEANED FILE - ${idsToRemove.size} hallucinated examples removed`,
        `  // 📅  Cleaned on: ${new Date().toISOString()}`,
        `  // 🔍  Removed IDs: ${Array.from(idsToRemove).join(', ')}`,
        ''
      );
    }
    
    return cleanedLines.join('\n');
  }

  extractExampleBlock(lines, startIndex) {
    const block = [];
    let braceDepth = 0;
    
    for (let i = startIndex; i < lines.length && i < startIndex + 20; i++) {
      const line = lines[i];
      block.push(line);
      
      const openBraces = (line.match(/{/g) || []).length;
      const closeBraces = (line.match(/}/g) || []).length;
      braceDepth += openBraces - closeBraces;
      
      if (braceDepth <= 0 && i > startIndex) {
        break;
      }
    }
    
    return block.join('\n');
  }

  extractIdFromBlock(block) {
    const idMatch = block.match(/id:\s*['"`]([^'"`]+)['"`]/);
    return idMatch ? idMatch[1] : null;
  }
}

// Main execution
async function main() {
  console.log('🧹 DSL Example Cleaner - Removing Hallucinated Examples\n');
  console.log('⚠️  This will modify your source files. Backups will be created.\n');
  
  const cleaner = new ExampleCleaner();
  await cleaner.cleanAllExamples();
  
  console.log('\n' + '='.repeat(80));
  console.log('🎯 CLEANUP COMPLETE');
  console.log('='.repeat(80));
  console.log('\nNext steps:');
  console.log('1. Review the cleaned files');
  console.log('2. Test your DSL with the remaining valid examples');
  console.log('3. Remove backup files when satisfied: rm src/examples/*.backup.ts');
  console.log('4. Commit the cleaned examples to git');
}

if (require.main === module) {
  main().catch(console.error);
} 