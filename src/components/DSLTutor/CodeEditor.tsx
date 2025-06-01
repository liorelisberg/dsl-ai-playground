import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Play, Book, Code2, Sparkles, Shuffle, Minimize2, Maximize2, Copy, GripVertical, Eye, FileText, MessageCircle } from 'lucide-react';
import { evaluateExpression } from '../../services/dslService';
import { useToast } from '@/hooks/use-toast';
import ExamplesDrawer from './ExamplesDrawer';
import { allExamples, Example } from '../../examples';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import JsonView from '@uiw/react-json-view';
import { useTheme } from 'next-themes';

interface CodeEditorProps {
  onParserToChat?: (expression: string, input: string, result: string, isSuccess: boolean) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ onParserToChat }) => {
  const [code, setCode] = useState('// Enter your DSL expression here\nupper(user.name)');
  const [sampleInput, setSampleInput] = useState('{"user": {"name": "john doe", "age": 30}}');
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const [lastRandomExampleId, setLastRandomExampleId] = useState<string | null>(null);
  const [isPrettyFormat, setIsPrettyFormat] = useState(true);
  const [isPrettyInputFormat, setIsPrettyInputFormat] = useState(true);
  
  // New state to track evaluation status for "Ask About This" button
  const [hasEvaluated, setHasEvaluated] = useState(false);
  const [lastEvaluationSuccess, setLastEvaluationSuccess] = useState(false);
  
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
  
  const { toast } = useToast();

  // Theme detection
  const { theme } = useTheme();
  
  // Helper function to get JSON viewer theme based on current theme
  const getJsonViewerTheme = (): React.CSSProperties => {
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
  };

  // Helper function to safely parse JSON
  const safeParseJSON = (jsonString: string) => {
    try {
      return JSON.parse(jsonString);
    } catch {
      return null;
    }
  };

  // Helper function to check if content is valid JSON
  const isValidJSON = (content: string): boolean => {
    if (!content || content.trim() === '') return false;
    try {
      JSON.parse(content);
      return true;
    } catch {
      return false;
    }
  };

  // Helper function to format result based on prettify toggle
  const formatResult = (rawResult: string): string => {
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
  };

  const handleExecute = async () => {
    setIsLoading(true);
    try {
      const response = await evaluateExpression(code, sampleInput);
      setResult(response.result || response.error || 'No result');
      setHasEvaluated(true);
      // Success if no error property exists
      const isSuccess = !response.error;
      setLastEvaluationSuccess(isSuccess);
      if (onParserToChat) {
        onParserToChat(code, sampleInput, response.result || response.error || 'No result', isSuccess);
      }
    } catch (error) {
      console.error('Execution error:', error);
      setResult('Error: Failed to execute expression');
      setHasEvaluated(true);
      setLastEvaluationSuccess(false);
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
    // Reset evaluation state when loading new example
    setHasEvaluated(false);
    setLastEvaluationSuccess(false);
    setResult('');
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
      toast({
        title: "Copy Failed",
        description: "Unable to copy result to clipboard",
        variant: "destructive"
      });
    }
  };

  // Handler for "Ask About This" button
  const handleAskAboutThis = () => {
    if (!onParserToChat || !hasEvaluated) return;

    onParserToChat(code, sampleInput, result, lastEvaluationSuccess);
    
    // Show feedback toast
    toast({
      title: "Sent to Chat",
      description: lastEvaluationSuccess 
        ? "Asking AI to explain your working expression" 
        : "Asking AI to debug your failing expression",
    });
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
      toast({
        title: "Copy Failed",
        description: "Unable to copy sample input to clipboard",
        variant: "destructive"
      });
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
      toast({
        title: "Copy Failed",
        description: "Unable to copy path to clipboard",
        variant: "destructive"
      });
    }
  };

  // Helper function to format and generate JSON paths
  const getJsonPath = (keyPath: (string | number)[]): string => {
    if (keyPath.length === 0) return '$';
    return '$.' + keyPath.map(key => 
      typeof key === 'number' ? `[${key}]` : key
    ).join('.');
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
      <div className="flex-1 p-6 flex flex-col gap-6 overflow-hidden" ref={containerRef}>
        {/* DSL Expression - 1/5 of available height */}
        <div className="flex flex-col min-h-0 relative" style={{ height: `${dslHeight}px` }}>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center">
            <Sparkles className="h-4 w-4 mr-2 text-emerald-500" />
            DSL Expression
          </label>
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
                        onClick={() => setSampleInputCollapsed(prev => Math.max(0, prev - 1))}
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
                        onClick={() => setSampleInputCollapsed(prev => prev + 1)}
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
                  style={getJsonViewerTheme()}
                  collapsed={sampleInputCollapsed}
                  enableClipboard={false}
                  displayDataTypes={false}
                >
                  {/* Enhanced String Rendering for URLs and Images */}
                  <JsonView.String
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
                        onClick={() => setResultCollapsed(prev => Math.max(0, prev - 1))}
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
                        onClick={() => setResultCollapsed(prev => prev + 1)}
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
              
              {/* Ask About This Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleAskAboutThis}
                    disabled={!hasEvaluated || !onParserToChat}
                    className="h-7 w-7 p-0 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {!hasEvaluated 
                      ? 'Run expression first to enable this feature'
                      : lastEvaluationSuccess 
                        ? 'Ask AI to explain this working expression' 
                        : 'Ask AI to debug this failing expression'
                    }
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          <Card className="border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 shadow-lg rounded-2xl ring-1 ring-slate-200 dark:ring-slate-700 flex-1 min-h-0 relative">
            {resultJsonMode && isValidJSON(result) ? (
              <div className="p-4 h-full overflow-auto pb-8">
                <JsonView 
                  value={safeParseJSON(result)} 
                  style={getJsonViewerTheme()}
                  collapsed={resultCollapsed}
                  enableClipboard={false}
                  displayDataTypes={false}
                >
                  {/* Enhanced String Rendering for URLs and Images */}
                  <JsonView.String
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
};

export default CodeEditor;
