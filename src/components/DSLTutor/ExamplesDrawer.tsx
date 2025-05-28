
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
      <div className="bg-white/95 backdrop-blur-md w-full max-w-md h-full overflow-hidden flex flex-col border-l border-gray-200/50 shadow-2xl">
        {/* Header */}
        <div className="border-b border-gray-200/50 p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Code className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">DSL Examples</h3>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-white/50">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-gray-100/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search examples..."
              className="pl-10 border-gray-300/50 bg-white/80 backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Examples List */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse mx-auto mb-3"></div>
              <p className="text-gray-500">Loading examples...</p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(categorizedExamples).map(([category, categoryExamples]) => (
                <div key={category}>
                  <div className="flex items-center space-x-2 mb-4">
                    <Sparkles className="h-4 w-4 text-purple-500" />
                    <h4 className="font-semibold text-gray-900 capitalize">
                      {category}
                    </h4>
                  </div>
                  <div className="space-y-3">
                    {categoryExamples.map((example) => (
                      <Card 
                        key={example.id} 
                        className="p-4 cursor-pointer hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-200 border-gray-300/50 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md"
                        onClick={() => onSelectExample(example)}
                      >
                        <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                          <Code className="h-3 w-3 mr-2 text-blue-500" />
                          {example.title}
                        </h5>
                        <p className="text-sm text-gray-600 mb-3">
                          {example.description}
                        </p>
                        <div className="bg-gradient-to-r from-gray-100/80 to-gray-200/80 rounded-lg p-2">
                          <code className="text-xs text-gray-800 font-mono">
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
