# DSL Hallucination Report

Generated: 2025-05-30T21:41:17.264Z

## Summary

- **Total Examples Checked**: 725
- **Valid Examples**: 638
- **Invalid Examples**: 87
- **Hallucinated Functions**: 27

## Hallucinated Functions

### `unique()`

**Status**: ❌ Not found in datasets
**Examples affected**: 2

**Invalid Examples:**
- `array-flat-6`: `unique([1, 2, 2, 3, 3, 3, 4])`
  - File: `src/examples/arrayOperationsExamples.backup.ts`
- `array-flat-6`: `unique([1, 2, 2, 3, 3, 3, 4])`
  - File: `src/examples/arrayOperationsExamples.manual-backup.ts`

### `sort()`

**Status**: ❌ Not found in datasets
**Examples affected**: 4

**Invalid Examples:**
- `array-flat-7`: `sort([3, 1, 4, 1, 5, 9, 2, 6])`
  - File: `src/examples/arrayOperationsExamples.backup.ts`
- `array-flat-8`: `sort([`
  - File: `src/examples/arrayOperationsExamples.backup.ts`
- `array-flat-7`: `sort([3, 1, 4, 1, 5, 9, 2, 6])`
  - File: `src/examples/arrayOperationsExamples.manual-backup.ts`
- `array-flat-8`: `sort([`
  - File: `src/examples/arrayOperationsExamples.manual-backup.ts`

### `reverse()`

**Status**: ❌ Not found in datasets
**Examples affected**: 4

**Invalid Examples:**
- `array-flat-9`: `reverse([1, 2, 3, 4, 5])`
  - File: `src/examples/arrayOperationsExamples.backup.ts`
- `array-flat-9`: `reverse([1, 2, 3, 4, 5])`
  - File: `src/examples/arrayOperationsExamples.manual-backup.ts`
- `str-adv-10`: `reverse(`
  - File: `src/examples/stringOperationsExamples.backup.ts`
- `str-adv-10`: `reverse(`
  - File: `src/examples/stringOperationsExamples.manual-backup.ts`

### `reduce()`

**Status**: ❌ Not found in datasets
**Examples affected**: 2

**Invalid Examples:**
- `array-flat-10`: `reduce([1, 2, 3, 4, 5], # + acc, 0)`
  - File: `src/examples/arrayOperationsExamples.backup.ts`
- `array-flat-10`: `reduce([1, 2, 3, 4, 5], # + acc, 0)`
  - File: `src/examples/arrayOperationsExamples.manual-backup.ts`

### `now()`

**Status**: ❌ Not found in datasets
**Examples affected**: 1

**Invalid Examples:**
- `date-1`: `now()`
  - File: `src/examples/dateOperationsExamples.backup.ts`

### `daysBetween()`

**Status**: ❌ Not found in datasets
**Examples affected**: 2

**Invalid Examples:**
- `date-12`: `daysBetween(date(`
  - File: `src/examples/dateOperationsExamples.backup.ts`
- `date-12`: `daysBetween(date(`
  - File: `src/examples/dateOperationsExamples.manual-backup.ts`

### `isWeekend()`

**Status**: ❌ Not found in datasets
**Examples affected**: 2

**Invalid Examples:**
- `date-13`: `isWeekend(date(`
  - File: `src/examples/dateOperationsExamples.backup.ts`
- `date-13`: `isWeekend(date(`
  - File: `src/examples/dateOperationsExamples.manual-backup.ts`

### `today()`

**Status**: ❌ Not found in datasets
**Examples affected**: 2

**Invalid Examples:**
- `date-const-5`: `today()`
  - File: `src/examples/dateOperationsExamples.backup.ts`
- `date-const-5`: `today()`
  - File: `src/examples/dateOperationsExamples.manual-backup.ts`

### `tomorrow()`

**Status**: ❌ Not found in datasets
**Examples affected**: 2

**Invalid Examples:**
- `date-const-6`: `tomorrow()`
  - File: `src/examples/dateOperationsExamples.backup.ts`
- `date-const-6`: `tomorrow()`
  - File: `src/examples/dateOperationsExamples.manual-backup.ts`

### `yesterday()`

**Status**: ❌ Not found in datasets
**Examples affected**: 2

**Invalid Examples:**
- `date-const-7`: `yesterday()`
  - File: `src/examples/dateOperationsExamples.backup.ts`
- `date-const-7`: `yesterday()`
  - File: `src/examples/dateOperationsExamples.manual-backup.ts`

### `startOfDay()`

**Status**: ❌ Not found in datasets
**Examples affected**: 2

**Invalid Examples:**
- `date-const-8`: `startOfDay(date(`
  - File: `src/examples/dateOperationsExamples.backup.ts`
- `date-const-8`: `startOfDay(date(`
  - File: `src/examples/dateOperationsExamples.manual-backup.ts`

### `endOfDay()`

**Status**: ❌ Not found in datasets
**Examples affected**: 2

**Invalid Examples:**
- `date-const-9`: `endOfDay(date(`
  - File: `src/examples/dateOperationsExamples.backup.ts`
