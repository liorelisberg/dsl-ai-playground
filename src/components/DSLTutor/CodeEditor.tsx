
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Play, Book, Code2, Sparkles } from 'lucide-react';
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
    <div className="flex flex-col h-full">
      {/* Editor Header */}
      <div className="border-b border-gray-200/50 p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <Code2 className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Expression Workbench</h2>
              <p className="text-sm text-gray-600">Write and test DSL expressions</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExamples(true)}
              className="border-gray-300/50 bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm"
            >
              <Book className="h-4 w-4 mr-2" />
              Examples
            </Button>
            <Button
              onClick={handleExecute}
              disabled={isLoading}
              size="sm"
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg"
            >
              <Play className="h-4 w-4 mr-2" />
              {isLoading ? 'Running...' : 'Run'}
            </Button>
          </div>
        </div>
      </div>

      {/* Code Editor */}
      <div className="flex-1 p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
            <Sparkles className="h-4 w-4 mr-2 text-purple-500" />
            DSL Expression
          </label>
          <Card className="border-gray-300/50 bg-white/80 backdrop-blur-sm shadow-sm">
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter your DSL expression here..."
              className="font-mono text-sm min-h-[200px] border-0 bg-transparent resize-none"
            />
          </Card>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
            <Code2 className="h-4 w-4 mr-2 text-blue-500" />
            Sample Input (JSON)
          </label>
          <Card className="border-gray-300/50 bg-white/80 backdrop-blur-sm shadow-sm">
            <Textarea
              value={sampleInput}
              onChange={(e) => setSampleInput(e.target.value)}
              placeholder="Enter sample JSON input..."
              className="font-mono text-sm min-h-[120px] border-0 bg-transparent resize-none"
            />
          </Card>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
            <Play className="h-4 w-4 mr-2 text-green-500" />
            Result
          </label>
          <Card className="border-gray-300/50 bg-gradient-to-br from-gray-50/80 to-gray-100/80 backdrop-blur-sm shadow-sm">
            <div className="p-4 min-h-[120px]">
              <pre className="text-sm font-mono whitespace-pre-wrap text-gray-800">
                {result || 'Click "Run" to execute your expression'}
              </pre>
            </div>
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
