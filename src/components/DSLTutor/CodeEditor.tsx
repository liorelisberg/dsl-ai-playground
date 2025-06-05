import React, { useState, useEffect, useRef, useCallback, useImperativeHandle, forwardRef, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Play, Book, Code2, Sparkles, Shuffle, Minimize2, Maximize2, Copy, GripVertical, Eye, FileText, MessageCircle } from 'lucide-react';
import { evaluateExpression } from '../../services/dslService';
import { useToast } from '@/hooks/use-toast';
import { useErrorToast } from '../../hooks/useErrorToast';
import ExamplesDrawer from './ExamplesDrawer';
import { allExamples, Example } from '../../examples';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import JsonView from '@uiw/react-json-view';
import { useTheme } from 'next-themes';

// Phase 1 Infrastructure Imports
import {
  validateParserContent,
  generateSizeSummary,
  getFlowDescription
} from '@/lib/parserContentAnalysis';
import {
  generatePromptPreview
} from '@/lib/attachmentPromptGenerator';

interface CodeEditorProps {
  onParserToChat?: (expression: string, input: string, result: string, isSuccess: boolean, isEmpty?: boolean) => Promise<void>;
}

export interface CodeEditorRef {
  handleChatTransfer: (expression: string, input: string) => void;
}

const CodeEditor = forwardRef<CodeEditorRef, CodeEditorProps>(({ onParserToChat }, ref) => {
  // Helper function to get a random example for initial load
  const getRandomInitialExample = () => {
    if (allExamples.length === 0) {
      return {
        expression: 'upper(user.name)',
        sampleInput: '{"user": {"name": "john doe", "age": 30}}'
      };
    }
    
    const randomIndex = Math.floor(Math.random() * allExamples.length);
    const randomExample = allExamples[randomIndex];
    
    return {
      expression: randomExample.expression,
      sampleInput: randomExample.sampleInput
    };
  };

  // Get random initial example
  const initialExample = getRandomInitialExample();
  
  const [code, setCode] = useState(initialExample.expression);
  const [sampleInput, setSampleInput] = useState(initialExample.sampleInput);
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const [lastRandomExampleId, setLastRandomExampleId] = useState<string | null>(null);
  const [isPrettyFormat, setIsPrettyFormat] = useState(true);
  const [isPrettyInputFormat, setIsPrettyInputFormat] = useState(true);
  
  // New state to track evaluation status for "Ask About This" button
  const [hasEvaluated, setHasEvaluated] = useState(false);
  const [lastEvaluationSuccess, setLastEvaluationSuccess] = useState(false);
  const [isAskingAI, setIsAskingAI] = useState(false); // New state for AI request loading
  const [explainCooldown, setExplainCooldown] = useState(0); // Cooldown timer in seconds
  
  // JSON Viewer modes
  const [sampleInputJsonMode, setSampleInputJsonMode] = useState(false); // false = text, true = JSON viewer
  const [resultJsonMode, setResultJsonMode] = useState(false); // false = text, true = JSON viewer
  
  // Advanced JSON viewer features
  const [sampleInputCollapsed, setSampleInputCollapsed] = useState(1); // Default collapse level
  const [resultCollapsed, setResultCollapsed] = useState(1); // Default collapse level
  
  // Ref to track available height for calculations
  const containerRef = useRef<HTMLDivElement>(null);
  const [availableHeight, setAvailableHeight] = useState(600); // Default fallback
  
  // Height proportions (percentages of available height)
  const [dslHeightPercent, setDslHeightPercent] = useState(20); // 20%
  const [sampleInputHeightPercent, setSampleInputHeightPercent] = useState(40); // 40% 
  const [resultHeightPercent, setResultHeightPercent] = useState(40); // 40%
  
  const [isDragging, setIsDragging] = useState<'dsl' | 'sampleInput' | 'result' | null>(null);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragStartPercent, setDragStartPercent] = useState(0);
  
  // Calculate actual pixel heights from percentages
  const dslHeight = Math.round((availableHeight * dslHeightPercent) / 100);
  const sampleInputHeight = Math.round((availableHeight * sampleInputHeightPercent) / 100);
  const resultHeight = Math.round((availableHeight * resultHeightPercent) / 100);
  
  // Minimum height is 20% of available height
  const minHeightPercent = 20;
  
  // Refs to avoid stale closures
  const isDraggingRef = useRef<'dsl' | 'sampleInput' | 'result' | null>(null);
  const dragStartYRef = useRef(0);
  const dragStartPercentRef = useRef(0);
  
  // Update refs when state changes
  useEffect(() => {
    isDraggingRef.current = isDragging;
  }, [isDragging]);
  
  useEffect(() => {
    dragStartYRef.current = dragStartY;
  }, [dragStartY]);
  
  useEffect(() => {
    dragStartPercentRef.current = dragStartPercent;
  }, [dragStartPercent]);
  
  // Measure available height dynamically
  useEffect(() => {
    const updateAvailableHeight = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        // Subtract some padding and spacing (estimated 60px for gaps and labels)
        const newAvailableHeight = Math.max(300, rect.height - 60);
        setAvailableHeight(newAvailableHeight);
      }
    };

    // Initial measurement
    updateAvailableHeight();

    // Update on window resize
    window.addEventListener('resize', updateAvailableHeight);
    
    // Use ResizeObserver if available for more accurate container size tracking
    let resizeObserver: ResizeObserver | null = null;
    if (containerRef.current && window.ResizeObserver) {
      resizeObserver = new ResizeObserver(updateAvailableHeight);
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateAvailableHeight);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, []);
  
  // Handle explain button cooldown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (explainCooldown > 0) {
      timer = setTimeout(() => {
        setExplainCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [explainCooldown]);
  
  const { toast } = useToast();
  const errorToast = useErrorToast();

  // Theme detection
  const { theme } = useTheme();
  
  // ========================================================================
  // MEMOIZED VALUES & CALLBACKS - Performance Optimization
  // ========================================================================

  // Memoize theme-dependent JSON viewer styles
  const jsonViewerTheme = useMemo((): React.CSSProperties => {
    const isDark = theme === 'dark';
    
    if (isDark) {
      return {
        '--w-rjv-background-color': 'transparent',
        '--w-rjv-border-left': '0px',
        '--w-rjv-line-color': 'transparent',
        '--w-rjv-font-family': 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
        // Bright, high-contrast colors for dark theme
        '--w-rjv-color': '#e5e7eb', // Light gray for general text
        '--w-rjv-key-string': '#34d399', // Bright emerald for keys
        '--w-rjv-type-string-color': '#fbbf24', // Bright amber for strings
        '--w-rjv-type-int-color': '#60a5fa', // Bright blue for numbers
        '--w-rjv-type-float-color': '#60a5fa', // Bright blue for numbers
        '--w-rjv-type-boolean-color': '#c084fc', // Bright purple for booleans
        '--w-rjv-type-null-color': '#9ca3af', // Medium gray for null
        '--w-rjv-type-undefined-color': '#9ca3af', // Medium gray for undefined
        '--w-rjv-curlybraces-color': '#e5e7eb', // Light gray for braces
        '--w-rjv-brackets-color': '#e5e7eb', // Light gray for brackets
        '--w-rjv-colon-color': '#e5e7eb', // Light gray for colons
        '--w-rjv-arrow-color': '#9ca3af', // Medium gray for arrows
        '--w-rjv-info-color': '#9ca3af', // Medium gray for item counts ("5 items", "2 items")
      } as React.CSSProperties;
    } else {
      return {
        '--w-rjv-background-color': 'transparent',
        '--w-rjv-border-left': '0px',
        '--w-rjv-line-color': 'transparent',
        '--w-rjv-font-family': 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
        '--w-rjv-color': '#374151', // Dark gray for light theme
        '--w-rjv-key-string': '#059669', // Emerald for keys
        '--w-rjv-type-string-color': '#dc2626', // Red for strings
        '--w-rjv-type-int-color': '#2563eb', // Blue for numbers
        '--w-rjv-type-float-color': '#2563eb', // Blue for numbers
        '--w-rjv-type-boolean-color': '#7c3aed', // Purple for booleans
        '--w-rjv-type-null-color': '#6b7280', // Gray for null
      } as React.CSSProperties;
    }
  }, [theme]);

  // Memoize JSON parsing utility functions
  const safeParseJSON = useCallback((jsonString: string) => {
    try {
      return JSON.parse(jsonString);
    } catch {
      return null;
    }
  }, []);

  const isValidJSON = useCallback((content: string): boolean => {
    if (!content || content.trim() === '') return false;
    try {
      JSON.parse(content);
      return true;
    } catch {
      return false;
    }
  }, []);

  // Memoize result formatting function
  const formatResult = useCallback((rawResult: string): string => {
    if (!rawResult || rawResult.trim() === '') {
      return 'Click "Run" to execute your expression';
    }

    // Handle error messages (don't try to format them)
    if (rawResult.startsWith('Error:') || rawResult.startsWith('Invalid')) {
      return rawResult;
    }

    // Try to detect and format JSON
    try {
      const parsed = JSON.parse(rawResult);
      return isPrettyFormat 
        ? JSON.stringify(parsed, null, 2)
        : JSON.stringify(parsed);
    } catch {
      // Not valid JSON, return as-is
      return rawResult;
    }
  }, [isPrettyFormat]);

  // Memoize empty result checker
  const isEmptyResult = useCallback((result: string): boolean => {
    if (!result || result.trim() === '') return true;
    
    // Try to parse as JSON to check for empty structures
    try {
      const parsed = JSON.parse(result);
      
      // Check for various "empty" conditions
      if (parsed === null || parsed === undefined) return true;
      if (Array.isArray(parsed) && parsed.length === 0) return true;
      if (typeof parsed === 'object' && Object.keys(parsed).length === 0) return true;
      if (typeof parsed === 'string' && parsed.trim() === '') return true;
      
      return false;
    } catch {
      // Not JSON, check if it's an empty string
      return result.trim() === '';
    }
  }, []);

  // Memoize AI query information  
  const aiQueryInfo = useMemo(() => {
    if (!hasEvaluated) {
      return {
        type: 'disabled',
        title: 'Run expression first',
        description: 'Execute your expression to enable AI assistance',
        buttonText: 'Ask AI',
        variant: 'ghost' as const,
        message: `Explain this DSL expression: ${code}`
      };
    }

    const isEmpty = isEmptyResult(result);
    
    if (!lastEvaluationSuccess) {
      return {
        type: 'error',
        title: 'Debug Error',
        description: 'Ask AI to help debug this failing expression',
        buttonText: 'Debug',
        variant: 'destructive' as const,
        message: `Debug this failing DSL expression: ${code}`
      };
    }

    if (isEmpty) {
      return {
        type: 'empty',
        title: 'Explain Empty Result',
        description: 'Ask AI why this expression returned an empty result',
        buttonText: 'Why Empty?',
        variant: 'outline' as const,
        message: `This DSL expression returns empty results: ${code}`
      };
    }

    return {
      type: 'success',
      title: 'Explain Expression',
      description: 'Ask AI to explain how this expression works',
      buttonText: 'Explain',
      variant: 'default' as const,
      message: `Explain this working DSL expression: ${code}`
    };
  }, [hasEvaluated, lastEvaluationSuccess, result, code, isEmptyResult]);

  // ========================================================================
  // EXISTING FUNCTIONS (Remove duplicates)
  // ========================================================================

  // Remove the old getJsonViewerTheme function since it's now memoized above
  // Remove the old safeParseJSON function since it's now memoized above  
  // Remove the old isValidJSON function since it's now memoized above
  // Remove the old formatResult function since it's now memoized above
  // Remove the old isEmptyResult function since it's now memoized above
  // Remove the old getAIQueryInfo function since it's now memoized above

  const handleExecute = async () => {
    setIsLoading(true);
    try {
      const response = await evaluateExpression(code, sampleInput);
      setResult(response.result || response.error || 'No result');
      setHasEvaluated(true);
      // Success if no error property exists
      const isSuccess = !response.error;
      setLastEvaluationSuccess(isSuccess);
    } catch (error) {
      console.error('Execution error:', error);
      setResult('Error: Failed to execute expression');
      setHasEvaluated(true);
      setLastEvaluationSuccess(false);
      errorToast.showExecutionError();
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleSelect = (example: Example) => {
    setCode(example.expression);
    setSampleInput(example.sampleInput);
    setShowExamples(false);
    // Reset evaluation state when loading new example
    setHasEvaluated(false);
    setLastEvaluationSuccess(false);
    setResult('');
  };

  const handleRandomExample = () => {
    if (allExamples.length === 0) {
      errorToast.showError("No Examples Available", "No examples are currently loaded.");
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

    // Clear previous result and reset evaluation state
    setResult('');
    setHasEvaluated(false);
    setLastEvaluationSuccess(false);
  };

  const handleSampleInputChange = (value: string) => {
    setSampleInput(value);
  };

  // Copy handlers
  const handleCopyResult = async () => {
    try {
      const textToCopy = formatResult(result);
      await navigator.clipboard.writeText(textToCopy);
      toast({
        title: "Copied!",
        description: "Result copied to clipboard",
      });
    } catch (error) {
      console.error('Copy result error:', error);
      errorToast.showCopyError();
    }
  };

  // Enhanced Ask About This with Phase 1 infrastructure
  const handleAskAboutThis = async () => {
    if (!onParserToChat || !hasEvaluated || explainCooldown > 0) return;

    setIsAskingAI(true);
    
    try {
      // Phase 1: Content validation and analysis
      const validation = validateParserContent(code, sampleInput, result);
      
      if (!validation.isValid) {
        // Show validation errors to user
        toast({
          title: "Content Validation Error",
          description: validation.errors[0],
          variant: "destructive",
          duration: 5000
        });
        return;
      }
      
      // Show warnings if any
      if (validation.warnings.length > 0) {
        validation.warnings.forEach(warning => {
          toast({
            title: "Content Notice",
            description: warning,
            variant: "default",
            duration: 4000
          });
        });
      }
      
      // Determine prompt type for preview
      const promptType = !lastEvaluationSuccess ? 'error' : 
                        isEmptyResult(result) ? 'empty' : 'success';
      
      // Generate user-friendly preview
      const promptPreview = generatePromptPreview(
        promptType,
        validation.analysis.requiresAttachment,
        validation.analysis.inputSize
      );
      
      // Enhanced user feedback with flow information
      const { analysis } = validation;
      const sizeSummary = generateSizeSummary(analysis);
      const flowDescription = getFlowDescription(analysis);
      
      // Call the enhanced parser-to-chat handler
      await onParserToChat(code, sampleInput, result, lastEvaluationSuccess, isEmptyResult(result));
      
      // Success feedback with detailed information
      let toastDescription = promptPreview;
      
      if (analysis.requiresAttachment) {
        toastDescription += `\n\n📊 Content: ${sizeSummary}\n🔄 Flow: ${flowDescription}`;
      } else {
        toastDescription += `\n\n📊 Content: ${sizeSummary} (sent directly)`;
      }
      
      toast({
        title: "Sent to AI Chat",
        description: toastDescription,
        duration: analysis.requiresAttachment ? 6000 : 4000
      });

      // Adaptive cooldown based on content size
      const cooldownTime = analysis.requiresAttachment ? 8 : 5; // Longer cooldown for complex flows
      setExplainCooldown(cooldownTime);
      
    } catch (error) {
      console.error('Enhanced parser-to-chat error:', error);
      
      toast({
        title: "AI Communication Error", 
        description: error instanceof Error 
          ? `Failed to send to AI: ${error.message}`
          : "Failed to communicate with AI. Please try again.",
        variant: "destructive",
        duration: 5000
      });
    } finally {
      setIsAskingAI(false);
    }
  };

  const handleCopySampleInput = async () => {
    try {
      const textToCopy = getDisplayValue();
      await navigator.clipboard.writeText(textToCopy);
      toast({
        title: "Copied!",
        description: "Sample input copied to clipboard",
      });
    } catch (error) {
      console.error('Copy sample input error:', error);
      errorToast.showCopyError();
    }
  };

  const handleCopyExpression = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast({
        title: "Copied!",
        description: "DSL expression copied to clipboard",
      });
    } catch (error) {
      console.error('Copy expression error:', error);
      errorToast.showCopyError();
    }
  };

  // Get display value for sample input (only format if valid JSON and not currently being edited)
  const getDisplayValue = () => {
    if (!sampleInput || sampleInput.trim() === '') {
      return '';
    }
    
    // Try to format only if it's valid JSON
    try {
      const parsed = JSON.parse(sampleInput);
      return isPrettyInputFormat 
        ? JSON.stringify(parsed, null, 2)
        : JSON.stringify(parsed);
    } catch {
      // Not valid JSON, return as-is
      return sampleInput;
    }
  };

  // Resize handlers
  const handleResizeMove = useCallback((event: MouseEvent) => {
    const currentDragging = isDraggingRef.current;
    if (!currentDragging) return;
    
    const deltaY = event.clientY - dragStartYRef.current;
    
    // Convert pixel delta to percentage change
    const deltaPercent = (deltaY / availableHeight) * 100;
    const newPercent = Math.max(minHeightPercent, Math.min(80, dragStartPercentRef.current + deltaPercent)); // Max 80% for any component
    
    if (currentDragging === 'dsl') {
      setDslHeightPercent(Math.round(newPercent));
    } else if (currentDragging === 'sampleInput') {
      setSampleInputHeightPercent(Math.round(newPercent));
    } else if (currentDragging === 'result') {
      setResultHeightPercent(Math.round(newPercent));
    }
  }, [availableHeight, minHeightPercent]);

  const handleResizeEnd = useCallback(() => {
    setIsDragging(null);
    isDraggingRef.current = null;
    document.removeEventListener('mousemove', handleResizeMove);
    document.removeEventListener('mouseup', handleResizeEnd);
  }, [handleResizeMove]);

  const handleResizeStart = useCallback((section: 'dsl' | 'sampleInput' | 'result', event: React.MouseEvent) => {
    event.preventDefault();
    setIsDragging(section);
    isDraggingRef.current = section;
    
    const startY = event.clientY;
    setDragStartY(startY);
    dragStartYRef.current = startY;
    
    let startPercent;
    if (section === 'dsl') {
      startPercent = dslHeightPercent;
    } else if (section === 'sampleInput') {
      startPercent = sampleInputHeightPercent;
    } else if (section === 'result') {
      startPercent = resultHeightPercent;
    } else {
      startPercent = 20;
    }
    
    setDragStartPercent(startPercent);
    dragStartPercentRef.current = startPercent;
    
    // Add global mouse event listeners
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
  }, [dslHeightPercent, sampleInputHeightPercent, resultHeightPercent, handleResizeMove, handleResizeEnd]);

  // Cleanup event listeners on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
    };
  }, [handleResizeMove, handleResizeEnd]);

  // Resize handle component
  const ResizeHandle = ({ section }: { section: 'dsl' | 'sampleInput' | 'result' }) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className="absolute bottom-1 right-1 w-5 h-5 cursor-ns-resize hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center rounded opacity-60 hover:opacity-100 transition-all duration-200 z-10"
          onMouseDown={(e) => {
            handleResizeStart(section, e);
          }}
        >
          <GripVertical className="h-3 w-3 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300" />
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>Drag vertically to resize this section</p>
      </TooltipContent>
    </Tooltip>
  );

  // Helper function to copy JSON path to clipboard
  const handleCopyPath = async (path: string) => {
    try {
      await navigator.clipboard.writeText(path);
      toast({
        title: "Path Copied!",
        description: `JSON path: ${path}`,
      });
    } catch (error) {
      console.error('Copy path error:', error);
      errorToast.showCopyError();
    }
  };

  // Helper function to format and generate JSON paths
  const getJsonPath = (keyPath: (string | number)[]): string => {
    if (keyPath.length === 0) return '$';
    return '$.' + keyPath.map(key => 
      typeof key === 'number' ? `[${key}]` : key
    ).join('.');
  };

  // Use useImperativeHandle to expose handleChatTransfer method
  useImperativeHandle(ref, () => ({
    handleChatTransfer: (expression: string, input: string) => {
      // Transfer expression and input from chat to parser directly
      // System prompt should ensure AI generates correct single backslashes for ZEN DSL
      setCode(expression);
      setSampleInput(input);
      
      // Reset evaluation state when loading new content from chat
      setHasEvaluated(false);
      setLastEvaluationSuccess(false);
      setResult('');
    },
  }));

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
      <div className="flex-1 p-6 flex flex-col gap-6 overflow-hidden" ref={containerRef}>
        {/* DSL Expression - 1/5 of available height */}
        <div className="flex flex-col min-h-0 relative" style={{ height: `${dslHeight}px` }}>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center">
              <Sparkles className="h-4 w-4 mr-2 text-emerald-500" />
              DSL Expression
            </label>
            <div className="flex items-center space-x-2">
              {/* Copy Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyExpression}
                    className="h-7 w-7 p-0 hover:bg-slate-200 dark:hover:bg-slate-700"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy DSL expression to clipboard</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          <Card className="border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-lg rounded-2xl flex-1 min-h-0 relative">
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter your DSL expression here..."
              className="font-mono text-sm border-0 bg-transparent resize-none h-full pb-8"
            />
            <ResizeHandle section="dsl" />
          </Card>
        </div>

        {/* Sample Input (JSON) - 2/5 of available height */}
        <div className="flex flex-col min-h-0 relative" style={{ height: `${sampleInputHeight}px` }}>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center">
            <Code2 className="h-4 w-4 mr-2 text-indigo-500" />
            Sample Input (JSON)
          </label>
            <div className="flex items-center space-x-2">
              {/* Collapse Controls for Sample Input JSON Viewer - leftmost when active */}
              {isValidJSON(sampleInput) && sampleInputJsonMode && (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSampleInputCollapsed(prev => prev + 1)}
                        className="h-7 w-7 p-0 hover:bg-slate-200 dark:hover:bg-slate-700"
                      >
                        <Maximize2 className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Expand more levels</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSampleInputCollapsed(prev => Math.max(0, prev - 1))}
                        className="h-7 w-7 p-0 hover:bg-slate-200 dark:hover:bg-slate-700"
                      >
                        <Minimize2 className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Collapse more levels</p>
                    </TooltipContent>
                  </Tooltip>
                </>
              )}
              
              {/* JSON Viewer Toggle for Sample Input */}
              {isValidJSON(sampleInput) && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSampleInputJsonMode(!sampleInputJsonMode)}
                      className="h-7 w-7 p-0 hover:bg-slate-200 dark:hover:bg-slate-700"
                    >
                      {sampleInputJsonMode ? (
                        <FileText className="h-3.5 w-3.5" />
                      ) : (
                        <Eye className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{sampleInputJsonMode ? 'Switch to text editor' : 'Switch to JSON viewer'}</p>
                  </TooltipContent>
                </Tooltip>
              )}
              
              {/* Pretty/Compact Format Toggle - disabled in JSON viewer mode */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsPrettyInputFormat(!isPrettyInputFormat)}
                    disabled={sampleInputJsonMode}
                    className="h-7 w-7 p-0 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPrettyInputFormat ? (
                      <Minimize2 className="h-3.5 w-3.5" />
                    ) : (
                      <Maximize2 className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{sampleInputJsonMode ? 'Not available in JSON viewer mode' : (isPrettyInputFormat ? 'Switch to compact format' : 'Switch to pretty format')}</p>
                </TooltipContent>
              </Tooltip>
              
              {/* Copy Button - rightmost */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopySampleInput}
                    className="h-7 w-7 p-0 hover:bg-slate-200 dark:hover:bg-slate-700"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy sample input to clipboard</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          <Card className="border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-lg rounded-2xl flex-1 min-h-0 relative">
            {sampleInputJsonMode && isValidJSON(sampleInput) ? (
              <div className="p-4 h-full overflow-auto pb-8">
                <JsonView 
                  value={safeParseJSON(sampleInput)} 
                  style={jsonViewerTheme}
                  collapsed={sampleInputCollapsed}
                  enableClipboard={false}
                  displayDataTypes={false}
                >
                  {/* Enhanced String Rendering for URLs and Images */}
                  <JsonView.String
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    render={({ children, ...props }, { type, value, keyName }) => {
                      if (type === 'value') {
                        // Check if it's a URL
                        const isUrl = typeof value === 'string' && /^https?:\/\//.test(value);
                        const isImageUrl = typeof value === 'string' && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(value);
                        
                        if (isImageUrl) {
                          return (
                            <div className="inline-flex items-center gap-2">
                              <span {...props}>{children}</span>
                              <img 
                                src={value} 
                                alt="Preview" 
                                className="h-8 w-8 object-cover rounded border border-slate-200 dark:border-slate-600"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            </div>
                          );
                        }
                        
                        if (isUrl) {
                          return (
                            <a 
                              href={value} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-blue-600 dark:text-blue-400 hover:underline"
                              {...props}
                            >
                              {children}
                            </a>
                          );
                        }
                      }
                      return <span {...props}>{children}</span>;
                    }}
                  />
                  
                  {/* Row Click for Path Copying */}
                  <JsonView.Row
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    render={(props, { keyName, value, keys = [] }) => {
                      return (
                        <div
                          {...props}
                          className={`${props.className || ''} hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer rounded px-1`}
                          title={`Click to copy path: ${getJsonPath(keys)}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            const path = getJsonPath(keys);
                            handleCopyPath(path);
                          }}
                        />
                      );
                    }}
                  />
                </JsonView>
              </div>
            ) : (
            <Textarea
                value={getDisplayValue()}
                onChange={(e) => handleSampleInputChange(e.target.value)}
              placeholder="Enter sample JSON input..."
                className="font-mono text-sm border-0 bg-transparent resize-none h-full pb-8"
            />
            )}
            <ResizeHandle section="sampleInput" />
          </Card>
        </div>

        {/* Result - 2/5 of available height */}
        <div className="flex flex-col min-h-0" style={{ height: `${resultHeight}px` }}>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center">
            <Play className="h-4 w-4 mr-2 text-emerald-500" />
            Result
          </label>
            <div className="flex items-center space-x-2">
              {/* Collapse Controls for Result JSON Viewer - leftmost when active */}
              {isValidJSON(result) && resultJsonMode && (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setResultCollapsed(prev => prev + 1)}
                        className="h-7 w-7 p-0 hover:bg-slate-200 dark:hover:bg-slate-700"
                      >
                        <Maximize2 className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Expand more levels</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setResultCollapsed(prev => Math.max(0, prev - 1))}
                        className="h-7 w-7 p-0 hover:bg-slate-200 dark:hover:bg-slate-700"
                      >
                        <Minimize2 className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Collapse more levels</p>
                    </TooltipContent>
                  </Tooltip>
                </>
              )}
              
              {/* JSON Viewer Toggle for Result */}
              {isValidJSON(result) && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setResultJsonMode(!resultJsonMode)}
                      className="h-7 w-7 p-0 hover:bg-slate-200 dark:hover:bg-slate-700"
                    >
                      {resultJsonMode ? (
                        <FileText className="h-3.5 w-3.5" />
                      ) : (
                        <Eye className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{resultJsonMode ? 'Switch to text view' : 'Switch to JSON viewer'}</p>
                  </TooltipContent>
                </Tooltip>
              )}
              
              {/* Pretty/Compact Format Toggle - disabled in JSON viewer mode */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsPrettyFormat(!isPrettyFormat)}
                    disabled={resultJsonMode}
                    className="h-7 w-7 p-0 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPrettyFormat ? (
                      <Minimize2 className="h-3.5 w-3.5" />
                    ) : (
                      <Maximize2 className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{resultJsonMode ? 'Not available in JSON viewer mode' : (isPrettyFormat ? 'Switch to compact format' : 'Switch to pretty format')}</p>
                </TooltipContent>
              </Tooltip>
              
              {/* Copy Button - rightmost */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyResult}
                    className="h-7 w-7 p-0 hover:bg-slate-200 dark:hover:bg-slate-700"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy result to clipboard</p>
                </TooltipContent>
              </Tooltip>
              
              {/* Ask About This Button - Enhanced with Smart Logic */}
              {hasEvaluated && onParserToChat && (
                <div className="flex items-center space-x-2">
                  {/* Separator line */}
                  <div className="w-px h-4 bg-slate-300 dark:bg-slate-600"></div>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={handleAskAboutThis}
                        disabled={isAskingAI || explainCooldown > 0}
                        size="sm"
                        variant={aiQueryInfo.variant}
                        className={`
                          flex items-center space-x-1.5 px-3 py-1.5 h-8 rounded-lg transition-all duration-200
                          ${aiQueryInfo.type === 'error' 
                            ? 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:text-red-300 dark:border-red-800' 
                            : aiQueryInfo.type === 'empty'
                              ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:hover:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800'
                              : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800'}
                          ${isAskingAI ? 'animate-pulse' : ''}
                          ${explainCooldown > 0 ? 'opacity-60 cursor-not-allowed' : ''}
                        `}
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        <span className="text-xs font-medium">
                          {isAskingAI 
                            ? 'Asking...' 
                            : explainCooldown > 0 
                              ? `Wait ${explainCooldown}s`
                              : aiQueryInfo.buttonText
                          }
                        </span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-medium">
                        {explainCooldown > 0 
                          ? `Please wait ${explainCooldown} seconds` 
                          : aiQueryInfo.title
                        }
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {explainCooldown > 0 
                          ? 'Cooldown prevents rapid requests to protect the AI service'
                          : aiQueryInfo.description
                        }
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              )}
              
              {/* Hint for unevaluated expressions */}
              {!hasEvaluated && (
                <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                  <MessageCircle className="h-3 w-3 mr-1 opacity-50" />
                  <span>Run to enable AI help</span>
                </div>
              )}
            </div>
          </div>
          <Card className="border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 shadow-lg rounded-2xl ring-1 ring-slate-200 dark:ring-slate-700 flex-1 min-h-0 relative">
            {resultJsonMode && isValidJSON(result) ? (
              <div className="p-4 h-full overflow-auto pb-8">
                <JsonView 
                  value={safeParseJSON(result)} 
                  style={jsonViewerTheme}
                  collapsed={resultCollapsed}
                  enableClipboard={false}
                  displayDataTypes={false}
                >
                  {/* Enhanced String Rendering for URLs and Images */}
                  <JsonView.String
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    render={({ children, ...props }, { type, value, keyName }) => {
                      if (type === 'value') {
                        // Check if it's a URL
                        const isUrl = typeof value === 'string' && /^https?:\/\//.test(value);
                        const isImageUrl = typeof value === 'string' && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(value);
                        
                        if (isImageUrl) {
                          return (
                            <div className="inline-flex items-center gap-2">
                              <span {...props}>{children}</span>
                              <img 
                                src={value} 
                                alt="Preview" 
                                className="h-8 w-8 object-cover rounded border border-slate-200 dark:border-slate-600"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            </div>
                          );
                        }
                        
                        if (isUrl) {
                          return (
                            <a 
                              href={value} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-blue-600 dark:text-blue-400 hover:underline"
                              {...props}
                            >
                              {children}
                            </a>
                          );
                        }
                      }
                      return <span {...props}>{children}</span>;
                    }}
                  />
                  
                  {/* Row Click for Path Copying */}
                  <JsonView.Row
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    render={(props, { keyName, value, keys = [] }) => {
                      return (
                        <div
                          {...props}
                          className={`${props.className || ''} hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer rounded px-1`}
                          title={`Click to copy path: ${getJsonPath(keys)}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            const path = getJsonPath(keys);
                            handleCopyPath(path);
                          }}
                        />
                      );
                    }}
                  />
                </JsonView>
              </div>
            ) : (
              <div className="p-6 h-full overflow-auto pb-8">
              <pre className="text-sm font-mono whitespace-pre-wrap text-slate-800 dark:text-slate-200">
                  {formatResult(result)}
              </pre>
            </div>
            )}
            <ResizeHandle section="result" />
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
});

CodeEditor.displayName = 'CodeEditor';

export default CodeEditor;