- `date-const-9`: `endOfDay(date(`
  - File: `src/examples/dateOperationsExamples.manual-backup.ts`

### `startOfMonth()`

**Status**: ❌ Not found in datasets
**Examples affected**: 2

**Invalid Examples:**
- `date-const-10`: `startOfMonth(date(`
  - File: `src/examples/dateOperationsExamples.backup.ts`
- `date-const-10`: `startOfMonth(date(`
  - File: `src/examples/dateOperationsExamples.manual-backup.ts`

### `endOfMonth()`

**Status**: ❌ Not found in datasets
**Examples affected**: 2

**Invalid Examples:**
- `date-const-11`: `endOfMonth(date(`
  - File: `src/examples/dateOperationsExamples.backup.ts`
- `date-const-11`: `endOfMonth(date(`
  - File: `src/examples/dateOperationsExamples.manual-backup.ts`

### `daysInMonth()`

**Status**: ❌ Not found in datasets
**Examples affected**: 2

**Invalid Examples:**
- `date-parts-9`: `daysInMonth(date(`
  - File: `src/examples/dateOperationsExamples.backup.ts`
- `date-parts-9`: `daysInMonth(date(`
  - File: `src/examples/dateOperationsExamples.manual-backup.ts`

### `age()`

**Status**: ❌ Not found in datasets
**Examples affected**: 2

**Invalid Examples:**
- `date-parts-10`: `age(date(`
  - File: `src/examples/dateOperationsExamples.backup.ts`
- `date-parts-10`: `age(date(`
  - File: `src/examples/dateOperationsExamples.manual-backup.ts`

### `sqrt()`

**Status**: ❌ Not found in datasets
**Examples affected**: 22

**Invalid Examples:**
- `math-8`: `sqrt(16)`
  - File: `src/examples/mathematicalOperationsExamples.backup.ts`
- `math-23`: `sqrt(5 ^ 2)`
  - File: `src/examples/mathematicalOperationsExamples.backup.ts`
- `complex-math-3`: `sqrt(16) + 2 ^ 3`
  - File: `src/examples/mathematicalOperationsExamples.backup.ts`
- `complex-math-9`: `sqrt(sqrt(256))`
  - File: `src/examples/mathematicalOperationsExamples.backup.ts`
- `complex-math-13`: `sqrt(9 + 16)`
  - File: `src/examples/mathematicalOperationsExamples.backup.ts`
- `complex-math-22`: `sqrt((x2 - x1) ^ 2 + (y2 - y1) ^ 2)`
  - File: `src/examples/mathematicalOperationsExamples.backup.ts`
- `complex-math-26`: `sqrt(a * b)`
  - File: `src/examples/mathematicalOperationsExamples.backup.ts`
- `complex-math-29`: `sqrt(a ^ 2 + b ^ 2)`
  - File: `src/examples/mathematicalOperationsExamples.backup.ts`
- `complex-math-32`: `sqrt(((x1 - mean) ^ 2 + (x2 - mean) ^ 2) / 2)`
  - File: `src/examples/mathematicalOperationsExamples.backup.ts`
- `complex-math-34`: `abs(sqrt((a + b) ^ 2) - sqrt(a ^ 2 + b ^ 2))`
  - File: `src/examples/mathematicalOperationsExamples.backup.ts`
- `round-10`: `round(sqrt(50), 2)`
  - File: `src/examples/mathematicalOperationsExamples.backup.ts`
- `math-8`: `sqrt(16)`
  - File: `src/examples/mathematicalOperationsExamples.manual-backup.ts`
- `math-23`: `sqrt(5 ^ 2)`
  - File: `src/examples/mathematicalOperationsExamples.manual-backup.ts`
- `complex-math-3`: `sqrt(16) + 2 ^ 3`
  - File: `src/examples/mathematicalOperationsExamples.manual-backup.ts`
- `complex-math-9`: `sqrt(sqrt(256))`
  - File: `src/examples/mathematicalOperationsExamples.manual-backup.ts`
- `complex-math-13`: `sqrt(9 + 16)`
  - File: `src/examples/mathematicalOperationsExamples.manual-backup.ts`
- `complex-math-22`: `sqrt((x2 - x1) ^ 2 + (y2 - y1) ^ 2)`
  - File: `src/examples/mathematicalOperationsExamples.manual-backup.ts`
- `complex-math-26`: `sqrt(a * b)`
  - File: `src/examples/mathematicalOperationsExamples.manual-backup.ts`
- `complex-math-29`: `sqrt(a ^ 2 + b ^ 2)`
  - File: `src/examples/mathematicalOperationsExamples.manual-backup.ts`
- `complex-math-32`: `sqrt(((x1 - mean) ^ 2 + (x2 - mean) ^ 2) / 2)`
  - File: `src/examples/mathematicalOperationsExamples.manual-backup.ts`
- `complex-math-34`: `abs(sqrt((a + b) ^ 2) - sqrt(a ^ 2 + b ^ 2))`
  - File: `src/examples/mathematicalOperationsExamples.manual-backup.ts`
- `round-10`: `round(sqrt(50), 2)`
  - File: `src/examples/mathematicalOperationsExamples.manual-backup.ts`

