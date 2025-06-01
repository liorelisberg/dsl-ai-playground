import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Eye, Trash2, Activity, Clock, User } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { API_CONFIG } from '@/config/api';

interface ContextData {
  sessionId: string;
  interactions: number;
  jsonContext: {
    filename?: string;
    keys: string[];
    sizeBytes: number;
  } | null;
  recentTopics: string[];
  userProfile: {
    sessionCount: number;
    preferredComplexity: 'basic' | 'intermediate' | 'advanced';
    totalQueries: number;
    conversationTopics: string[];
  };
  conversationContext: {
    currentTopic: string;
    topicDepth: number;
    flowType: string;
    conceptsDiscussed: number;
    satisfaction: number;
  };
  semanticStats: {
    totalDocuments: number;
    lastUpdate: string;
  };
  lastActivity: string;
}

interface ContextStatusProps {
  onClearContext?: () => void;
}

export const ContextStatus: React.FC<ContextStatusProps> = ({ onClearContext }) => {
  const [contextData, setContextData] = useState<ContextData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  const fetchContextStatus = async () => {
    try {
      const response = await fetch(API_CONFIG.ENDPOINTS.CHAT_STATUS, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setContextData(data);
      }
    } catch (error) {
      console.error('Failed to fetch context status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearContext = async () => {
    try {
      const response = await fetch(`${API_CONFIG.ENDPOINTS.CHAT_STATUS}/clear`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        setContextData(null);
        onClearContext?.();
        toast({
          title: "Context Cleared",
          description: "Starting fresh conversation without previous context"
        });
      }
    } catch (error) {
      toast({
        title: "Clear Failed",
        description: "Unable to clear context",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchContextStatus();
    // Refresh context status every 2 minutes
    const interval = setInterval(fetchContextStatus, 120000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="flex items-center space-x-2">
          <Brain className="h-4 w-4 animate-pulse text-blue-500" />
          <span className="text-sm text-gray-600">Loading context...</span>
        </div>
      </Card>
    );
  }

  if (!contextData || contextData.interactions === 0) {
    return (
      <Card className="p-4 border-dashed">
        <div className="flex items-center space-x-2 text-gray-500">
          <Brain className="h-4 w-4" />
          <span className="text-sm">No context available - Starting fresh conversation</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Brain className="h-4 w-4 text-blue-500" />
          <span className="font-medium text-sm">Intelligent Context Active</span>
          <Badge variant="secondary" className="text-xs">
            <Activity className="h-3 w-3 mr-1" />
            {contextData.interactions} interactions
          </Badge>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="h-7 px-2"
          >
            <Eye className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearContext}
            className="h-7 px-2 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Context Summary */}
      <div className="space-y-2">
        {contextData.jsonContext && (
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <span>📄 JSON: {contextData.jsonContext.filename}</span>
            <span>({contextData.jsonContext.keys.length} keys)</span>
          </div>
        )}
        
        <div className="flex items-center space-x-2 text-xs text-gray-600">
          <span>🎯 Level: {contextData.userProfile.preferredComplexity}</span>
          <span>•</span>
          <Clock className="h-3 w-3" />
          <span>{new Date(contextData.lastActivity).toLocaleTimeString()}</span>
        </div>

        {contextData.recentTopics.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {contextData.recentTopics.slice(0, 3).map((topic, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {topic}
              </Badge>
            ))}
            {contextData.recentTopics.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{contextData.recentTopics.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Detailed View */}
      {showDetails && (
        <div className="pt-2 border-t space-y-2 text-xs">
          <div>
            <span className="font-medium">Session ID:</span>
            <span className="ml-1 font-mono text-gray-600">{contextData.sessionId.slice(0, 8)}</span>
          </div>
          
          {contextData.jsonContext && (
            <div>
              <span className="font-medium">JSON Keys:</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {contextData.jsonContext.keys.slice(0, 6).map((key, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {key}
                  </Badge>
                ))}
                {contextData.jsonContext.keys.length > 6 && (
                  <Badge variant="outline" className="text-xs">
                    +{contextData.jsonContext.keys.length - 6} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          <div>
            <span className="font-medium">Conversation Style:</span>
            <span className="ml-1">{contextData.conversationContext.currentTopic}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* User Profile Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <User className="h-4 w-4" />
              User Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Sessions:</span>
              <span className="font-medium">{contextData.userProfile.sessionCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Complexity:</span>
              <span className="font-medium">{contextData.userProfile.preferredComplexity}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Queries:</span>
              <span className="font-medium">{contextData.userProfile.totalQueries}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Topics:</span>
              <span className="font-medium">{contextData.userProfile.conversationTopics.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </Card>
  );
}; 