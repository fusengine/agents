---
title: File Upload Form with Preview
description: Form component with file input handling, image preview, type and size validation, and upload progress tracking
category: forms
tags:
  - file-upload
  - forms
  - validation
  - preview
  - progress
stack: React
language: TypeScript
difficulty: intermediate
---

## Overview

Complete file upload form component with:
- File input with drag-and-drop support
- Image preview capability
- File type validation (images only)
- File size validation (max 5MB)
- Upload progress state management
- Error handling and user feedback

## Component Code

### FileUploadForm.tsx

```typescript
import React, { useCallback, useState } from 'react';

interface FileUploadFormProps {
  /** Callback when file is successfully validated and ready to upload */
  onFileSelect: (file: File, preview: string) => void;
  /** Maximum file size in bytes (default: 5MB) */
  maxSize?: number;
  /** Accepted file types (default: image types) */
  acceptedTypes?: string[];
}

interface UploadState {
  /** Currently selected file or null */
  file: File | null;
  /** Preview URL for image files */
  preview: string | null;
  /** Current upload progress (0-100) */
  progress: number;
  /** Error message if validation fails */
  error: string | null;
  /** Whether upload is in progress */
  isUploading: boolean;
}

/**
 * File upload form component with validation and preview
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const handleFileSelect = (file: File, preview: string) => {
 *     console.log('Ready to upload:', file.name)
 *   }
 *   return <FileUploadForm onFileSelect={handleFileSelect} />
 * }
 * ```
 */
