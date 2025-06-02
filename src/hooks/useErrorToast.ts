import { useToast } from './use-toast';

export const useErrorToast = () => {
  const { toast } = useToast();

  const showError = (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "destructive"
    });
  };

  const showSuccess = (title: string, description?: string) => {
    toast({
      title,
      description,
    });
  };

  const showExecutionError = (description = "Failed to execute the expression. Please check your syntax.") => {
    showError("Execution Error", description);
  };

  const showCopyError = (description = "Unable to copy to clipboard") => {
    showError("Copy Failed", description);
  };

  const showCopySuccess = (itemName = "Content") => {
    showSuccess("Copied!", `${itemName} copied to clipboard`);
  };

  const showUploadError = (description = "Failed to upload file. Please try again.") => {
    showError("Upload Error", description);
  };

  const showNetworkError = (description = "Network error. Please check your connection.") => {
    showError("Connection Error", description);
  };

  const showValidationError = (description = "Invalid input. Please check your data.") => {
    showError("Validation Error", description);
  };

  return {
    showError,
    showSuccess,
    showExecutionError,
    showCopyError,
    showCopySuccess,
    showUploadError,
    showNetworkError,
    showValidationError
  };
}; 