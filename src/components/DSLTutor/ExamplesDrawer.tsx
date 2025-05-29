import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { X, Search, Code, Sparkles, ArrowLeft, FolderOpen, Hash } from 'lucide-react';
import { getExamples } from '../../services/examplesService';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface Example {
  id: string;
  title: string;
  expression: string;
  sampleInput: string;
  expectedOutput: string;
  description: string;
  category: string;
}

interface ExamplesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectExample: (example: Example) => void;
}

type ViewMode = 'categories' | 'examples';

// Category display configuration
const categoryConfig: Record<string, { icon: React.ReactNode; label: string; description: string; color: string }> = {
  boolean: {
    icon: <Hash className="h-5 w-5" />,
    label: 'Boolean Logic',
    description: 'AND, OR, NOT operations and boolean expressions',
    color: 'bg-gradient-to-br from-purple-500 to-pink-600'
  },
  numbers: {
    icon: <Hash className="h-5 w-5" />,
    label: 'Numbers & Math',
    description: 'Arithmetic operations, comparisons, and math functions',
    color: 'bg-gradient-to-br from-blue-500 to-indigo-600'
  },
  mathematical: {
    icon: <Hash className="h-5 w-5" />,
    label: 'Mathematical Functions',
    description: 'Floor, ceil, round, and high-precision arithmetic',
    color: 'bg-gradient-to-br from-cyan-500 to-blue-600'
  },
  string: {
    icon: <Code className="h-5 w-5" />,
    label: 'String Operations',
    description: 'Text manipulation, searching, and pattern matching',
    color: 'bg-gradient-to-br from-green-500 to-emerald-600'
  },
  template: {
    icon: <Sparkles className="h-5 w-5" />,
    label: 'Template Strings',
    description: 'String interpolation and template literals',
    color: 'bg-gradient-to-br from-yellow-500 to-orange-600'
  },
  slice: {
    icon: <Code className="h-5 w-5" />,
    label: 'String Slicing',
    description: 'Extract substrings using array-like syntax',
    color: 'bg-gradient-to-br from-teal-500 to-cyan-600'
  },
  array: {
    icon: <FolderOpen className="h-5 w-5" />,
    label: 'Array Operations',
    description: 'Map, filter, reduce, and array manipulation',
    color: 'bg-gradient-to-br from-red-500 to-pink-600'
  },
  'array-advanced': {
    icon: <Sparkles className="h-5 w-5" />,
    label: 'Advanced Array Methods',
    description: 'Complex map, filter, some, all, flatMap operations',
    color: 'bg-gradient-to-br from-purple-500 to-indigo-600'
  },
  object: {
    icon: <FolderOpen className="h-5 w-5" />,
    label: 'Object Operations',
    description: 'Property access, keys, values, and object manipulation',
    color: 'bg-gradient-to-br from-indigo-500 to-purple-600'
  },
  conditional: {
    icon: <Hash className="h-5 w-5" />,
    label: 'Conditionals',
    description: 'Ternary operators, comparisons, and range checks',
    color: 'bg-gradient-to-br from-amber-500 to-yellow-600'
  },
  conversion: {
    icon: <Sparkles className="h-5 w-5" />,
    label: 'Type Conversion',
    description: 'Convert between strings, numbers, and booleans',
    color: 'bg-gradient-to-br from-violet-500 to-purple-600'
  },
  'type-checking': {
    icon: <Hash className="h-5 w-5" />,
    label: 'Type Checking',
    description: 'Validate types and check if values are numeric',
    color: 'bg-gradient-to-br from-teal-500 to-emerald-600'
  },
  date: {
    icon: <Hash className="h-5 w-5" />,
    label: 'Date Operations',
    description: 'Date creation, formatting, and manipulation',
    color: 'bg-gradient-to-br from-rose-500 to-red-600'
  },
  'date-advanced': {
    icon: <Sparkles className="h-5 w-5" />,
    label: 'Advanced Date Operations',
    description: 'Date validation, timezone conversion, and comparisons',
    color: 'bg-gradient-to-br from-pink-500 to-rose-600'
  },
  null: {
    icon: <Hash className="h-5 w-5" />,
    label: 'Null Handling',
    description: 'Nullish coalescing and null safety operations',
    color: 'bg-gradient-to-br from-slate-500 to-gray-600'
  },
  complex: {
    icon: <Sparkles className="h-5 w-5" />,
    label: 'Complex Operations',
    description: 'Advanced expressions and data transformations',
    color: 'bg-gradient-to-br from-emerald-500 to-teal-600'
  },
  range: {
    icon: <Hash className="h-5 w-5" />,
    label: 'Range Operations',
    description: 'Range syntax and interval iterations',
    color: 'bg-gradient-to-br from-orange-500 to-red-600'
  },
  'complex-math': {
    icon: <Hash className="h-5 w-5" />,
    label: 'Complex Math Expressions',
    description: 'Multi-step calculations with parentheses and operator precedence',
    color: 'bg-gradient-to-br from-blue-500 to-purple-600'
  },
  'dynamic-objects': {
    icon: <FolderOpen className="h-5 w-5" />,
    label: 'Dynamic Object Construction',
    description: 'Create objects with computed keys and dynamic properties',
    color: 'bg-gradient-to-br from-violet-500 to-purple-600'
  },
  'date-duration': {
    icon: <Hash className="h-5 w-5" />,
    label: 'Date Duration Arithmetic',
    description: 'Duration operations, date arithmetic, and time period calculations',
    color: 'bg-gradient-to-br from-indigo-500 to-blue-600'
  },
  'array-statistics': {
    icon: <FolderOpen className="h-5 w-5" />,
    label: 'Array Statistics',
    description: 'Statistical functions: median, mode, range calculations',
    color: 'bg-gradient-to-br from-emerald-500 to-green-600'
  },
  'date-parts': {
    icon: <Hash className="h-5 w-5" />,
    label: 'Extended Date Parts',
    description: 'Extract year, month, day, week using function syntax',
    color: 'bg-gradient-to-br from-orange-500 to-pink-600'
  },
  'business-calculations': {
    icon: <FolderOpen className="h-5 w-5" />,
    label: 'Business Calculations',
    description: 'Price validation, revenue calculations, permissions, and inventory checks',
    color: 'bg-gradient-to-br from-green-500 to-emerald-600'
  },
  'unary-operations': {
    icon: <Hash className="h-5 w-5" />,
    label: 'Unary Operations',
    description: 'Context-dependent expressions using $ symbol for comparisons and validations',
    color: 'bg-gradient-to-br from-yellow-500 to-orange-600'
  },
  'string-advanced': {
    icon: <Code className="h-5 w-5" />,
    label: 'Advanced String Operations',
    description: 'String concatenation, join, repeat, reverse, and utility functions',
    color: 'bg-gradient-to-br from-teal-500 to-blue-600'
  },
  'date-constructors': {
    icon: <Hash className="h-5 w-5" />,
    label: 'Advanced Date Constructors',
    description: 'Timezone-aware date creation, enhanced comparisons, and duration operations',
    color: 'bg-gradient-to-br from-purple-500 to-violet-600'
  },
  'utility-functions': {
    icon: <Sparkles className="h-5 w-5" />,
    label: 'Utility Functions',
    description: 'Fuzzy matching, timezone operations, leap year checks, and date setters',
    color: 'bg-gradient-to-br from-red-500 to-pink-600'
  }
};

