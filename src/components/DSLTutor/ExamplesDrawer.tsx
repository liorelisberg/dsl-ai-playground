
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { X, Search } from 'lucide-react';
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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 p-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold">DSL Examples</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search examples..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Examples List */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading examples...</div>
          ) : (
            <div className="space-y-6">
              {Object.entries(categorizedExamples).map(([category, categoryExamples]) => (
                <div key={category}>
                  <h4 className="font-semibold text-gray-900 mb-3 capitalize">
                    {category}
                  </h4>
                  <div className="space-y-3">
                    {categoryExamples.map((example) => (
                      <Card 
                        key={example.id} 
                        className="p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => onSelectExample(example)}
                      >
                        <h5 className="font-medium text-gray-900 mb-1">
                          {example.title}
                        </h5>
                        <p className="text-sm text-gray-600 mb-2">
                          {example.description}
                        </p>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {example.expression}
                        </code>
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
