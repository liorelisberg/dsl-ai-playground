import { Example } from './types';

export const dynamic_objectsExamples: Example[] = [
  {
    id: 'dynamic-obj-1',
    title: 'Dynamic Key with Template',
    expression: '{[`key-${value}`]: 123}',
    sampleInput: '{"value":"test"}',
    expectedOutput: '{"key-test":123}',
    description: 'Create object with computed key using template string',
    category: 'dynamic-objects'
  },
  {
    id: 'dynamic-obj-2',
    title: 'Property as Key',
    expression: '{[user.id]: user.name}',
    sampleInput: '{"user":{"id":"u123","name":"John"}}',
    expectedOutput: '{"u123":"John"}',
    description: 'Use object property value as key for new object',
    category: 'dynamic-objects'
  },
  {
    id: 'dynamic-obj-3',
    title: 'Keys of Dynamic Object',
    expression: 'keys({[`dynamic-${"key"}`]: 123})',
    sampleInput: '{}',
    expectedOutput: '["dynamic-key"]',
    description: 'Get keys from object with computed key',
    category: 'dynamic-objects'
  },
  {
    id: 'dynamic-obj-4',
    title: 'Dynamic Key with Variable',
    expression: '{[prefix + "-" + suffix]: value}',
    sampleInput: '{"prefix":"user","suffix":"123","value":"John"}',
    expectedOutput: '{"user-123":"John"}',
    description: 'Create dynamic key by concatenating variables',
    category: 'dynamic-objects'
  },
  {
    id: 'dynamic-obj-5',
    title: 'Conditional Dynamic Key',
    expression: '{[status == "active" ? "activeUser" : "inactiveUser"]: user.name}',
    sampleInput: '{"status":"active","user":{"name":"John"}}',
    expectedOutput: '{"activeUser":"John"}',
    description: 'Use conditional expression as object key',
    category: 'dynamic-objects'
  },
  {
    id: 'dynamic-obj-6',
    title: 'Multiple Dynamic Keys',
    expression: '{[key1]: value1, [key2]: value2}',
    sampleInput: '{"key1":"firstName","value1":"John","key2":"lastName","value2":"Doe"}',
    expectedOutput: '{"firstName":"John","lastName":"Doe"}',
    description: 'Create object with multiple computed keys',
    category: 'dynamic-objects'
  },
  {
    id: 'dynamic-obj-7',
    title: 'Dynamic Key from Array Index',
    expression: '{[`item_${index}`]: items[index]}',
    sampleInput: '{"index":0,"items":["apple","banana","cherry"]}',
    expectedOutput: '{"item_0":"apple"}',
    description: 'Use array index to create dynamic key and value',
    category: 'dynamic-objects'
  },
  {
    id: 'dynamic-obj-8',
    title: 'Dynamic Key with Function',
    expression: '{[upper(category)]: count}',
    sampleInput: '{"category":"books","count":25}',
    expectedOutput: '{"BOOKS":25}',
    description: 'Transform property value to create dynamic key',
    category: 'dynamic-objects'
  },
  {
    id: 'dynamic-obj-1',
    title: 'Dynamic Key with Template',
    expression: '{[`key-${value}`]: 123}',
    sampleInput: '{"value":"test"}',
    expectedOutput: '{"key-test":123}',
    description: 'Create object with computed key using template string',
    category: 'dynamic-objects'
  },
  {
    id: 'dynamic-obj-2',
    title: 'Property as Key',
    expression: '{[user.id]: user.name}',
    sampleInput: '{"user":{"id":"u123","name":"John"}}',
    expectedOutput: '{"u123":"John"}',
    description: 'Use object property value as key for new object',
    category: 'dynamic-objects'
  },
  {
    id: 'dynamic-obj-3',
    title: 'Keys of Dynamic Object',
    expression: 'keys({[`dynamic-${"key"}`]: 123})',
    sampleInput: '{}',
    expectedOutput: '["dynamic-key"]',
    description: 'Get keys from object with computed key',
    category: 'dynamic-objects'
  },
  {
    id: 'dynamic-obj-4',
    title: 'Dynamic Key with Variable',
    expression: '{[prefix + "-" + suffix]: value}',
    sampleInput: '{"prefix":"user","suffix":"123","value":"John"}',
    expectedOutput: '{"user-123":"John"}',
    description: 'Create dynamic key by concatenating variables',
    category: 'dynamic-objects'
  },
  {
    id: 'dynamic-obj-5',
    title: 'Conditional Dynamic Key',
    expression: '{[status == "active" ? "activeUser" : "inactiveUser"]: user.name}',
    sampleInput: '{"status":"active","user":{"name":"John"}}',
    expectedOutput: '{"activeUser":"John"}',
    description: 'Use conditional expression as object key',
    category: 'dynamic-objects'
  },
  {
    id: 'dynamic-obj-6',
    title: 'Multiple Dynamic Keys',
    expression: '{[key1]: value1, [key2]: value2}',
    sampleInput: '{"key1":"firstName","value1":"John","key2":"lastName","value2":"Doe"}',
    expectedOutput: '{"firstName":"John","lastName":"Doe"}',
    description: 'Create object with multiple computed keys',
    category: 'dynamic-objects'
  },
  {
    id: 'dynamic-obj-7',
    title: 'Dynamic Key from Array Index',
    expression: '{[`item_${index}`]: items[index]}',
    sampleInput: '{"index":0,"items":["apple","banana","cherry"]}',
    expectedOutput: '{"item_0":"apple"}',
    description: 'Use array index to create dynamic key and value',
    category: 'dynamic-objects'
  },
  {
    id: 'dynamic-obj-8',
    title: 'Dynamic Key with Function',
    expression: '{[upper(category)]: count}',
    sampleInput: '{"category":"books","count":25}',
    expectedOutput: '{"BOOKS":25}',
    description: 'Transform property value to create dynamic key',
    category: 'dynamic-objects'
  },
];
