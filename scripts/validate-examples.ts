#!/usr/bin/env ts-node

import * as fs from 'fs';
import * as path from 'path';

interface ValidFunction {
  name: string;
  type: 'function' | 'operator' | 'method';
  context?: string; // For methods like d().add()
}

interface ExampleDefinition {
  id: string;
  title: string;
  expression: string;
  input: unknown;
  output: unknown;
  description: string;
  category: string;
  sourceFile?: string;
  filename?: string;
}

interface ExampleFile {
  path: string;
  examples: ExampleDefinition[];
}

interface ValidationResult {
  validExamples: ExampleDefinition[];
  invalidExamples: (ExampleDefinition & { invalidFunctions: string[] })[];
  hallucinations: {
    function: string;
    examples: ExampleDefinition[];
  }[];
}

class DSLValidator {
  private validFunctions: Set<string> = new Set();
  private validMethods: Map<string, Set<string>> = new Map(); // context -> methods
  private validOperators: Set<string> = new Set();

  constructor() {
    this.initializeValidElements();
  }

  private initializeValidElements() {
    // Parse datasets to extract valid functions
    this.parseDatasets();
    
    // Add core operators that might not appear in datasets
    this.validOperators.add('==');
    this.validOperators.add('!=');
    this.validOperators.add('<');
    this.validOperators.add('<=');
    this.validOperators.add('>');
    this.validOperators.add('>=');
    this.validOperators.add('+');
    this.validOperators.add('-');
    this.validOperators.add('*');
    this.validOperators.add('/');
    this.validOperators.add('%');
    this.validOperators.add('^');
    this.validOperators.add('and');
    this.validOperators.add('or');
    this.validOperators.add('not');
    this.validOperators.add('in');
    this.validOperators.add('?');
    this.validOperators.add(':');
  }

  private parseDatasets() {
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

  private parseDatasetFile(filePath: string) {
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

  private extractFunctionsFromExpression(expression: string) {
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
      this.validMethods.get(context)!.add(method);
    }

    // Extract simple method calls: d().method()
    const simpleMethodRegex = /([a-zA-Z_][a-zA-Z0-9_]*)\(\s*[^)]*\s*\)\.([a-zA-Z_][a-zA-Z0-9_]*)\(/g;
    while ((match = simpleMethodRegex.exec(expression)) !== null) {
      const context = match[1];
      const method = match[2];
      
      if (!this.validMethods.has(context)) {
        this.validMethods.set(context, new Set());
      }
      this.validMethods.get(context)!.add(method);
    }
  }

  public validateExamples(): ValidationResult {
    const exampleFiles = this.loadExampleFiles();
    const result: ValidationResult = {
      validExamples: [],
      invalidExamples: [],
      hallucinations: []
    };

    const hallucinationMap = new Map<string, ExampleDefinition[]>();

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
            hallucinationMap.get(func)!.push({
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

  private loadExampleFiles(): ExampleFile[] {
    const exampleDir = 'src/examples';
    const files = fs.readdirSync(exampleDir)
      .filter(file => file.endsWith('.ts') && file !== 'types.ts' && file !== 'index.ts');

    const exampleFiles: ExampleFile[] = [];

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

  private extractExamplesFromFile(content: string, filename: string): ExampleDefinition[] {
    const examples: ExampleDefinition[] = [];
    
    // Extract examples from the exported array
    const exampleRegex = /{\s*id:\s*['"`]([^'"`]+)['"`].*?expression:\s*['"`]([^'"`]+)['"`].*?}/gs;
    let match;
    
    while ((match = exampleRegex.exec(content)) !== null) {
      const id = match[1];
      const expression = match[2];
      
      examples.push({
        id,
        expression,
        title: '',
        input: null,
        output: null,
        description: '',
        category: '',
        filename: filename
      });
    }

    return examples;
  }

  private validateExample(example: ExampleDefinition): { isValid: boolean; invalidFunctions: string[] } {
    const expression = example.expression;
    const invalidFunctions: string[] = [];

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

  public printValidationReport(result: ValidationResult) {
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
    console.log(`  ${sortedFunctions.join(', ')}`);
  }

  public generateCleanedFiles(result: ValidationResult) {
    console.log('\n🔧 GENERATING CLEANED EXAMPLE FILES...');
    
    // Group valid examples by source file
    const fileGroups = new Map<string, ExampleDefinition[]>();
    
    for (const example of result.validExamples) {
      const sourceFile = example.sourceFile || example.filename || 'unknown';
      if (!fileGroups.has(sourceFile)) {
        fileGroups.set(sourceFile, []);
      }
      fileGroups.get(sourceFile)!.push(example);
    }

    // Create cleaned versions
    for (const [originalPath, validExamples] of fileGroups) {
      if (originalPath !== 'unknown') {
        this.generateCleanedFile(originalPath, validExamples);
      }
    }
  }

  private generateCleanedFile(originalPath: string, validExamples: ExampleDefinition[]) {
    const backupPath = originalPath.replace('.ts', '.backup.ts');
    const cleanedPath = originalPath.replace('.ts', '.cleaned.ts');
    
    try {
      // Create backup
      fs.copyFileSync(originalPath, backupPath);
      console.log(`  ✅ Backup created: ${backupPath}`);
      
      // Read original file structure
      const originalContent = fs.readFileSync(originalPath, 'utf-8');
      
      // Create cleaned content (this is a simplified approach)
      const cleanedContent = this.createCleanedFileContent(originalContent, validExamples);
      
      // Write cleaned file
      fs.writeFileSync(cleanedPath, cleanedContent);
      console.log(`  ✅ Cleaned file created: ${cleanedPath}`);
      
    } catch (error) {
      console.error(`  ❌ Error processing ${originalPath}: ${error}`);
    }
  }

  private createCleanedFileContent(originalContent: string, validExamples: ExampleDefinition[]): string {
    // Extract the header and imports
    const lines = originalContent.split('\n');
    const headerLines: string[] = [];
    
    for (const line of lines) {
      headerLines.push(line);
      if (line.includes('Example[]')) {
        break;
      }
    }

    // Build cleaned content
    let cleanedContent = headerLines.join('\n') + '\n';
    
    // Add comment about cleaning
    cleanedContent += `  // ⚠️  CLEANED FILE - Hallucinated examples removed\n`;
    cleanedContent += `  // ✅  ${validExamples.length} valid examples retained\n`;
    cleanedContent += `  // 📅  Generated: ${new Date().toISOString()}\n\n`;
    
    // Add valid examples (simplified - would need more sophisticated parsing for real use)
    for (let i = 0; i < validExamples.length; i++) {
      const example = validExamples[i];
      cleanedContent += `  {\n`;
      cleanedContent += `    id: '${example.id}',\n`;
      cleanedContent += `    expression: '${example.expression}',\n`;
      cleanedContent += `    // Other properties would be preserved here\n`;
      cleanedContent += `  }${i < validExamples.length - 1 ? ',' : ''}\n`;
    }
    
    cleanedContent += '];\n';
    
    return cleanedContent;
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
    console.log('Run with --clean flag to generate cleaned files.');
    
    // Check if --clean flag is provided
    if (process.argv.includes('--clean')) {
      validator.generateCleanedFiles(result);
    }
  } else {
    console.log('\n✅ ALL EXAMPLES ARE VALID!');
  }
  
  console.log('\n' + '='.repeat(80));
}

if (require.main === module) {
  main();
}

export { DSLValidator }; 