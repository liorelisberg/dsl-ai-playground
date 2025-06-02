import * as fs from 'fs';
import * as path from 'path';
import { extractExpressionPairs, getPairStatistics } from '../dslPairDetection';

describe('Real AI Response Analysis', () => {
  test('should handle actual "explain all string functions" AI response correctly', () => {
    // Read the actual AI response from the saved file
    const chatResponsePath = path.resolve(process.cwd(), 'chat-response.json');
    
    // Skip test if file doesn't exist (CI environment)
    if (!fs.existsSync(chatResponsePath)) {
      console.log('⏭️ Skipping test - chat-response.json not found');
      return;
    }
    
    const chatResponse = JSON.parse(fs.readFileSync(chatResponsePath, 'utf8'));
    const content = chatResponse.text;
    
    console.log('🧪 Testing REAL AI response from server...');
    console.log(`📄 Content length: ${content.length} characters`);
    
    // Run our algorithm
    const pairs = extractExpressionPairs(content);
    const stats = getPairStatistics(content);
    
    console.log('📊 Algorithm Results:');
    console.log(`   pairs.length: ${pairs.length}`);
    console.log(`   stats.hasMarkers: ${stats.hasMarkers}`);
    console.log(`   stats.inputBlocks: ${stats.inputBlocks}`);
    console.log(`   stats.expressionBlocks: ${stats.expressionBlocks}`);
    console.log(`   stats.titleBlocks: ${stats.titleBlocks}`);
    console.log(`   stats.resultBlocks: ${stats.resultBlocks}`);
    
    // Test expectations for educational content
    expect(pairs).toHaveLength(0);
    expect(stats.hasMarkers).toBe(false);
    expect(stats.inputBlocks).toBe(0);
    expect(stats.expressionBlocks).toBe(0);
    expect(stats.titleBlocks).toBe(0);
    expect(stats.resultBlocks).toBe(0);
    
    console.log('✅ Algorithm correctly detected educational content');
    console.log('   No "Try This" buttons should appear in UI');
    
    // Check for any unexpected marker-like content
    const potentialMarkers = [
      '${title}',
      '${inputBlock}',
      '${expressionBlock}',
      '${resultBlock}',
      'title}',
      'inputBlock}',
      'expressionBlock}',
      'resultBlock}'
    ];
    
    potentialMarkers.forEach(marker => {
      const found = content.includes(marker);
      if (found) {
        console.log(`⚠️ Found potential marker: "${marker}"`);
      }
      expect(found).toBe(false);
    });
    
    // Verify the content is indeed educational
    expect(content).toContain('string functions');
    expect(content).toContain('ZEN');
    expect(content).not.toContain('${');
  });
}); 