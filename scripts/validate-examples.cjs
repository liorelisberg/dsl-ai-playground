#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class DSLValidator {
  constructor() {
    this.validFunctions = new Set();
    this.validMethods = new Map(); // context -> methods
    this.validOperators = new Set();
    this.initializeValidElements();
  }

  initializeValidElements() {
    // Parse datasets to extract valid functions
    this.parseDatasets();
    
    // Add core operators that might not appear in datasets
    const operators = ['==', '!=', '<', '<=', '>', '>=', '+', '-', '*', '/', '%', '^', 'and', 'or', 'not', 'in', '?', ':'];
    operators.forEach(op => this.validOperators.add(op));
  }

  parseDatasets() {
    const datasetPaths = [
      'docs/datasets/standard.csv',
      'docs/datasets/unary.csv', 
      'docs/datasets/date.csv'
    ];

    for (const datasetPath of datasetPaths) {
      this.parseDatasetFile(datasetPath);
    }

    console.log(`Found ${this.validFunctions.size} valid functions`);
    console.log(`Found ${this.validOperators.size} valid operators`);
    console.log(`Found ${this.validMethods.size} method contexts`);
  }

  parseDatasetFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('#') || line.trim() === '' || line.startsWith('expression')) {
          continue;
        }
        
        const parts = line.split(';');
        if (parts.length >= 1) {
          const expression = parts[0].trim();
          this.extractFunctionsFromExpression(expression);
        }
      }
    } catch (error) {
      console.warn(`Could not read dataset: ${filePath}`);
    }
  }

  extractFunctionsFromExpression(expression) {
    // Extract standard functions: functionName(...)
    const functionRegex = /([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g;
    let match;
    
    while ((match = functionRegex.exec(expression)) !== null) {
      const funcName = match[1];
      // Skip keywords that aren't functions
      if (!['if', 'then', 'else', 'true', 'false', 'null'].includes(funcName)) {
        this.validFunctions.add(funcName);
      }
    }

    // Extract method calls: object.method(...)
    const methodRegex = /([a-zA-Z_][a-zA-Z0-9_]*)\(\s*[^)]*\s*\)\.([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g;
    while ((match = methodRegex.exec(expression)) !== null) {
      const context = match[1];
      const method = match[2];
      
      if (!this.validMethods.has(context)) {
        this.validMethods.set(context, new Set());
      }
      this.validMethods.get(context).add(method);
    }

    // Extract simple method calls: d().method()
    const simpleMethodRegex = /([a-zA-Z_][a-zA-Z0-9_]*)\(\s*[^)]*\s*\)\.([a-zA-Z_][a-zA-Z0-9_]*)\(/g;
    while ((match = simpleMethodRegex.exec(expression)) !== null) {
      const context = match[1];
      const method = match[2];
      
      if (!this.validMethods.has(context)) {
        this.validMethods.set(context, new Set());
      }
      this.validMethods.get(context).add(method);
    }
  }

  validateExamples() {
    const exampleFiles = this.loadExampleFiles();
    const result = {
      validExamples: [],
      invalidExamples: [],
      hallucinations: []
    };

    const hallucinationMap = new Map();

    for (const file of exampleFiles) {
      console.log(`\nValidating ${file.path}...`);
      
      for (const example of file.examples) {
        const validation = this.validateExample(example);
        
        if (validation.isValid) {
          result.validExamples.push({
            ...example,
            sourceFile: file.path
          });
        } else {
          result.invalidExamples.push({
            ...example,
            sourceFile: file.path,
            invalidFunctions: validation.invalidFunctions
          });

          // Track hallucinations
          for (const func of validation.invalidFunctions) {
            if (!hallucinationMap.has(func)) {
              hallucinationMap.set(func, []);
            }
            hallucinationMap.get(func).push({
              ...example,
              sourceFile: file.path
            });
          }
        }
      }
    }

    // Convert hallucination map to array
    for (const [func, examples] of hallucinationMap) {
      result.hallucinations.push({
        function: func,
        examples
      });
    }

    return result;
  }

  loadExampleFiles() {
    const exampleDir = 'src/examples';
    const files = fs.readdirSync(exampleDir)
      .filter(file => file.endsWith('.ts') && file !== 'types.ts' && file !== 'index.ts');

    const exampleFiles = [];

    for (const file of files) {
      const filePath = path.join(exampleDir, file);
      try {
        // Read and parse TypeScript file to extract examples
        const content = fs.readFileSync(filePath, 'utf-8');
        const examples = this.extractExamplesFromFile(content, file);
        
        if (examples.length > 0) {
          exampleFiles.push({
            path: filePath,
            examples
          });
        }
      } catch (error) {
        console.warn(`Could not parse examples from ${file}: ${error}`);
      }
    }

    return exampleFiles;
  }

  extractExamplesFromFile(content, filename) {
    const examples = [];
    
    // Extract examples from the exported array - more robust regex
    const exampleRegex = /{\s*id:\s*['"`]([^'"`]+)['"`][^}]*?expression:\s*['"`]([^'"`]+)['"`][^}]*}/gs;
    let match;
    
    while ((match = exampleRegex.exec(content)) !== null) {
      const id = match[1];
      const expression = match[2];
      
      examples.push({
        id,
        expression,
        filename
      });
    }

    return examples;
  }

  validateExample(example) {
    const expression = example.expression;
    const invalidFunctions = [];

    // Extract all function calls from expression
    const functionRegex = /([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g;
    let match;
    
    while ((match = functionRegex.exec(expression)) !== null) {
      const funcName = match[1];
      
      // Skip keywords and valid functions
      if (['if', 'then', 'else', 'true', 'false', 'null'].includes(funcName)) {
        continue;
      }
      
      if (!this.validFunctions.has(funcName)) {
        invalidFunctions.push(funcName);
      }
    }

    return {
      isValid: invalidFunctions.length === 0,
      invalidFunctions: [...new Set(invalidFunctions)] // Remove duplicates
    };
  }

  printValidationReport(result) {
    console.log('\n' + '='.repeat(80));
    console.log('DSL EXAMPLE VALIDATION REPORT');
    console.log('='.repeat(80));
    
    console.log(`\n📊 SUMMARY:`);
    console.log(`  Valid Examples: ${result.validExamples.length}`);
    console.log(`  Invalid Examples: ${result.invalidExamples.length}`);
    console.log(`  Hallucinated Functions: ${result.hallucinations.length}`);
    
    if (result.hallucinations.length > 0) {
      console.log(`\n🚨 HALLUCINATED FUNCTIONS DETECTED:`);
      
      for (const hallucination of result.hallucinations) {
        console.log(`\n  Function: ${hallucination.function}`);
        console.log(`  Examples: ${hallucination.examples.length}`);
        
        for (const example of hallucination.examples.slice(0, 3)) { // Show first 3
          console.log(`    - ${example.id}: "${example.expression}"`);
          console.log(`      File: ${example.sourceFile || example.filename}`);
        }
        
        if (hallucination.examples.length > 3) {
          console.log(`    ... and ${hallucination.examples.length - 3} more`);
        }
      }
    }

    console.log(`\n✅ VALID FUNCTIONS REFERENCE:`);
    const sortedFunctions = Array.from(this.validFunctions).sort();
    console.log(`  Functions: ${sortedFunctions.join(', ')}`);

    // Show valid methods too
    if (this.validMethods.size > 0) {
      console.log(`\n✅ VALID METHODS BY CONTEXT:`);
      for (const [context, methods] of this.validMethods) {
        console.log(`  ${context}(): ${Array.from(methods).join(', ')}`);
      }
    }
  }

  generateHallucinationReport(result) {
    console.log('\n📝 GENERATING DETAILED HALLUCINATION REPORT...');
    
    const reportPath = 'scripts/hallucination-report.md';
    let reportContent = '# DSL Hallucination Report\n\n';
    reportContent += `Generated: ${new Date().toISOString()}\n\n`;
    reportContent += `## Summary\n\n`;
    reportContent += `- **Total Examples Checked**: ${result.validExamples.length + result.invalidExamples.length}\n`;
    reportContent += `- **Valid Examples**: ${result.validExamples.length}\n`;
    reportContent += `- **Invalid Examples**: ${result.invalidExamples.length}\n`;
    reportContent += `- **Hallucinated Functions**: ${result.hallucinations.length}\n\n`;
    
    if (result.hallucinations.length > 0) {
      reportContent += `## Hallucinated Functions\n\n`;
      
      for (const hallucination of result.hallucinations) {
        reportContent += `### \`${hallucination.function}()\`\n\n`;
        reportContent += `**Status**: ❌ Not found in datasets\n`;
        reportContent += `**Examples affected**: ${hallucination.examples.length}\n\n`;
        
        reportContent += `**Invalid Examples:**\n`;
        for (const example of hallucination.examples) {
          reportContent += `- \`${example.id}\`: \`${example.expression}\`\n`;
          reportContent += `  - File: \`${example.sourceFile || example.filename}\`\n`;
        }
        reportContent += '\n';
      }
    }

    const sortedFunctions = Array.from(this.validFunctions).sort();
    reportContent += `## Valid Functions Reference\n\n`;
    reportContent += `The following ${sortedFunctions.length} functions are confirmed valid (found in datasets):\n\n`;
    for (const func of sortedFunctions) {
      reportContent += `- \`${func}()\`\n`;
    }

    fs.writeFileSync(reportPath, reportContent);
    console.log(`✅ Report saved to: ${reportPath}`);
  }
}

// Main execution
function main() {
  console.log('🔍 Starting DSL Example Validation...\n');
  
  const validator = new DSLValidator();
  const result = validator.validateExamples();
  
  validator.printValidationReport(result);
  
  if (result.invalidExamples.length > 0) {
    console.log('\n⚠️  HALLUCINATED EXAMPLES DETECTED!');
    
    // Generate detailed report
    validator.generateHallucinationReport(result);
    
    console.log('\nNext steps:');
    console.log('1. Review the hallucination report');
    console.log('2. Remove invalid examples from source files');
    console.log('3. Re-run validation to confirm cleanup');
  } else {
    console.log('\n✅ ALL EXAMPLES ARE VALID!');
  }
  
  console.log('\n' + '='.repeat(80));
}

if (require.main === module) {
  main();
}

module.exports = { DSLValidator }; 