### `log()`

**Status**: ❌ Not found in datasets
**Examples affected**: 2

**Invalid Examples:**
- `complex-math-31`: `log(x) / log(base)`
  - File: `src/examples/mathematicalOperationsExamples.backup.ts`
- `complex-math-31`: `log(x) / log(base)`
  - File: `src/examples/mathematicalOperationsExamples.manual-backup.ts`

### `precise()`

**Status**: ❌ Not found in datasets
**Examples affected**: 10

**Invalid Examples:**
- `decimal-2`: `precise(0.1 + 0.2, 1) == 0.3`
  - File: `src/examples/mathematicalOperationsExamples.backup.ts`
- `decimal-4`: `precise(0.1 * 3, 1)`
  - File: `src/examples/mathematicalOperationsExamples.backup.ts`
- `decimal-6`: `precise(1 / 3, 4)`
  - File: `src/examples/mathematicalOperationsExamples.backup.ts`
- `decimal-7`: `precise((0.1 + 0.2) * 1.5, 2)`
  - File: `src/examples/mathematicalOperationsExamples.backup.ts`
- `decimal-8`: `precise(price * (1 + tax), 2)`
  - File: `src/examples/mathematicalOperationsExamples.backup.ts`
- `decimal-2`: `precise(0.1 + 0.2, 1) == 0.3`
  - File: `src/examples/mathematicalOperationsExamples.manual-backup.ts`
- `decimal-4`: `precise(0.1 * 3, 1)`
  - File: `src/examples/mathematicalOperationsExamples.manual-backup.ts`
- `decimal-6`: `precise(1 / 3, 4)`
  - File: `src/examples/mathematicalOperationsExamples.manual-backup.ts`
- `decimal-7`: `precise((0.1 + 0.2) * 1.5, 2)`
  - File: `src/examples/mathematicalOperationsExamples.manual-backup.ts`
- `decimal-8`: `precise(price * (1 + tax), 2)`
  - File: `src/examples/mathematicalOperationsExamples.manual-backup.ts`

### `replace()`

**Status**: ❌ Not found in datasets
**Examples affected**: 4

**Invalid Examples:**
- `str-adv-1`: `replace(`
  - File: `src/examples/stringOperationsExamples.backup.ts`
- `str-adv-12`: `upper(replace(trim(`
  - File: `src/examples/stringOperationsExamples.backup.ts`
- `str-adv-1`: `replace(`
  - File: `src/examples/stringOperationsExamples.manual-backup.ts`
- `str-adv-12`: `upper(replace(trim(`
  - File: `src/examples/stringOperationsExamples.manual-backup.ts`

### `substr()`

**Status**: ❌ Not found in datasets
**Examples affected**: 2

**Invalid Examples:**
- `str-adv-2`: `substr(`
  - File: `src/examples/stringOperationsExamples.backup.ts`
- `str-adv-2`: `substr(`
  - File: `src/examples/stringOperationsExamples.manual-backup.ts`

### `padLeft()`

**Status**: ❌ Not found in datasets
**Examples affected**: 2

**Invalid Examples:**
- `str-adv-5`: `padLeft(`
  - File: `src/examples/stringOperationsExamples.backup.ts`
- `str-adv-5`: `padLeft(`
  - File: `src/examples/stringOperationsExamples.manual-backup.ts`

### `padRight()`

**Status**: ❌ Not found in datasets
**Examples affected**: 2

**Invalid Examples:**
- `str-adv-6`: `padRight(`
  - File: `src/examples/stringOperationsExamples.backup.ts`
- `str-adv-6`: `padRight(`
  - File: `src/examples/stringOperationsExamples.manual-backup.ts`

### `indexOf()`

**Status**: ❌ Not found in datasets
**Examples affected**: 2

**Invalid Examples:**
- `str-adv-7`: `indexOf(`
  - File: `src/examples/stringOperationsExamples.backup.ts`
- `str-adv-7`: `indexOf(`
  - File: `src/examples/stringOperationsExamples.manual-backup.ts`

### `lastIndexOf()`

**Status**: ❌ Not found in datasets
**Examples affected**: 2

**Invalid Examples:**
- `str-adv-8`: `lastIndexOf(`
  - File: `src/examples/stringOperationsExamples.backup.ts`
- `str-adv-8`: `lastIndexOf(`
  - File: `src/examples/stringOperationsExamples.manual-backup.ts`

### `charAt()`

**Status**: ❌ Not found in datasets
**Examples affected**: 2

**Invalid Examples:**
- `str-adv-9`: `charAt(`
  - File: `src/examples/stringOperationsExamples.backup.ts`
- `str-adv-9`: `charAt(`
  - File: `src/examples/stringOperationsExamples.manual-backup.ts`

### `join()`

**Status**: ❌ Not found in datasets
**Examples affected**: 2

**Invalid Examples:**
- `str-adv-11`: `join([`
  - File: `src/examples/stringOperationsExamples.backup.ts`
- `str-adv-11`: `join([`
  - File: `src/examples/stringOperationsExamples.manual-backup.ts`

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