const ExamplesDrawer: React.FC<ExamplesDrawerProps> = ({ 
  isOpen, 
  onClose, 
  onSelectExample 
}) => {
  const [examples, setExamples] = useState<Example[]>([]);
  const [filteredExamples, setFilteredExamples] = useState<Example[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('categories');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      loadExamples();
      setViewMode('categories');
      setSelectedCategory('');
      setSearchTerm('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = examples.filter(example =>
        example.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        example.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        example.expression.toLowerCase().includes(searchTerm.toLowerCase()) ||
        example.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredExamples(filtered);
    } else {
      setFilteredExamples(examples);
    }
  }, [searchTerm, examples]);

  const loadExamples = async () => {
    setLoading(true);
    try {
      const exampleData = await getExamples();
      setExamples(exampleData);
      setFilteredExamples(exampleData);
    } catch (error) {
      console.error('Failed to load examples:', error);
    } finally {
      setLoading(false);
    }
  };

  const categorizedExamples = filteredExamples.reduce((acc, example) => {
    if (!acc[example.category]) {
      acc[example.category] = [];
    }
    acc[example.category].push(example);
    return acc;
  }, {} as Record<string, Example[]>);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setViewMode('examples');
  };

  const handleBackToCategories = () => {
    setViewMode('categories');
    setSelectedCategory('');
    setSearchTerm('');
  };

  const currentCategoryExamples = selectedCategory ? categorizedExamples[selectedCategory] || [] : [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end">
      <div className="bg-white dark:bg-slate-800 w-full max-w-md h-full overflow-hidden flex flex-col border-l border-slate-200 dark:border-slate-700 shadow-2xl">
        {/* Header */}
        <div className="border-b border-slate-200 dark:border-slate-700 p-6 bg-slate-50 dark:bg-slate-800">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              {viewMode === 'examples' && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={handleBackToCategories}
                      className="hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full mr-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Back to categories</p>
                  </TooltipContent>
                </Tooltip>
              )}
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                {viewMode === 'categories' ? (
                  <FolderOpen className="h-5 w-5 text-white" />
                ) : (
                  <Code className="h-5 w-5 text-white" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {viewMode === 'categories' ? 'DSL Categories' : categoryConfig[selectedCategory]?.label || selectedCategory}
                </h3>
                {viewMode === 'examples' && (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {currentCategoryExamples.length} example{currentCategoryExamples.length !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">
                  <X className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Close examples drawer</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={viewMode === 'categories' ? "Search categories..." : "Search examples..."}
              className="pl-10 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-full"
            />
          </div>
          {searchTerm && (
            <div className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              {viewMode === 'categories' ? (
                (() => {
                  const matchingCategories = Object.entries(categorizedExamples).filter(([category, categoryExamples]) => {
                    const categoryMatches = 
                      category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      categoryConfig[category]?.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      categoryConfig[category]?.description.toLowerCase().includes(searchTerm.toLowerCase());
                    
                    const exampleMatches = categoryExamples.some(example =>
                      example.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      example.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      example.expression.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                    
                    return categoryMatches || exampleMatches;
                  });
                  
                  const totalMatchingExamples = matchingCategories.reduce((total, [, examples]) => {
                    return total + examples.filter(example =>
                      example.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      example.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      example.expression.toLowerCase().includes(searchTerm.toLowerCase())
                    ).length;
                  }, 0);
                  
                  return `Found ${matchingCategories.length} categories with ${totalMatchingExamples} matching examples`;
                })()
              ) : (
                `Found ${currentCategoryExamples.filter(example => 
                  example.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  example.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  example.expression.toLowerCase().includes(searchTerm.toLowerCase())
                ).length} examples`
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-emerald-500 rounded-full animate-pulse mx-auto mb-3"></div>
              <p className="text-slate-500 dark:text-slate-400">Loading examples...</p>
            </div>
          ) : viewMode === 'categories' ? (
            // Categories View
            <div className="space-y-4">
              {Object.entries(categorizedExamples)
                .filter(([category, categoryExamples]) => {
                  if (!searchTerm) return true;
                  
                  // Check if category name, label, or description matches
                  const categoryMatches = 
                    category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    categoryConfig[category]?.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    categoryConfig[category]?.description.toLowerCase().includes(searchTerm.toLowerCase());
                  
                  // Check if any examples in this category match the search term
                  const exampleMatches = categoryExamples.some(example =>
                    example.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    example.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    example.expression.toLowerCase().includes(searchTerm.toLowerCase())
                  );
                  
                  return categoryMatches || exampleMatches;
                })
                .map(([category, categoryExamples]) => {
                const config = categoryConfig[category] || {
                  icon: <Code className="h-5 w-5" />,
                  label: category,
                  description: `${categoryExamples.length} examples`,
                  color: 'bg-gradient-to-br from-slate-500 to-gray-600'
                };

                // Calculate matching examples for this category when searching
                const matchingExamplesInCategory = searchTerm ? 
                  categoryExamples.filter(example =>
                    example.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    example.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    example.expression.toLowerCase().includes(searchTerm.toLowerCase())
                  ).length : categoryExamples.length;

                const categoryMatches = searchTerm ? 
                  category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  config.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  config.description.toLowerCase().includes(searchTerm.toLowerCase()) : true;

                return (
                  <Tooltip key={category}>
                    <TooltipTrigger asChild>
                      <Card 
                        className="p-6 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl rounded-2xl"
                        onClick={() => handleCategorySelect(category)}
                      >
                        <div className="flex items-start space-x-4">
                          <div className={`w-12 h-12 ${config.color} rounded-xl flex items-center justify-center shadow-md text-white`}>
                            {config.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                              {config.label}
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                              {config.description}
                            </p>
                            <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 space-x-2">
                              <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700">
                                {categoryExamples.length} example{categoryExamples.length !== 1 ? 's' : ''}
                              </span>
                              {searchTerm && matchingExamplesInCategory > 0 && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300">
                                  {matchingExamplesInCategory} match{matchingExamplesInCategory !== 1 ? 'es' : ''}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Click to view {categoryExamples.length} {category} examples
                        {searchTerm && matchingExamplesInCategory > 0 && ` (${matchingExamplesInCategory} matching)`}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          ) : (
            // Examples View
            <div className="space-y-4">
              {currentCategoryExamples
                .filter(example => 
                  !searchTerm || 
                  example.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  example.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  example.expression.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((example) => (
                <Tooltip key={example.id}>
                  <TooltipTrigger asChild>
                    <Card 
                      className="p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl rounded-2xl"
                      onClick={() => onSelectExample(example)}
                    >
                      <h5 className="font-medium text-slate-900 dark:text-slate-100 mb-2 flex items-center">
                        <Code className="h-3 w-3 mr-2 text-indigo-500" />
                        {example.title}
                      </h5>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                        {example.description}
                      </p>
                      <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-3">
                        <code className="text-xs text-slate-800 dark:text-slate-200 font-mono">
                          {example.expression}
                        </code>
                      </div>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Click to load this example into the editor</p>
                  </TooltipContent>
                </Tooltip>
              ))}
              
              {currentCategoryExamples.length === 0 && !loading && (
                <div className="text-center py-12">
                  <FolderOpen className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-500 dark:text-slate-400">No examples found in this category</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamplesDrawer;
