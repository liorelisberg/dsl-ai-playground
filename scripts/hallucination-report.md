# DSL Hallucination Report

Generated: 2025-05-30T22:11:09.526Z

## Summary

- **Total Examples Checked**: 564
- **Valid Examples**: 532
- **Invalid Examples**: 32
- **Hallucinated Functions**: 7

## Hallucinated Functions

### `unique()`

**Status**: ❌ Not found in datasets
**Examples affected**: 2

**Invalid Examples:**
- `array-flat-6`: `unique([1, 2, 2, 3, 3, 4])`
  - File: `src/examples/arrayOperationsExamples.backup.ts`
- `array-flat-6`: `unique([1, 2, 2, 3, 3, 4])`
  - File: `src/examples/arrayOperationsExamples.ts`

### `sort()`

**Status**: ❌ Not found in datasets
**Examples affected**: 4

**Invalid Examples:**
- `array-flat-7`: `sort([3, 1, 4, 1, 5, 9, 2, 6])`
  - File: `src/examples/arrayOperationsExamples.backup.ts`
- `array-flat-8`: `sort([`
  - File: `src/examples/arrayOperationsExamples.backup.ts`
- `array-flat-7`: `sort([3, 1, 4, 1, 5, 9, 2, 6])`
  - File: `src/examples/arrayOperationsExamples.ts`
- `array-flat-8`: `sort([`
  - File: `src/examples/arrayOperationsExamples.ts`

### `reverse()`

**Status**: ❌ Not found in datasets
**Examples affected**: 2

**Invalid Examples:**
- `array-flat-9`: `reverse([1, 2, 3, 4, 5])`
  - File: `src/examples/arrayOperationsExamples.backup.ts`
- `array-flat-9`: `reverse([1, 2, 3, 4, 5])`
  - File: `src/examples/arrayOperationsExamples.ts`

### `subtract()`

**Status**: ❌ Not found in datasets
**Examples affected**: 2

**Invalid Examples:**
- `date-const-7`: `date().subtract(1, `
  - File: `src/examples/dateOperationsExamples.backup.ts`
- `date-const-7`: `date().subtract(1, `
  - File: `src/examples/dateOperationsExamples.ts`

### `sqrt()`

**Status**: ❌ Not found in datasets
**Examples affected**: 18

**Invalid Examples:**
- `math-7`: `sqrt(16)`
  - File: `src/examples/mathematicalOperationsExamples.backup.ts`
- `math-23`: `sqrt(5 ^ 2)`
  - File: `src/examples/mathematicalOperationsExamples.backup.ts`
- `complex-math-3`: `sqrt(16) * 2`
  - File: `src/examples/mathematicalOperationsExamples.backup.ts`
- `complex-math-9`: `sqrt(sqrt(16))`
  - File: `src/examples/mathematicalOperationsExamples.backup.ts`
- `complex-math-13`: `sqrt(5 ^ 2 + 12 ^ 2)`
  - File: `src/examples/mathematicalOperationsExamples.backup.ts`
- `complex-math-22`: `sqrt((x2 - x1) ^ 2 + (y2 - y1) ^ 2)`
  - File: `src/examples/mathematicalOperationsExamples.backup.ts`
- `complex-math-26`: `sqrt(a * b)`
  - File: `src/examples/mathematicalOperationsExamples.backup.ts`
- `complex-math-33`: `((2 + 3) * (4 - 1)) + (6 / 2) + sqrt(16)`
  - File: `src/examples/mathematicalOperationsExamples.backup.ts`
- `round-10`: `round(sqrt(5 ^ 2 + 12 ^ 2), 2)`
  - File: `src/examples/mathematicalOperationsExamples.backup.ts`
- `math-7`: `sqrt(16)`
  - File: `src/examples/mathematicalOperationsExamples.ts`
- `math-23`: `sqrt(5 ^ 2)`
  - File: `src/examples/mathematicalOperationsExamples.ts`
- `complex-math-3`: `sqrt(16) * 2`
  - File: `src/examples/mathematicalOperationsExamples.ts`
- `complex-math-9`: `sqrt(sqrt(16))`
  - File: `src/examples/mathematicalOperationsExamples.ts`
- `complex-math-13`: `sqrt(5 ^ 2 + 12 ^ 2)`
  - File: `src/examples/mathematicalOperationsExamples.ts`
- `complex-math-22`: `sqrt((x2 - x1) ^ 2 + (y2 - y1) ^ 2)`
  - File: `src/examples/mathematicalOperationsExamples.ts`
- `complex-math-26`: `sqrt(a * b)`
  - File: `src/examples/mathematicalOperationsExamples.ts`
- `complex-math-33`: `((2 + 3) * (4 - 1)) + (6 / 2) + sqrt(16)`
  - File: `src/examples/mathematicalOperationsExamples.ts`
- `round-10`: `round(sqrt(5 ^ 2 + 12 ^ 2), 2)`
  - File: `src/examples/mathematicalOperationsExamples.ts`

### `pow()`

**Status**: ❌ Not found in datasets
**Examples affected**: 2

**Invalid Examples:**
- `math-8`: `pow(3, 2)`
  - File: `src/examples/mathematicalOperationsExamples.backup.ts`
- `math-8`: `pow(3, 2)`
  - File: `src/examples/mathematicalOperationsExamples.ts`

### `log()`

**Status**: ❌ Not found in datasets
**Examples affected**: 2

**Invalid Examples:**
- `complex-math-30`: `log(x) / log(10)`
  - File: `src/examples/mathematicalOperationsExamples.backup.ts`
- `complex-math-30`: `log(x) / log(10)`
  - File: `src/examples/mathematicalOperationsExamples.ts`

## Valid Functions Reference

The following 79 functions are confirmed valid (found in datasets):

- `abs()`
- `add()`
- `all()`
- `avg()`
- `bool()`
- `ceil()`
- `contains()`
- `count()`
- `d()`
- `date()`
- `dateString()`
- `day()`
- `dayOfMonth()`
- `dayOfWeek()`
- `dayOfYear()`
- `diff()`
- `duration()`
- `endOf()`
- `endsWith()`
- `extract()`
- `filter()`
- `flatMap()`
- `floor()`
- `format()`
- `fuzzyMatch()`
- `hour()`
- `in()`
- `isAfter()`
- `isBefore()`
- `isLeapYear()`
- `isNumeric()`
- `isSame()`
- `isSameOrAfter()`
- `isSameOrBefore()`
- `isToday()`
- `isTomorrow()`
- `isValid()`
- `isYesterday()`
- `keys()`
- `len()`
- `lower()`
- `map()`
- `matches()`
- `max()`
- `median()`
- `min()`
- `minute()`
- `mode()`
- `month()`
- `monthOfYear()`
- `monthString()`
- `none()`
- `number()`
- `offsetName()`
- `one()`
- `quarter()`
- `rand()`
- `round()`
- `second()`
- `set()`
- `some()`
- `split()`
- `startOf()`
- `startsWith()`
- `string()`
- `sub()`
- `sum()`
- `time()`
- `timestamp()`
- `trim()`
- `trunc()`
- `type()`
- `tz()`
- `upper()`
- `values()`
- `weekOfYear()`
- `weekday()`
- `weekdayString()`
- `year()`
