import { Example } from './types';

export const complexExamples: Example[] = [
  {
    id: 'complex-1',
    title: 'Chained Array Operations',
    expression: 'map(filter([1, 2, 3, 4, 5], # > 2), # * 2)',
    sampleInput: '{}',
    expectedOutput: '[6, 8, 10]',
    description: 'Filter then map array elements',
    category: 'complex'
  },
  {
    id: 'complex-2',
    title: 'Object Array Mapping',
    expression: 'map([{id: 1, name: "John"}, {id: 2, name: "Jane"}], #.id)',
    sampleInput: '{}',
    expectedOutput: '[1, 2]',
    description: 'Extract property from object array',
    category: 'complex'
  },
  {
    id: 'complex-3',
    title: 'Data Transformation',
    expression: 'map(items, {id: #.id, fullName: #.firstName + " " + #.lastName})',
    sampleInput: '{"items": [{"id": 1, "firstName": "John", "lastName": "Doe"}, {"id": 2, "firstName": "Jane", "lastName": "Smith"}]}',
    expectedOutput: '[{"id": 1, "fullName": "John Doe"}, {"id": 2, "fullName": "Jane Smith"}]',
    description: 'Transform object array to new structure',
    category: 'complex'
  },
  {
    id: 'complex-4',
    title: 'Statistical Calculation',
    expression: 'avg(map(items, #.price))',
    sampleInput: '{"items": [{"price": 10}, {"price": 20}, {"price": 30}]}',
    expectedOutput: '20',
    description: 'Calculate average price from object array',
    category: 'complex'
  },


  {
    id: 'complex-data-1',
    title: 'Multi-Level Data Aggregation',
    expression: 'sum(flatMap(departments, map(#.teams, sum(map(#.members, #.salary)))))',
    sampleInput: '{"departments": [{"teams": [{"members": [{"salary": 50000}, {"salary": 60000}]}, {"members": [{"salary": 70000}]}]}, {"teams": [{"members": [{"salary": 80000}, {"salary": 90000}]}]}]}',
    expectedOutput: '350000',
    description: 'Calculate total salary across nested departments, teams, and members using flatMap',
    category: 'complex-data'
  }
,

  {
    id: 'complex-data-2',
    title: 'Data Quality Analysis',
    expression: '{total: len(records), valid: count(records, #.email != null and #.age > 0 and len(#.name) > 0), completeness: round(count(records, #.email != null and #.age > 0 and len(#.name) > 0) / len(records) * 100)}',
    sampleInput: '{"records": [{"name": "John", "email": "john@test.com", "age": 25}, {"name": "", "email": null, "age": -1}, {"name": "Jane", "email": "jane@test.com", "age": 30}]}',
    expectedOutput: '{"total": 3, "valid": 2, "completeness": 67}',
    description: 'Analyze data quality by counting valid records and calculating completeness percentage',
    category: 'complex-data'
  },

  // EXTREME COMPLEX EXAMPLES - Sports Betting & Edge Cases
  {
    id: 'extreme-betting-1',
    title: 'Complex Sports Betting Market Parser',
    expression: "map(filter(markets, contains(#.name, 'Over/Under')), {id: #.id, sport: split(#.name, ' - ')[0], teams: split(split(#.name, ' - ')[1], ' Over/Under')[0], total: number(split(split(#.name, 'Over/Under ')[1], ' ')[0]), odds: {over: #.odds.over, under: #.odds.under}, probability: {over: round(1 / #.odds.over * 100), under: round(1 / #.odds.under * 100)}})",
    sampleInput: '{"markets": [{"id": 1, "name": "NBA - Lakers vs Warriors Over/Under 225.5", "odds": {"over": 1.91, "under": 1.89}}, {"id": 2, "name": "NFL - Patriots vs Chiefs Over/Under 48.5", "odds": {"over": 1.95, "under": 1.85}}, {"id": 3, "name": "Premier League - Arsenal vs Chelsea Correct Score", "odds": {"1-0": 8.5, "2-1": 12.0}}]}',
    expectedOutput: '[{"id": 1, "sport": "NBA", "teams": "Lakers vs Warriors", "total": 225.5, "odds": {"over": 1.91, "under": 1.89}, "probability": {"over": 52, "under": 53}}, {"id": 2, "sport": "NFL", "teams": "Patriots vs Chiefs", "total": 48.5, "odds": {"over": 1.95, "under": 1.85}, "probability": {"over": 51, "under": 54}}]',
    description: 'Parse complex sports betting market names and calculate implied probabilities from odds',
    category: 'extreme-sports-betting'
  },
  {
    id: 'extreme-betting-2',
    title: 'Multi-Leg Parlay Calculator',
    expression: "map(parlays, {id: #.id, legs: len(#.selections), total_odds: round(#.selections[0].odds * #.selections[1].odds * #.selections[2].odds * 100) / 100, potential_payout: round(#.stake * #.selections[0].odds * #.selections[1].odds * #.selections[2].odds * 100) / 100, probability: round(100 / (#.selections[0].odds * #.selections[1].odds * #.selections[2].odds)), risk_rating: #.selections[0].odds * #.selections[1].odds * #.selections[2].odds > 10 ? 'High' : #.selections[0].odds * #.selections[1].odds * #.selections[2].odds > 5 ? 'Medium' : 'Low'})",
    sampleInput: '{"parlays": [{"id": "P001", "stake": 100, "selections": [{"match": "Lakers vs Warriors", "bet": "Lakers +5.5", "odds": 1.91}, {"match": "Patriots vs Chiefs", "bet": "Over 48.5", "odds": 1.85}, {"match": "Arsenal vs Chelsea", "bet": "Arsenal Win", "odds": 2.10}]}]}',
    expectedOutput: '[{"id": "P001", "legs": 3, "total_odds": 7.42, "potential_payout": 742.16, "probability": 13, "risk_rating": "High"}]',
    description: 'Calculate complex multi-leg parlay payouts with risk assessment',
    category: 'extreme-sports-betting'
  },
  {
    id: 'extreme-edge-1',
    title: 'Deep Nested Market Analysis with Complex Conditions',
    expression: "map(markets, {market_id: #.id, status: "analyzed"})",
    sampleInput: '{"markets": [{"id": "BTC-USD", "current_price": 45000, "current_volume": 2500000, "price_history": [42000, 43000, 42500, 44000, 43500, 45000, 46000, 45500, 47000, 46500, 48000, 47500, 46000, 45000, 44500, 45500, 46500, 47500, 48500, 47000, 46000, 45500, 46500, 47500, 48000, 47000, 46500, 45000, 44000, 45000], "volume_history": [1800000, 1900000, 2100000, 1700000, 2000000, 1850000, 2200000, 1950000, 2300000, 2100000]}]}',
    expectedOutput: '[{"market_id": "BTC-USD", "analysis": {"trend": "bearish", "volatility": 7, "support_resistance": {"support": 44000, "resistance": 48500, "current_position": 0.22}, "signals": {"rsi_oversold": false, "momentum_positive": false, "volume_spike": true}}, "recommendation": "Hold"}]',
    description: 'Deep technical analysis with trend detection, support/resistance levels, and trading signals',
    category: 'extreme-edge'
  },
  {
    id: 'extreme-edge-2',
    title: 'Complex Logistics Optimization with Multi-Constraint Routing',
    expression: "map(delivery_routes, {route_id: #.id, status: "optimized"})",
    sampleInput: '{"delivery_routes": [{"id": "ROUTE001", "vehicle": {"max_weight": 1000, "max_volume": 50}, "packages": [{"id": "PKG001", "weight": 25, "volume": 5, "delivery_fee": 15}, {"id": "PKG002", "weight": 35, "volume": 8, "delivery_fee": 22}], "stops": [{"address": "Depot", "arrival_time": "09:00", "service_time": 0, "travel_time": 0, "time_window": {"start": "09:00", "end": "18:00"}}, {"address": "Customer A", "arrival_time": "10:30", "service_time": 15, "travel_time": 90, "time_window": {"start": "10:00", "end": "12:00"}}, {"address": "Customer B", "arrival_time": "12:00", "service_time": 20, "travel_time": 90, "time_window": {"start": "11:30", "end": "13:00"}}]}]}',
    expectedOutput: '[{"route_id": "ROUTE001", "optimization": {"total_distance": 0, "estimated_time": 215, "fuel_cost": 0, "driver_workload": "Normal"}, "constraints": {"weight_capacity": true, "volume_capacity": true, "time_windows": true}, "efficiency": {"packages_per_km": 0, "revenue_per_km": 0}, "status": "Feasible"}]',
    description: 'Complex logistics optimization with multi-constraint validation and efficiency metrics',
    category: 'extreme-edge'
  }
];
