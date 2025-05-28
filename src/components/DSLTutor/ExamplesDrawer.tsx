
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { X, Search, Code, Sparkles } from 'lucide-react';
import { getExamples } from '../../services/examplesService';

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

const ExamplesDrawer: React.FC<ExamplesDrawerProps> = ({ 
  isOpen, 
  onClose, 
  onSelectExample 
}) => {
  const [examples, setExamples] = useState<Example[]>([]);
  const [filteredExamples, setFilteredExamples] = useState<Example[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadExamples();
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = examples.filter(example =>
        example.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        example.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end">
      <div className="bg-white dark:bg-slate-800 w-full max-w-md h-full overflow-hidden flex flex-col border-l border-slate-200 dark:border-slate-700 shadow-2xl">
        {/* Header */}
        <div className="border-b border-slate-200 dark:border-slate-700 p-6 bg-slate-50 dark:bg-slate-800">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                <Code className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">DSL Examples</h3>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search examples..."
              className="pl-10 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-full"
            />
          </div>
        </div>

        {/* Examples List */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-emerald-500 rounded-full animate-pulse mx-auto mb-3"></div>
              <p className="text-slate-500 dark:text-slate-400">Loading examples...</p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(categorizedExamples).map(([category, categoryExamples]) => (
                <div key={category}>
                  <div className="flex items-center space-x-2 mb-4">
                    <Sparkles className="h-4 w-4 text-emerald-500" />
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 capitalize">
                      {category}
                    </h4>
                  </div>
                  <div className="space-y-3">
                    {categoryExamples.map((example) => (
                      <Card 
                        key={example.id} 
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
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamplesDrawer;
