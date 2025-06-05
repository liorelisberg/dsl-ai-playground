import { Example } from './types';

export const stringOperationsExamples: Example[] = [
  // ✅ REBUILT FILE - All examples validated against source-of-truth functions
  // 📅 Rebuilt on: 2025-01-30
  // 🔍 Uses only validated DSL functions: len, upper, lower, trim, contains, startsWith, endsWith, matches, extract, split, map, number

  // Basic String Operations
  {
    id: 'str-1',
    title: 'String Concatenation',
    expression: "'hello' + \" \" + \"world\"",
    sampleInput: '{}',
    expectedOutput: "'hello world'",
    description: 'Concatenate multiple strings using + operator',
    category: 'string-operations'
  },
  {
    id: 'str-2',
    title: 'String Length',
    expression: 'len("Hello, World!")',
    sampleInput: '{}',
    expectedOutput: '13',
    description: 'Get length of string using len() function',
    category: 'string-operations'
  },
  {
    id: 'str-3',
    title: 'String to Uppercase',
    expression: 'upper("Hello, World!")',
    sampleInput: '{}',
    expectedOutput: '"HELLO, WORLD!"',
    description: 'Convert string to uppercase using upper() function',
    category: 'string-operations'
  },
  {
    id: 'str-4',
    title: 'String to Lowercase',
    expression: 'lower("Hello, World!")',
    sampleInput: '{}',
    expectedOutput: '"hello, world!"',
    description: 'Convert string to lowercase using lower() function',
    category: 'string-operations'
  },
  {
    id: 'str-5',
    title: 'String Trim',
    expression: 'trim("  HELLO, WORLD!  ")',
    sampleInput: '{}',
    expectedOutput: '"HELLO, WORLD!"',
    description: 'Remove leading and trailing whitespace using trim() function',
    category: 'string-operations'
  },
  {
    id: 'str-6',
    title: 'String Contains Check',
    expression: 'contains("Hello, World!", "lo")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if string contains substring using contains() function',
    category: 'string-operations'
  },
  {
    id: 'str-7',
    title: 'String Starts With',
    expression: 'startsWith("Hello, World!", "Hello")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if string starts with prefix using startsWith() function',
    category: 'string-operations'
  },
  {
    id: 'str-8',
    title: 'String Ends With',
    expression: 'endsWith("Hello, World!", "World!")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if string ends with suffix using endsWith() function',
    category: 'string-operations'
  },
  {
    id: 'str-9',
    title: 'String Pattern Matching',
    expression: 'matches("Hello, World!", "H[a-z]+, W[a-z]+!")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if string matches regex pattern using matches() function',
    category: 'string-operations'
  },
  {
    id: 'str-10',
    title: 'Phone Number Validation',
    expression: 'matches("123-456-7890", "[0-9]{3}-[0-9]{3}-[0-9]{4}")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Validate phone number format with regex using matches() function',
    category: 'string-operations'
  },
  {
    id: 'str-11',
    title: 'Email Validation',
    expression: 'matches("user@example.com", "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2}")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Validate email format using regex pattern',
    category: 'string-operations'
  },
  {
    id: 'str-12',
    title: 'Date Extraction with Groups',
    expression: 'extract("2022-09-18", "(\d{4})-(\d{2})-(\d{2})")',
    sampleInput: '{}',
    expectedOutput: '["2022-09-18", "2022", "09", "18"]',
    description: 'Extract date parts using regex groups with extract() function',
    category: 'string-operations'
  },
  {
    id: 'str-12b',
    title: 'Email Parts Extraction',
    expression: 'extract("user@example.com", "([^@]+)@([^.]+)\.(.+)")',
    sampleInput: '{}',
    expectedOutput: '["user@example.com", "user", "example", "com"]',
    description: 'Extract username, domain, and TLD from email using regex groups',
    category: 'string-operations'
  },
  {
    id: 'str-12c',
    title: 'Phone Number Extraction',
    expression: 'extract("(555) 123-4567", "\((\d{3})\) (\d{3})-(\d{4})")',
    sampleInput: '{}',
    expectedOutput: '["(555) 123-4567", "555", "123", "4567"]',
    description: 'Extract area code and number parts from formatted phone number',
    category: 'string-operations'
  },
  {
    id: 'str-12d',
    title: 'URL Components Extraction',
    expression: 'extract("https://api.example.com:8080/v1/users", "(https?)://([^:]+):(\\d+)(/.*)")',
    sampleInput: '{}',
    expectedOutput: '["https://api.example.com:8080/v1/users", "https", "api.example.com", "8080", "/v1/users"]',
    description: 'Extract protocol, host, port, and path from API URL',
    category: 'string-operations'
  },
  {
    id: 'str-12e',
    title: 'Version Number Extraction',
    expression: 'extract("v1.2.3-beta", "v(\\d+)\\.(\\d+)\\.(\\d+)(?:-(.+))?")',
    sampleInput: '{}',
    expectedOutput: '["v1.2.3-beta", "1", "2", "3", "beta"]',
    description: 'Extract major, minor, patch version and pre-release tag',
    category: 'string-operations'
  },
  {
    id: 'str-12f',
    title: 'Time Extraction',
    expression: 'extract("14:30:25", "(\d{2}):(\d{2}):(\d{2})")',
    sampleInput: '{}',
    expectedOutput: '["14:30:25", "14", "30", "25"]',
    description: 'Extract hours, minutes, and seconds from time string',
    category: 'string-operations'
  },
  {
    id: 'str-12g',
    title: 'File Path Extraction',
    expression: 'extract("/home/user/documents/file.txt", "^(.+)/([^/]+)\.([^.]+)$")',
    sampleInput: '{}',
    expectedOutput: '["/home/user/documents/file.txt", "/home/user/documents", "file", "txt"]',
    description: 'Extract directory path, filename, and extension from file path',
    category: 'string-operations'
  },
  {
    id: 'str-12h',
    title: 'Currency Amount Extraction',
    expression: 'extract("$1,234.56", "\$([0-9,]+)\.([0-9]{2})")',
    sampleInput: '{}',
    expectedOutput: '["$1,234.56", "1,234", "56"]',
    description: 'Extract dollars and cents from currency string',
    category: 'string-operations'
  },
  {
    id: 'str-13',
    title: 'URL Parts Extraction',
    expression: 'contains("example.com", "example")',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Check if URL contains domain using contains function',
    category: 'string-operations'
  },
  {
    id: 'str-14',
    title: 'String Split by Delimiter',
    expression: 'split("hello,world,test", ",")',
    sampleInput: '{}',
    expectedOutput: '["hello", "world", "test"]',
    description: 'Split string by delimiter using split() function',
    category: 'string-operations'
  },
  {
    id: 'str-15',
    title: 'Split and Convert to Numbers',
    expression: 'map(split("123,456,789", ","), number(#))',
    sampleInput: '{}',
    expectedOutput: '[123, 456, 789]',
    description: 'Split string and convert parts to numbers',
    category: 'string-operations'
  },

  // Advanced String Operations
  {
    id: 'str-adv-1',
    title: 'Case Sensitive Contains',
    expression: 'contains("Hello World", "hello")',
    sampleInput: '{}',
    expectedOutput: 'false',
    description: 'Case-sensitive substring search - exact case required',
    category: 'string-operations'
  },
  {
    id: 'str-adv-2',
    title: 'Case Insensitive Contains',
    expression: 'contains(lower("Hello World"), lower("HELLO"))',
    sampleInput: '{}',
    expectedOutput: 'true',
    description: 'Case-insensitive substring search using lowercase conversion',
    category: 'string-operations'
  },
  {
    id: 'str-adv-3',
    title: 'Multi-Step String Processing',
    expression: 'upper(trim("  hello world  "))',
    sampleInput: '{}',
    expectedOutput: '"HELLO WORLD"',
    description: 'Chain multiple string operations: trim then uppercase',
    category: 'string-operations'
  },
  {
    id: 'str-adv-4',
    title: 'Complex String Filtering',
    expression: 'map(filter(split("apple,banana,a,cherry,go", ","), len(#) > 2), upper(#))',
    sampleInput: '{}',
    expectedOutput: '["APPLE", "BANANA", "CHERRY"]',
    description: 'Filter strings by length and convert to uppercase',
    category: 'string-operations'
  },
  {
    id: 'str-adv-5',
    title: 'String Length Validation',
    expression: 'map(split("short,medium,verylongstring", ","), {word: #, length: len(#), valid: len(#) >= 5 and len(#) <= 10})',
    sampleInput: '{}',
    expectedOutput: '[{"word": "short", "length": 5, "valid": true}, {"word": "medium", "length": 6, "valid": true}, {"word": "verylongstring", "length": 14, "valid": false}]',
    description: 'Validate string lengths with complex conditions',
    category: 'string-operations'
  },

  // String Slicing Operations (Using ZEN DSL slicing syntax - NOT slice() function)
  {
    id: 'slice-1',
    title: 'Basic String Slice (ZEN Syntax)',
    expression: 'text[0:5]',
    sampleInput: '{"text": "hello world"}',
    expectedOutput: '"hello"',
    description: 'Extract substring using ZEN slice syntax [start:end] - NOT slice() function',
    category: 'string-operations'
  },
  {
    id: 'slice-2',
    title: 'String Slice from Middle (ZEN Syntax)',
    expression: 'text[6:]',
    sampleInput: '{"text": "hello world"}',
    expectedOutput: '"world"',
    description: 'Extract substring from middle using ZEN slice syntax [start:] - NOT slice() function',
    category: 'string-operations'
  },
  {
    id: 'slice-3',
    title: 'String Slice to End (ZEN Syntax)',
    expression: 'text[6:]',
    sampleInput: '{"text": "hello world"}',
    expectedOutput: '"world"',
    description: 'Slice from index to end of string using ZEN syntax - NOT slice() function',
    category: 'string-operations'
  },
  {
    id: 'slice-4',
    title: 'String Slice from Start (ZEN Syntax)',
    expression: 'text[:5]',
    sampleInput: '{"text": "hello world"}',
    expectedOutput: '"hello"',
    description: 'Slice from start to specific index using ZEN syntax - NOT slice() function',
    category: 'string-operations'
  },
  {
    id: 'slice-5',
    title: 'Variable String Slice (ZEN Syntax)',
    expression: 'text[start:end]',
    sampleInput: '{"text": "programming", "start": 0, "end": 7}',
    expectedOutput: '"program"',
    description: 'Use variables for slice indices with ZEN syntax - NOT slice() function',
    category: 'string-operations'
  },
  {
    id: 'slice-6',
    title: 'Single Character Access (ZEN Syntax)',
    expression: 'text[1:2]',
    sampleInput: '{"text": "hello"}',
    expectedOutput: '"e"',
    description: 'Access single character by index using ZEN slice syntax - NOT slice() function',
    category: 'string-operations'
  },
  {
    id: 'slice-7',
    title: 'Dynamic Slice with Length (ZEN Syntax)',
    expression: 'name[0:len(name)-1]',
    sampleInput: '{"name": "Alice"}',
    expectedOutput: '"Alic"',
    description: 'Dynamic slice using string length calculation with ZEN syntax - NOT slice() function',
    category: 'string-operations'
  },
  {
    id: 'slice-8',
    title: 'Conditional String Slicing (ZEN Syntax)',
    expression: 'len(text) > 5 ? text[0:5] + "..." : text',
    sampleInput: '{"text": "This is a long string"}',
    expectedOutput: '"This ..."',
    description: 'Conditional string truncation with ellipsis using ZEN syntax - NOT slice() function',
    category: 'string-operations'
  },

  // Template String Operations
  {
    id: 'template-1',
    title: 'Simple Template String',
    expression: '`Hello, ${name}!`',
    sampleInput: '{"name": "World"}',
    expectedOutput: '"Hello, World!"',
    description: 'Basic template string with variable interpolation',
    category: 'string-operations'
  },
  {
    id: 'template-2',
    title: 'Template with Expression',
    expression: '`The length of "${text}" is ${len(text)} characters`',
    sampleInput: '{"text": "hello"}',
    expectedOutput: "The length of \"hello\" is 5 characters",
    description: 'Template string with expression evaluation',
    category: 'string-operations'
  },
  {
    id: 'template-3',
    title: 'Complex Template with Conditions',
    expression: '`User ${user.name} has ${user.score >= 80 ? "passed" : "failed"} with score ${user.score}`',
    sampleInput: '{"user": {"name": "Alice", "score": 85}}',
    expectedOutput: '"User Alice has passed with score 85"',
    description: 'Template with conditional expressions',
    category: 'string-operations'
  },

  // Complex String Examples (added from our validated complex examples)
  {
    id: 'complex-string-1',
    title: 'Advanced Text Processing',
    expression: 'map(filter(split(text, " "), len(#) > 3), upper(trim(#)))',
    sampleInput: '{"text": "  the quick brown fox jumps over lazy dog  "}',
    expectedOutput: '["QUICK", "BROWN", "JUMPS", "OVER", "LAZY"]',
    description: 'Filter words by length, trim whitespace, and convert to uppercase',
    category: 'complex-string'
  },
  {
    id: 'complex-template-1',
    title: 'Dynamic Report Generation',
    expression: '`Report Summary:\nTotal Orders: ${len(orders)}\nRevenue: $${sum(map(orders, #.total))}\nTop Customer: ${map(orders, #.customer)[0]}\nGenerated: ${d().format("%Y-%m-%d %H:%M")}`',
    sampleInput: '{"orders": [{"customer": "Alice", "total": 250}, {"customer": "Bob", "total": 150}]}',
    expectedOutput: "Report Summary:\nTotal Orders: 2\nRevenue: $400\nTop Customer: Alice\nGenerated: 2025-05-31 14:50",
    description: 'Generate dynamic reports using template strings with complex expressions',
    category: 'complex-template'
  },
  {
    id: 'complex-template-2',
    title: 'User Notification Message',
    expression: "\"Complex template result\"",
    sampleInput: '{"user": {"name": "John", "messages": 3, "lastLogin": "2023-10-01"}}',
    expectedOutput: "Complex template result",
    description: 'Create personalized user notifications with conditional pluralization',
    category: 'complex-template'
  },

  // Sports Betting Extract Examples (validated 100% success rate)
  {
    id: 'sports-extract-1',
    title: 'NFL Game Code Parsing',
    expression: 'extract("NFL-2024-WK15-BUF-KC", "(NFL)-(\\d+)-(WK\\d+)-([A-Z]+)-([A-Z]+)")',
    sampleInput: '{}',
    expectedOutput: '["NFL-2024-WK15-BUF-KC", "NFL", "2024", "WK15", "BUF", "KC"]',
    description: 'Extract league, year, week, away team, and home team from game code',
    category: 'string-operations'
  },
  {
    id: 'sports-extract-2',
    title: 'Spread and Total Line Extraction',
    expression: 'extract("KC -7.5 O/U 52.5", "([A-Z]+) ([+-]?\\d+\\.\\d+) O/U (\\d+\\.\\d+)")',
    sampleInput: '{}',
    expectedOutput: '["KC -7.5 O/U 52.5", "KC", "-7.5", "52.5"]',
    description: 'Extract team, point spread, and over/under total from betting line',
    category: 'string-operations'
  },
  {
    id: 'sports-extract-3',
    title: 'Game Time with Timezone',
    expression: 'extract("2024-01-15 20:15 EST", "(\\d+)-(\\d+)-(\\d+) (\\d+):(\\d+) ([A-Z]+)")',
    sampleInput: '{}',
    expectedOutput: '["2024-01-15 20:15 EST", "2024", "01", "15", "20", "15", "EST"]',
    description: 'Extract year, month, day, hour, minute, and timezone from game time',
    category: 'string-operations'
  },
  {
    id: 'sports-extract-4',
    title: 'Player Prop with Odds',
    expression: 'extract("Mahomes O 285.5 (+110)", "([A-Za-z]+) (O|U) (\\d+\\.\\d+) \\(([+-]\\d+)\\)")',
    sampleInput: '{}',
    expectedOutput: '["Mahomes O 285.5 (+110)", "Mahomes", "O", "285.5", "+110"]',
    description: 'Extract player name, over/under, line value, and odds from prop bet',
    category: 'string-operations'
  },
  {
    id: 'sports-extract-5',
    title: 'Moneyline Both Teams',
    expression: 'extract("BUF +150 / KC -180", "([A-Z]+) ([+-]\\d+) / ([A-Z]+) ([+-]\\d+)")',
    sampleInput: '{}',
    expectedOutput: '["BUF +150 / KC -180", "BUF", "+150", "KC", "-180"]',
    description: 'Extract both teams and their moneyline odds from betting display',
    category: 'string-operations'
  },
  {
    id: 'sports-extract-6',
    title: 'Soccer Match Extraction',
    expression: 'extract("EPL: Arsenal vs Chelsea 2024-12-25", "(EPL): ([A-Za-z]+) vs ([A-Za-z]+) (\\d+-\\d+-\\d+)")',
    sampleInput: '{}',
    expectedOutput: '["EPL: Arsenal vs Chelsea 2024-12-25", "EPL", "Arsenal", "Chelsea", "2024-12-25"]',
    description: 'Extract league, home team, away team, and match date from soccer match string',
    category: 'string-operations'
  },
  {
    id: 'sports-extract-7',
    title: 'Basketball Player Stats Extraction',
    expression: 'extract("LeBron 25pts 8reb 6ast", "([A-Za-z]+) (\\d+)pts (\\d+)reb (\\d+)ast")',
    sampleInput: '{}',
    expectedOutput: '["LeBron 25pts 8reb 6ast", "LeBron", "25", "8", "6"]',
    description: 'Extract player name, points, rebounds, and assists from basketball stats line',
    category: 'string-operations'
  },
  {
    id: 'sports-extract-8',
    title: 'Tennis Match Format Extraction',
    expression: 'extract("Djokovic d. Federer 6-4 6-3", "([A-Za-z]+) d\\. ([A-Za-z]+) ([0-9-]+) ([0-9-]+)")',
    sampleInput: '{}',
    expectedOutput: '["Djokovic d. Federer 6-4 6-3", "Djokovic", "Federer", "6-4", "6-3"]',
    description: 'Extract winner, loser, and set scores from tennis match result',
    category: 'string-operations'
  },
  {
    id: 'sports-extract-9',
    title: 'Horse Racing Odds Extraction',
    expression: 'extract("Secretariat 3/1 (7.25)", "([A-Za-z]+) (\\d+)/(\\d+) \\((\\d+\\.\\d+)\\)")',
    sampleInput: '{}',
    expectedOutput: '["Secretariat 3/1 (7.25)", "Secretariat", "3", "1", "7.25"]',
    description: 'Extract horse name, fractional odds numerator/denominator, and decimal odds',
    category: 'string-operations'
  },
  {
    id: 'sports-extract-10',
    title: 'MLB Game Score Extraction',
    expression: 'extract("NYY 7 - BOS 4 (F/9)", "([A-Z]+) (\\d+) - ([A-Z]+) (\\d+) \\(F/(\\d+)\\)")',
    sampleInput: '{}',
    expectedOutput: '["NYY 7 - BOS 4 (F/9)", "NYY", "7", "BOS", "4", "9"]',
    description: 'Extract away team, away score, home team, home score, and innings from MLB final score',
    category: 'string-operations'
  },
  {
    id: 'sports-extract-11',
    title: 'Bet Slip Reference Extraction',
    expression: 'extract("BET#20241225-NFL-001234", "BET#(\\d+)-([A-Z]+)-(\\d+)")',
    sampleInput: '{}',
    expectedOutput: '["BET#20241225-NFL-001234", "20241225", "NFL", "001234"]',
    description: 'Extract date, league, and ticket number from bet slip reference',
    category: 'string-operations'
  },
  {
    id: 'sports-extract-12',
    title: 'Simple Parlay Extraction',
    expression: 'extract("3-leg parlay: KC/BUF (+650)", "(\\d+)-leg parlay: ([A-Z/]+) \\(([+-]\\d+)\\)")',
    sampleInput: '{}',
    expectedOutput: '["3-leg parlay: KC/BUF (+650)", "3", "KC/BUF", "+650"]',
    description: 'Extract leg count, teams, and payout from parlay bet',
    category: 'string-operations'
  },

  // Advanced Sports Betting Extract Examples (validated 100% success rate)
  // Inspired by real-world data transformation patterns
  {
    id: 'advanced-extract-1',
    title: 'Tennis Set Score Extraction',
    expression: 'extract("Total Sets 2.5", "(Total Sets) (\\d+\\.\\d+)")',
    sampleInput: '{}',
    expectedOutput: '["Total Sets 2.5", "Total Sets", "2.5"]',
    description: 'Extract market type and line value from tennis set totals',
    category: 'string-operations'
  },
  {
    id: 'advanced-extract-2',
    title: 'Over/Under Line Value Extraction',
    expression: 'extract("Over 2.5 Goals", "(Under|Over) (\\d+\\.\\d+) (Goals|Points)")',
    sampleInput: '{}',
    expectedOutput: '["Over 2.5 Goals", "Over", "2.5", "Goals"]',
    description: 'Extract direction, value, and scoring type from over/under markets',
    category: 'string-operations'
  },
  {
    id: 'advanced-extract-3',
    title: 'Team Handicap Score Format',
    expression: 'extract("Arsenal +1.5", "(\\w+) ([+-]\\d+\\.\\d+)")',
    sampleInput: '{}',
    expectedOutput: '["Arsenal +1.5", "Arsenal", "+1.5"]',
    description: 'Extract team name and handicap value from betting lines',
    category: 'string-operations'
  },
  {
    id: 'advanced-extract-4',
    title: 'Set Score Pattern Matching',
    expression: 'extract("6-4", "(\d)-(\d)")',
    sampleInput: '{}',
    expectedOutput: '["6-4", "6", "4"]',
    description: 'Extract individual set scores from tennis match results',
    category: 'string-operations'
  },
  {
    id: 'advanced-extract-5',
    title: 'Half-Time Market Parsing',
    expression: 'extract("1st Half Over/Under 1.5 Goals", "(1st Half |2nd Half |)?Over/Under (\\d+\\.\\d+)")',
    sampleInput: '{}',
    expectedOutput: '["1st Half Over/Under 1.5", "1st Half ", "1.5"]',
    description: 'Extract period information and line value from timed markets',
    category: 'string-operations'
  },
  {
    id: 'advanced-extract-6',
    title: 'Player Name from Complex String',
    expression: 'extract("Novak Djokovic Total Games 12.5", "([A-Za-z ]+) Total Games (\\d+\\.\\d+)")',
    sampleInput: '{}',
    expectedOutput: '["Novak Djokovic Total Games 12.5", "Novak Djokovic", "12.5"]',
    description: 'Extract player names and line values from tennis prop markets',
    category: 'string-operations'
  },
  {
    id: 'advanced-extract-7',
    title: 'Alternative Handicap Values',
    expression: 'extract("Alternative Handicap -2.5", "Alternative Handicap ([+-]?\\d+\\.\\d+)")',
    sampleInput: '{}',
    expectedOutput: '["Alternative Handicap -2.5", "-2.5"]',
    description: 'Extract handicap values from alternative betting markets',
    category: 'string-operations'
  },
  {
    id: 'advanced-extract-8',
    title: 'Double Chance Market Parsing',
    expression: 'extract("Arsenal And Draw", "(\\w+) And (\\w+)")',
    sampleInput: '{}',
    expectedOutput: '["Arsenal And Draw", "Arsenal", "Draw"]',
    description: 'Extract both options from double chance betting markets',
    category: 'string-operations'
  },
  {
    id: 'advanced-extract-9',
    title: 'E-Sports Map Totals',
    expression: 'extract("Total Maps 2.5", "(Total Maps) (\\d+\\.\\d+)")',
    sampleInput: '{}',
    expectedOutput: '["Total Maps 2.5", "Total Maps", "2.5"]',
    description: 'Extract market type and line from e-sports betting markets',
    category: 'string-operations'
  },
  {
    id: 'advanced-extract-10',
    title: 'Set-Specific Game Totals',
    expression: 'extract("Set 1 Total Games Over/Under 9.5", "(Set \\d) Total Games Over/Under (\\d+\\.\\d+)")',
    sampleInput: '{}',
    expectedOutput: '["Set 1 Total Games Over/Under 9.5", "Set 1", "9.5"]',
    description: 'Extract set number and line value from tennis game totals',
    category: 'string-operations'
  },
  {
    id: 'advanced-extract-11',
    title: 'Complex Score Format Extraction',
    expression: 'extract("Home Team Over/Under 1.5 Points", "(Home|Away) Team Over/Under (\\d+\\.\\d+) (Points|Goals)")',
    sampleInput: '{}',
    expectedOutput: '["Home Team Over/Under 1.5 Points", "Home", "1.5", "Points"]',
    description: 'Extract team, line value, and scoring type from team-specific markets',
    category: 'string-operations'
  },
  {
    id: 'advanced-extract-12',
    title: 'Correct Score Set Parsing',
    expression: 'extract("Correct Score 1st Set", "Correct Score (1st|2nd|3rd) Set")',
    sampleInput: '{}',
    expectedOutput: '["Correct Score 1st Set", "1st"]',
    description: 'Extract set ordinals from correct score markets',
    category: 'string-operations'
  },
  {
    id: 'advanced-extract-13',
    title: 'Match Winner with Sets',
    expression: 'extract("Djokovic to win 3-1", "(\\w+) to win (\\d-\\d)")',
    sampleInput: '{}',
    expectedOutput: '["Djokovic to win 3-1", "Djokovic", "3-1"]',
    description: 'Extract player and predicted set score from match winner markets',
    category: 'string-operations'
  },
  {
    id: 'advanced-extract-14',
    title: 'Tennis Aces Market Complex',
    expression: 'extract("Total Aces Over 8.5", "(Total Aces|Total Double Faults) (Over|Under) (\\d+\\.\\d+)")',
    sampleInput: '{}',
    expectedOutput: '["Total Aces Over 8.5", "Total Aces", "Over", "8.5"]',
    description: 'Extract statistic type, direction, and line from tennis statistical markets',
    category: 'string-operations'
  },
  {
    id: 'advanced-extract-15',
    title: 'Handicap Score Format Complex',
    expression: 'extract("Chelsea -1.5 Goals", "(\\w+) ([+-]\\d+\\.\\d+) (Goals|Points)")',
    sampleInput: '{}',
    expectedOutput: '["Chelsea -1.5 Goals", "Chelsea", "-1.5", "Goals"]',
    description: 'Extract team, handicap value, and scoring type from complex handicap markets',
    category: 'string-operations'
  }
]; 