export const FileUploadForm: React.FC<FileUploadFormProps> = ({
  onFileSelect,
  maxSize = 5 * 1024 * 1024, // 5MB default
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
}) => {
  const [uploadState, setUploadState] = useState<UploadState>({
    file: null,
    preview: null,
    progress: 0,
    error: null,
    isUploading: false,
  });

  const [isDragActive, setIsDragActive] = useState(false);

  /**
   * Validates file against size and type restrictions
   *
   * @param file - File to validate
   * @returns Error message or null if valid
   */
  const validateFile = useCallback(
    (file: File): string | null => {
      // Check file type
      if (!acceptedTypes.includes(file.type)) {
        return `Invalid file type. Accepted: ${acceptedTypes.join(', ')}`;
      }

      // Check file size
      if (file.size > maxSize) {
        const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
        return `File size must not exceed ${maxSizeMB}MB`;
      }

      return null;
    },
    [acceptedTypes, maxSize]
  );

  /**
   * Creates a preview URL for image files
   *
   * @param file - Image file to preview
   * @returns Promise resolving to preview data URL
   */
  const generatePreview = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === 'string') {
          resolve(result);
        } else {
          reject(new Error('Failed to read file'));
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsDataURL(file);
    });
  }, []);

  /**
   * Handles file selection from input or drag-drop
   *
   * @param file - Selected file to process
   */
  const handleFileSelect = useCallback(
    async (file: File) => {
      // Clear previous errors
      setUploadState((prev) => ({ ...prev, error: null }));

      // Validate file
      const validationError = validateFile(file);
      if (validationError) {
        setUploadState((prev) => ({
          ...prev,
          error: validationError,
          file: null,
          preview: null,
        }));
        return;
      }

      try {
        setUploadState((prev) => ({ ...prev, isUploading: true }));

        // Generate preview
        const preview = await generatePreview(file);

        setUploadState({
          file,
          preview,
          progress: 0,
          error: null,
          isUploading: false,
        });

        // Notify parent component
        onFileSelect(file, preview);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to process file';

        setUploadState((prev) => ({
          ...prev,
          error: errorMessage,
          isUploading: false,
        }));
      }
    },
    [validateFile, generatePreview, onFileSelect]
  );

  /**
   * Handles file input change event
   */
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  /**
   * Handles drag enter event
   */
  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(true);
  };

  /**
   * Handles drag leave event
   */
  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(false);
  };

  /**
   * Handles drag over event
   */
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  /**
   * Handles drop event
   */
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(false);

    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  /**
   * Clears selected file and preview
   */
  const clearFile = useCallback(() => {
    setUploadState({
      file: null,
      preview: null,
      progress: 0,
      error: null,
      isUploading: false,
    });
  }, []);

  return (
    <div className="w-full max-w-md mx-auto p-6">
      {/* Upload Area */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${uploadState.file ? 'border-green-500 bg-green-50' : ''}
        `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {uploadState.preview ? (
          // Preview Section
          <div className="space-y-4">
            <img
              src={uploadState.preview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg mx-auto"
            />
            <div className="text-sm">
              <p className="font-medium text-gray-900">{uploadState.file?.name}</p>
              <p className="text-gray-500">
                {((uploadState.file?.size || 0) / 1024).toFixed(2)} KB
              </p>
            </div>

            {/* Progress Bar */}
            {uploadState.progress > 0 && uploadState.progress < 100 && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadState.progress}%` }}
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 justify-center pt-2">
              <button
                onClick={clearFile}
                disabled={uploadState.isUploading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Clear
              </button>
              <label className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 cursor-pointer disabled:opacity-50">
                Change
                <input
                  type="file"
                  accept={acceptedTypes.join(',')}
                  onChange={handleInputChange}
                  className="hidden"
                  disabled={uploadState.isUploading}
                />
              </label>
            </div>
          </div>
        ) : (
          // Upload Prompt
          <div className="space-y-3">
            <svg
              className={`w-12 h-12 mx-auto ${
                uploadState.isUploading ? 'text-gray-400' : 'text-gray-400'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <p className="text-sm font-medium text-gray-700">
              Drag and drop your image here
            </p>
            <p className="text-xs text-gray-500">or</p>
            <label className="inline-block px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 cursor-pointer disabled:opacity-50">
              Browse Files
              <input
                type="file"
                accept={acceptedTypes.join(',')}
                onChange={handleInputChange}
                className="hidden"
                disabled={uploadState.isUploading}
              />
            </label>
            <p className="text-xs text-gray-500">
              Max size: {(maxSize / (1024 * 1024)).toFixed(1)}MB
            </p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {uploadState.error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{uploadState.error}</p>
        </div>
      )}

      {/* Success Message */}
      {uploadState.file && !uploadState.error && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700">File ready for upload</p>
        </div>
      )}
    </div>
  );
};
```

## Usage Example

```typescript
import React, { useState } from 'react';
import { FileUploadForm } from './FileUploadForm';

/**
 * Example component demonstrating file upload form
 */
export function UploadPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handles file selection from form
   */
  const handleFileSelect = async (file: File, preview: string) => {
    console.log('File selected:', file.name);
    setUploadedFile(file);
  };

  /**
   * Handles form submission
   */
  const handleSubmit = async () => {
    if (!uploadedFile) return;

    try {
      setIsSubmitting(true);

      // Create FormData for multipart upload
      const formData = new FormData();
      formData.append('file', uploadedFile);

      // Upload to API
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      console.log('Upload successful:', result);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Upload Profile Picture</h1>

      <FileUploadForm
        onFileSelect={handleFileSelect}
        maxSize={5 * 1024 * 1024} // 5MB
        acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
      />

      {uploadedFile && (
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full px-4 py-2 font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {isSubmitting ? 'Uploading...' : 'Upload File'}
        </button>
      )}
    </div>
  );
}
```

## Key Features

### File Validation
- **Type validation**: Restricts to specified MIME types (default: images)
- **Size validation**: Enforces maximum file size limit
- **Error handling**: Clear error messages for validation failures

### Preview Generation
- Uses FileReader API to generate base64 preview URL
- Async preview generation to avoid blocking UI
- Automatic preview update on file selection

### Progress Tracking
- Progress state management (0-100%)
- Visual progress bar during upload
- Upload state indicators

### Drag & Drop
- Full drag-and-drop support
- Visual feedback on drag states
- Same validation applied to dropped files

### User Experience
- Clear, intuitive UI with Tailwind CSS
- File size and name display
- Action buttons for changing/clearing files
- Loading states during file processing

## Customization Options

```typescript
// Custom file types
<FileUploadForm
  onFileSelect={handleFileSelect}
  acceptedTypes={['image/jpeg', 'image/png', 'application/pdf']}
  maxSize={10 * 1024 * 1024} // 10MB
/>

// Custom styling via Tailwind config
// Adjust className props in FileUploadForm component
```

## Related Skills

- React Forms fundamentals
- File input handling
- Progress state management
- Drag and drop API
- Validation patterns
