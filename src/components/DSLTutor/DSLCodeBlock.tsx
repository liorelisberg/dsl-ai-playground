import React, { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { extractExpressionPairs, getPairStatistics, ExpressionPair } from '@/lib/dslPairDetection';
import TryThisButton from './TryThisButton';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from 'next-themes';
import { Hash, Play, Database, Copy, Check, CheckCircle, ChevronDown, ChevronRight, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ParserFactory, convertToLegacyFormat } from '@/lib/contentParser';

interface DSLCodeBlockProps {
  content: string;
  onChatToParser?: (expression: string, input: string) => void;
}

// Add type for block states
type BlockState = 'collapsed' | 'preview' | 'expanded';

/**
 * Custom component that renders structured DSL examples with proper code blocks
 */
const DSLCodeBlock: React.FC<DSLCodeBlockProps> = ({ 
  content, 
  onChatToParser 
}) => {
  const [isTransferring, setIsTransferring] = useState(false);
  const [copiedBlocks, setCopiedBlocks] = useState<{[key: string]: boolean}>({});
  const [collapsedBlocks, setCollapsedBlocks] = useState<{[key: string]: BlockState}>({});
  const [initialized, setInitialized] = useState(false);
  const { theme } = useTheme();
  
  // Extract pairs from message content (for Try buttons)
  const pairs = extractExpressionPairs(content);
  const stats = getPairStatistics(content);
  
  // Parse structured content using the new generic parser system
  const parser = ParserFactory.createDSLParser();
  const blocks = convertToLegacyFormat(parser.parse(content));
  const hasStructuredExamples = blocks.some(block => block.type === 'dsl-example' || block.type === 'title');
  
  // Helper function to determine default state based on content length
  const getDefaultBlockState = (content: string): BlockState => {
    if (!content) return 'collapsed';
    return content.length <= 100 ? 'expanded' : 'preview';
  };
  
  // Helper function to get display content based on state
  const getDisplayContent = (content: string, state: BlockState): string => {
    if (!content) return '';
    if (state === 'expanded') return content;
    if (state === 'preview' && content.length > 100) {
      return content.substring(0, 100) + '...';
    }
    return content;
  };
  
  // Helper function to get state label
  const getStateLabel = (content: string, state: BlockState): string => {
    if (!content) return '';
    if (state === 'collapsed') {
      return `(collapsed - ${content.split('\n').length} lines)`;
    }
    if (state === 'preview' && content.length > 100) {
      return `(preview - Total ${content.split('\n').length} lines, ${content.length} chars)`;
    }
    return '';
  };
  
  // Initialize collapsed state for all blocks with smart defaults
  React.useEffect(() => {
    // Only initialize once when we have blocks and haven't initialized yet
    if (!initialized && blocks.length > 0) {
      const initialState: {[key: string]: BlockState} = {};
      blocks.forEach((block, index) => {
        if (block.type === 'dsl-example') {
          // Set smart defaults based on content length
          initialState[`input-${index}`] = getDefaultBlockState(block.input || '');
          initialState[`expression-${index}`] = getDefaultBlockState(block.expression || '');
          if (block.result) {
            initialState[`result-${index}`] = getDefaultBlockState(block.result);
          }
        }
      });
      setCollapsedBlocks(initialState);
      setInitialized(true);
      
      // Debug logging
      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 DSLCodeBlock: Initialized smart collapsed state:', initialState);
      }
    }
  }, [blocks, initialized]);
  
  // Debug logging
  if (stats.hasMarkers && process.env.NODE_ENV === 'development') {
    console.log('🔍 DSL Detection:', {
      pairs: pairs.length,
      structuredBlocks: blocks.filter(b => b.type === 'dsl-example').length,
      inputBlocks: stats.inputBlocks,
      expressionBlocks: stats.expressionBlocks,
      resultBlocks: stats.resultBlocks,
      titleBlocks: stats.titleBlocks,
      isBalanced: stats.isBalanced,
      collapsedBlocks,
      initialized
    });
  }

  const copyToClipboard = async (text: string, blockId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedBlocks(prev => ({ ...prev, [blockId]: true }));
      
      toast({
        title: "Copied!",
        description: "Code has been copied to your clipboard.",
      });
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedBlocks(prev => ({ ...prev, [blockId]: false }));
      }, 2000);
    } catch (error) {
      console.error('Copy failed:', error);
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard.",
        variant: "destructive"
      });
    }
  };

  const toggleBlockCollapse = (blockId: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 DSLCodeBlock: Toggling block:', blockId);
    }
    
    setCollapsedBlocks(prev => {
      const currentState = prev[blockId] || 'collapsed';
      let nextState: BlockState;
      
      // Cycle through states: collapsed -> preview -> expanded -> collapsed
      if (currentState === 'collapsed') {
        nextState = 'preview';
      } else if (currentState === 'preview') {
        nextState = 'expanded';
      } else {
        nextState = 'collapsed';
      }
      
      const newState = {
        ...prev,
        [blockId]: nextState
      };
      
      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 DSLCodeBlock: State transition:', currentState, '->', nextState);
        console.log('🔧 DSLCodeBlock: New collapsed state:', newState);
      }
      
      return newState;
    });
  };

  const toggleAllBlocks = (exampleIndex: number, collapse: boolean) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 DSLCodeBlock: Toggle all blocks for example', exampleIndex, 'collapse:', collapse);
    }
    
    setCollapsedBlocks(prev => {
      const targetState: BlockState = collapse ? 'collapsed' : 'expanded';
      const newState = {
        ...prev,
        [`input-${exampleIndex}`]: targetState,
        [`expression-${exampleIndex}`]: targetState,
        [`result-${exampleIndex}`]: targetState,
      };
      
      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 DSLCodeBlock: New collapsed state after toggle all:', newState);
      }
      
      return newState;
    });
  };

  const handleTransfer = async (pair: ExpressionPair) => {
    if (!onChatToParser) {
      toast({
        title: "Transfer Not Available",
        description: "Chat to parser communication is not configured.",
        variant: "destructive"
      });
      return;
    }

    setIsTransferring(true);
    
    try {
      // Transfer to parser directly - system prompt should ensure correct regex syntax
      onChatToParser(pair.expression, pair.input);
      
      toast({
        title: "Expression Transferred!",
        description: `Sent to Expression Workbench. Click "Run" to test it.`,
      });
      
    } catch (error) {
      console.error('Transfer error:', error);
      toast({
        title: "Transfer Failed",
        description: "Failed to transfer expression to parser.",
        variant: "destructive"
      });
    } finally {
      setIsTransferring(false);
    }
  };

  // If no structured examples detected, show content normally with markdown
  if (!hasStructuredExamples) {
    return (
      <div className="space-y-3">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
        
        {/* Try buttons for any detected pairs */}
        {pairs.length > 0 && (
          <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-slate-600">
            <TryThisButton 
              pairs={pairs}
              onTransfer={handleTransfer}
              isTransferring={isTransferring}
            />
          </div>
        )}
      </div>
    );
  }

  // Render structured content with proper code blocks
  return (
    <div className="space-y-4">
      {blocks.map((block, index) => {
        if (block.type === 'text') {
          return (
            <div key={index}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {block.content}
              </ReactMarkdown>
            </div>
          );
        }

        if (block.type === 'title') {
          return (
            <div key={index} className="py-3">
              <div className="flex items-center space-x-3">
                <Hash className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {block.title}
                </h3>
              </div>
            </div>
          );
        }

        if (block.type === 'dsl-example') {
          const hasResult = Boolean(block.result);
          const inputCollapsed = collapsedBlocks[`input-${index}`];
          const expressionCollapsed = collapsedBlocks[`expression-${index}`];
          const resultCollapsed = collapsedBlocks[`result-${index}`];
          const allCollapsed = inputCollapsed === 'collapsed' && expressionCollapsed === 'collapsed' && (hasResult ? resultCollapsed === 'collapsed' : true);
          
          return (
            <div key={index} className="bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
              {/* Example Title with Global Toggle */}
              <div className="px-4 py-3 bg-indigo-50 dark:bg-indigo-900/30 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Hash className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    <h4 className="font-medium text-slate-900 dark:text-slate-100">
                      {block.title}
                    </h4>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleAllBlocks(index, !allCollapsed)}
                      className="h-7 px-2 text-xs hover:bg-indigo-100 dark:hover:bg-indigo-800"
                      title={allCollapsed ? "Expand all blocks" : "Collapse all blocks"}
                    >
                      {allCollapsed ? (
                        <>
                          <Maximize2 className="h-3 w-3 mr-1" />
                          Expand All
                        </>
                      ) : (
                        <>
                          <Minimize2 className="h-3 w-3 mr-1" />
                          Collapse All
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-0">
                {/* Sample Input */}
                <div className="border-b border-slate-200 dark:border-slate-700">
                  <div className="px-4 py-2 bg-slate-100 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-600">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Database className="h-3 w-3 text-slate-600 dark:text-slate-400" />
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                          Sample Input
                        </span>
                        {inputCollapsed !== 'collapsed' && (
                          <span className="text-xs text-slate-500 dark:text-slate-400 italic">
                            {getStateLabel(block.input || '', inputCollapsed)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleBlockCollapse(`input-${index}`)}
                          className="h-6 w-6 p-0 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                          title={
                            inputCollapsed === 'collapsed' 
                              ? "Show preview" 
                              : inputCollapsed === 'preview' 
                                ? "Expand full content" 
                                : "Collapse block"
                          }
                        >
                          {inputCollapsed === 'collapsed' ? (
                            <ChevronRight className="h-3 w-3 text-slate-500 dark:text-slate-400" />
                          ) : (
                            <ChevronDown className="h-3 w-3 text-slate-500 dark:text-slate-400" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(block.input || '', `input-${index}`)}
                          className="h-6 w-6 p-0 hover:bg-slate-200 dark:hover:bg-slate-600"
                        >
                          {copiedBlocks[`input-${index}`] ? (
                            <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                          ) : (
                            <Copy className="h-3 w-3 text-slate-500 dark:text-slate-400" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                  {inputCollapsed !== 'collapsed' && (
                    <div className="p-0 transition-all duration-200 ease-in-out">
                      <SyntaxHighlighter
                        language="json"
                        style={theme === 'dark' ? vscDarkPlus : prism}
                        customStyle={{
                          margin: 0,
                          fontSize: '0.875rem',
                          backgroundColor: 'transparent',
                        }}
                        showLineNumbers={false}
                      >
                        {getDisplayContent(block.input || '', inputCollapsed)}
                      </SyntaxHighlighter>
                    </div>
                  )}
                </div>

                {/* ZEN Expression */}
                <div className={block.result ? "border-b border-slate-200 dark:border-slate-700" : ""}>
                  <div className="px-4 py-2 bg-slate-100 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-600">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Play className="h-3 w-3 text-slate-600 dark:text-slate-400" />
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                          ZEN Expression
                        </span>
                        {expressionCollapsed !== 'collapsed' && (
                          <span className="text-xs text-slate-500 dark:text-slate-400 italic">
                            {getStateLabel(block.expression || '', expressionCollapsed)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleBlockCollapse(`expression-${index}`)}
                          className="h-6 w-6 p-0 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                          title={
                            expressionCollapsed === 'collapsed' 
                              ? "Show preview" 
                              : expressionCollapsed === 'preview' 
                                ? "Expand full content" 
                                : "Collapse block"
                          }
                        >
                          {expressionCollapsed === 'collapsed' ? (
                            <ChevronRight className="h-3 w-3 text-slate-500 dark:text-slate-400" />
                          ) : (
                            <ChevronDown className="h-3 w-3 text-slate-500 dark:text-slate-400" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(block.expression || '', `expression-${index}`)}
                          className="h-6 w-6 p-0 hover:bg-slate-200 dark:hover:bg-slate-600"
                        >
                          {copiedBlocks[`expression-${index}`] ? (
                            <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                          ) : (
                            <Copy className="h-3 w-3 text-slate-500 dark:text-slate-400" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                  {expressionCollapsed !== 'collapsed' && (
                    <div className="p-0 transition-all duration-200 ease-in-out">
                      <SyntaxHighlighter
                        language="javascript"
                        style={theme === 'dark' ? vscDarkPlus : prism}
                        customStyle={{
                          margin: 0,
                          fontSize: '0.875rem',
                          backgroundColor: 'transparent',
                        }}
                        showLineNumbers={false}
                      >
                        {getDisplayContent(block.expression || '', expressionCollapsed)}
                      </SyntaxHighlighter>
                    </div>
                  )}
                </div>

                {/* Expected Result (if available) */}
                {block.result && (
                  <div>
                    <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 border-b border-slate-200 dark:border-slate-600">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300 uppercase tracking-wide">
                            Expected Result
                          </span>
                          {resultCollapsed !== 'collapsed' && (
                            <span className="text-xs text-emerald-600 dark:text-emerald-400 italic">
                              {getStateLabel(block.result || '', resultCollapsed)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleBlockCollapse(`result-${index}`)}
                            className="h-6 w-6 p-0 hover:bg-emerald-100 dark:hover:bg-emerald-800 transition-colors"
                            title={
                              resultCollapsed === 'collapsed' 
                                ? "Show preview" 
                                : resultCollapsed === 'preview' 
                                  ? "Expand full content" 
                                  : "Collapse block"
                            }
                          >
                            {resultCollapsed === 'collapsed' ? (
                              <ChevronRight className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                              <ChevronDown className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(block.result || '', `result-${index}`)}
                            className="h-6 w-6 p-0 hover:bg-emerald-100 dark:hover:bg-emerald-800"
                          >
                            {copiedBlocks[`result-${index}`] ? (
                              <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                            ) : (
                              <Copy className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                    {resultCollapsed !== 'collapsed' && (
                      <div className="p-0 transition-all duration-200 ease-in-out">
                        <SyntaxHighlighter
                          language="json"
                          style={theme === 'dark' ? vscDarkPlus : prism}
                          customStyle={{
                            margin: 0,
                            fontSize: '0.875rem',
                            backgroundColor: 'transparent',
                          }}
                          showLineNumbers={false}
                        >
                          {getDisplayContent(block.result || '', resultCollapsed)}
                        </SyntaxHighlighter>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        }

        return null;
      })}
      
      {/* Try buttons */}
      {pairs.length > 0 && (
        <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-slate-600">
          <TryThisButton 
            pairs={pairs}
            onTransfer={handleTransfer}
            isTransferring={isTransferring}
          />
        </div>
      )}
      
      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && stats.hasMarkers && (
        <div className="text-xs text-slate-500 mt-2">
          Debug: {pairs.length} pairs detected, {blocks.filter(b => b.type === 'dsl-example').length} structured examples, {stats.resultBlocks} results
        </div>
      )}
    </div>
  );
};

export default DSLCodeBlock; 