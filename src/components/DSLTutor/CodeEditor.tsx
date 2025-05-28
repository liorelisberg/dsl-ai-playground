
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Play, Book, Search } from 'lucide-react';
import { evaluateExpression } from '../../services/dslService';
import { useToast } from '@/hooks/use-toast';
import ExamplesDrawer from './ExamplesDrawer';

const CodeEditor = () => {
  const [code, setCode] = useState('// Enter your DSL expression here\nuser.name.toUpperCase()');
  const [sampleInput, setSampleInput] = useState('{"user": {"name": "john doe", "age": 30}}');
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const { toast } = useToast();

  const handleExecute = async () => {
    setIsLoading(true);
    try {
      const response = await evaluateExpression(code, sampleInput);
      setResult(response.result || response.error || 'No result');
    } catch (error) {
      console.error('Execution error:', error);
      setResult('Error: Failed to execute expression');
      toast({
        title: "Execution Error",
        description: "Failed to execute the expression. Please check your syntax.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleSelect = (example: any) => {
    setCode(example.expression);
    setSampleInput(example.sampleInput);
    setShowExamples(false);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Editor Header */}
      <div className="border-b border-gray-200 p-4 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Expression Workbench</h2>
          <p className="text-sm text-gray-600">Write and test DSL expressions</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowExamples(true)}
          >
            <Book className="h-4 w-4 mr-2" />
            Examples
          </Button>
          <Button
            onClick={handleExecute}
            disabled={isLoading}
            size="sm"
          >
            <Play className="h-4 w-4 mr-2" />
            {isLoading ? 'Running...' : 'Run'}
          </Button>
        </div>
      </div>

      {/* Code Editor */}
      <div className="flex-1 p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            DSL Expression
          </label>
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter your DSL expression here..."
            className="font-mono text-sm min-h-[200px]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sample Input (JSON)
          </label>
          <Textarea
            value={sampleInput}
            onChange={(e) => setSampleInput(e.target.value)}
            placeholder="Enter sample JSON input..."
            className="font-mono text-sm min-h-[100px]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Result
          </label>
          <Card className="p-4 bg-gray-50 min-h-[100px]">
            <pre className="text-sm font-mono whitespace-pre-wrap">
              {result || 'Click "Run" to execute your expression'}
            </pre>
          </Card>
        </div>
      </div>

      <ExamplesDrawer
        isOpen={showExamples}
        onClose={() => setShowExamples(false)}
        onSelectExample={handleExampleSelect}
      />
    </div>
  );
};

export default CodeEditor;
