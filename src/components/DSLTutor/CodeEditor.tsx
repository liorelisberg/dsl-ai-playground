import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Play, Book, Code2, Sparkles, Shuffle } from 'lucide-react';
import { evaluateExpression } from '../../services/dslService';
import { useToast } from '@/hooks/use-toast';
import ExamplesDrawer from './ExamplesDrawer';
import { allExamples, Example } from '../../examples';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const CodeEditor = () => {
  const [code, setCode] = useState('// Enter your DSL expression here\nupper(user.name)');
  const [sampleInput, setSampleInput] = useState('{"user": {"name": "john doe", "age": 30}}');
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const [lastRandomExampleId, setLastRandomExampleId] = useState<string | null>(null);
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

  const handleExampleSelect = (example: Example) => {
    setCode(example.expression);
    setSampleInput(example.sampleInput);
    setShowExamples(false);
  };

  const handleRandomExample = () => {
    if (allExamples.length === 0) {
      toast({
        title: "No Examples Available",
        description: "No examples are currently loaded.",
        variant: "destructive"
      });
      return;
    }

    // Filter out the last selected example to avoid consecutive duplicates
    const availableExamples = allExamples.filter(example => 
      allExamples.length === 1 || example.id !== lastRandomExampleId
    );

    // Select a random example
    const randomIndex = Math.floor(Math.random() * availableExamples.length);
    const randomExample = availableExamples[randomIndex];

    // Load the example
    setCode(randomExample.expression);
    setSampleInput(randomExample.sampleInput);
    setLastRandomExampleId(randomExample.id);

    // Show success feedback
    toast({
      title: "Random Example Loaded",
      description: `${randomExample.title} (${randomExample.category})`,
    });

    // Clear previous result to encourage running the new example
    setResult('');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Editor Header */}
      <div className="border-b border-slate-200 dark:border-slate-700 p-6 bg-slate-50 dark:bg-slate-800">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
              <Code2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Expression Workbench</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">Write and test DSL expressions</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRandomExample}
                  className="border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 rounded-full shadow-sm"
                >
                  <Shuffle className="h-4 w-4 mr-2" />
                  Random
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Load a random DSL example for exploration</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowExamples(true)}
                  className="border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 rounded-full shadow-sm"
                >
                  <Book className="h-4 w-4 mr-2" />
                  Examples
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Browse pre-built DSL expression examples</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleExecute}
                  disabled={isLoading}
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg"
                >
                  <Play className="h-4 w-4 mr-2" />
                  {isLoading ? 'Running...' : 'Run'}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Execute DSL expression with sample input</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Code Editor */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center">
            <Sparkles className="h-4 w-4 mr-2 text-emerald-500" />
            DSL Expression
          </label>
          <Card className="border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-lg rounded-2xl">
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter your DSL expression here..."
              className="font-mono text-sm min-h-[200px] border-0 bg-transparent resize-none"
            />
          </Card>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center">
            <Code2 className="h-4 w-4 mr-2 text-indigo-500" />
            Sample Input (JSON)
          </label>
          <Card className="border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-lg rounded-2xl">
            <Textarea
              value={sampleInput}
              onChange={(e) => setSampleInput(e.target.value)}
              placeholder="Enter sample JSON input..."
              className="font-mono text-sm min-h-[120px] border-0 bg-transparent resize-none"
            />
          </Card>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center">
            <Play className="h-4 w-4 mr-2 text-emerald-500" />
            Result
          </label>
          <Card className="border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 shadow-lg rounded-2xl ring-1 ring-slate-200 dark:ring-slate-700">
            <div className="p-6 min-h-[120px]">
              <pre className="text-sm font-mono whitespace-pre-wrap text-slate-800 dark:text-slate-200">
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
