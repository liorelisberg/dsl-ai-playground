import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Upload, File, X, Check, FileJson, AlertCircle, Settings, Zap } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { 
  UPLOAD_CONFIG, 
  validateJsonFile, 
  validateJsonContent,
  compressJson,
  formatFileSize,
  estimateTokenization
} from '@/config/upload';

export interface JsonMetadata {
  filename: string;
  sizeBytes: number;
  topLevelKeys: string[];
  uploadTime: string;
  complexity?: 'simple' | 'moderate' | 'complex';
  estimatedTokens?: number;
  depth?: number;
  compressionRatio?: number;
}

interface JsonUploadProps {
  onUploadSuccess?: (metadata: JsonMetadata) => void;
  onUploadError?: (error: string) => void;
  onClearFile?: () => void;
  currentFile?: JsonMetadata | null;
  mode?: 'full' | 'compressed'; // Processing mode
  onModeChange?: (mode: 'full' | 'compressed') => void;
}

interface FileRejectionError {
  code: string;
  message: string;
}

interface FileRejection {
  file: File;
  errors: FileRejectionError[];
}

export const JsonUpload: React.FC<JsonUploadProps> = ({ 
  onUploadSuccess, 
  onUploadError,
  onClearFile,
  currentFile,
  mode = 'compressed',
  onModeChange
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [preview, setPreview] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [warnings, setWarnings] = useState<string[]>([]);
  const [processingMode, setProcessingMode] = useState<'full' | 'compressed'>(mode);
  const [jsonAnalysis, setJsonAnalysis] = useState<{
    original: unknown;
    compressed?: string;
    tokenEstimates: Record<string, { tokens: number; overhead: number; description: string }>;
  } | null>(null);

  // Update internal mode when prop changes
  useEffect(() => {
    setProcessingMode(mode);
  }, [mode]);

  const handleModeChange = (newMode: 'full' | 'compressed') => {
    setProcessingMode(newMode);
    onModeChange?.(newMode);
    
    // Show different preview based on mode
    if (jsonAnalysis) {
      updatePreviewForMode(newMode);
    }
  };

  const updatePreviewForMode = useCallback((mode: 'full' | 'compressed') => {
    if (!jsonAnalysis) return;

    let content: string;
    switch (mode) {
      case 'compressed':
        content = jsonAnalysis.compressed || '';
        break;
      default:
        content = JSON.stringify(jsonAnalysis.original, null, 2);
    }

    setPreview(content.length > 500 ? content.substring(0, 500) + '...' : content);
  }, [jsonAnalysis]);

  const onDrop = useCallback(async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    // Handle rejections
    if (fileRejections.length > 0) {
      const rejection = fileRejections[0];
      if (rejection.errors.some((e: FileRejectionError) => e.code === 'file-too-large')) {
        const errorMsg = UPLOAD_CONFIG.json.errorMessages.sizeExceeded;
        setError(errorMsg);
        onUploadError?.(errorMsg);
        toast({
          title: "File Too Large",
          description: errorMsg,
          variant: "destructive"
        });
        return;
      }
      if (rejection.errors.some((e: FileRejectionError) => e.code === 'file-invalid-type')) {
        const errorMsg = UPLOAD_CONFIG.json.errorMessages.invalidType;
        setError(errorMsg);
        onUploadError?.(errorMsg);
        toast({
          title: "Invalid File Type",
          description: errorMsg,
          variant: "destructive"
        });
        return;
      }
    }

    const file = acceptedFiles[0];
    if (!file) return;

    // Basic file validation
    const validation = validateJsonFile(file);
    if (!validation.isValid) {
      const errorMsg = validation.errors[0];
      setError(errorMsg);
      onUploadError?.(errorMsg);
      toast({
        title: "Upload Error",
        description: errorMsg,
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError('');
    setWarnings([]);

    try {
      // Read and validate JSON content
      const text = await file.text();
      const contentValidation = await validateJsonContent(text);

      if (!contentValidation.isValid) {
        throw new Error(contentValidation.errors[0]);
      }

      // Show warnings if any
      if (contentValidation.warnings.length > 0) {
        setWarnings(contentValidation.warnings);
        toast({
          title: "Validation Warnings",
          description: contentValidation.warnings[0],
          variant: "default"
        });
      }

      setUploadProgress(30);

      // Generate different representations
      const parsedJson = contentValidation.parsedJson!;

      setUploadProgress(50);

      // Generate compressed version
      const compressionResult = compressJson(parsedJson, 'structured');

      setUploadProgress(70);

      // Calculate token estimates for all modes
      const tokenEstimates = {
        full: estimateTokenization(text, 'full'),
        compressed: estimateTokenization(compressionResult.compressed, 'compressed')
      };

      // Store analysis for preview switching
      const analysis = {
        original: parsedJson,
        compressed: compressionResult.compressed,
        tokenEstimates
      };
      setJsonAnalysis(analysis);

      setUploadProgress(90);

      // Create metadata object
      const metadata: JsonMetadata = {
        filename: file.name,
        sizeBytes: file.size,
        topLevelKeys: contentValidation.metadata.topLevelKeys,
        uploadTime: new Date().toISOString(),
        complexity: contentValidation.metadata.complexity,
        estimatedTokens: tokenEstimates[processingMode].tokens,
        depth: contentValidation.metadata.depth,
        compressionRatio: compressionResult.compressionRatio
      };

      // Update preview for current mode
      updatePreviewForMode(processingMode);

      setUploadProgress(100);

      // Complete upload
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        onUploadSuccess?.(metadata);
        
        toast({
          title: "Upload Successful",
          description: `${file.name} (${formatFileSize(file.size)}) processed successfully`,
          variant: "default"
        });
      }, 500);

    } catch (error) {
      setIsUploading(false);
      setUploadProgress(0);
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setError(errorMessage);
      onUploadError?.(errorMessage);
      
      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive"
      });
    }
  }, [onUploadSuccess, onUploadError, processingMode, updatePreviewForMode]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json']
    },
    maxSize: UPLOAD_CONFIG.json.maxSizeBytes,
    multiple: false
  });

  const clearFile = () => {
    setPreview('');
    setError('');
    setWarnings([]);
    setJsonAnalysis(null);
    onClearFile?.();
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center">
          <FileJson className="h-5 w-5 mr-2 text-blue-500" />
          JSON Data Context
        </h3>
        <div className="flex items-center space-x-2">
          {currentFile && (
            <Badge variant="secondary" className="text-xs">
              Context Active
            </Badge>
          )}
          {jsonAnalysis && (
            <Badge variant="outline" className="text-xs">
              {processingMode} mode
            </Badge>
          )}
        </div>
      </div>

      {/* Processing Mode Selector */}
      {(currentFile || jsonAnalysis) && (
        <div className="flex items-center space-x-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <Settings className="h-4 w-4 text-slate-600" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Processing Mode:</span>
          <div className="flex space-x-1">
            {(['full', 'compressed'] as const).map((modeOption) => (
              <Button
                key={modeOption}
                variant={processingMode === modeOption ? "default" : "ghost"}
                size="sm"
                onClick={() => handleModeChange(modeOption)}
                className="text-xs h-7"
              >
                {modeOption === 'full' && <File className="h-3 w-3 mr-1" />}
                {modeOption === 'compressed' && <Zap className="h-3 w-3 mr-1" />}
                {modeOption}
                {jsonAnalysis && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    ~{jsonAnalysis.tokenEstimates[modeOption]?.tokens || 0}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      {currentFile ? (
        // File uploaded state with enhanced info
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center space-x-3">
              <Check className="h-5 w-5 text-green-600" />
              <div>
                <div className="font-medium text-green-900 dark:text-green-100">
                  {currentFile.filename}
                </div>
                <div className="text-sm text-green-700 dark:text-green-300 flex items-center space-x-2">
                  <span>{formatFileSize(currentFile.sizeBytes)}</span>
                  <span>•</span>
                  <span>{currentFile.topLevelKeys?.length || 0} keys</span>
                  {currentFile.complexity && (
                    <>
                      <span>•</span>
                      <Badge variant="outline" className="text-xs">
                        {currentFile.complexity}
                      </Badge>
                    </>
                  )}
                  {currentFile.estimatedTokens && (
                    <>
                      <span>•</span>
                      <span>~{currentFile.estimatedTokens} tokens</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={clearFile}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Enhanced metadata display */}
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <div className="font-medium mb-1">Available Keys:</div>
            <div className="flex flex-wrap gap-1">
              {(currentFile.topLevelKeys || []).slice(0, 10).map((key, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {key}
                </Badge>
              ))}
              {(currentFile.topLevelKeys?.length || 0) > 10 && (
                <Badge variant="outline" className="text-xs">
                  +{(currentFile.topLevelKeys?.length || 0) - 10} more
                </Badge>
              )}
            </div>

            {/* Processing stats */}
            {(currentFile.depth || currentFile.compressionRatio) && (
              <div className="mt-2 p-2 bg-slate-50 dark:bg-slate-800 rounded text-xs space-y-1">
                {currentFile.depth && (
                  <div>Nesting depth: {currentFile.depth} levels</div>
                )}
                {currentFile.compressionRatio && (
                  <div>Compression ratio: {(currentFile.compressionRatio * 100).toFixed(1)}%</div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        // Upload interface
        <div className="space-y-4">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
              isDragActive 
                ? 'border-blue-400 bg-blue-50 dark:bg-blue-950' 
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <input {...getInputProps()} />
            
            <div className="space-y-4">
              <div className="flex justify-center">
                {isUploading ? (
                  <div className="h-12 w-12 rounded-full border-4 border-blue-200 border-t-blue-500 animate-spin" />
                ) : (
                  <Upload className={`h-12 w-12 ${
                    isDragActive ? 'text-blue-500' : 'text-gray-400'
                  }`} />
                )}
              </div>
              
              <div>
                <p className="text-base font-medium text-gray-900 dark:text-gray-100 mb-2">
                  {isUploading 
                    ? 'Processing & Validating...' 
                    : isDragActive 
                      ? 'Drop your JSON file here!' 
                      : 'Drag & drop a JSON file here'
                  }
                </p>
                {!isUploading && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    or <span className="text-blue-500 hover:text-blue-600 font-medium">click to select</span>
                  </p>
                )}
              </div>
              
              <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                <div>{UPLOAD_CONFIG.json.helpText.detailed}</div>
                <div>Comprehensive validation • Compression analysis</div>
              </div>
            </div>
          </div>

          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Processing Progress</span>
                <span className="font-medium">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
              <div className="text-xs text-gray-500 text-center">
                Validating → Compression Analysis → Complete
              </div>
            </div>
          )}

          {/* Warnings */}
          {warnings.length > 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  {warnings.map((warning, index) => (
                    <div key={index}>{warning}</div>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Errors */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Preview */}
          {preview && !error && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Preview ({processingMode} mode):
                </div>
                {jsonAnalysis && (
                  <Badge variant="outline" className="text-xs">
                    ~{jsonAnalysis.tokenEstimates[processingMode]?.tokens} tokens
                  </Badge>
                )}
              </div>
              <pre className="text-xs bg-gray-50 dark:bg-gray-800 p-3 rounded-md overflow-x-auto border max-h-40">
                {preview}
              </pre>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}; 