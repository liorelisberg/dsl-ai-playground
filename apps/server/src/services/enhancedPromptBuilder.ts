// Simplified Enhanced Prompt Builder - Focus on Essential Prompt Construction
// Modern AI models handle complexity and strategy adaptation naturally

import { ChatTurn } from './contextManager';
import { SimpleResponse, UserProfile, ConversationContext } from './conversationStateManager';
import { KnowledgeCard } from './vectorStore';

export interface PromptSection {
  name: string;
  content: string;
  tokenEstimate: number;
  priority: 'high' | 'medium' | 'low';
}

export interface EnhancedPromptResult {
  prompt: string;
  sections: PromptSection[];
  totalTokens: number;
  adaptations: string[];
}

export class EnhancedPromptBuilder {
  private readonly BASE_SYSTEM_PROMPT = `🛡️ STRICT SCOPE ENFORCEMENT:
You are a specialized ZEN DSL expert. Your ONLY purpose is helping users with ZEN DSL (Domain-Specific Language) for data processing and transformation.

📋 ZEN DSL AREAS YOU HANDLE:
- ZEN syntax, functions, and operators (filter, map, len, contains, etc.)
- Data transformation expressions and queries
- ZEN array, string, number, date, and object operations
- ZEN conditional logic and mathematical operations
- Debugging ZEN expressions and syntax issues
- Converting requirements into ZEN DSL code

🚫 NON-ZEN QUESTIONS:
For questions outside ZEN DSL scope, politely redirect: "I specialize in ZEN DSL for data processing. For non-ZEN questions, please consult other resources. However, if you have data processing needs, I'd be happy to show you ZEN solutions!"

🔧 CORE PRINCIPLE:
ALWAYS provide ZEN DSL solutions. NEVER suggest JavaScript, SQL, Python, or other languages. 
For data processing tasks, show the ZEN way exclusively.

🚫 COMMON MISTAKES TO AVOID:
DO NOT use these hallucinated functions (they don't exist in ZEN DSL):
- JavaScript functions: uppercase(), toLowerCase(), push(), pop(), slice(), length
- Math functions: sqrt(), pow(), sin(), cos(), Math.max(), Math.min(), product()
- Array functions: sort(), reverse(), join(), indexOf(), includes()
- String functions: replace(), substring(), charAt(), indexOf(), lastIndexOf()
- Control flow: if(), switch(), case, else
- Date functions: now(), new Date(), getFullYear()

🚨 CRITICAL: "this" OPERATOR DOES NOT EXIST IN ZEN DSL!
❌ WRONG: this.markets, this.users, this.data - The "this" keyword does not exist!
❌ WRONG: map(this.markets, #.name) - Use direct property access instead!
✅ CORRECT: markets, users, data - Access properties directly from input data
✅ CORRECT: map(markets, #.name) - Direct property access in functions

🚨 CRITICAL: slice() FUNCTION DOES NOT EXIST IN ZEN DSL!
❌ WRONG: slice(text, 0, 5) - This function does not exist!
✅ CORRECT: text[0:5] - Use ZEN slice syntax with brackets

🚨 CRITICAL: replace() FUNCTION DOES NOT EXIST IN ZEN DSL!
❌ WRONG: replace(text, "old", "new") - This function does not exist!
For text replacement needs, use ZEN functions like extract(), split(), and string concatenation.

🚨 CRITICAL: product() FUNCTION DOES NOT EXIST IN ZEN DSL!
❌ WRONG: product(numbers) - This function does not exist!
✅ CORRECT: For multiplying array elements, use manual multiplication for small arrays like: a * b * c * d, or calculate programmatically using map() with individual operations. ZEN DSL doesn't have built-in array multiplication functions.

ZEN DSL SLICING RULES:
- Use bracket syntax: text[start:end], array[1:5], name[0:3]
- NOT function syntax: slice(text, start, end) ← THIS DOES NOT EXIST!
- Slicing works for strings AND arrays using the same [start:end] syntax

ALWAYS use correct ZEN equivalents:
- String functions: upper(), lower(), len(), trim(), contains(), startsWith(), endsWith()
- String processing: extract(), split(), matches() (NO replace() function!)
- Array functions: filter(), map(), some(), all(), count(), flatMap()
- Math functions: max(), min(), abs(), round(), floor(), ceil()
- Date functions: d(), year(), month(), day(), format(), diff()
- Use: condition ? value1 : value2 (ternary, not if statements)
- Use: text[0:5] for slicing (NOT slice() function)

🔧 REGEX PATTERN RULES:
CRITICAL: In ZEN DSL regex patterns, regex metacharacters need proper escaping for string literals.
When writing ZEN expressions as strings, use double backslashes for regex metacharacters.

❌ WRONG - Triple/quadruple backslashes (over-escaping):
extract("2023-10-27", "(\\\\\\\\d{4})-(\\\\\\\\d{2})-(\\\\\\\\d{2})")

❌ WRONG - Missing backslash (invalid regex):
extract("2023-10-27", "(d{4})-(d{2})-(d{2})")

❌ WRONG - Single backslash in string context:
extract("2023-10-27", "(\d{4})-(\d{2})-(\d{2})")

✅ CORRECT - Double backslash for metacharacters (ZEN DSL string literals):
extract("2023-10-27", "(\\d{4})-(\\d{2})-(\\d{2})")
extract("John Doe", "(\\w+) (\\w+)")
extract("test@email.com", "([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})")

Reason: In string literals, \\d becomes \d when parsed, which is what ZEN regex engine expects.

📦 DSL EXAMPLE FORMAT:
When providing DSL examples, use this EXACT format with explicit markers:

\${title}
Example 1: Converting text to uppercase
\${title}

\${inputBlock}
{name:"hello", id: "world"}
\${inputBlock}

\${expressionBlock}
upper(name + " " + id)
\${expressionBlock}

\${resultBlock}
"HELLO WORLD"
\${resultBlock}

🎯 RESULT DISPLAY RULES:
- Always include expected results using \${resultBlock} markers
- Show the actual output value (string, number, array, object)
- For arrays/objects, format as clean JSON (no extra quotes)
- For strings, include quotes to show string type
- For numbers/booleans, show the raw value
- Keep results concise but complete

✅ GOOD RESULT EXAMPLES:
\${resultBlock}
["Alice", "Bob", "Charlie"]
\${resultBlock}

\${resultBlock}
{"name": "John", "age": 30}
\${resultBlock}

\${resultBlock}
"UPPERCASE TEXT"
\${resultBlock}

\${resultBlock}
42
\${resultBlock}

CRITICAL DATA STRUCTURE RULES:
🚨 ARRAYS MUST BE WRAPPED: Raw arrays cannot be accessed directly in ZEN DSL expressions.

❌ WRONG - Raw array (will fail):
\${inputBlock}
[{"name":"Alice","age":30},{"name":"Bob","age":25}]
\${inputBlock}
\${expressionBlock}
filter(this, age > 28)  // ❌ "this" doesn't exist, "age" needs "#"
\${expressionBlock}

✅ CORRECT - Wrapped in object with descriptive key:
\${inputBlock}
{"users": [{"name":"Alice","age":30},{"name":"Bob","age":25}]}
\${inputBlock}
\${expressionBlock}
filter(users, #.age > 28)  // ✅ Access "users" key, use "#" for properties
\${expressionBlock}

🔧 ARRAY OPERATION RULES:
- Arrays must be inside objects: {"data": [...], "items": [...], "users": [...]}
- Use descriptive keys: "users", "products", "events" (not generic "data")
- Array functions (filter, map, etc.) require "#" operator for element access
- Access properties with "#.propertyName" (e.g., "#.age", "#.name")

RULES:
- Always wrap example titles with \${title} markers  
- Always wrap input data with \${inputBlock} markers
- Always wrap expressions with \${expressionBlock} markers  
- Include realistic sample data that works with the expression
- You can provide multiple title/input/expression sets in one response
- Make titles descriptive and specific (e.g., "Filtering users by age", "Calculating date differences")
- ENSURE arrays are wrapped in objects with meaningful keys
- ENSURE expressions use proper "#" operator for array element access
- Don't worry about perfect syntax - the parser will validate
- Use clear, meaningful titles that explain what each example demonstrates

🎯 RESPONSE STYLE:
- Provide clear, helpful responses with practical examples
- Include ZEN syntax explanations and usage patterns
- Reference previous conversation when relevant
- Maintain focus on ZEN DSL capabilities
- Adapt detail level naturally based on user context`;

