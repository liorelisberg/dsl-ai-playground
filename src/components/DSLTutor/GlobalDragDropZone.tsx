import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card } from "@/components/ui/card";
import { Upload, FileJson, X } from 'lucide-react';
import { JsonMetadata } from './JsonUpload';
import { toast } from "@/hooks/use-toast";

interface GlobalDragDropZoneProps {
  onUploadSuccess: (metadata: JsonMetadata) => void;
  onUploadError: (error: string) => void;
  onDragComplete: () => void;
}

export const GlobalDragDropZone: React.FC<GlobalDragDropZoneProps> = ({
  onUploadSuccess,
  onUploadError,
  onDragComplete
}) => {
  const onDrop = useCallback(async (acceptedFiles: File[], fileRejections: any[]) => {
    onDragComplete(); // Hide the modal immediately
    
    // Handle rejections
    if (fileRejections.length > 0) {
      const rejection = fileRejections[0];
      if (rejection.errors.some((e: any) => e.code === 'file-too-large')) {
        const errorMsg = 'File size exceeds 256KB limit';
        onUploadError(errorMsg);
        return;
      }
      if (rejection.errors.some((e: any) => e.code === 'file-invalid-type')) {
        const errorMsg = 'Please upload a valid JSON file';
        onUploadError(errorMsg);
        return;
      }
    }

    const file = acceptedFiles[0];
    if (!file) return;

    try {
      // Validate JSON format
      const text = await file.text();
      let parsedJson;
      
      try {
        parsedJson = JSON.parse(text);
      } catch (parseError) {
        throw new Error('Invalid JSON format');
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

      // Create metadata object
      const metadata: JsonMetadata = {
        filename: file.name,
        sizeBytes: result.sizeBytes,
        topLevelKeys: result.topLevelKeys || [],
        uploadTime: new Date().toISOString()
      };

      onUploadSuccess(metadata);
      
      toast({
        title: "File Uploaded Successfully",
        description: `${file.name} (${(result.sizeBytes / 1024).toFixed(1)}KB) with ${result.topLevelKeys?.length || 0} top-level keys`,
      });

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Upload failed';
      onUploadError(errorMsg);
      toast({
        title: "Upload Failed",
        description: errorMsg,
        variant: "destructive"
      });
    }
  }, [onUploadSuccess, onUploadError, onDragComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/json': ['.json'] },
    maxFiles: 1,
    maxSize: 256 * 1024, // 256KB
    noClick: true, // Disable click to open file dialog
    noKeyboard: true // Disable keyboard interaction
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onDragComplete}
      />
      
      {/* Modal Content */}
      <Card 
        {...getRootProps()}
        className="relative z-10 w-96 h-64 m-4 flex flex-col items-center justify-center border-2 border-dashed border-blue-400 bg-blue-50 dark:bg-blue-950 hover:border-blue-500 transition-colors"
      >
        <input {...getInputProps()} />
        
        {/* Close Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDragComplete();
          }}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-white/20 transition-colors"
        >
          <X className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </button>

        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <FileJson className="h-16 w-16 text-blue-500" />
              <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                <Upload className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
              {isDragActive ? 'Drop your JSON file here!' : 'Drop JSON file anywhere'}
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Upload data to get context-aware DSL suggestions
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              Maximum file size: 256KB • JSON format only
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}; 