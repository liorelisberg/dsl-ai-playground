// JSON Context Optimization for intelligent schema and data selection
// Phase 1.3 of Conversation Optimization Plan

// JSON type definitions
export type JsonValue = string | number | boolean | null | JsonObject | Array<JsonValue>;
export interface JsonObject {
  [key: string]: JsonValue;
}

export interface JsonOptimizationResult {
  content: string;
  tokensUsed: number;
  optimizationType: 'full' | 'schema-only' | 'focused' | 'minimal' | 'empty';
  extractedFields: string[];
  sampleIncluded: boolean;
}

export interface JsonField {
  path: string;
  type: string;
  value?: JsonValue;
  relevanceScore: number;
}

export class JSONContextOptimizer {
  private readonly MAX_SAMPLE_OBJECTS = 3;
  private readonly MAX_ARRAY_SAMPLES = 2;

  /**
   * Optimize JSON context based on query and token budget
   */
  optimizeForQuery(
    jsonData: unknown,
    query: string,
    tokenBudget: number,
    includeFullData: boolean = false
  ): JsonOptimizationResult {

    console.log(`🎯 Optimizing JSON context: Budget=${tokenBudget} tokens, Full=${includeFullData}`);

    if (!jsonData || tokenBudget <= 0) {
      return this.createEmptyResult();
    }

    // Handle full data inclusion for high budgets
    if (includeFullData && tokenBudget > 10000) {
      const fullContent = this.formatFullJSON(jsonData);
      const tokens = this.estimateTokens(fullContent);
      
      if (tokens <= tokenBudget) {
        console.log(`📄 Using full JSON data (${tokens} tokens)`);
        return {
          content: fullContent,
          tokensUsed: tokens,
          optimizationType: 'full',
          extractedFields: this.getAllFields(jsonData),
          sampleIncluded: true
        };
      }
    }

    // Extract query-relevant fields
    const relevantFields = this.extractRelevantFields(jsonData, query);
    
    if (relevantFields.length === 0) {
      // No relevant fields found, generate minimal schema
      const minimalContent = this.generateMinimalSchema(jsonData);
      const tokens = this.estimateTokens(minimalContent);
      
      console.log(`📄 Using minimal schema (${tokens} tokens)`);
      return {
        content: minimalContent,
        tokensUsed: tokens,
        optimizationType: 'minimal',
        extractedFields: [],
        sampleIncluded: false
      };
    }

    // Generate focused schema
    const focusedSchema = this.generateFocusedSchema(relevantFields, jsonData);
    const schemaTokens = this.estimateTokens(focusedSchema);

    if (schemaTokens >= tokenBudget) {
      // Schema too large, use minimal
      const minimalContent = this.generateMinimalSchema(jsonData);
      const tokens = this.estimateTokens(minimalContent);
      
      console.log(`📄 Schema too large, using minimal (${tokens} tokens)`);
      return {
        content: minimalContent,
        tokensUsed: tokens,
        optimizationType: 'minimal',
        extractedFields: relevantFields.map(f => f.path),
        sampleIncluded: false
      };
    }

    // Check if we can add sample data
    const remainingBudget = tokenBudget - schemaTokens;
    if (remainingBudget > 100) {
      const sampleData = this.generateSampleData(relevantFields, jsonData, remainingBudget);
      if (sampleData) {
        const fullContent = focusedSchema + '\n\n**Sample Data:**\n' + sampleData;
        const totalTokens = this.estimateTokens(fullContent);
        
        console.log(`📄 Using focused schema + samples (${totalTokens} tokens)`);
        return {
          content: fullContent,
          tokensUsed: totalTokens,
          optimizationType: 'focused',
          extractedFields: relevantFields.map(f => f.path),
          sampleIncluded: true
        };
      }
    }

    // Schema only
    console.log(`📄 Using schema only (${schemaTokens} tokens)`);
    return {
      content: focusedSchema,
      tokensUsed: schemaTokens,
      optimizationType: 'schema-only',
      extractedFields: relevantFields.map(f => f.path),
      sampleIncluded: false
    };
  }

