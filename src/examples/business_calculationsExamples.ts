import { Example } from './types';

export const business_calculationsExamples: Example[] = [
  {
    id: 'business-1',
    title: 'Permission Check',
    expression: 'some(user.permissions, # == "edit")',
    sampleInput: '{"user":{"permissions":["view","edit","delete"]}}',
    expectedOutput: 'true',
    description: 'Check if user has specific permission',
    category: 'business-calculations'
  },
  {
    id: 'business-2',
    title: 'Price Validation All',
    expression: 'all(items, #.price > 10)',
    sampleInput: '{"items":[{"price":15},{"price":20},{"price":25}]}',
    expectedOutput: 'true',
    description: 'Check if all items meet minimum price requirement',
    category: 'business-calculations'
  },
  {
    id: 'business-3',
    title: 'Price Validation Some Fail',
    expression: 'all(items, #.price > 10)',
    sampleInput: '{"items":[{"price":15},{"price":5},{"price":25}]}',
    expectedOutput: 'false',
    description: 'Price validation with some items failing requirement',
    category: 'business-calculations'
  },
  {
    id: 'business-4',
    title: 'Average Price Calculation',
    expression: 'avg(map(items, #.price))',
    sampleInput: '{"items":[{"price":10},{"price":20},{"price":30}]}',
    expectedOutput: '20',
    description: 'Calculate average price from product array',
    category: 'business-calculations'
  },
  {
    id: 'business-5',
    title: 'Maximum Order Value',
    expression: 'max(map(items, #.qty * #.price))',
    sampleInput: '{"items":[{"qty":2,"price":10},{"qty":1,"price":20},{"qty":3,"price":15}]}',
    expectedOutput: '45',
    description: 'Find maximum order value (quantity × price)',
    category: 'business-calculations'
  },
  {
    id: 'business-6',
    title: 'Total Revenue Calculation',
    expression: 'sum(map(orders, #.qty * #.price))',
    sampleInput: '{"orders":[{"qty":2,"price":10},{"qty":1,"price":20},{"qty":3,"price":15}]}',
    expectedOutput: '85',
    description: 'Calculate total revenue from all orders',
    category: 'business-calculations'
  },
  {
    id: 'business-7',
    title: 'High Value Orders',
    expression: 'filter(orders, #.qty * #.price > 30)',
    sampleInput: '{"orders":[{"qty":2,"price":10},{"qty":1,"price":20},{"qty":3,"price":15}]}',
    expectedOutput: '[{"qty":3,"price":15}]',
    description: 'Filter orders with value greater than threshold',
    category: 'business-calculations'
  },
  {
    id: 'business-8',
    title: 'Count High Value Orders',
    expression: 'len(filter(orders, #.qty * #.price > 30))',
    sampleInput: '{"orders":[{"qty":2,"price":10},{"qty":1,"price":20},{"qty":3,"price":15}]}',
    expectedOutput: '1',
    description: 'Count orders exceeding value threshold',
    category: 'business-calculations'
  },
  {
    id: 'business-9',
    title: 'Admin Permission Check',
    expression: 'some(user.roles, # == "admin")',
    sampleInput: '{"user":{"roles":["user","editor","admin"]}}',
    expectedOutput: 'true',
    description: 'Check if user has admin role',
    category: 'business-calculations'
  },
  {
    id: 'business-10',
    title: 'All Items In Stock',
    expression: 'all(inventory, #.stock > 0)',
    sampleInput: '{"inventory":[{"stock":5},{"stock":10},{"stock":3}]}',
    expectedOutput: 'true',
    description: 'Check if all items are in stock',
    category: 'business-calculations'
  },
  {
    id: 'business-11',
    title: 'Low Stock Alert',
    expression: 'some(inventory, #.stock < 5)',
    sampleInput: '{"inventory":[{"stock":5},{"stock":2},{"stock":10}]}',
    expectedOutput: 'true',
    description: 'Check if any items have low stock',
    category: 'business-calculations'
  },
  {
    id: 'business-12',
    title: 'Discount Eligibility',
    expression: 'sum(map(cart, #.price)) > 100',
    sampleInput: '{"cart":[{"price":45},{"price":35},{"price":25}]}',
    expectedOutput: 'true',
    description: 'Check if cart total qualifies for discount',
    category: 'business-calculations'
  },


  {
    id: 'complex-business-1',
    title: 'Customer Order Analysis',
    expression: 'filter(map(orders, {id: #.id, total: sum(map(#.items, #.price * #.quantity)), customer: #.customer}), #.total > 100)',
    sampleInput: '{"orders": [{"id": 1, "customer": "John", "items": [{"price": 25, "quantity": 2}, {"price": 60, "quantity": 1}]}, {"id": 2, "customer": "Jane", "items": [{"price": 15, "quantity": 3}]}]}',
    expectedOutput: '[{"id": 1, "total": 110, "customer": "John"}]',
    description: 'Calculate order totals and filter high-value orders using nested maps and filters',
    category: 'complex-business'
  }
,

  {
    id: 'complex-business-2',
    title: 'Employee Performance Score',
    expression: 'map(employees, {name: #.name, score: round(avg([#.sales, #.reviews, #.attendance]) * 100), grade: avg([#.sales, #.reviews, #.attendance]) >= 0.8 ? \'A\' : avg([#.sales, #.reviews, #.attendance]) >= 0.6 ? \'B\' : \'C\'})',
    sampleInput: '{"employees": [{"name": "Alice", "sales": 0.9, "reviews": 0.8, "attendance": 0.95}, {"name": "Bob", "sales": 0.6, "reviews": 0.7, "attendance": 0.5}]}',
    expectedOutput: '[{"name": "Alice", "score": 88, "grade": "A"}, {"name": "Bob", "score": 60, "grade": "C"}]',
    description: 'Calculate performance scores with conditional grading using nested ternary operations',
    category: 'complex-business'
  }
];
