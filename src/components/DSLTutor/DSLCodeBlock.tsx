import React, { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { extractExpressionPairs, getPairStatistics, ExpressionPair } from '@/lib/dslPairDetection';
import TryThisButton from './TryThisButton';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface DSLCodeBlockProps {
  content: string;
  onChatToParser?: (expression: string, input: string) => void;
}

/**
 * Custom component that wraps around chat message content to detect
 * DSL expression-input pairs and show appropriate "Try This" buttons
 */
const DSLCodeBlock: React.FC<DSLCodeBlockProps> = ({ 
  content, 
  onChatToParser 
}) => {
  const [isTransferring, setIsTransferring] = useState(false);
  
  // Extract pairs from message content
  const pairs = extractExpressionPairs(content);
  const stats = getPairStatistics(content);
  
  // Debug logging
  if (stats.hasMarkers) {
    console.log('🔍 DSL Detection:', {
      pairs: pairs.length,
      inputBlocks: stats.inputBlocks,
      expressionBlocks: stats.expressionBlocks,
      isBalanced: stats.isBalanced
    });
  }

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

  // If no pairs detected, show content normally with markdown
  if (pairs.length === 0) {
    return (
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    );
  }

  // Show content with Try buttons
  return (
    <div className="space-y-3">
      {/* Original content with markdown rendering */}
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
      
      {/* Try buttons */}
      <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-slate-600">
        <TryThisButton 
          pairs={pairs}
          onTransfer={handleTransfer}
          isTransferring={isTransferring}
        />
      </div>
      
      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && stats.hasMarkers && (
        <div className="text-xs text-slate-500 mt-2">
          Debug: {pairs.length} pairs detected ({stats.inputBlocks} inputs, {stats.expressionBlocks} expressions)
        </div>
      )}
    </div>
  );
};

export default DSLCodeBlock; 