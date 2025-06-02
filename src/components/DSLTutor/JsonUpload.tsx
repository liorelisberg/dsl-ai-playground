import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Upload, File, X, Check, FileJson, AlertCircle, CheckCircle2, Trash2 } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

export interface JsonMetadata {
  filename: string;
  sizeBytes: number;
  topLevelKeys: string[];
  uploadTime: string;
}

interface JsonUploadProps {
  onUploadSuccess?: (metadata: JsonMetadata) => void;
  onUploadError?: (error: string) => void;
  onClearFile?: () => void;
  currentFile?: JsonMetadata | null;
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
  currentFile
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [preview, setPreview] = useState<string>('');
  const [error, setError] = useState<string>('');

  const onDrop = useCallback(async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    // Handle rejections
    if (fileRejections.length > 0) {
      const rejection = fileRejections[0];
      if (rejection.errors.some((e: FileRejectionError) => e.code === 'file-too-large')) {
        const errorMsg = 'File size exceeds 50KB limit';
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
        const errorMsg = 'Please upload a valid JSON file';
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

    setIsUploading(true);
    setUploadProgress(0);
    setError('');

    try {
      // Read file for preview and validation
      const text = await file.text();
      let parsedJson;
      
      try {
        parsedJson = JSON.parse(text);
      } catch (parseError) {
        throw new Error('Invalid JSON format');
      }

      // Generate preview
      const previewText = JSON.stringify(parsedJson, null, 2);
      setPreview(previewText.length > 300 ? previewText.substring(0, 300) + '...' : previewText);

      // Simulate upload progress
      for (let i = 0; i <= 90; i += 10) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      // Upload file to backend
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload-json', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      setUploadProgress(100);

      // Create metadata object
      const metadata: JsonMetadata = {
        filename: file.name,
        sizeBytes: result.sizeBytes,
        topLevelKeys: result.topLevelKeys || [],
        uploadTime: new Date().toISOString()
      };

      onUploadSuccess?.(metadata);
      
      toast({
        title: "File Uploaded Successfully",
        description: `${file.name} (${(result.sizeBytes / 1024).toFixed(1)}KB) with ${result.topLevelKeys?.length || 0} top-level keys`,
      });

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Upload failed';
      setError(errorMsg);
      onUploadError?.(errorMsg);
      toast({
        title: "Upload Failed",
        description: errorMsg,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  }, [onUploadSuccess, onUploadError]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: { 'application/json': ['.json'] },
    maxFiles: 1,
    maxSize: 50 * 1024, // 50KB
    disabled: isUploading
  });

  const clearFile = () => {
    setPreview('');
    setError('');
    onClearFile?.();
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center">
          <FileJson className="h-5 w-5 mr-2 text-blue-500" />
          JSON Data Context
        </h3>
        {currentFile && (
          <Badge variant="secondary" className="text-xs">
            Context Active
          </Badge>
        )}
      </div>
      
      {currentFile ? (
        // File uploaded state
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center space-x-3">
              <Check className="h-5 w-5 text-green-600" />
              <div>
                <div className="font-medium text-green-900 dark:text-green-100">
                  {currentFile.filename}
                </div>
                <div className="text-sm text-green-700 dark:text-green-300">
                  {(currentFile.sizeBytes / 1024).toFixed(1)}KB • {currentFile.topLevelKeys?.length || 0} keys
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={clearFile}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
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
                : isDragReject
                  ? 'border-red-400 bg-red-50 dark:bg-red-950'
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
                    ? 'Uploading...' 
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
                <div>Maximum file size: 50KB</div>
                <div>Supported format: .json files only</div>
              </div>
            </div>
          </div>

          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Upload Progress</span>
                <span className="font-medium">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {preview && !error && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Preview:
              </div>
              <pre className="text-xs bg-gray-50 dark:bg-gray-800 p-3 rounded-md overflow-x-auto border">
                {preview}
              </pre>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}; 