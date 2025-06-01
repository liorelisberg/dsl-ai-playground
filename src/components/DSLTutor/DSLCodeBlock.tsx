import React, { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { extractExpressionPairs, getPairStatistics, ExpressionPair } from '@/lib/dslPairDetection';
import TryThisButton from './TryThisButton';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from 'next-themes';
import { Hash, Play, Database, Copy, Check, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DSLCodeBlockProps {
  content: string;
  onChatToParser?: (expression: string, input: string) => void;
}

/**
 * Parse content to extract and render structured DSL examples
 */
function parseStructuredContent(content: string) {
  const blocks: Array<{
    type: 'text' | 'dsl-example';
    content: string;
    title?: string;
    input?: string;
    expression?: string;
    result?: string;
  }> = [];

  // Split content by title markers
  const titlePattern = /\$\{title\}([\s\S]*?)\$\{title\}/g;
  let lastIndex = 0;
  let match;
  let exampleIndex = 0;

  while ((match = titlePattern.exec(content)) !== null) {
    // Add text before this example
    if (match.index > lastIndex) {
      const precedingText = content.slice(lastIndex, match.index).trim();
      if (precedingText) {
        blocks.push({ type: 'text', content: precedingText });
      }
    }

    // Find corresponding input, expression, and result blocks after this title
    const afterTitleContent = content.slice(match.index + match[0].length);
    
    const inputMatch = afterTitleContent.match(/\$\{inputBlock\}([\s\S]*?)\$\{inputBlock\}/);
    const expressionMatch = afterTitleContent.match(/\$\{expressionBlock\}([\s\S]*?)\$\{expressionBlock\}/);
    const resultMatch = afterTitleContent.match(/\$\{resultBlock\}([\s\S]*?)\$\{resultBlock\}/);

    if (inputMatch && expressionMatch) {
      blocks.push({
        type: 'dsl-example',
        content: '',
        title: match[1].trim(),
        input: inputMatch[1].trim(),
        expression: expressionMatch[1].trim(),
        result: resultMatch ? resultMatch[1].trim() : undefined
      });

      // Update lastIndex to after the last block (result if present, otherwise expression)
      const lastBlock = resultMatch || expressionMatch;
      const lastBlockEnd = match.index + match[0].length + 
        afterTitleContent.indexOf(lastBlock[0]) + lastBlock[0].length;
      lastIndex = lastBlockEnd;
    } else {
      // If no matching blocks, treat as regular text
      lastIndex = match.index + match[0].length;
    }
    
    exampleIndex++;
  }

  // Add remaining text
  if (lastIndex < content.length) {
    const remainingText = content.slice(lastIndex).trim();
    if (remainingText) {
      blocks.push({ type: 'text', content: remainingText });
    }
  }

  return blocks;
}

/**
 * Custom component that renders structured DSL examples with proper code blocks
 */
const DSLCodeBlock: React.FC<DSLCodeBlockProps> = ({ 
  content, 
  onChatToParser 
}) => {
  const [isTransferring, setIsTransferring] = useState(false);
  const [copiedBlocks, setCopiedBlocks] = useState<{[key: string]: boolean}>({});
  const { theme } = useTheme();
  
  // Extract pairs from message content (for Try buttons)
  const pairs = extractExpressionPairs(content);
  const stats = getPairStatistics(content);
  
  // Parse structured content
  const blocks = parseStructuredContent(content);
  const hasStructuredExamples = blocks.some(block => block.type === 'dsl-example');
  
  // Debug logging
  if (stats.hasMarkers) {
    console.log('🔍 DSL Detection:', {
      pairs: pairs.length,
      structuredBlocks: blocks.filter(b => b.type === 'dsl-example').length,
      inputBlocks: stats.inputBlocks,
      expressionBlocks: stats.expressionBlocks,
      resultBlocks: stats.resultBlocks,
      titleBlocks: stats.titleBlocks,
      isBalanced: stats.isBalanced
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
      // Transfer to parser (no validation - let parser handle errors)
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

        if (block.type === 'dsl-example') {
          return (
            <div key={index} className="bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
              {/* Example Title */}
              <div className="px-4 py-3 bg-indigo-50 dark:bg-indigo-900/30 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center space-x-2">
                  <Hash className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <h4 className="font-medium text-slate-900 dark:text-slate-100">
                    {block.title}
                  </h4>
                </div>
              </div>

              <div className="space-y-0">
                {/* Sample Input */}
                <div className="border-b border-slate-200 dark:border-slate-700">
                  <div className="px-4 py-2 bg-slate-100 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-600 relative">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Database className="h-3 w-3 text-slate-600 dark:text-slate-400" />
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                          Sample Input
                        </span>
                      </div>
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
                  <div className="p-0">
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
                      {block.input || ''}
                    </SyntaxHighlighter>
                  </div>
                </div>

                {/* ZEN Expression */}
                <div className={block.result ? "border-b border-slate-200 dark:border-slate-700" : ""}>
                  <div className="px-4 py-2 bg-slate-100 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-600 relative">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Play className="h-3 w-3 text-slate-600 dark:text-slate-400" />
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                          ZEN Expression
                        </span>
                      </div>
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
                  <div className="p-0">
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
                      {block.expression || ''}
                    </SyntaxHighlighter>
                  </div>
                </div>

                {/* Expected Result (if available) */}
                {block.result && (
                  <div>
                    <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 border-b border-slate-200 dark:border-slate-600 relative">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300 uppercase tracking-wide">
                            Expected Result
                          </span>
                        </div>
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
                    <div className="p-0">
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
                        {block.result}
                      </SyntaxHighlighter>
                    </div>
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