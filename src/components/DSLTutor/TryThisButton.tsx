import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Play, Code, ChevronDown } from 'lucide-react';
import { ExpressionPair, generatePairTitle } from '@/lib/dslPairDetection';

interface TryThisButtonProps {
  pairs: ExpressionPair[];
  onTransfer: (pair: ExpressionPair) => void;
  isTransferring?: boolean;
}

/**
 * Adaptive button component that changes UI based on number of pairs:
 * - 0 pairs: No button shown
 * - 1 pair: Single "Try This" button  
 * - 2+ pairs: Dropdown menu
 */
const TryThisButton: React.FC<TryThisButtonProps> = ({ 
  pairs, 
  onTransfer, 
  isTransferring = false 
}) => {
  
  // No pairs detected
  if (pairs.length === 0) {
    return null;
  }

  // Single pair - simple button
  if (pairs.length === 1) {
    return (
      <Button 
        size="sm" 
        onClick={() => onTransfer(pairs[0])}
        disabled={isTransferring}
        className="bg-indigo-600 hover:bg-indigo-700 text-white"
      >
        <Play className="h-3 w-3 mr-1" />
        Try This
      </Button>
    );
  }

  // 2+ pairs - dropdown menu
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          size="sm"
          disabled={isTransferring}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <Play className="h-3 w-3 mr-1" />
          Try Examples
          <ChevronDown className="h-3 w-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {pairs.map((pair, index) => (
          <DropdownMenuItem 
            key={index}
            onClick={() => onTransfer(pair)}
            className="cursor-pointer"
          >
            <Code className="h-4 w-4 mr-2" />
            {generatePairTitle(pair, pairs)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TryThisButton; 