  /**
   * Build a simplified prompt based on user context
   */
  buildSimplePrompt(
    userMessage: string,
    knowledgeCards: KnowledgeCard[],
    history: ChatTurn[],
    simpleResponse: SimpleResponse,
    userProfile?: UserProfile,
    conversationContext?: ConversationContext,
    jsonContext?: string
  ): EnhancedPromptResult {
    
    console.log(`🎨 Building prompt with ${knowledgeCards.length} knowledge cards and ${history.length} history turns`);

    const sections: PromptSection[] = [];
    const adaptations: string[] = [];

    // 1. System prompt
    sections.push({
      name: 'system',
      content: this.BASE_SYSTEM_PROMPT,
      tokenEstimate: this.estimateTokens(this.BASE_SYSTEM_PROMPT),
      priority: 'high'
    });

    // 2. Knowledge cards with ZEN priority
    if (knowledgeCards.length > 0) {
      const knowledgeSection = this.buildKnowledgeSection(knowledgeCards);
      sections.push({
        name: 'knowledge',
        content: knowledgeSection.content,
        tokenEstimate: this.estimateTokens(knowledgeSection.content),
        priority: 'high'
      });
      adaptations.push(...knowledgeSection.adaptations);
    }

    // 3. Conversation history (keep last 6 turns for context)
    if (history.length > 0) {
      const historySection = this.buildHistorySection(history);
      sections.push({
        name: 'history',
        content: historySection.content,
        tokenEstimate: this.estimateTokens(historySection.content),
        priority: 'medium'
      });
      adaptations.push(...historySection.adaptations);
    }

    // 4. JSON context (if available)
    if (jsonContext) {
      sections.push({
        name: 'data',
        content: `**Available Data Context:**\n${jsonContext}`,
        tokenEstimate: this.estimateTokens(jsonContext),
        priority: 'medium'
      });
    }

    // 5. Current user message with context
    const messageSection = this.buildMessageSection(
      userMessage,
      simpleResponse,
      conversationContext
    );
    sections.push({
      name: 'query',
      content: messageSection.content,
      tokenEstimate: this.estimateTokens(messageSection.content),
      priority: 'high'
    });
    adaptations.push(...messageSection.adaptations);

    // 6. Simple response guidelines
    const guidelines = this.buildSimpleGuidelines(history.length > 0);
    sections.push({
      name: 'guidelines',
      content: guidelines.content,
      tokenEstimate: this.estimateTokens(guidelines.content),
      priority: 'medium'
    });
    adaptations.push(...guidelines.adaptations);

    // Assemble final prompt
    const prompt = sections.map(section => section.content).join('\n\n');
    const totalTokens = sections.reduce((sum, section) => sum + section.tokenEstimate, 0);

    console.log(`🎨 Prompt built: ${sections.length} sections, ${totalTokens} tokens`);

    return {
      prompt,
      sections,
      totalTokens,
      adaptations
    };
  }

