#!/usr/bin/env node

const http = require('http');

// Test cases
const testCases = [
  {
    name: "Valid expression without comments",
    expression: "upper(user.name)",
    data: { user: { name: "john doe", age: 30 } },
    expectedToSucceed: true
  },
  {
    name: "Invalid expression with single-line comment",
    expression: "// This is a comment\nupper(user.name)",
    data: { user: { name: "john doe", age: 30 } },
    expectedToSucceed: false
  },
  {
    name: "Invalid expression with comment at end",
    expression: "upper(user.name) // comment at end",
    data: { user: { name: "john doe", age: 30 } },
    expectedToSucceed: false
  },
  {
    name: "Another valid expression",
    expression: "map([1, 2, 3], # * 2)",
    data: {},
    expectedToSucceed: true
  },
  {
    name: "Invalid expression with comment in middle",
    expression: "map([1, 2, 3], // comment\n# * 2)",
    data: {},
    expectedToSucceed: false
  }
];

// Function to make HTTP request
function makeRequest(expression, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      expression: expression,
      data: data
    });

    const options = {
      hostname: 'localhost',
      port: 3000, // Backend server port
      path: '/api/evaluate-dsl',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve({ statusCode: res.statusCode, result });
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// Run tests
async function runTests() {
  console.log('🧪 Testing DSL Comment Handling...\n');
  console.log('Expected behavior:');
  console.log('✅ Expressions WITHOUT comments should succeed');
  console.log('❌ Expressions WITH comments should fail\n');
  console.log('=' * 60);

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`\n${i + 1}. ${testCase.name}`);
    console.log(`Expression: "${testCase.expression}"`);
    console.log(`Expected: ${testCase.expectedToSucceed ? 'SUCCESS' : 'FAILURE'}`);

    try {
      const response = await makeRequest(testCase.expression, testCase.data);
      const hasError = !!response.result.error;
      const actualSuccess = !hasError;

      console.log(`Status: ${response.statusCode}`);
      
      if (actualSuccess) {
        console.log(`✅ SUCCESS - Result: ${JSON.stringify(response.result.result)}`);
      } else {
        console.log(`❌ FAILED - Error: ${response.result.error}`);
      }

      // Check if result matches expectation
      if (actualSuccess === testCase.expectedToSucceed) {
        console.log(`🎯 CORRECT - Behaved as expected`);
      } else {
        console.log(`⚠️  UNEXPECTED - Expected ${testCase.expectedToSucceed ? 'success' : 'failure'} but got ${actualSuccess ? 'success' : 'failure'}`);
      }

    } catch (error) {
      console.log(`💥 REQUEST FAILED: ${error.message}`);
      
      if (error.code === 'ECONNREFUSED') {
        console.log(`\n🔧 Make sure the backend server is running on port 3001`);
        console.log(`   Run: pnpm run server`);
        break;
      }
    }
  }

  console.log('\n' + '=' * 60);
  console.log('🏁 Test completed!');
}

// Start tests
runTests().catch(console.error); 