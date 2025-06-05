import { allExamples, Example } from '../../docs/knowledge-cards/examples';

export const getExamples = async (): Promise<Example[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Sort by category, then by title
  return allExamples.sort((a, b) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }
    return a.title.localeCompare(b.title);
  });
};