  /**
   * Build knowledge section with ZEN priority
   */
  private buildKnowledgeSection(knowledgeCards: KnowledgeCard[]): { content: string; adaptations: string[] } {
    const adaptations: string[] = [];
    let content = '**Relevant ZEN DSL Knowledge:**\n\n';

    // Sort by relevance and prioritize ZEN examples
    const sortedCards = [...knowledgeCards]
      .sort((a, b) => {
        const aIsZenExample = a.source.includes('example') || a.content.includes('ZEN');
        const bIsZenExample = b.source.includes('example') || b.content.includes('ZEN');
        
        if (aIsZenExample && !bIsZenExample) return -1;
        if (!aIsZenExample && bIsZenExample) return 1;
        
        return b.relevanceScore - a.relevanceScore;
      });

    // Use top 12 cards to keep prompt manageable
    const selectedCards = sortedCards.slice(0, 12);
    adaptations.push(`selected ${selectedCards.length} most relevant cards`);

    selectedCards.forEach((card) => {
      content += `${card.source}:\n`;
      content += `   ${card.content}\n\n`;
    });

    content += `💡 **ZEN SYNTAX REMINDER**: Always use ZEN functions like len(), upper(), filter(), map() with # placeholder - never JavaScript equivalents.\n`;

    return { content, adaptations };
  }

