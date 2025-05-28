
import { ChatMessage, ChatResponse } from '../types/chat';

// Mock implementation - replace with actual Gemini API integration
export const sendChatMessage = async (
  message: string, 
  chatHistory: ChatMessage[]
): Promise<ChatResponse> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock responses based on keywords
  const lowerMessage = message.toLowerCase();
  
  let response = '';
  
  if (lowerMessage.includes('syntax') || lowerMessage.includes('how to')) {
    response = `Here are some key DSL syntax concepts:

1. **Property Access**: Use dot notation like \`user.name\` to access object properties
2. **String Methods**: Methods like \`.toUpperCase()\`, \`.toLowerCase()\`, \`.trim()\`
3. **Array Operations**: Use \`.map()\`, \`.filter()\`, \`.find()\` for array manipulation
4. **Conditionals**: Use ternary operators like \`condition ? valueIfTrue : valueIfFalse\`

Example: \`user.name.toUpperCase()\` converts the user's name to uppercase.

Try these in the code editor to see how they work!`;
  } else if (lowerMessage.includes('example') || lowerMessage.includes('sample')) {
    response = `Here are some common DSL patterns:

**Basic Property Access:**
\`\`\`
user.name
user.email
user.profile.age
\`\`\`

**String Transformations:**
\`\`\`
user.name.toUpperCase()
user.email.toLowerCase()
user.description.trim()
\`\`\`

**Conditional Logic:**
\`\`\`
user.age >= 18 ? "adult" : "minor"
user.status === "active" ? user.name : "inactive user"
\`\`\`

Click the "Examples" button in the code editor to see more detailed examples!`;
  } else if (lowerMessage.includes('error') || lowerMessage.includes('problem')) {
    response = `Common DSL errors and solutions:

1. **Property doesn't exist**: Check your JSON structure and property names
2. **Syntax errors**: Make sure to use proper JavaScript syntax
3. **Type errors**: Ensure you're calling methods on the right data types
4. **Undefined values**: Use optional chaining \`user?.profile?.age\` for safety

If you're seeing a specific error, paste your expression and I'll help debug it!`;
  } else {
    response = `I'm here to help you learn the DSL! You can ask me about:

- Syntax and language features
- Examples and use cases  
- Debugging expressions
- Best practices

What would you like to learn about? You can also try examples in the code editor on the right.`;
  }

  return { response };
};
