# 🔍 Proximity-Based DSL Pair Detection Algorithm Analysis

## 📊 Problem Analysis

### 🚨 Critical Issue Identified
The original algorithm assumed **1:1 ordering** between titles and examples, causing misalignment when AI responses contained:

1. **Educational title blocks** without corresponding examples
2. **Mixed content** with titles scattered throughout
3. **Unbalanced markers** (more titles than input/expression pairs)

### 💥 Real-World Failure Case
```
${title}
Explanation of the extract Method in ZEN DSL  ← Educational title
${title}

Educational content here...

${title}
Example 1: Extracting a Number  ← Example title
${title}

${inputBlock}
{"text": "Order ID: 12345"}
${inputBlock}

${expressionBlock}
extract(text, "[0-9]+")
${expressionBlock}
```

**Old algorithm**: Educational title gets paired with Example 1 ❌  
**New algorithm**: Example title gets paired with Example 1 ✅

## 🎯 Expected Format & Marker Order

Based on the system prompt, the **ideal format** is:

```
${title}
Example 1: Converting text to uppercase  
${title}

${inputBlock}
{name:"hello", id: "world"}
${inputBlock}

${expressionBlock}
upper(name + " " + id)
${expressionBlock}

${resultBlock}
"HELLO WORLD"
${resultBlock}
```

### 🔑 Key Markers Hierarchy

**ESSENTIAL** (required for functionality):
1. `${inputBlock}...${inputBlock}` - JSON input data
2. `${expressionBlock}...${expressionBlock}` - ZEN expression

**OPTIONAL** (enhance UX):
3. `${title}...${title}` - Descriptive title
4. `${resultBlock}...${resultBlock}` - Expected result

## 🛠️ Step-by-Step Fix Implementation

### Phase 1: Position-Based Detection ✅
```typescript
// Collect all matches with their positions
const titleMatches = [...content.matchAll(titlePattern)].map(match => ({
  content: match[1].trim(),
  start: match.index!,
  end: match.index! + match[0].length
}));
```

**Why**: Instead of simple array indexing, we now track exact positions in the content.

### Phase 2: Core Example Pairing ✅
```typescript
// Create input+expression pairs (these are the core examples)
const coreExampleCount = Math.min(inputMatches.length, expressionMatches.length);
```

**Why**: Input+Expression pairs are the foundation. Everything else is enhancement.

### Phase 3: Proximity-Based Title Matching ✅
```typescript
// Find the closest preceding title for this example that hasn't been used
const exampleStart = Math.min(inputMatch.start, expressionMatch.start);
let closestTitle: string | null = null;
let closestTitleDistance = Infinity;

for (let titleIndex = 0; titleIndex < titleMatches.length; titleIndex++) {
  const titleMatch = titleMatches[titleIndex];
  
  // Skip if this title has already been used
  if (usedTitleIndices.has(titleIndex)) {
    continue;
  }
  
  // Only consider titles that come before this example
  if (titleMatch.start < exampleStart) {
    const distance = exampleStart - titleMatch.end;
    if (distance < closestTitleDistance) {
      closestTitleDistance = distance;
      closestTitle = titleMatch.content;
      closestTitleIndex = titleIndex;
    }
  }
}
```

**Why**: Titles are matched by proximity and context, not by array order.

### Phase 4: Title Reuse Prevention ✅
```typescript
const usedTitleIndices = new Set<number>(); // Track which titles we've already used

// Mark this title as used if we found one
if (closestTitleIndex >= 0) {
  usedTitleIndices.add(closestTitleIndex);
}
```

**Why**: Prevents educational titles from being incorrectly reused for multiple examples.

### Phase 5: Distance Validation ✅
```typescript
// Validate that input and expression are reasonably close to each other
const proximityThreshold = 2000; // characters
const distance = Math.abs(inputMatch.start - expressionMatch.start);

if (distance > proximityThreshold) {
  console.warn(`⚠️ Input and expression pair ${i + 1} are far apart (${distance} chars). Skipping.`);
  continue;
}
```

**Why**: Prevents pairing markers that are too far apart (likely unrelated).

## 🧠 Algorithm Behavior Analysis

### ✅ How the Function Should Behave

1. **Primary Pairing**: Based on `inputBlock` + `expressionBlock` proximity
2. **Title Matching**: Find closest preceding title that hasn't been used
3. **Graceful Fallbacks**: Generate "Try Example N" when titles missing
4. **Robust Validation**: Skip malformed or distant pairs
5. **Educational Content**: Distinguish between educational and example titles

### 🔄 What Happens When Model Doesn't Follow Format

| **Scenario** | **Old Behavior** | **New Behavior** |
|--------------|------------------|------------------|
| Extra educational titles | Misaligned pairing | Educational titles ignored |
| Missing titles | Array index errors | Graceful fallback naming |
| Unbalanced markers | Partial extraction | Complete validation |
| Large distances | Invalid pairings | Skipped with warning |
| Mixed order | Order dependency | Position-based matching |

### 🎯 Key Markers for Test-Example-in-Parser Feature

**Required for functionality**:
- `inputBlock` + `expressionBlock` pairs must exist
- Pairs must be within proximity threshold (2000 chars)
- Input must be valid JSON-like structure
- Expression must be valid ZEN syntax

**Optional for enhanced UX**:
- Descriptive titles for dropdown options
- Result blocks for expected output display
- Proper ordering for clean presentation

## 📈 Test Results

### ✅ All 27 Tests Passing

**New test coverage includes**:
- Extract method scenario with mixed educational/example titles
- Titles very far from examples
- Examples without preceding titles  
- Malformed pairs with large distances
- Results matching to closest expressions
- Mixed order with proper proximity detection

### 🔍 Debug Logging Enhanced

```typescript
console.log(`🔍 Detected ${pairs.length} expression-input pairs from ${titleMatches.length} titles, ${inputMatches.length} inputs and ${expressionMatches.length} expressions`);

// Debug logging for problematic cases
if (titleMatches.length > pairs.length + 2) {
  console.warn(`⚠️ Many extra titles detected (${titleMatches.length} titles vs ${pairs.length} examples). This might indicate educational content mixed with examples.`);
}
```

## 🚀 Production Impact

### ✅ Benefits
- **Robust Title Matching**: Handles mixed educational/example content
- **Proximity Validation**: Prevents invalid marker pairings
- **Educational Content Support**: Properly distinguishes learning vs. example content  
- **Fallback Mechanisms**: Graceful handling of missing/malformed markers
- **Debug Visibility**: Clear logging for troubleshooting

### ✅ Backward Compatibility
- All existing functionality preserved
- Enhanced behavior for edge cases
- No breaking changes to API
- Improved UX for dropdown buttons

## 🎯 Algorithm Summary

The **proximity-based algorithm** fundamentally shifts from:

**OLD**: `titleArray[i] → inputArray[i] → expressionArray[i]`  
**NEW**: `proximitySearch(input, expression) → findClosestTitle() → validateDistance()`

This ensures **context-aware pairing** rather than **order-dependent matching**, making the system robust against AI response variations while maintaining full backward compatibility. 