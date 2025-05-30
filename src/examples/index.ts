import { Example } from './types';
import { arrayOperationsExamples } from './arrayOperationsExamples';
import { booleanExamples } from './booleanExamples';
import { business_calculationsExamples } from './business_calculationsExamples';
import { closureOperationsExamples } from './closureOperationsExamples';
import { complexExamples } from './complexExamples';
import { conditionalExamples } from './conditionalExamples';
import { conversionExamples } from './conversionExamples';
import { dateOperationsExamples } from './dateOperationsExamples';
import { dynamic_objectsExamples } from './dynamic_objectsExamples';
import { mathematicalOperationsExamples } from './mathematicalOperationsExamples';
import { nullExamples } from './nullExamples';
import { objectExamples } from './objectExamples';
import { rangeExamples } from './rangeExamples';
import { stringOperationsExamples } from './stringOperationsExamples';
import { templateExamples } from './templateExamples';
import { type_checkingExamples } from './type_checkingExamples';
import { unary_operationsExamples } from './unary_operationsExamples';
import { utility_functionsExamples } from './utility_functionsExamples';

export const allExamples: Example[] = [
  ...arrayOperationsExamples,
  ...booleanExamples,
  ...business_calculationsExamples,
  ...closureOperationsExamples,
  ...complexExamples,
  ...conditionalExamples,
  ...conversionExamples,
  ...dateOperationsExamples,
  ...dynamic_objectsExamples,
  ...mathematicalOperationsExamples,
  ...nullExamples,
  ...objectExamples,
  ...rangeExamples,
  ...stringOperationsExamples,
  ...templateExamples,
  ...type_checkingExamples,
  ...unary_operationsExamples,
  ...utility_functionsExamples,
];

export type { Example } from './types';