  /**
   * Extract fields relevant to the query
   */
  private extractRelevantFields(data: unknown, query: string): JsonField[] {
    const queryTerms = query.toLowerCase().split(/\s+/)
      .filter(term => term.length > 2)
      .map(term => term.replace(/[^\w]/g, ''));

    const relevantFields: JsonField[] = [];

    console.log(`🔍 Searching for fields relevant to: ${queryTerms.join(', ')}`);

    this.findRelevantPaths(data, '', queryTerms, relevantFields);

    // Sort by relevance score
    relevantFields.sort((a, b) => b.relevanceScore - a.relevanceScore);

    console.log(`📊 Found ${relevantFields.length} relevant fields`);
    return relevantFields.slice(0, 20); // Limit to top 20 fields
  }

  /**
   * Recursively find relevant object paths
   */
  private findRelevantPaths(
    obj: unknown,
    currentPath: string,
    queryTerms: string[],
    results: JsonField[],
    depth: number = 0
  ): void {
    if (depth > 4 || !obj || typeof obj !== 'object') return;

    if (Array.isArray(obj)) {
      // For arrays, analyze first few elements
      obj.slice(0, 3).forEach((item, index) => {
        this.findRelevantPaths(
          item,
          `${currentPath}[${index}]`,
          queryTerms,
          results,
          depth + 1
        );
      });
      return;
    }

    // Type guard: ensure obj is a record-like object
    const objRecord = obj as Record<string, unknown>;
    Object.keys(objRecord).forEach(key => {
      const fullPath = currentPath ? `${currentPath}.${key}` : key;
      const value = objRecord[key];
      const relevanceScore = this.calculateFieldRelevance(key, value, queryTerms);

      if (relevanceScore > 0) {
        results.push({
          path: fullPath,
          type: this.getValueType(value),
          value: this.getSampleValue(value),
          relevanceScore
        });
      }

      // Recurse into objects
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        this.findRelevantPaths(value, fullPath, queryTerms, results, depth + 1);
      }
    });
  }

  /**
   * Calculate field relevance to query terms
   */
  private calculateFieldRelevance(key: string, value: unknown, queryTerms: string[]): number {
    const keyLower = key.toLowerCase();
    let score = 0;

    // Direct key match
    for (const term of queryTerms) {
      if (keyLower.includes(term)) {
        score += 1.0;
      }
    }

    // Value content match (for strings)
    if (typeof value === 'string') {
      const valueLower = value.toLowerCase();
      for (const term of queryTerms) {
        if (valueLower.includes(term)) {
          score += 0.5;
        }
      }
    }

    // Common field name patterns
    const commonPatterns = {
      id: ['id', 'identifier', 'key'],
      name: ['name', 'title', 'label'],
      value: ['value', 'amount', 'price', 'cost'],
      date: ['date', 'time', 'created', 'updated'],
      status: ['status', 'state', 'active', 'enabled']
    };

    for (const [pattern, keywords] of Object.entries(commonPatterns)) {
      if (queryTerms.includes(pattern) && keywords.some(kw => keyLower.includes(kw))) {
        score += 0.3;
      }
    }

    return score;
  }

  /**
   * Generate focused schema for relevant fields
   */
  private generateFocusedSchema(relevantFields: JsonField[], data: unknown): string {
    if (relevantFields.length === 0) {
      return this.generateMinimalSchema(data);
    }

    const structure = this.buildFocusedStructure(relevantFields);
    
    return [
      '**Available Data Structure:**',
      '```json',
      JSON.stringify(structure, null, 2),
      '```',
      '',
      '**Relevant Fields:**',
      ...relevantFields.slice(0, 10).map(field => 
        `- \`${field.path}\` (${field.type}) - Relevance: ${(field.relevanceScore * 100).toFixed(0)}%`
      )
    ].join('\n');
  }

  /**
   * Build focused data structure from relevant fields
   */
  private buildFocusedStructure(fields: JsonField[]): Record<string, unknown> {
    const structure: Record<string, unknown> = {};

    fields.forEach(field => {
      const pathParts = field.path.split('.');
      let current: Record<string, unknown> = structure;

      pathParts.forEach((part, index) => {
        // Handle array notation
        if (part.includes('[')) {
          const [key, arrayIndex] = part.split('[');
          if (!current[key]) current[key] = [];
          if (arrayIndex === '0]') {
            current[key] = [{}];
            current = (current[key] as Record<string, unknown>[])[0];
          }
          return;
        }

        if (index === pathParts.length - 1) {
          // Leaf node - set type info only if not already an object
          if (typeof current[part] !== 'object') {
            current[part] = `<${field.type}>`;
          }
        } else {
          // Intermediate node - ensure it's an object
          if (!current[part] || typeof current[part] === 'string') {
            current[part] = {};
          }
          current = current[part] as Record<string, unknown>;
        }
      });
    });

    return structure;
  }

  /**
   * Generate sample data within token budget
   */
  private generateSampleData(
    relevantFields: JsonField[],
    data: unknown,
    tokenBudget: number
  ): string | null {
    const samples: string[] = [];
    let usedTokens = 0;

    // Get sample values for most relevant fields
    const topFields = relevantFields.slice(0, 5);
    
    for (const field of topFields) {
      const sampleValue = this.getFieldSampleValue(data, field.path);
      if (sampleValue !== null) {
        const sampleLine = `${field.path}: ${JSON.stringify(sampleValue)}`;
        const lineTokens = this.estimateTokens(sampleLine);
        
        if (usedTokens + lineTokens < tokenBudget) {
          samples.push(sampleLine);
          usedTokens += lineTokens;
        }
      }
    }

    if (samples.length === 0) return null;

    return [
      '```json',
      '{',
      ...samples.map(line => `  "${line}"`),
      '}',
      '```'
    ].join('\n');
  }

  /**
   * Get sample value for a specific field path
   */
  private getFieldSampleValue(data: unknown, path: string): unknown {
    const pathParts = path.split('.');
    let current = data;

    try {
      for (const part of pathParts) {
        if (part.includes('[')) {
          const [key, index] = part.split('[');
          current = (current as Record<string, unknown>)[key];
          if (Array.isArray(current) && current.length > 0) {
            current = current[0]; // Take first element
          }
        } else {
          current = (current as Record<string, unknown>)[part];
        }
        
        if (current === undefined) return null;
      }

      return this.getSampleValue(current);
    } catch {
      return null;
    }
  }

  /**
   * Generate minimal schema
   */
  private generateMinimalSchema(data: unknown): string {
    const basicStructure = this.getBasicStructure(data, 2); // Max depth 2
    
    return [
      '**Basic Data Structure:**',
      '```json',
      JSON.stringify(basicStructure, null, 2),
      '```'
    ].join('\n');
  }

  /**
   * Get basic structure with limited depth
   */
  private getBasicStructure(obj: unknown, maxDepth: number, currentDepth: number = 0): unknown {
    if (currentDepth >= maxDepth || !obj || typeof obj !== 'object') {
      return this.getValueType(obj);
    }

    if (Array.isArray(obj)) {
      return obj.length > 0 ? [this.getBasicStructure(obj[0], maxDepth, currentDepth + 1)] : [];
    }

    const result: Record<string, unknown> = {};
    Object.keys(obj).slice(0, 10).forEach(key => { // Limit to 10 keys
      result[key] = this.getBasicStructure((obj as Record<string, unknown>)[key], maxDepth, currentDepth + 1);
    });

    return result;
  }

  /**
   * Format full JSON with size limits
   */
  private formatFullJSON(data: unknown): string {
    return [
      '**Complete Data Available:**',
      '```json',
      JSON.stringify(data, null, 2),
      '```'
    ].join('\n');
  }

  /**
   * Get all field paths in data
   */
  private getAllFields(data: unknown, prefix: string = ''): string[] {
    const fields: string[] = [];
    
    if (!data || typeof data !== 'object') return fields;
    
    if (Array.isArray(data)) {
      if (data.length > 0) {
        return this.getAllFields(data[0], prefix + '[0]');
      }
      return fields;
    }

    const objRecord = data as Record<string, unknown>;
    Object.keys(objRecord).forEach(key => {
      const fullPath = prefix ? `${prefix}.${key}` : key;
      fields.push(fullPath);
      
      if (objRecord[key] && typeof objRecord[key] === 'object') {
        fields.push(...this.getAllFields(objRecord[key], fullPath));
      }
    });

    return fields;
  }

  /**
   * Utility functions
   */
  private getValueType(value: unknown): string {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    return typeof value;
  }

  private getSampleValue(value: unknown): JsonValue {
    if (Array.isArray(value)) {
      return value.slice(0, 2) as JsonValue; // First 2 elements
    }
    if (typeof value === 'string' && value.length > 50) {
      return value.substring(0, 50) + '...';
    }
    return value as JsonValue;
  }

  private estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }

  private createEmptyResult(): JsonOptimizationResult {
    return {
      content: '',
      tokensUsed: 0,
      optimizationType: 'empty',
      extractedFields: [],
      sampleIncluded: false
    };
  }
} 