  /**
   * Build conversation history section
   */
  private buildHistorySection(history: ChatTurn[]): { content: string; adaptations: string[] } {
    const adaptations: string[] = [];
    let content = '**Conversation History:**\n\n';

    // Keep last 6 turns for context
    const recentHistory = history.slice(-6);
    adaptations.push(`limited to ${recentHistory.length} recent turns`);

    recentHistory.forEach((turn) => {
      const roleEmoji = turn.role === 'user' ? '🗣️' : '🤖';
      content += `${roleEmoji} **${turn.role.toUpperCase()}:**\n`;
      content += `${turn.content}\n\n`;
    });

    return { content, adaptations };
  }

  /**
   * Build user message section with context
   */
  private buildMessageSection(
    message: string,
    simpleResponse: SimpleResponse,
    context?: ConversationContext
  ): { content: string; adaptations: string[] } {
    
    const adaptations: string[] = [];
    let content = '**Current Question:**\n';

    // Add context if available
    if (context && context.topicDepth > 1) {
      content += `*Continuing ${context.currentTopic} discussion (depth ${context.topicDepth})*\n`;
      adaptations.push('added topic context');
    }

    if (simpleResponse.estimatedUserNeed !== 'General DSL guidance') {
      content += `*User need: ${simpleResponse.estimatedUserNeed}*\n`;
      adaptations.push('added need estimation');
    }

    content += `\n${message}`;

    // Add follow-up suggestions if available
    if (simpleResponse.suggestedFollowUps.length > 0) {
      content += `\n\n*Related areas: ${simpleResponse.suggestedFollowUps.join(', ')}*`;
      adaptations.push('added follow-up suggestions');
    }

    return { content, adaptations };
  }

  /**
   * Build simple response guidelines
   */
  private buildSimpleGuidelines(hasHistory: boolean): { content: string; adaptations: string[] } {
    const adaptations: string[] = [];
    let content = '\n**Response Guidelines:**\n';

    content += '- Provide clear explanations with practical ZEN examples\n';
    content += '- Focus on ZEN DSL syntax and best practices\n';
    content += '- Include working code examples when helpful\n';

    if (hasHistory) {
      content += '- Reference previous conversation when relevant\n';
      content += '- Build on concepts already discussed\n';
      adaptations.push('conversation-aware guidelines');
    }

    return { content, adaptations };
  }

  /**
   * Utility methods
   */
  private estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }

  private capitalizeCategory(category: string): string {
    return category.charAt(0).toUpperCase() + category.slice(1);
  }

  /**
   * Validate prompt for token limits
   */
  validatePrompt(promptResult: EnhancedPromptResult, maxTokens: number): {
    isValid: boolean;
    issues: string[];
    suggestions: string[];
  } {
    
    const issues: string[] = [];
    const suggestions: string[] = [];

    // Token limit check
    if (promptResult.totalTokens > maxTokens) {
      issues.push(`Prompt exceeds token limit: ${promptResult.totalTokens} > ${maxTokens}`);
      suggestions.push('Reduce history length or knowledge cards');
    }

    // Basic quality checks
    if (promptResult.adaptations.length === 0) {
      issues.push('No adaptations applied');
      suggestions.push('Ensure context is available');
    }

    return {
      isValid: issues.length === 0,
      issues,
      suggestions
    };
  }
} 